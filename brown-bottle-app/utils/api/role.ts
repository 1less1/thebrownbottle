import Constants from "expo-constants";

import { buildQueryString } from "@/utils/helper";

import { Role } from "@/types/iApi";

// Fetches data from the role table
export async function getRole(params?: Partial<Role>) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/role?${queryString}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data; // JSON Response
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}
