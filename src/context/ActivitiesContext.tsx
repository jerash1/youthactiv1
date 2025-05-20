
import React, { createContext, useContext, ReactNode } from "react";
import { Activity } from "../types/activity";
import { Center } from "../types/supabase";
import { useActivitiesData } from "./activities/activitiesHooks";

interface ActivitiesContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getActivityById: (id: string) => Activity | undefined;
  availableCenters: { id: number; name: string }[];
  filterActivities: (searchTerm: string, statusFilter: string | null) => Activity[];
  loading: boolean;
}

export const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export const ActivitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const activitiesData = useActivitiesData();
  
  const value = {
    activities: activitiesData.activities,
    addActivity: activitiesData.addActivity,
    updateActivity: activitiesData.updateActivity,
    deleteActivity: activitiesData.deleteActivity,
    getActivityById: activitiesData.getActivityById,
    availableCenters: activitiesData.availableCenters.map(c => ({ id: c.id, name: c.name })),
    filterActivities: activitiesData.filterActivities,
    loading: activitiesData.loading,
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
