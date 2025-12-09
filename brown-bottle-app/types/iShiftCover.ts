export type Status = "Pending" | "Awaiting Approval" | "Accepted" | "Denied";

export interface ShiftCoverRequest {
  cover_request_id: number;
  shift_id: number;

  requested_employee_id: number;
  requested_first_name: string;
  requested_last_name: string;
  requested_primary_role_id: number;
  requested_primary_role_name: string;

  accepted_employee_id: number | null;
  accepted_first_name: string | null;
  accepted_last_name: string | null;
  accepted_primary_role_id: number | null;
  accepted_primary_role_name: string | null;

  section_id: number;
  section_name: string;
  shift_date: string;
  shift_start: string;
  status: Status
  timestamp: string; 
}

export interface GetShiftCoverRequest {
  cover_request_id: number | null;
  shift_id: number | null;
  accepted_employee_id: number| null;
  requested_employee_id: number| null;
  employee_id: number | null; // Filter all requests either requested by or accepted by the provided employee_id parameter
  requested_primary_role: number;
  requested_secondary_role: number;
  requested_tertiary_role: number;
  status: Status[] | null; // <-- list of allowed texts
  date_sort: "Newest" | "Oldest" | null;
  timestamp_sort: "Newest" | "Oldest" | null;
}

export interface InsertShiftCoverRequest {
  requested_employee_id: number;
  shift_id: number;
}

export interface UpdateShiftCoverRequest {
  accepted_employee_id: number | null;
  shift_id?: number; // Should never really have to update this!!!
  status: "Pending" | "Awaiting Approval" | "Accepted" | "Denied";
}