export interface Shift {
  shift_id: number;
  employee_id: number;
  section_id: number;
  date: string;       // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
  timestamp: string;

  first_name: string;
  last_name: string;
  primary_role: number | null;
  primary_role_name: string;
  section_name: string;
  day_name: string; // String representing weekday (Monday, Tuesday, etc.)
  day_index: number; // Integer from 1–7 representing weekday (1 = Sunday to 7 = Saturday)
}

export interface GetShift {
  shift_id: number;
  employee_id: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
  section_id: number;
  date: string; // Exact date filtering
  start_date: string; // Date Range 
  end_date: string; // Date Range
  is_today: 1 | 0; // Shift's only Today?
  next_shift: 1 | 0; // Get next shift
}

export interface InsertShift {
  employee_id: number;
  section_id: number;
  date: string;       // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
}

export interface UpdateShift {
  employee_id: number;
  section_id: number;
  date: string;       // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
}
