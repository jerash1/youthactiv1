
import React from "react";
import { Link } from "react-router-dom";
import { Home, BarChart, Plus, List } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold">برنامج تتبع أنشطة المراكز الشبابية</div>
        </div>
        <div>
          <Link to="/login" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </div>
      
      {/* Sidebar/Navigation Bar */}
      <div className="fixed top-1/2 transform -translate-y-1/2 left-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col space-y-1 p-1">
          <Link
            to="/"
            className="p-3 hover:bg-blue-50 rounded-md flex items-center justify-center text-primary transition-colors"
            title="الرئيسية"
          >
            <Home size={24} />
          </Link>
          <Link
            to="/activities"
            className="p-3 hover:bg-blue-50 rounded-md flex items-center justify-center text-primary transition-colors"
            title="عرض الأنشطة"
          >
            <List size={24} />
          </Link>
          <Link
            to="/add-activity"
            className="p-3 hover:bg-blue-50 rounded-md flex items-center justify-center text-primary transition-colors"
            title="إضافة نشاط"
          >
            <Plus size={24} />
          </Link>
          <Link
            to="/reports"
            className="p-3 hover:bg-blue-50 rounded-md flex items-center justify-center text-primary transition-colors"
            title="التقارير"
          >
            <BarChart size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
