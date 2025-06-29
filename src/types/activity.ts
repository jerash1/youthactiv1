
export type ActivityStatus = "preparing" | "in_progress" | "completed" | "cancelled";

export interface Activity {
  id: string;
  name: string;
  center: string;
  location: string;
  startDate: string;
  endDate: string;
  status: ActivityStatus;
  description?: string;
  expectedParticipants?: number;
}

export interface Center {
  id: number;
  name: string;
}
