
import { Activity } from "../../types/activity";
import { Center, SupabaseActivity } from "../../types/supabase";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { mapSupabaseToActivity, mapActivityToSupabase, validateStatus } from "./activitiesMapper";

export interface ActivitiesServiceState {
  activities: Activity[];
  availableCenters: Center[];
  loading: boolean;
}

export async function fetchActivitiesData(): Promise<ActivitiesServiceState> {
  try {
    // جلب المراكز
    const { data: centersData, error: centersError } = await supabase
      .from('centers')
      .select('*');
      
    if (centersError) {
      throw centersError;
    }
    
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
    
    return {
      activities: formattedActivities,
      availableCenters: centersData,
      loading: false
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("حدث خطأ أثناء جلب البيانات");
    
    // إذا فشل الاتصال، استخدم البيانات المحلية من localStorage إن وجدت
    const savedActivities = localStorage.getItem("activities");
    return {
      activities: savedActivities ? JSON.parse(savedActivities) : [],
      availableCenters: [],
      loading: false
    };
  }
}

export async function addNewActivity(
  activityData: Omit<Activity, "id">, 
  availableCenters: Center[]
): Promise<Activity | null> {
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
    const status = validateStatus(data.status);
    const validatedData = { ...data, status };
    const newActivity = mapSupabaseToActivity(validatedData, data.centers.name);
    
    toast.success("تم إضافة النشاط بنجاح");
    return newActivity;
  } catch (error) {
    console.error("Error adding activity:", error);
    toast.error("حدث خطأ أثناء إضافة النشاط");
    
    // إذا فشل الاتصال، إضافة النشاط محليًا مع معرف مؤقت
    const newActivity = {
      ...activityData,
      id: uuidv4(),
    };
    
    return newActivity;
  }
}

export async function updateExistingActivity(
  updatedActivity: Activity, 
  availableCenters: Center[]
): Promise<boolean> {
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
    
    toast.success("تم تحديث النشاط بنجاح");
    return true;
  } catch (error) {
    console.error("Error updating activity:", error);
    toast.error("حدث خطأ أثناء تحديث النشاط");
    return false;
  }
}

export async function deleteExistingActivity(id: string): Promise<boolean> {
  try {
    // حذف النشاط من Supabase
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    toast.success("تم حذف النشاط بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting activity:", error);
    toast.error("حدث خطأ أثناء حذف النشاط");
    return false;
  }
}
