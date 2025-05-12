
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Activity } from "../types/activity";
import { centers, initialActivities } from "../data/mockData";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ActivitiesContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  getActivityById: (id: string) => Activity | undefined;
  availableCenters: { id: number; name: string }[];
  filterActivities: (searchTerm: string, statusFilter: string | null) => Activity[];
}

export const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export const ActivitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("activities");
    return saved ? JSON.parse(saved) : initialActivities;
  });

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activityData: Omit<Activity, "id">) => {
    const newActivity = {
      ...activityData,
      id: uuidv4(),
    };
    setActivities((prev) => [...prev, newActivity]);
    toast.success("تم إضافة النشاط بنجاح");
  };

  const updateActivity = (updatedActivity: Activity) => {
    setActivities((prev) =>
      prev.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity))
    );
    toast.success("تم تحديث النشاط بنجاح");
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
    toast.success("تم حذف النشاط بنجاح");
  };

  const getActivityById = (id: string) => {
    return activities.find((activity) => activity.id === id);
  };

  const filterActivities = (searchTerm: string, statusFilter: string | null) => {
    return activities.filter((activity) => {
      const matchesSearch = searchTerm
        ? activity.name.includes(searchTerm) ||
          activity.center.includes(searchTerm) ||
          activity.location.includes(searchTerm)
        : true;

      const matchesStatus = statusFilter ? activity.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  };

  const value = {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
    availableCenters: centers,
    filterActivities,
  };

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};
