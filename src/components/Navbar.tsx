
import React from "react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SidebarTrigger />
          <div className="text-2xl font-bold">برنامج تتبع أنشطة المراكز الشبابية</div>
        </div>
        <div>
          <Link to="/login" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
