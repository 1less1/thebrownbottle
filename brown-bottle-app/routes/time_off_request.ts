import Constants from "expo-constants";
import { buildQueryString } from "@/utils/apiHelpers";
import {
  TimeOffRequest,
  GetTimeOffRequest,
  InsertTimeOffRequest,
  UpdateTimeOffRequest,
} from "@/types/iTimeOff";

// GET: Fetches data from the time_off_request table
export async function getTimeOffRequest(params?: Partial<GetTimeOffRequest>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/tor?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[TOR API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();
    return data as TimeOffRequest[];
  } catch (error) {
    console.error("Failed to fetch time off request data:", error);
    throw error;
  }

}

// POST: Inserts a time off request record
export async function insertTimeOffRequest(fields: InsertTimeOffRequest) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/tor/insert`;

  // Required db fields for POST
  const requiredFields: (keyof InsertTimeOffRequest)[] = [
    "employee_id",
    "reason",
    "start_date",
    "end_date",
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
      throw new Error(`[TOR API] Failed to POST: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to insert time off request data:", error);
    throw error;
  }

}

// PATCH: Updates a time off request record
export async function updateTimeOffRequest(request_id: number, fields: Partial<UpdateTimeOffRequest>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  if (!request_id) {
    throw new Error("Updating a time off request requires a request_id!");
  }

  const url = `${API_BASE_URL}/tor/update/${request_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[TOR API] Failed to PATCH: ${request_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update time off request data:", error);
    throw error;
  }

}

// DELETE: Deletes a time off request record (irreversible)
export async function deleteTimeOffRequest(request_id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/tor/delete/${request_id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[TOR API] Failed to DELETE Time Off Request: ${request_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete time off request:", error);
    throw error;
  }

}
