export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string; // DECIMAL MySQL types are formatted as strings in JSON
  admin: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
  is_active: number;
  timestamp: string; // When the employee was created

  full_name: string;
  primary_role_name: string;
  secondary_role_name: string;
  tertiary_role_name: string;
}

export interface GetEmployee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string;
  admin: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
  is_active: number;
  
  full_name: string;
  role_id: number | number[];
}

export interface InsertEmployee {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string;
  admin: number;
  primary_role: number;
}

export interface UpdateEmployee {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wage: string;
  admin: number;
  primary_role: number;
  secondary_role: number;
  tertiary_role: number;
  is_active: number;
}