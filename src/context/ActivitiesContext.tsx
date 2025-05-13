
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Activity, ActivityStatus } from "../types/activity";
import { Center, SupabaseActivity } from "../types/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../integrations/supabase/client";

interface ActivitiesContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getActivityById: (id: string) => Activity | undefined;
  availableCenters: { id: number; name: string }[];
  filterActivities: (searchTerm: string, statusFilter: string | null) => Activity[];
  loading: boolean;
}

export const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export const ActivitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [availableCenters, setAvailableCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // تحويل من تنسيق Supabase إلى تنسيق التطبيق
  const mapSupabaseToActivity = (supaActivity: SupabaseActivity, centerName: string): Activity => {
    return {
      id: supaActivity.id,
      name: supaActivity.name,
      center: centerName,
      location: supaActivity.location,
      startDate: new Date(supaActivity.start_date).toISOString().split('T')[0],
      endDate: new Date(supaActivity.end_date).toISOString().split('T')[0],
      status: supaActivity.status as ActivityStatus,
      description: supaActivity.description || undefined,
      expectedParticipants: supaActivity.expected_participants || undefined
    };
  };
  
  // تحويل من تنسيق التطبيق إلى تنسيق Supabase
  const mapActivityToSupabase = (activity: Omit<Activity, "id">, centerId: number): Omit<SupabaseActivity, "id" | "created_at" | "updated_at"> => {
    return {
      name: activity.name,
      center_id: centerId,
      location: activity.location,
      start_date: new Date(activity.startDate).toISOString(),
      end_date: new Date(activity.endDate).toISOString(),
      status: activity.status,
      description: activity.description || null,
      expected_participants: activity.expectedParticipants || null
    };
  };

  // جلب البيانات من Supabase عند تحميل التطبيق
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // جلب المراكز
        const { data: centersData, error: centersError } = await supabase
          .from('centers')
          .select('*');
          
        if (centersError) {
          throw centersError;
        }
        
        setAvailableCenters(centersData);
        
        // جلب الأنشطة مع أسماء المراكز
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select(`
            *,
            centers:center_id (name)
          `);
          
        if (activitiesError) {
          throw activitiesError;
        }
        
        // تحويل البيانات إلى تنسيق التطبيق
        const formattedActivities = activitiesData.map((item: any) => {
          // تأكد من أن قيمة status هي من القيم المتوقعة
          const status = validateStatus(item.status);
          // إنشاء نسخة من العنصر مع قيمة status الصحيحة
          const validatedItem = { ...item, status };
          return mapSupabaseToActivity(validatedItem, item.centers.name);
        });
        
        setActivities(formattedActivities);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء جلب البيانات");
        
        // إذا فشل الاتصال، استخدم البيانات المحلية من localStorage إن وجدت
        const savedActivities = localStorage.getItem("activities");
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities));
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // التأكد من أن قيمة status مناسبة
  const validateStatus = (status: string): ActivityStatus => {
    const validStatuses: ActivityStatus[] = ["preparing", "completed", "cancelled"];
    return validStatuses.includes(status as ActivityStatus) 
      ? (status as ActivityStatus) 
      : "preparing"; // القيمة الافتراضية إذا كانت القيمة غير صالحة
  };

  // إضافة نشاط جديد
  const addActivity = async (activityData: Omit<Activity, "id">) => {
    try {
      // البحث عن معرف المركز
      const center = availableCenters.find(c => c.name === activityData.center);
      if (!center) {
        throw new Error("المركز غير موجود");
      }
      
      // تحويل البيانات إلى تنسيق Supabase
      const supabaseData = mapActivityToSupabase(activityData, center.id);
      
      // إضافة النشاط إلى Supabase
      const { data, error } = await supabase
        .from('activities')
        .insert(supabaseData)
        .select(`
          *,
          centers:center_id (name)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      // إضافة النشاط الجديد إلى حالة التطبيق
      const newActivity = mapSupabaseToActivity(data, data.centers.name);
      setActivities((prev) => [...prev, newActivity]);
      toast.success("تم إضافة النشاط بنجاح");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("حدث خطأ أثناء إضافة النشاط");
      
      // إذا فشل الاتصال، إضافة النشاط محليًا مع معرف مؤقت
      const newActivity = {
        ...activityData,
        id: uuidv4(),
      };
      
      setActivities((prev) => [...prev, newActivity]);
    }
  };

  // تحديث نشاط
  const updateActivity = async (updatedActivity: Activity) => {
    try {
      // البحث عن معرف المركز
      const center = availableCenters.find(c => c.name === updatedActivity.center);
      if (!center) {
        throw new Error("المركز غير موجود");
      }
      
      // تحويل البيانات إلى تنسيق Supabase
      const supabaseData = mapActivityToSupabase(updatedActivity, center.id);
      
      // تحديث النشاط في Supabase
      const { error } = await supabase
        .from('activities')
        .update(supabaseData)
        .eq('id', updatedActivity.id);
        
      if (error) {
        throw error;
      }
      
      // تحديث النشاط في حالة التطبيق
      setActivities((prev) =>
        prev.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity))
      );
      
      toast.success("تم تحديث النشاط بنجاح");
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("حدث خطأ أثناء تحديث النشاط");
      
      // إذا فشل الاتصال، تحديث النشاط محليًا
      setActivities((prev) =>
        prev.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity))
      );
    }
  };

  // حذف نشاط
  const deleteActivity = async (id: string) => {
    try {
      // حذف النشاط من Supabase
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // حذف النشاط من حالة التطبيق
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
      toast.success("تم حذف النشاط بنجاح");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("حدث خطأ أثناء حذف النشاط");
      
      // إذا فشل الاتصال، حذف النشاط محليًا
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    }
  };

  const getActivityById = (id: string) => {
    return activities.find((activity) => activity.id === id);
  };

  const filterActivities = (searchTerm: string, statusFilter: string | null) => {
    return activities.filter((activity) => {
      const matchesSearch = searchTerm
        ? activity.name.includes(searchTerm) ||
          activity.center.includes(searchTerm) ||
          activity.location.includes(searchTerm)
        : true;

      const matchesStatus = statusFilter ? activity.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  };

  const value = {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
    availableCenters: availableCenters.map(c => ({ id: c.id, name: c.name })),
    filterActivities,
    loading,
  };

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};
