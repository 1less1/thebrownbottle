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
      throw new Error(`[Employee API] Failed to GET: ${response.status}`);
    }

    const data = await response.json();

    return data; // JSON Response

  } catch (error) {
    console.error("Failed to fetch employee data:", error);
    throw error;
  }

}


// POST: Inserts an employee record within the employee table
export async function insertEmployee(fields: Partial<Employee>) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const url = `${API_BASE_URL}/employee/insert`;

  // Required db fields for POST
  const requiredFields: (keyof Employee)[] = [
    "first_name", "last_name", "email", "phone_number", "wage",
    "admin", "primary_role", "secondary_role", "tertiary_role",
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
      throw new Error(`[Employee API] Failed to POST: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Failed to insert employee data:", error);
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
      throw new Error(`[Employee API] Failed to PATCH: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Failed to update employee data:", error);
    throw error;
  }

}

// PATCH: Marks multiple employees as inactive by setting "is_active" to 0
export async function removeEmployees(employeeIds: number[]) {

  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    const results = await Promise.all(

      employeeIds.map(async (id) => {
        const url = `${API_BASE_URL}/employee/update/${id}`; // Different API route for each employee id
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_active: 0 }),
        });

        if (!response.ok) {
          throw new Error(`[Employee API] Failed to PATCH ID ${id}: ${response.status}`);
        }

        return await response.json();
      })

    );

    return results; // Response Array

  } catch (error) {
    console.error("Failed to update one or more employees:", error);
    throw error;
  }

}
