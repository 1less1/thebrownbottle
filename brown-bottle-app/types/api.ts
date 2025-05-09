export interface Announcement {
  announcement_id: number;
  author_id: number;
  author: string;
  role_id: number;
  role_name: string;
  title: string;
  description: string;
  date: string; // MM/DD/YYYY format
  time: string; // HH:MM format
}

export interface Shift {
  shift_id: number;
  employee_id: number;
  date: string;       // MM/DD/YYYY
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  section_name: string;
  shiftDateTime?: Date;
}

export interface Role {
  role_id: number;
  role_name: string;
};

export interface Section {
  section_id: number;
  section_name: string;
};
