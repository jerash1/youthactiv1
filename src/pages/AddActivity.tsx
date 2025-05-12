
import React from "react";
import ActivityForm from "../components/ActivityForm";

const AddActivity = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إضافة نشاط جديد</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ActivityForm />
      </div>
    </div>
  );
};

export default AddActivity;
