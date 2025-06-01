
import React from "react";
import { Activity } from "../types/activity";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { getDaysRemaining } from "../data/mockData";

interface CompactActivityCardProps {
  activity: Activity;
}

const CompactActivityCard: React.FC<CompactActivityCardProps> = ({ activity }) => {
  const daysRemaining = getDaysRemaining(activity.startDate);

  const getStatusClass = () => {
    switch (activity.status) {
      case "preparing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = () => {
    switch (activity.status) {
      case "preparing":
        return "في الإعداد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const getDaysRemainingText = () => {
    if (daysRemaining === 0) return "اليوم";
    if (daysRemaining === 1) return "غداً";
    if (daysRemaining < 0) return "مضى";
    return `${daysRemaining} أيام`;
  };

  const getDaysRemainingColor = () => {
    if (daysRemaining <= 1) return "text-red-600 bg-red-50 border-red-200";
    if (daysRemaining <= 3) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  return (
    <Link to={`/view-activity/${activity.id}`}>
      <Card className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden cursor-pointer">
        {/* Header with gradient */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-4">
          {/* Title and Status Row */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 ml-2">
              {activity.name}
            </h3>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusClass()} shrink-0`}>
              {getStatusText()}
            </span>
          </div>

          {/* Compact Info Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center ml-2 shrink-0">
                <Users size={12} className="text-blue-600" />
              </div>
              <span className="truncate">{activity.center}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center ml-2 shrink-0">
                <MapPin size={12} className="text-purple-600" />
              </div>
              <span className="truncate">{activity.location}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center ml-2 shrink-0">
                <Calendar size={12} className="text-green-600" />
              </div>
              <span className="truncate">{activity.startDate}</span>
            </div>

            <div className="flex items-center text-sm">
              <div className="w-6 h-6 bg-orange-50 rounded-lg flex items-center justify-center ml-2 shrink-0">
                <Clock size={12} className="text-orange-600" />
              </div>
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDaysRemainingColor()}`}>
                {getDaysRemainingText()}
              </span>
            </div>
          </div>

          {/* Quick Preview */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            <span className="font-medium">الفترة:</span> {activity.startDate} - {activity.endDate}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CompactActivityCard;
