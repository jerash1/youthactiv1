
import { Activity, ActivityStatus } from "../../types/activity";
import { SupabaseActivity } from "../../types/supabase";

// تحويل من تنسيق Supabase إلى تنسيق التطبيق
export const mapSupabaseToActivity = (supaActivity: SupabaseActivity, centerName: string): Activity => {
  return {
    id: supaActivity.id,
    name: supaActivity.name,
    center: centerName,
    location: supaActivity.location,
    startDate: new Date(supaActivity.start_date).toISOString().split('T')[0],
    endDate: new Date(supaActivity.end_date).toISOString().split('T')[0],
    status: supaActivity.status as ActivityStatus,
    description: supaActivity.description || undefined,
    expectedParticipants: supaActivity.expected_participants || undefined
  };
};

// تحويل من تنسيق التطبيق إلى تنسيق Supabase
export const mapActivityToSupabase = (activity: Omit<Activity, "id">, centerId: number): Omit<SupabaseActivity, "id" | "created_at" | "updated_at"> => {
  return {
    name: activity.name,
    center_id: centerId,
    location: activity.location,
    start_date: new Date(activity.startDate).toISOString(),
    end_date: new Date(activity.endDate).toISOString(),
    status: activity.status,
    description: activity.description || null,
    expected_participants: activity.expectedParticipants || null
  };
};

// التأكد من أن قيمة status مناسبة
export const validateStatus = (status: string): ActivityStatus => {
  const validStatuses: ActivityStatus[] = ["preparing", "completed", "cancelled"];
  return validStatuses.includes(status as ActivityStatus) 
    ? (status as ActivityStatus) 
    : "preparing"; // القيمة الافتراضية إذا كانت القيمة غير صالحة
};
