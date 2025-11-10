import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";

import { Shift, ShiftAPI } from "@/types/iShift";

// GET: Fetches data from the shift table
export async function getShift(params?: Partial<ShiftAPI>) {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params || {})

  const url = `${API_BASE_URL}/shift?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`[Shift API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();

    return data; // JSON Response

  } catch (error) {
    console.error("Failed to fetch shift data:", error);
    throw error;
  }

}

// POST: Inserts a shift record within the shift table
export async function insertShift(fields: Partial<Shift>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/shift/insert`;

  // Required db fields for POST
  const requiredFields: (keyof Shift)[] = [
    "employee_id", "start_time", "end_time",
    "date", "section_id"
  ];

  try {
    for (const key of requiredFields) {
      if (fields[key] === undefined || fields[key] === "") {
        throw new Error(`Missing required field: ${key}`);
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[Shift API] Failed to POST: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Failed to insert shift data:", error);
    throw error;
  }

}


// PATCH: Updates an shift record within the shift table
export async function updateShift(id: number, fields: Partial<Shift>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/shift/update/${id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[Shift API] Failed to PATCH: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Failed to update shift data:", error);
    throw error;
  }

}

// DELETE: Deletes a shift record from the database (irreversible)
export async function deleteShift(id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/shift/delete/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`[Shift API] Failed to DELETE Shift: ${id}: ${response.status}`);
    }

    const data = await response.json();

    return data;


  } catch (error) {
    console.error("Failed to delete selected shift:", error);
    throw error;
  }

}

