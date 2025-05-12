
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
        <SidebarGroup>
          <SidebarGroupLabel className="mt-16 text-primary font-bold">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="hover:bg-primary/10 transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="text-primary" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
