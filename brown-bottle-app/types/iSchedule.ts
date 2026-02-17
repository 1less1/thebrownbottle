export interface ScheduleAPI {
  role_id?: number | number[]; // Ex: role_id: 1 or role_id = [1, 2, 3]
  section_id?: number | number[]; // Ex: section_id: 1 or section_id = [1, 2, 3]
  start_date?: string;
  end_date?: string;
  full_name?: string;
}

export interface ScheduleShift {
  shift_id: number;
  start_time: string;
  section_id: number;   
  section_name: string;
}

export interface ScheduleAvailability {
    is_available: 1 | 0; // Available for the day (1=True and 0=False)
    start_time: string | null;
    end_time: string | null;
    all_day: 1 |0; // Available all day if is_available=0 and start_time and end_time are null
}

export interface ScheduleDay {
    date: string;
    day_name: string;     // e.g., "Monday"
    day_index: number;    // 1–7 (Sunday=1)
    shift: (ScheduleShift | null); // Can add a list ScheduleShift[] for future implementation
    availability: ScheduleAvailability; // Can add a list of ScheduleAvailability for future implementation
    time_off_approved: 1 | 0;
}

export interface ScheduleEmployee {
  employee_id: number;
  full_name: string;
  primary_role: number;
  primary_role_name: string;
  days: ScheduleDay[]; // 7 entries (One for each day Sunday through Saturday)
}
