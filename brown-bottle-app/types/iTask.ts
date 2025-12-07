  export interface Task {
  task_id: number,
  author_id: number,
  author: string,
  section_id: number,
  section_name: string,
  title: string,
  description: string,
  complete: number,
  recurring_task_id: number | null,
  due_date: string, // YYYY-MM-DD
  last_modified_by: number; // employee_id
  last_modified_at: string;
  last_modified_name: string;
  timestamp: string,
}

export type UpdateTaskFields = Partial<{
  title: string;
  description: string;
  author_id: number;
  section_id: number;
  due_date: string;    // YYYY-MM-DD
  complete: 0 | 1;
  recurring_task_id: number;
  last_modified_by: number; // employee_id
}>;
