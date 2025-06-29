
import React, { useState } from "react";
import { useActivities } from "../context/ActivitiesContext";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteActivityDialog from "../components/DeleteActivityDialog";

const ActivitiesList = () => {
  const { activities, availableCenters, filterActivities, deleteActivity } = useActivities();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; activity: any }>({
    open: false,
    activity: null
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredActivities = filterActivities(searchTerm, statusFilter);

  const handleDeleteClick = (activity: any) => {
    setDeleteDialog({ open: true, activity });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.activity) {
      deleteActivity(deleteDialog.activity.id);
      setDeleteDialog({ open: false, activity: null });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return "في مرحلة الإعداد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "تم إلغاء النشاط";
      default:
        return "غير محدد";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">قائمة الأنشطة</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-auto">
              <Link
                to="/add-activity"
                className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors justify-center"
              >
                <Plus size={18} className="ml-1" />
                <span>إضافة نشاط جديد</span>
              </Link>
            </div>

            <div className="w-full md:w-1/3 flex">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="ابحث عن نشاط، مركز أو مكان..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pr-10 w-full"
                />
                <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <select
                className="mr-2 p-2 border rounded-md bg-white"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">اظهار الكل</option>
                <option value="preparing">في مرحلة الإعداد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-right">اسم النشاط</th>
                  <th className="px-4 py-3 text-right">المركز</th>
                  <th className="px-4 py-3 text-right">مكان التنفيذ</th>
                  <th className="px-4 py-3 text-right">تاريخ البدء</th>
                  <th className="px-4 py-3 text-right">تاريخ الانتهاء</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                  <th className="px-4 py-3 text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <tr key={activity.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{activity.name}</td>
                      <td className="px-4 py-3">{activity.center}</td>
                      <td className="px-4 py-3">{activity.location}</td>
                      <td className="px-4 py-3">{activity.startDate}</td>
                      <td className="px-4 py-3">{activity.endDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(
                            activity.status
                          )}`}
                        >
                          {getStatusText(activity.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2 space-x-reverse items-center">
                          <Link
                            to={`/edit-activity/${activity.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            تعديل
                          </Link>
                          <span className="text-gray-400">|</span>
                          <Link
                            to={`/view-activity/${activity.id}`}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            عرض
                          </Link>
                          <span className="text-gray-400">|</span>
                          <button
                            onClick={() => handleDeleteClick(activity)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <Trash2 size={14} className="ml-1" />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      لا توجد أنشطة مطابقة لمعايير البحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteActivityDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, activity: null })}
        onConfirm={handleDeleteConfirm}
        activityName={deleteDialog.activity?.name || ""}
      />
    </>
  );
};

export default ActivitiesList;
