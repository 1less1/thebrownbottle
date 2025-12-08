export interface TimeOffRequest {
  request_id: number;
  employee_id: number;
  first_name: string;
  last_name: string;
  reason: string;
  start_date: string;
  end_date: string;
  timestamp: string;
  status: Status;
}

export type Status = "Pending" | "Accepted" | "Denied";

export interface GetTimeOffRequest {
  request_id: number;
  employee_id: number;
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

export interface ButtonProps {
  employee_id: number;
  employee_name: string;
  request_id: number;
  status: string;
  onApproveRequest: (
    employee_id: number,
    employee_name: string,
    request_id: number,
    status: string
  ) => Promise<void>;
  onDenyRequest: (
    employee_id: number,
    employee_name: string,
    request_id: number,
    status: string
  ) => Promise<void>;
}