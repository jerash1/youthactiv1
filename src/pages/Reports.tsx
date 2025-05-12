
import React from "react";
import { useActivities } from "../context/ActivitiesContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  const { activities, availableCenters } = useActivities();

  // Prepare data for status chart
  const statusData = [
    {
      name: "في مرحلة الإعداد",
      value: activities.filter((a) => a.status === "preparing").length,
    },
    {
      name: "مكتمل",
      value: activities.filter((a) => a.status === "completed").length,
    },
    {
      name: "ملغي",
      value: activities.filter((a) => a.status === "cancelled").length,
    },
  ];

  // Prepare data for centers chart
  const centersData = availableCenters.map((center) => {
    return {
      name: center.name,
      count: activities.filter((a) => a.center === center.name).length,
    };
  }).filter(item => item.count > 0);

  // Colors for the pie chart
  const COLORS = ["#1E88E5", "#66BB6A", "#EF5350"];

  // Count activities by month
  const getMonthActivities = () => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    
    const monthCounts = Array(12).fill(0);
    
    activities.forEach((activity) => {
      const date = new Date(activity.startDate);
      const month = date.getMonth();
      monthCounts[month]++;
    });
    
    return months.map((month, index) => ({
      name: month,
      activities: monthCounts[index],
    }));
  };

  const monthlyData = getMonthActivities();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">التقارير والمتابعة</h1>
        <p className="text-gray-600">تحليل أنشطة المراكز الشبابية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-center mb-6">الأنشطة حسب الحالة</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-center mb-6">الأنشطة المكتملة والملغاة</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "مكتمل",
                    value: activities.filter((a) => a.status === "completed").length,
                  },
                  {
                    name: "ملغي",
                    value: activities.filter((a) => a.status === "cancelled").length,
                  },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1E88E5" name="عدد الأنشطة" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-center mb-6">الأنشطة حسب الشهر</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="activities" fill="#1E88E5" name="عدد الأنشطة" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {centersData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-center mb-6">الأنشطة حسب المركز</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={centersData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="عدد الأنشطة" fill="#1E88E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
