export type Status = "Pending" | "Accepted" | "Denied";

export interface TimeOffRequest {
  request_id: number;
  employee_id: number;
  primary_role: number;
  primary_role_name: string;
  first_name: string;
  last_name: string;
  reason: string;
  start_date: string;
  end_date: string;
  timestamp: string;
  status: Status;
}

export interface GetTimeOffRequest {
  request_id: number;
  employee_id: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
  reason: string;
  start_date: string;
  end_date: string;
  status: Status[];
  date_sort: "Newest" | "Oldest";
  timestamp_sort: "Newest" | "Oldest";
}

export interface InsertTimeOffRequest {
  employee_id: number;
  reason: string;
  start_date: string;
  end_date: string;
}

export interface UpdateTimeOffRequest {
  status: Status;
}