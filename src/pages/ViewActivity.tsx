
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useActivities } from "../context/ActivitiesContext";
import { needsAlert } from "../data/mockData";
import { Edit, ArrowUp, Calendar, CalendarCheck, CalendarMinus, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ImageThumbnail from "../components/ImageThumbnail";

interface ActivityFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string | null;
}

const ViewActivity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getActivityById } = useActivities();
  
  const activity = getActivityById(id || "");
  const alertLevel = activity ? needsAlert(activity) : null;

  const [activityFiles, setActivityFiles] = useState<ActivityFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (activity) {
      loadActivityFiles(activity.id);
    }
  }, [activity]);

  const loadActivityFiles = async (activityId: string) => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from('activity_files')
        .select('*')
        .eq('activity_id', activityId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error loading files:', error);
      } else {
        setActivityFiles(data || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  if (!activity) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-4">
          لم يتم العثور على النشاط المطلوب
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark shadow-sm transition-colors"
        >
          العودة
        </button>
      </div>
    );
  }

  const getStatusText = () => {
    switch (activity.status) {
      case "preparing":
        return "في مرحلة الإعداد";
      case "in_progress":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "تم إلغاء النشاط";
      default:
        return "غير محدد";
    }
  };

  const getStatusClass = () => {
    switch (activity.status) {
      case "preparing":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "in_progress":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusIcon = () => {
    switch (activity.status) {
      case "preparing":
        return <Calendar size={20} className="ml-2" />;
      case "in_progress":
        return <Play size={20} className="ml-2" />;
      case "completed":
        return <CalendarCheck size={20} className="ml-2" />;
      case "cancelled":
        return <CalendarMinus size={20} className="ml-2" />;
      default:
        return <Calendar size={20} className="ml-2" />;
    }
  };

  const showFiles = activity.status === "completed" || activity.status === "in_progress";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">تفاصيل النشاط</h1>
        <Link
          to={`/edit-activity/${id}`}
          className="bg-gradient-to-r from-primary/90 to-primary text-white px-4 py-2 rounded-md flex items-center hover:shadow-md transition-all"
        >
          <Edit size={18} className="ml-2" />
          <span>تعديل النشاط</span>
        </Link>
      </div>

      {alertLevel && (
        <div
          className={`mb-4 p-4 rounded-md shadow-sm ${
            alertLevel === 1
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-amber-50 border border-amber-200 text-amber-700"
          }`}
        >
          <div className="flex items-center">
            <ArrowUp className="ml-2" size={20} />
            <span className="font-medium">
              {alertLevel === 1
                ? "تنبيه: باقي أقل من يوم على تنفيذ هذا النشاط!"
                : `تنبيه: باقي ${alertLevel} أيام على تنفيذ هذا النشاط`}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{activity.name}</h2>
          <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClass()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">المركز</h3>
            <p className="text-gray-800 font-semibold">{activity.center}</p>
          </div>

          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">مكان التنفيذ</h3>
            <p className="text-gray-800 font-semibold">{activity.location || "غير محدد"}</p>
          </div>

          <div className="bg-gray-50 rounded-md p-4 border border-gray-100 flex items-start">
            <Calendar size={18} className="text-primary mt-1 ml-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ البدء</h3>
              <p className="text-gray-800 font-semibold">{activity.startDate}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4 border border-gray-100 flex items-start">
            <Calendar size={18} className="text-primary mt-1 ml-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ الانتهاء</h3>
              <p className="text-gray-800 font-semibold">{activity.endDate}</p>
            </div>
          </div>

          {activity.expectedParticipants && (
            <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">عدد المشاركين المتوقع</h3>
              <p className="text-gray-800 font-semibold">{activity.expectedParticipants}</p>
            </div>
          )}
        </div>

        {activity.description && (
          <div className="border-t pt-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">وصف النشاط</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100 whitespace-pre-line">{activity.description}</p>
          </div>
        )}

        {showFiles && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">الملفات والصور</h3>
            {loadingFiles ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : activityFiles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activityFiles.map((file) => (
                  <ImageThumbnail
                    key={file.id}
                    file={file}
                    disabled={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                <Calendar size={32} className="mx-auto mb-2 text-gray-400" />
                <p>لا توجد ملفات مرفوعة لهذا النشاط</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
        >
          العودة
        </button>
      </div>
    </div>
  );
};

export default ViewActivity;
