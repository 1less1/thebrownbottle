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
  date: string;       // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
  end_time: string;   // 'HH:MM'
  section_name: string;
  shiftDateTime?: Date;
}

// Raw shift data from the schedule API
export interface ScheduleShift {
  shift_id: number;
  employee_id: number;
  employee_name: string;          // "Alice Johnson"
  start_time: string;             // "08:00"
  end_time: string;               // "17:00"
  date: string;                   // "2025-10-14"
  section_id: number;
  section_name: string;           // "Kitchen"
  primary_role: number;
  primary_role_name: string;      // "Server"
}

// Processed shift data for a single cell in the spreadsheet
export interface ShiftDisplay {
  shift_id?: number;
  time: string;                   // "8:00-17:00"
  section: string;                // "Kitchen"
  section_id: number;
}

// Single employee row in the schedule spreadsheet
export interface ScheduleEmployee {
  employee_id: number;
  employee_name: string;          // "Alice Johnson"
  primary_role_name: string;      // "Server"
  shifts: (ShiftDisplay | null)[]; // Array with one entry per day
}

// Complete schedule data structure
export interface ScheduleData {
  dates: string[];                // ["10/14", "10/15", "10/16", ...]
  dayNames: string[];             // ["Mon", "Tue", "Wed", ...]
  employees: ScheduleEmployee[];
}