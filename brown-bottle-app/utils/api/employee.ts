import Constants from "expo-constants";

import { buildQueryString } from "@/utils/Helper";

import { Employee } from "@/types/api";

// Fetches data from the employee table
export async function getEmployee(params: Employee) {
  
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params)

  const url = `${API_BASE_URL}/employee?${queryString}`;
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