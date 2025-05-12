
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  
  // Get confirmed and postponed activities
  const confirmedActivities = activities.filter(a => a.status === "completed");
  const postponedActivities = activities.filter(a => a.status === "cancelled");

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">التقارير والمتابعة</h1>
        <p className="text-gray-600">تحليل أنشطة المراكز الشبابية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">الأنشطة حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">الأنشطة المكتملة والملغاة</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">الأنشطة حسب الشهر</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* New section for confirmed and postponed activities list */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">قائمة الأنشطة المؤكدة والمؤجلة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم النشاط</TableHead>
                  <TableHead>المركز</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {confirmedActivities.length === 0 && postponedActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">لا توجد أنشطة مؤكدة أو مؤجلة</TableCell>
                  </TableRow>
                ) : (
                  <>
                    {confirmedActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>{activity.center}</TableCell>
                        <TableCell>{activity.startDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">تم التأكيد</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {postponedActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>{activity.center}</TableCell>
                        <TableCell>{activity.startDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500">تم التأجيل</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {centersData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">الأنشطة حسب المركز</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
