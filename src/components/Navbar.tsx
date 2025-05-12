
import React from "react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SidebarTrigger />
          <div className="text-2xl font-bold">برنامج تتبع أنشطة المراكز الشبابية</div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-white">مرحباً، {user.username}</span>
              <button 
                onClick={logout}
                className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                <LogOut size={16} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
