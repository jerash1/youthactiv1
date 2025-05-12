
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, Plus, ListFilter, FileText } from "lucide-react";

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
    icon: FileText, // Changed from FileImport to FileText which is available in lucide-react
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar side="right" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
