
import React from "react";
import { Activity } from "../types/activity";
import { Link, useNavigate } from "react-router-dom";
import { needsAlert } from "../data/mockData";
import { Edit, Trash2, Check, X, Calendar } from "lucide-react";
import { useActivities } from "../context/ActivitiesContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { deleteActivity, updateActivity } = useActivities();
  const alertLevel = needsAlert(activity);
  const navigate = useNavigate();

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

  const handleConfirmActivity = () => {
    updateActivity({
      ...activity,
      status: "completed"
    });
    // توجيه المستخدم إلى صفحة عرض الأنشطة
    navigate("/activities");
  };

  const handlePostponeActivity = () => {
    updateActivity({
      ...activity,
      status: "cancelled"
    });
    // توجيه المستخدم إلى صفحة عرض الأنشطة
    navigate("/activities");
  };

  const cardClasses = `bg-white rounded-lg shadow-sm p-4 mb-4 hover-card border border-gray-100 ${
    alertLevel === 1 ? "alert-1-day" : alertLevel === 3 ? "alert-3-days" : ""
  }`;

  return (
    <Card className={cardClasses}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold mb-2">{activity.name}</h3>
        <span className={getStatusClass()}>{getStatusText()}</span>
      </div>

      <div className="mt-3 space-y-3 text-gray-700">
        <div className="flex items-center">
          <span className="text-gray-500 ml-2">المركز:</span>
          <span className="font-medium">{activity.center}</span>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 ml-2">مكان التنفيذ:</span>
          <span className="font-medium">{activity.location}</span>
        </div>

        <div className="flex items-center">
          <Calendar size={16} className="ml-1 text-primary" />
          <div className="flex items-center">
            <span className="text-gray-500 ml-2">تاريخ البدء:</span>
            <span className="font-medium">{activity.startDate}</span>
          </div>
        </div>

        <div className="flex items-center">
          <Calendar size={16} className="ml-1 text-primary" />
          <div className="flex items-center">
            <span className="text-gray-500 ml-2">تاريخ الانتهاء:</span>
            <span className="font-medium">{activity.endDate}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-4 gap-3">
        <div className="flex justify-between">
          <div className="space-x-2 flex">
            <Link
              to={`/edit-activity/${activity.id}`}
              className="flex items-center px-3 py-1.5 bg-blue-50 text-primary rounded-md hover:bg-blue-100 transition-colors"
            >
              <Edit size={16} className="ml-1" />
              <span>تعديل</span>
            </Link>
            <button
              onClick={() => deleteActivity(activity.id)}
              className="flex items-center px-3 py-1.5 bg-red-50 text-destructive rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} className="ml-1" />
              <span>حذف</span>
            </button>
          </div>

          {alertLevel === 1 && (
            <div className="text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded-md">
              تنبيه: باقي أقل من يوم على النشاط!
            </div>
          )}
          {alertLevel === 3 && (
            <div className="text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-md">
              تنبيه: باقي {alertLevel} أيام على النشاط
            </div>
          )}
        </div>

        {/* Action buttons for confirm or postpone */}
        {activity.status === "preparing" && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Button 
              variant="destructive"
              className="flex items-center justify-center"
              onClick={handlePostponeActivity}
            >
              <X size={18} className="ml-1" />
              <span>تأجيل</span>
            </Button>
            <Button 
              variant="default"
              className="bg-green-500 hover:bg-green-600 flex items-center justify-center"
              onClick={handleConfirmActivity}
            >
              <Check size={18} className="ml-1" />
              <span>تأكيد</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
