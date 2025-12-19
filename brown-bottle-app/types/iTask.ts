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

export interface GetTask {
  task_id: number;
  author_id: number;
  section_id: number;
  complete: 1 | 0;
  today: 1 | 0;
  past: 1 | 0;
  future: 1 | 0;
  recurring: 1 | 0;
  due_date: string; // YYYY-MM-DD
}

export interface InsertTask {
  title: string;
  description: string;
  author_id: number;
  section_id: number;
  due_date: string;
}

export interface UpdateTask {
  title: string;
  description: string;
  author_id: number;
  section_id: number;
  due_date: string; // YYYY-MM-DD
  complete: 1 | 0;
  recurring_task_id: number | null; // Foreign key to "recurring_task" table4
  last_modified_by: number; // Employee ID
}

// Original Below
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