
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">الصفحة غير موجودة</p>
        <p className="text-gray-500 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
