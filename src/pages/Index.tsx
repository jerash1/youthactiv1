
import React from "react";
import { Link } from "react-router-dom";
import { useActivities } from "../context/ActivitiesContext";
import ActivityCard from "../components/ActivityCard";
import CompactActivityCard from "../components/CompactActivityCard";
import ActivityStats from "../components/ActivityStats";
import { getDaysRemaining, needsAlert } from "../data/mockData";
import { Plus, Calendar, AlertTriangle, Clock } from "lucide-react";

const Index = () => {
  const { activities } = useActivities();

  // Get upcoming activities (those with start dates in the future)
  const upcomingActivities = activities.filter(
    (activity) => getDaysRemaining(activity.startDate) >= 0
  ).sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Filter activities that need attention (1 or 3 days remaining)
  const alertActivities = activities.filter(activity => needsAlert(activity) !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3">
            برنامج تتبع أنشطة المراكز الشبابية
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نظرة شاملة على الأنشطة والمراكز الشبابية مع أدوات إدارة متقدمة لتتبع جميع الفعاليات
          </p>
        </div>

        {/* Statistics Cards */}
        <ActivityStats />

        {/* Quick Actions */}
        <div className="flex justify-center mb-8">
          <Link
            to="/add-activity"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus size={20} className="ml-2" />
            <span>إضافة نشاط جديد</span>
          </Link>
        </div>

        {/* Alert Activities Section */}
        {alertActivities.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full ml-3"></div>
              <AlertTriangle className="w-6 h-6 text-red-500 ml-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                الأنشطة القادمة للمتابعة
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {alertActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  showActions={true}
                  showQuickActions={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Activities Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full ml-3"></div>
              <Clock className="w-6 h-6 text-blue-500 ml-2" />
              <h2 className="text-2xl font-bold text-gray-800">الأنشطة القادمة</h2>
            </div>
            <Link
              to="/activities"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              عرض الكل
            </Link>
          </div>

          {upcomingActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {upcomingActivities.slice(0, 10).map((activity) => (
                <CompactActivityCard 
                  key={activity.id} 
                  activity={activity} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد أنشطة قادمة</h3>
              <p className="text-gray-500 mb-6">ابدأ بإنشاء نشاط جديد لعرضه هنا</p>
              <Link
                to="/add-activity"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                <Plus size={18} className="ml-2" />
                <span>إضافة نشاط جديد</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
