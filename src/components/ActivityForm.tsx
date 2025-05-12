
import React, { useState, useEffect } from "react";
import { useActivities } from "../context/ActivitiesContext";
import { Activity } from "../types/activity";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ActivityFormProps {
  activity?: Activity;
  isEditing?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, isEditing = false }) => {
  const { addActivity, updateActivity, availableCenters } = useActivities();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<Omit<Activity, "id">>({
    name: "",
    center: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "preparing",
    description: "",
    expectedParticipants: 1,
  });

  useEffect(() => {
    if (isEditing && activity) {
      setFormValues({
        name: activity.name,
        center: activity.center,
        location: activity.location,
        startDate: activity.startDate,
        endDate: activity.endDate,
        status: activity.status,
        description: activity.description || "",
        expectedParticipants: activity.expectedParticipants || 1,
      });
    }
  }, [isEditing, activity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && activity) {
      updateActivity({ ...formValues, id: activity.id });
    } else {
      addActivity(formValues);
    }
    
    navigate("/activities");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-gray-700">اسم النشاط</label>
          <Input
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            placeholder="أدخل اسم النشاط"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="center" className="block text-gray-700">المركز</label>
          <select
            id="center"
            name="center"
            value={formValues.center}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">اختر المركز</option>
            {availableCenters.map((center) => (
              <option key={center.id} value={center.name}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-gray-700">مكان التنفيذ (اختياري)</label>
          <Input
            id="location"
            name="location"
            value={formValues.location}
            onChange={handleChange}
            placeholder="مثال: القاعة الرئيسية، الملعب..."
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-gray-700">حالة النشاط</label>
          <select
            id="status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="preparing">في مرحلة الإعداد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">تم إلغاء النشاط</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-gray-700">تاريخ البدء</label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formValues.startDate}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-gray-700">تاريخ الانتهاء</label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formValues.endDate}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="expectedParticipants" className="block text-gray-700">
            عدد المشاركين المتوقع
          </label>
          <Input
            id="expectedParticipants"
            name="expectedParticipants"
            type="number"
            value={formValues.expectedParticipants}
            onChange={handleChange}
            min="1"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-gray-700">
          وصف النشاط (اختياري)
        </label>
        <Textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          placeholder="أدخل وصفاً موجزاً للنشاط..."
          className="w-full"
          rows={4}
        />
      </div>

      <div className="flex space-x-4 space-x-reverse">
        <Button type="submit" className="bg-primary text-white">
          {isEditing ? "تحديث النشاط" : "حفظ النشاط"}
        </Button>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
