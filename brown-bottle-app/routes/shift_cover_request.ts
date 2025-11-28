import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";
import {
  ShiftCoverRequest,
  GetShiftCoverRequest,
  InsertShiftCoverRequest,
  UpdateShiftCoverRequest,
} from "@/types/iShiftCover";

// GET: Fetches data from the shift_cover_request table
export async function getShiftCoverRequest(params?: Partial<GetShiftCoverRequest>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/scr?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`[SCR API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();

    return data as ShiftCoverRequest[]; // JSON Response

  } catch (error) {
    console.error("Failed to fetch shift cover request data:", error);
    throw error;
  }

}


// POST: Inserts a shift coverrequest record within the shift_cover_request table
export async function insertShiftCoverRequest(fields: InsertShiftCoverRequest) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/scr/insert`;

  // Required db fields for POST
  const requiredFields: (keyof InsertShiftCoverRequest)[] = [
    "requested_employee_id", "shift_id"
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
      throw new Error(`[SCR API] Failed to POST: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to insert shift cover request data:", error);
    throw error;
  }

}


// PATCH: Updates a shift cover request record within the shift_cover_request table
export async function updateShiftCoverRequest(cover_request_id: number, fields: UpdateShiftCoverRequest) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  if (!cover_request_id) {
    throw new Error("Updating a shift cover request requires an cover_request_id!");
  }

  const url = `${API_BASE_URL}/scr/update/${cover_request_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[SCR API] Failed to PATCH: ${cover_request_id} - ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to update shift cover request data:", error);
    throw error;
  }

}


// DELETE: Deletes a shift cover request record from the database (irreversible)
export async function deleteShiftCoverRequest(cover_request_id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/scr/delete/${cover_request_id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`[SCR API] Failed to DELETE Shift Cover Request: ${cover_request_id} - ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to delete selected shift cover request:", error);
    throw error;
  }

}


// GET: Does the requesting employee have a recent request for the selected shift that is NOT Denied?
export async function hasPendingRequest(employeeId: number, shiftId: number): Promise<boolean> {

  const requestData = await getShiftCoverRequest({ requested_employee_id: employeeId });

  const latestRequests = requestData
    .filter((req) => req.shift_id === shiftId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
    )[0];

  return !!latestRequests && latestRequests.status !== "Denied";
}


// PATCH: Approve the selected shift cover request and assign new employee to the target shift
export async function approveShiftCoverRequest(cover_request_id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    const response = await fetch(`${API_BASE_URL}/scr/approve/${cover_request_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[SCR API] Failed to APPROVE Shift Cover Request: ${cover_request_id} - ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to approve shift cover request:", error);
    throw error;
  }

}
