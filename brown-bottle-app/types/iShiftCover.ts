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

export interface InsertShiftCoverRequest {
  requested_employee_id: number;
  shift_id: number;
  status: string;
}

export interface ShiftCoverModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  requests: ShiftCoverRequest[];
}

export interface UpdateShiftCoverRequest {
  cover_request_id: number;
  accepted_employee_id: number | null;
  requested_employee_id?: number;
  status: "Pending" | "Awaiting Approval" | "Accepted" | "Denied";
  shift_id?: number;
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
