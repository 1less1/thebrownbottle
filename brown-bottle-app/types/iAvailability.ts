export interface Availability {
  availability_id: number;
  employee_id: number; // Foreign Key
  employee_name: string;
  day_of_week: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  is_available: 1 | 0; // Default 1=True in DB
  start_time: string | null; // HH:MM
  end_time: string | null;   // HH:MM
}

export interface GetAvailability {
  availability_id: number;
  employee_id: number;
  day_of_week: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  is_available: 1 | 0;
}

export interface InsertAvailability {
  employee_id: number;
  day_of_week: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  is_available: 1 | 0; // Default 1=True in DB
  start_time: string | null;  // HH:MM
  end_time: string | null;    // HH:MM
}

export interface UpdateAvailability {
  day_of_week: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  is_available: 1 | 0; // Default 1=True in DB
  start_time: string | null;  // HH:MM
  end_time: string | null;    // HH:MM
}