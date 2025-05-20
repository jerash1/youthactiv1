
import { useState, useEffect, useCallback } from "react";
import { Activity } from "../../types/activity";
import { 
  fetchActivitiesData, 
  addNewActivity, 
  updateExistingActivity, 
  deleteExistingActivity,
  ActivitiesServiceState 
} from "./activitiesService";

export function useActivitiesData() {
  const [state, setState] = useState<ActivitiesServiceState>({
    activities: [],
    availableCenters: [],
    loading: true
  });

  useEffect(() => {
    async function loadData() {
      const data = await fetchActivitiesData();
      setState(data);
    }
    loadData();
  }, []);

  const addActivity = useCallback(async (activity: Omit<Activity, "id">) => {
    const newActivity = await addNewActivity(activity, state.availableCenters);
    if (newActivity) {
      setState(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity]
      }));
    }
  }, [state.availableCenters]);

  const updateActivity = useCallback(async (activity: Activity) => {
    const success = await updateExistingActivity(activity, state.availableCenters);
    if (success) {
      setState(prev => ({
        ...prev,
        activities: prev.activities.map((a) => (a.id === activity.id ? activity : a))
      }));
    }
  }, [state.availableCenters]);

  const deleteActivity = useCallback(async (id: string) => {
    const success = await deleteExistingActivity(id);
    if (success) {
      setState(prev => ({
        ...prev,
        activities: prev.activities.filter((activity) => activity.id !== id)
      }));
    }
  }, []);

  const getActivityById = useCallback((id: string) => {
    return state.activities.find((activity) => activity.id === id);
  }, [state.activities]);

  const filterActivities = useCallback((searchTerm: string, statusFilter: string | null) => {
    return state.activities.filter((activity) => {
      const matchesSearch = searchTerm
        ? activity.name.includes(searchTerm) ||
          activity.center.includes(searchTerm) ||
          activity.location.includes(searchTerm)
        : true;

      const matchesStatus = statusFilter ? activity.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [state.activities]);

  return {
    activities: state.activities,
    availableCenters: state.availableCenters,
    loading: state.loading,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
    filterActivities
  };
}
