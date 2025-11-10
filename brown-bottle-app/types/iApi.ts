// API Types for Requests and Responses

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string; // DECIMAL MySQL types are formatted as strings in JSON
  admin: number;
  primary_role: number | null;
  secondary_role: number | null;
  tertiary_role: number | null;
  is_active: number;

  // Only Used for JSON Responses:
  full_name?: string;
  primary_role_name?: string;
  secondary_role_name?: string;
  tertiary_role_name?: string;
};

export interface Role {
  role_id: number;
  role_name: string;
};

export interface Section {
  section_id: number;
  section_name: string;
};

export interface Announcement {
  announcement_id: number;
  author_id: number;
  author: string;
  role_id: number;
  role_name: string;
  title: string;
  description: string;
  date: string; // MM/DD/YYYY format
  time: string; // HH:MM format
}

export interface Task {
  task_id: number,
  author_id: number,
  author: string,
  section_id: number,
  section_name: string,
  title: string,
  description: string,
  complete: number,
  recurring_task_id: number | null,
  due_date: string, // YYYY-MM-DD
  last_modified_by: number; // employee_id
  last_modified_at: string;
  last_modified_name: string;
  timestamp: string,
}

export type UpdateTaskFields = Partial<{
  title: string;
  description: string;
  author_id: number;
  section_id: number;
  due_date: string;    // YYYY-MM-DD
  complete: 0 | 1;
  recurring_task_id: number;
  last_modified_by: number; // employee_id
}>;


export interface Shift {
  shift_id: number;
  employee_id: number;
  section_id: number;
  date: string;       // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
  end_time: string;   // 'HH:MM'
  timestamp: string;

  // Only appear in JSON responses
  first_name?: string;
  last_name?: string;
  primary_role?: number | null;
  primary_role_name?: string;
  section_name?: string;
  day_name?: string; // String representing weekday (Monday, Tuesday, etc.)
  day_index?: number; // Integer from 1–7 representing weekday (1 = Sunday to 7 = Saturday)
}

export interface ShiftAPI {
  shift_id?: number;
  employee_id?: number;
  primary_role?: number;
  secondary_role?: number;
  tertiary_role?: number;
  section_id?: number;
  date?: string; // Exact date filtering
  start_date?: string; // Date Range 
  end_date?: string; // Date Range
  is_today?: 1 | 0; // Shift's only Today?
}

export interface ScheduleAPI {
  role_id?: number;
  section_id?: number;
  start_date?: string;
  end_date?: string;
  full_name?: string;
}

export interface ScheduleShift {
  shift_id: number;
  date: string;
  start_time: string;   // e.g., "10:00 AM" (matches TIME_FORMAT '%h:%i %p')
  end_time: string;     // e.g., "06:00 PM"
  section_id: number;   // matches s.section_id
  section_name: string; // matches sec.section_name
  day_name: string;     // e.g., "Monday"
  day_index: number;    // 1–7 (Sunday=1)
}

export interface ScheduleEmployee {
  employee_id: number;
  full_name: string;
  primary_role: number | null;
  primary_role_name: string;
  shifts: (ScheduleShift | null)[]; // 7 Entries: Sunday (1)... to Saturday (7)
}
