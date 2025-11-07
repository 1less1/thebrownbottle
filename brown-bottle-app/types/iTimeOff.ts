export interface TimeOffRequest {
  request_id: number;
  employee_id: number;
  first_name: string;
  last_name: string;
  reason: string;
  start_date: string;
  end_date: string;
  timestamp: string;
  status: 'Pending' | 'Accepted' | 'Denied';
}

export interface TimeOffProps {
  refreshKey?: number;
}

export interface TimeOffModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
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