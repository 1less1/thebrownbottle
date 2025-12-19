import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";
import {
  RecurringTask,
  GetRecurringTask,
  InsertRecurringTask,
  UpdateRecurringTask
} from "@/types/iRecurringTask";


// GET: Fetches data from the recurring_task table
export async function getRecurringTask(params?: Partial<GetRecurringTask>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/recurring-task?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Recurring Task API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();
    return data as RecurringTask[];
  } catch (error) {
    console.error("Failed to fetch recurring task data:", error);
    throw error;
  }

}

// POST: Inserts a recurring task record
export async function insertRecurringTask(fields: InsertRecurringTask) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/recurring-task/insert`;

  // Required db fields for POST
  const requiredFields: (keyof InsertRecurringTask)[] = [
    "title",
    "description",
    "author_id",
    "section_id",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
    "start_date" // end_date is optional!!!
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
      throw new Error(`[Recurring Task API] Failed to POST: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to insert recurring task data:", error);
    throw error;
  }

}

// PATCH: Updates a recurring task record
export async function updateRecurringTask(recurring_task_id: number, fields: Partial<UpdateRecurringTask>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  if (!recurring_task_id) {
    throw new Error("Updating a recurring task requires a recurring_task_id!");
  }

  const url = `${API_BASE_URL}/recurring-task/update/${recurring_task_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[Recurring Task API] Failed to PATCH: ${recurring_task_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update recurring task data:", error);
    throw error;
  }

}

// DELETE: Deletes a recurring task record (irreversible)
export async function deleteRecurringTask(recurring_task_id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/recurring-task/delete/${recurring_task_id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Recurring Task API] Failed to DELETE Recurring Task: ${recurring_task_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete recurring task:", error);
    throw error;
  }

}
