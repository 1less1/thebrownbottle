import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";
import {
  Task,
  GetTask,
  InsertTask,
  UpdateTask,
  ConvertTask
} from "@/types/iTask";


// GET: Fetches data from the task table
export async function getTask(params?: Partial<GetTask>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/task?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Task API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();
    return data as Task[];
  } catch (error) {
    console.error("Failed to fetch task data:", error);
    throw error;
  }

}

// POST: Inserts a task record
export async function insertTask(fields: InsertTask) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/task/insert`;

  // Required db fields for POST
  const requiredFields: (keyof InsertTask)[] = [
    "title",
    "description",
    "author_id",
    "section_id",
    "due_date",
  ];

  try {
    for (const key of requiredFields) {
      if (fields[key] === undefined || fields[key] === null) {
        throw new Error(`Missing required field: ${key}`);
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[Task API] Failed to POST: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to insert task data:", error);
    throw error;
  }

}

// PATCH: Updates a task record
export async function updateTask(task_id: number, fields: Partial<UpdateTask>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  if (!task_id) {
    throw new Error("Updating a task requires a task_id!");
  }

  const url = `${API_BASE_URL}/task/update/${task_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[Task API] Failed to PATCH: ${task_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update task data:", error);
    throw error;
  }

}

// DELETE: Deletes a task record (irreversible)
export async function deleteTask(task_id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/task/delete/${task_id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Task API] Failed to DELETE Task: ${task_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }

}

// POST: Converts Normal Task -> Recurring or Recurring -> Normal
export async function convertTask(fields: ConvertTask) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/task/convert`;

  // Base required fields for both directions
  const baseRequired: (keyof ConvertTask)[] = [
    "direction",
    "title",
    "description",
    "author_id",
    "section_id",
  ];

  try {
    // 1. Validate Base Fields
    for (const key of baseRequired) {
      if (fields[key] === undefined || fields[key] === null) {
        throw new Error(`[Convert Task API] Missing base required field: ${key}`);
      }
    }

    // 2. Validate Direction-Specific Requirements
    if (fields.direction === "to_recurring") {
      if (!fields.task_id) {
        throw new Error("[Convert Task API] task_id is required for conversion to recurring.");
      }
      if (!fields.start_date) {
        throw new Error("[Convert Task API] start_date is required for recurring tasks.");
      }
    }

    if (fields.direction === "to_normal") {
      if (!fields.recurring_task_id) {
        throw new Error("[Convert Task API] recurring_task_id is required for conversion to normal.");
      }
      if (!fields.due_date) {
        throw new Error("[Convert Task API] due_date is required for normal tasks.");
      }
    }

    // 3. Execute Request
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`[Task API] Conversion Failed: ${errorData.message || response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to convert task:", error);
    throw error;
  }
}