import Constants from "expo-constants";

import { buildQueryString } from "@/utils/Helper";

import { Employee } from "@/types/api";

// GET: Fetches data from the employee table
export async function getEmployee(params?: Partial<Employee>) {
  
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params || {})

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
    console.error("Failed to fetch employee data:", error);
    throw error;
  }

}


// PATCH: Updates an employee record within the employee table
export async function updateEmployee(id: number, fields: Partial<Employee>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/employee/update/${id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data; // Updated employee object

  } catch (error) {
    console.error("Failed to update employee:", error);
    throw error;
  }

}