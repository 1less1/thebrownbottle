import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";
import {
  ShiftCoverRequest,
  InsertShiftCoverRequest,
  UpdateShiftCoverRequest,
} from "@/types/iShiftCover";

export async function getShiftCoverRequest(
  params: Record<string, any> = {}
): Promise<ShiftCoverRequest[]> {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/scr?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Shift API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Invalid SCR response format:", data);
      return [];
    }

    return data as ShiftCoverRequest[];
  } catch (error) {
    console.error("Failed to fetch shift cover data:", error);
    return []; 
  }
}


export async function insertShiftCoverRequest(fields: InsertShiftCoverRequest) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    const response = await fetch(`${API_BASE_URL}/scr/insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to insert shift cover request: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("[insertShiftCoverRequest] ERROR:", error);
    throw error;
  }
}

export async function updateShiftCoverRequest(fields: UpdateShiftCoverRequest) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  if (!fields.cover_request_id) {
    throw new Error("updateShiftCoverRequest requires cover_request_id");
  }

  const url = `${API_BASE_URL}/scr/update/${fields.cover_request_id}`;
  const { cover_request_id, ...payload } = fields;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update shift cover request (${response.status})`
      );
    }

    return await response.json();
  } catch (err) {
    console.error("[updateShiftCoverRequest] ERROR:", err);
    throw err;
  }
}

export async function deleteShiftCoverRequest(cover_request_id: number) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const url = `${API_BASE_URL}/scr/delete/${cover_request_id}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete shift cover request (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('[deleteShiftCoverRequest] ERROR:', error);
    throw error;
  }
}


export async function hasPendingRequest(
  employeeId: number,
  shiftId: number
): Promise<boolean> {
  const requests = await getShiftCoverRequest({
    requested_employee_id: employeeId,
  });

  const latest = requests
    .filter((req) => req.shift_id === shiftId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
    )[0];

  return !!latest && latest.status !== "Denied";
}

export async function approveShiftCoverRequest(cover_request_id: number) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const res = await fetch(`${API_BASE_URL}/scr/approve/${cover_request_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json(); // read once

  console.log("API RESPONSE:", data);

  if (!res.ok) throw new Error(data?.message || "Request failed");

  return data;
}
