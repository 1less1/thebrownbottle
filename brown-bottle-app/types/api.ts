// API Types for Requests and Responses

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  wage: number;
  admin: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
  full_name: string;

  // Only Used for JSON Responses:
  primary_role_name: string;
  secondary_role_name: string;
  tertiary_role_name: string;
}

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