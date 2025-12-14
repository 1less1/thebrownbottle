import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";
import {
  Announcement,
  GetAnnouncement,
  InsertAnnouncement,
  UpdateAnnouncement,
} from "@/types/iAnnouncement";

// GET: Fetches data from the announcement table
export async function getAnnouncement(params?: Partial<GetAnnouncement>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/announcement?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Announcement API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();
    return data as Announcement[];
  } catch (error) {
    console.error("Failed to fetch announcement data:", error);
    throw error;
  }

}

// POST: Inserts an announcement record
export async function insertAnnouncement(fields: InsertAnnouncement) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/announcement/insert`;

  // Required db fields for POST
  const requiredFields: (keyof InsertAnnouncement)[] = [
    "author_id",
    "title",
    "description",
    "role_id",
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
      throw new Error(`[Announcement API] Failed to POST: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to insert announcement data:", error);
    throw error;
  }

}

// PATCH: Updates an announcement record
export async function updateAnnouncement(announcement_id: number, fields: Partial<UpdateAnnouncement>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  if (!announcement_id) {
    throw new Error("Updating an announcement requires an announcement_id!");
  }

  const url = `${API_BASE_URL}/announcement/update/${announcement_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`[Announcement API] Failed to PATCH: ${announcement_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update announcement data:", error);
    throw error;
  }

}

// DELETE: Deletes an announcement record (irreversible)
export async function deleteAnnouncement(announcement_id: number) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/announcement/delete/${announcement_id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`[Announcement API] Failed to DELETE Announcement: ${announcement_id} - ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    throw error;
  }

}


export async function acknowledgeAnnouncement(
  announcement_id: number,
  employee_id: number
) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  const response = await fetch(`${baseURL}/announcement/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ announcement_id, employee_id }),
  });

  if (!response.ok) {
    throw new Error("Failed to acknowledge announcement");
  }

  return response.json();
}

// GET Acknolwedged Announcements for a specific employee
export async function getAcknowledgedAnnouncements(employee_id: number) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  const response = await fetch(
    `${baseURL}/announcement/acknowledgement?employee_id=${employee_id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch acknowledged announcements");
  }

  return (await response.json()) as { announcement_id: number }[];
  // [{ announcement_id, employee_id, acknowledged_at, employee_name }]
}