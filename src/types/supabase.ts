
export type Center = {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  created_at: string;
};

export type SupabaseActivity = {
  id: string;
  name: string;
  center_id: number;
  location: string;
  start_date: string;
  end_date: string;
  status: "preparing" | "completed" | "cancelled";
  description: string | null;
  expected_participants: number | null;
  created_at: string;
  updated_at: string;
};
