
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, Plus, ListFilter, FileText, Users } from "lucide-react";

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
  },
  {
    title: "عرض الأنشطة",
    url: "/activities",
    icon: ListFilter,
  },
  {
    title: "إضافة نشاط",
    url: "/add-activity",
    icon: Plus,
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: BarChart2,
  },
  {
    title: "استيراد وتصدير",
    url: "/import-export",
    icon: FileText,
  },
  {
    title: "إدارة المستخدمين",
    url: "/users",
    icon: Users,
  }
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar side="right" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <div className="flex flex-col items-center py-6 border-b border-gray-100">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-primary/80 to-primary text-white text-xl font-bold mb-2">
            ش
          </div>
          <h3 className="text-sm font-medium text-gray-700">نظام إدارة الأنشطة</h3>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="mt-6 text-primary font-bold text-sm px-3">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || 
                                (item.url === '/activities' && location.pathname.includes('/edit-activity') || location.pathname.includes('/view-activity'));
                
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={item.title}
                    className={`hover:bg-primary/10 transition-all duration-200 ${isActive ? 'bg-primary/15 text-primary font-medium' : ''}`}
                  >
                    <Link to={item.url} className="flex items-center gap-3 relative">
                      {isActive && <span className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l"></span>}
                      <item.icon className={isActive ? "text-primary" : "text-gray-500"} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto px-4 py-4 text-center text-xs text-gray-500">
          <p>إصدار 1.0</p>
          <p className="mt-1">© 2025 المراكز الشبابية</p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
