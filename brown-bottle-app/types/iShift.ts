export interface Shift {
  shift_id: number;
  employee_id: number;
  section_id: number;
  date: string;       // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
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
  role_id?: number | number[]; // Ex: role_id: 1 or role_id = [1, 2, 3]
  section_id?: number | number[]; // Ex: section_id: 1 or section_id = [1, 2, 3]
  start_date?: string;
  end_date?: string;
  full_name?: string;
}

export interface ScheduleShift {
  shift_id: number;
  date: string;
  start_time: string;   // e.g., HH:MM AM/PM
  section_id: number;   
  section_name: string;
  day_name: string;     // e.g., "Monday"
  day_index: number;    // 1–7 (Sunday=1)
}

export interface ScheduleEmployee {
  employee_id: number;
  full_name: string;
  primary_role: number | null;
  primary_role_name: string;
  shifts: (ScheduleShift | null)[]; // 7 Entries: Sunday (1)... to Saturday (7)
  blockedDays?: Set<string>; // Set of 'YYYY-MM-DD' strings representing blocked days
}
