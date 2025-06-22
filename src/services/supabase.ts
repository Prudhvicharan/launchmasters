import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types (to be expanded as we build the schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      colleges: {
        Row: {
          id: string;
          name: string;
          city: string;
          state: string;
          website: string | null;
          admission_rate: number | null;
          tuition_in_state: number | null;
          tuition_out_state: number | null;
          enrollment: number | null;
          sat_avg: number | null;
          act_avg: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          city: string;
          state: string;
          website?: string | null;
          admission_rate?: number | null;
          tuition_in_state?: number | null;
          tuition_out_state?: number | null;
          enrollment?: number | null;
          sat_avg?: number | null;
          act_avg?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string;
          state?: string;
          website?: string | null;
          admission_rate?: number | null;
          tuition_in_state?: number | null;
          tuition_out_state?: number | null;
          enrollment?: number | null;
          sat_avg?: number | null;
          act_avg?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_colleges: {
        Row: {
          id: string;
          user_id: string;
          college_id: string;
          category: "reach" | "target" | "safety";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          college_id: string;
          category: "reach" | "target" | "safety";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          college_id?: string;
          category?: "reach" | "target" | "safety";
          notes?: string | null;
          created_at?: string;
        };
      };
      deadlines: {
        Row: {
          id: string;
          user_id: string;
          college_id: string;
          deadline_type:
            | "early_decision"
            | "early_action"
            | "regular_decision"
            | "rolling";
          deadline_date: string;
          is_completed: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          college_id: string;
          deadline_type:
            | "early_decision"
            | "early_action"
            | "regular_decision"
            | "rolling";
          deadline_date: string;
          is_completed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          college_id?: string;
          deadline_type?:
            | "early_decision"
            | "early_action"
            | "regular_decision"
            | "rolling";
          deadline_date?: string;
          is_completed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          college_id: string;
          status:
            | "not_started"
            | "in_progress"
            | "submitted"
            | "accepted"
            | "rejected"
            | "waitlisted";
          submitted_date: string | null;
          decision_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          college_id: string;
          status?:
            | "not_started"
            | "in_progress"
            | "submitted"
            | "accepted"
            | "rejected"
            | "waitlisted";
          submitted_date?: string | null;
          decision_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          college_id?: string;
          status?:
            | "not_started"
            | "in_progress"
            | "submitted"
            | "accepted"
            | "rejected"
            | "waitlisted";
          submitted_date?: string | null;
          decision_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
