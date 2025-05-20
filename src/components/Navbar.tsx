
import React from "react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-primary/90 to-primary text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SidebarTrigger className="text-white hover:bg-white/20 rounded-md p-1.5" />
          <div className="text-2xl font-bold">برنامج تتبع أنشطة المراكز الشبابية</div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-1.5">
                  <User size={18} className="text-white" />
                </div>
                <span className="text-white font-medium">مرحباً، {user.username}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 bg-white text-primary px-4 py-1.5 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
              >
                <LogOut size={16} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2">
              <User size={16} />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
