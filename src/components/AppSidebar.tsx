
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, Plus, ListFilter, FileText, Users, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// قائمة الروابط للتنقل
const navigationItems = [
  {
    title: "الرئيسية",
    url: "/",
    icon: Home,
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "عرض الأنشطة",
    url: "/activities",
    icon: ListFilter,
    gradient: "from-emerald-500 to-green-600"
  },
  {
    title: "إضافة نشاط",
    url: "/add-activity",
    icon: Plus,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: BarChart2,
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "استيراد وتصدير",
    url: "/import-export",
    icon: FileText,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    title: "إدارة المستخدمين",
    url: "/users",
    icon: Users,
    gradient: "from-violet-500 to-purple-600"
  }
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar side="right" variant="sidebar" collapsible="icon" className="border-0">
      <SidebarContent className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Logo Section */}
        <div className="flex flex-col items-center py-8 border-b border-slate-700/50">
          <div className="relative">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-2xl font-bold mb-3 shadow-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <h3 className="text-sm font-bold text-white text-center leading-tight">
            نظام إدارة
            <br />
            الأنشطة الشبابية
          </h3>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
        </div>
        
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-4 px-3">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || 
                                (item.url === '/activities' && (location.pathname.includes('/edit-activity') || location.pathname.includes('/view-activity')));
                
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={item.title}
                    className={`
                      relative group rounded-xl transition-all duration-300 hover:scale-105
                      ${isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-blue-500/25` 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <Link to={item.url} className="flex items-center gap-3 relative w-full px-3 py-3">
                      {isActive && (
                        <>
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full opacity-90"></span>
                          <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                        </>
                      )}
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                        ${isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'}
                      `}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                      {isActive && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-60"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Footer */}
        <div className="mt-auto px-6 py-6 text-center border-t border-slate-700/50">
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>إصدار 1.0</span>
            </div>
            <p className="text-slate-500">© 2025 المراكز الشبابية</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
