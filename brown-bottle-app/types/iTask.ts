export interface Task {
  type: "normal";
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
  timestamp_sort: "Newest" | "Oldest";
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
  recurring_task_id: number | null; // Foreign key to "recurring_task" table
  last_modified_by: number; // Employee ID
}

export interface ConvertTask {
  direction: 'to_recurring' | 'to_normal';
  title: string;
  description: string;
  author_id: number;
  section_id: number;
  task_id?: number;           // Required for to_recurring
  recurring_task_id?: number; // Required for to_normal
  due_date?: string;          // Required for to_normal
  // Recurring fields
  mon?: number;
  tue?: number;
  wed?: number;
  thu?: number;
  fri?: number;
  sat?: number;
  sun?: number;
  start_date?: string;
  end_date?: string | null;
}