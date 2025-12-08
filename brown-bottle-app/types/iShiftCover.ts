export interface ShiftCoverRequest {
  cover_request_id: number;
  shift_id: number;

  requested_employee_id: number;
  requested_first_name: string;
  requested_last_name: string;

  accepted_employee_id: number | null;
  accepted_first_name: string | null;
  accepted_last_name: string | null;

  requester_role_id: number;
  requester_role_name: string;

  section_id: number;
  section_name: string;

  shift_date: string;
  shift_start: string;

  status: string;
  timestamp: string;
}

export type Status = "Pending" | "Awaiting Approval" | "Accepted" | "Denied";

export interface GetShiftCoverRequest {
  cover_request_id: number;
  shift_id: number;
  accepted_employee_id: number;
  requested_employee_id: number;
  employee_id: number; // Filter all requests either requested by or accepted by the provided employee_id parameter
  requester_role_id: number; // Filters requests to only show for current user's role
  status: Status[]; // <-- list of allowed texts
  date_sort: "Newest" | "Oldest";
  timestamp_sort: "Newest" | "Oldest";
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

export interface ShiftCoverModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  requests: ShiftCoverRequest[];
}

export interface ShiftDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  request: any | null;
  onSubmitted?: () => void;
}

export interface ShiftCoverButtonsProps {
  request_id: number;
  onApprove: (request_id: number) => Promise<void>;
  onDeny: (request_id: number) => Promise<void>;
  disabled?: boolean;
}
