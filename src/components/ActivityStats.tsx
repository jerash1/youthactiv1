
import React from "react";
import { useActivities } from "../context/ActivitiesContext";
import { Activity, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { Card } from "./ui/card";

const ActivityStats = () => {
  const { activities } = useActivities();

  const stats = {
    total: activities.length,
    preparing: activities.filter(a => a.status === "preparing").length,
    completed: activities.filter(a => a.status === "completed").length,
    cancelled: activities.filter(a => a.status === "cancelled").length,
  };

  const statCards = [
    {
      title: "إجمالي الأنشطة",
      value: stats.total,
      icon: Activity,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      title: "قيد الإعداد",
      value: stats.preparing,
      icon: BarChart3,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      textColor: "text-white"
    },
    {
      title: "مكتملة",
      value: stats.completed,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      textColor: "text-white"
    },
    {
      title: "ملغية",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Card 
          key={index} 
          className={`${stat.color} ${stat.textColor} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <stat.icon size={32} className="opacity-80" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityStats;
