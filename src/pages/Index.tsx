
import React from "react";
import { Link } from "react-router-dom";
import { useActivities } from "../context/ActivitiesContext";
import ActivityCard from "../components/ActivityCard";
import { getDaysRemaining, needsAlert } from "../data/mockData";
import { Plus } from "lucide-react";

const Index = () => {
  const { activities } = useActivities();

  // Get upcoming activities (those with start dates in the future)
  const upcomingActivities = activities.filter(
    (activity) => getDaysRemaining(activity.startDate) >= 0
  ).sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }).slice(0, 3);

  // Filter activities that need attention (1 or 3 days remaining)
  const alertActivities = activities.filter(activity => needsAlert(activity) !== null);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-2">
          برنامج تتبع أنشطة المراكز الشبابية
        </h1>
        <p className="text-gray-600 text-lg">
          نظرة سريعة على الأنشطة القادمة والمسجلة في المراكز
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">الأنشطة القادمة للمتابعة</h2>
          <Link
            to="/add-activity"
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} className="ml-1" />
            <span>إضافة نشاط</span>
          </Link>
        </div>

        {upcomingActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-600 mb-4">لا توجد أنشطة قادمة حالياً</p>
            <Link
              to="/add-activity"
              className="bg-primary text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-primary-dark transition-colors"
            >
              <Plus size={18} className="ml-1" />
              <span>إضافة نشاط جديد</span>
            </Link>
          </div>
        )}
      </div>

      {alertActivities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            أنشطة تحتاج انتباه (قريبة من موعد التنفيذ)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
