export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string; // DECIMAL MySQL types are formatted as strings in JSON
  admin: number;
  primary_role: number | null;
  secondary_role: number | null;
  tertiary_role: number | null;
  is_active: number;

  // Only Used for JSON Responses:
  full_name?: string;
  primary_role_name?: string;
  secondary_role_name?: string;
  tertiary_role_name?: string;
};