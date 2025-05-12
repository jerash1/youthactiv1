
import React from "react";
import { Activity } from "../types/activity";
import { Link } from "react-router-dom";
import { needsAlert } from "../data/mockData";
import { Edit, Trash2 } from "lucide-react";
import { useActivities } from "../context/ActivitiesContext";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { deleteActivity } = useActivities();
  const alertLevel = needsAlert(activity);

  const getStatusClass = () => {
    switch (activity.status) {
      case "preparing":
        return "status-badge status-preparing";
      case "completed":
        return "status-badge status-completed";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge status-preparing";
    }
  };

  const getStatusText = () => {
    switch (activity.status) {
      case "preparing":
        return "في مرحلة الإعداد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "تم تأجيل النشاط";
      default:
        return "غير محدد";
    }
  };

  const cardClasses = `bg-white rounded-lg shadow-sm p-4 mb-4 ${
    alertLevel === 1 ? "alert-1-day" : alertLevel === 3 ? "alert-3-days" : ""
  }`;

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold mb-2">{activity.name}</h3>
        <span className={getStatusClass()}>{getStatusText()}</span>
      </div>

      <div className="mt-3 space-y-2 text-gray-700">
        <div className="flex items-center">
          <span className="text-gray-500 ml-2">المركز:</span>
          <span>{activity.center}</span>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 ml-2">مكان التنفيذ:</span>
          <span>{activity.location}</span>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 ml-2">تاريخ البدء:</span>
          <span>{activity.startDate}</span>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 ml-2">تاريخ الانتهاء:</span>
          <span>{activity.endDate}</span>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="space-x-2 flex">
          <Link
            to={`/edit-activity/${activity.id}`}
            className="flex items-center px-3 py-1.5 bg-blue-50 text-primary rounded-md hover:bg-blue-100"
          >
            <Edit size={16} className="ml-1" />
            <span>تعديل</span>
          </Link>
          <button
            onClick={() => deleteActivity(activity.id)}
            className="flex items-center px-3 py-1.5 bg-red-50 text-destructive rounded-md hover:bg-red-100"
          >
            <Trash2 size={16} className="ml-1" />
            <span>حذف</span>
          </button>
        </div>

        {alertLevel === 1 && (
          <div className="text-red-600 text-sm font-medium">
            تنبيه: باقي أقل من يوم على النشاط!
          </div>
        )}
        {alertLevel === 3 && (
          <div className="text-amber-600 text-sm font-medium">
            تنبيه: باقي {alertLevel} أيام على النشاط
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
