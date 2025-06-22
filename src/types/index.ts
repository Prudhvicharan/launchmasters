// User types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// College types
export interface College {
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
}

export type CollegeCategory = "reach" | "target" | "safety";

export interface UserCollege {
  id: string;
  user_id: string;
  college_id: string;
  category: CollegeCategory;
  notes: string | null;
  created_at: string;
  college?: College; // Joined data
}

// Deadline types
export type DeadlineType =
  | "early_decision"
  | "early_action"
  | "regular_decision"
  | "rolling";

export interface Deadline {
  id: string;
  user_id: string;
  college_id: string;
  deadline_type: DeadlineType;
  deadline_date: string;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  college?: College; // Joined data
}

// Application types
export type ApplicationStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "accepted"
  | "rejected"
  | "waitlisted";

export interface Application {
  id: string;
  user_id: string;
  college_id: string;
  status: ApplicationStatus;
  submitted_date: string | null;
  decision_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  college?: College; // Joined data
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "deadline" | "reminder" | "update" | "system";
  is_read: boolean;
  created_at: string;
  related_id?: string; // ID of related deadline, application, etc.
}

// Dashboard types
export interface DashboardStats {
  total_colleges: number;
  colleges_by_category: Record<CollegeCategory, number>;
  upcoming_deadlines: number;
  applications_in_progress: number;
  applications_submitted: number;
  applications_accepted: number;
}

// Search and filter types
export interface CollegeSearchFilters {
  name?: string;
  state?: string;
  city?: string;
  admission_rate_min?: number;
  admission_rate_max?: number;
  tuition_min?: number;
  tuition_max?: number;
  enrollment_min?: number;
  enrollment_max?: number;
}

export interface CollegeSearchParams {
  query?: string;
  filters?: CollegeSearchFilters;
  page?: number;
  per_page?: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  full_name: string;
  confirmPassword: string;
}

export interface CollegeFormData {
  name: string;
  city: string;
  state: string;
  website?: string;
  admission_rate?: number;
  tuition_in_state?: number;
  tuition_out_state?: number;
  enrollment?: number;
  sat_avg?: number;
  act_avg?: number;
}

export interface DeadlineFormData {
  college_id: string;
  deadline_type: DeadlineType;
  deadline_date: string;
  notes?: string;
}

export interface ApplicationFormData {
  college_id: string;
  status: ApplicationStatus;
  submitted_date?: string;
  decision_date?: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// UI Component types
export interface SelectOption {
  value: string;
  label: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Utility types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

// Route types
export interface AppRoute {
  path: string;
  element: React.ComponentType;
  requiresAuth?: boolean;
  children?: AppRoute[];
}

// Theme types
export type Theme = "light" | "dark" | "system";

// Settings types
export interface UserSettings {
  theme: Theme;
  email_notifications: boolean;
  push_notifications: boolean;
  reminder_frequency: "daily" | "weekly" | "monthly";
}
