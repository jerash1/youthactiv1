
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ActivityForm from "../components/ActivityForm";
import { useActivities } from "../context/ActivitiesContext";

const EditActivity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getActivityById } = useActivities();
  const activity = getActivityById(id || "");

  if (!activity) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          لم يتم العثور على النشاط المطلوب
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">تعديل النشاط</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ActivityForm activity={activity} isEditing={true} />
      </div>
    </div>
  );
};

export default EditActivity;
