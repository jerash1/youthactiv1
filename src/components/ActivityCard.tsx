
import React, { useState } from "react";
import { Activity } from "../types/activity";
import { Link, useNavigate } from "react-router-dom";
import { needsAlert } from "../data/mockData";
import { Edit, Trash2, Check, X, Calendar, MapPin, Users, Play } from "lucide-react";
import { useActivities } from "../context/ActivitiesContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import DeleteActivityDialog from "./DeleteActivityDialog";

interface ActivityCardProps {
  activity: Activity;
  showActions?: boolean;
  showQuickActions?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  showActions = true, 
  showQuickActions = false 
}) => {
  const { deleteActivity, updateActivity } = useActivities();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const alertLevel = needsAlert(activity);
  const navigate = useNavigate();

  const getStatusClass = () => {
    switch (activity.status) {
      case "preparing":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = () => {
    switch (activity.status) {
      case "preparing":
        return "في مرحلة الإعداد";
      case "in_progress":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "تم إلغاؤه";
      default:
        return "غير محدد";
    }
  };

  const handleConfirmActivity = () => {
    updateActivity({
      ...activity,
      status: "completed"
    });
    navigate("/activities");
  };

  const handleStartActivity = () => {
    updateActivity({
      ...activity,
      status: "in_progress"
    });
    navigate("/activities");
  };

  const handlePostponeActivity = () => {
    updateActivity({
      ...activity,
      status: "cancelled"
    });
    navigate("/activities");
  };

  const handleDeleteActivity = () => {
    deleteActivity(activity.id);
    setShowDeleteDialog(false);
  };

  const cardClasses = `group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden ${
    alertLevel === 1 ? "ring-2 ring-red-200 shadow-red-100" : 
    alertLevel === 3 ? "ring-2 ring-amber-200 shadow-amber-100" : ""
  }`;

  return (
    <>
      <Card className={cardClasses}>
        {/* Header with gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {activity.name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Activity Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center ml-3">
                <Users size={16} className="text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">المركز:</span>
                <span className="font-medium text-gray-900 mr-2">{activity.center}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center ml-3">
                <MapPin size={16} className="text-purple-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">المكان:</span>
                <span className="font-medium text-gray-900 mr-2">{activity.location}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center ml-3">
                <Calendar size={16} className="text-green-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">تاريخ البدء:</span>
                <span className="font-medium text-gray-900 mr-2">{activity.startDate}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center ml-3">
                <Calendar size={16} className="text-orange-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">تاريخ الانتهاء:</span>
                <span className="font-medium text-gray-900 mr-2">{activity.endDate}</span>
              </div>
            </div>
          </div>

          {/* Alert Badges */}
          {alertLevel === 1 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
              <div className="text-red-700 text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></div>
                تنبيه عاجل: باقي أقل من يوم على النشاط!
              </div>
            </div>
          )}
          
          {alertLevel === 3 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="text-amber-700 text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full ml-2 animate-pulse"></div>
                تنبيه: باقي 3 أيام على النشاط
              </div>
            </div>
          )}

          {/* Quick Action Buttons for alert activities */}
          {showQuickActions && activity.status === "preparing" && (
            <div className="mb-4">
              <div className="flex gap-2">
                <Button 
                  variant="destructive"
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                  onClick={handlePostponeActivity}
                >
                  <X size={16} className="ml-2" />
                  <span>تأجيل</span>
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl"
                  onClick={handleStartActivity}
                >
                  <Play size={16} className="ml-2" />
                  <span>بدء التنفيذ</span>
                </Button>
              </div>
            </div>
          )}

          {/* Regular Action Buttons - Only show if showActions is true and not showing quick actions */}
          {showActions && !showQuickActions && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Link
                  to={`/edit-activity/${activity.id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  <Edit size={16} className="ml-2" />
                  <span>تعديل</span>
                </Link>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                  <Trash2 size={16} className="ml-2" />
                  <span>حذف</span>
                </button>
              </div>

              {/* Confirm/Start/Postpone buttons for different statuses */}
              {activity.status === "preparing" && (
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    className="flex-1 rounded-xl"
                    onClick={handlePostponeActivity}
                  >
                    <X size={16} className="ml-2" />
                    <span>تأجيل</span>
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl"
                    onClick={handleStartActivity}
                  >
                    <Play size={16} className="ml-2" />
                    <span>بدء التنفيذ</span>
                  </Button>
                </div>
              )}

              {activity.status === "in_progress" && (
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    className="flex-1 rounded-xl"
                    onClick={handlePostponeActivity}
                  >
                    <X size={16} className="ml-2" />
                    <span>إيقاف النشاط</span>
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl"
                    onClick={handleConfirmActivity}
                  >
                    <Check size={16} className="ml-2" />
                    <span>إكمال النشاط</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <DeleteActivityDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteActivity}
        activityName={activity.name}
      />
    </>
  );
};

export default ActivityCard;
