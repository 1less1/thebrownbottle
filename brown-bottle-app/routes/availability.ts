import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";
import {
    Availability,
    GetAvailability,
    InsertAvailability,
    UpdateAvailability,
} from "@/types/iAvailability";

// GET: Fetches data from the availability table
export async function getAvailability(params?: Partial<GetAvailability>) {

    const { API_BASE_URL } = Constants.expoConfig?.extra || {};

    const queryString = buildQueryString(params || {});

    const url = `${API_BASE_URL}/availability?${queryString}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`[Availability API] Failed to GET: ${response.status}`);
        }

        const data = await response.json();
        return data as Availability[]; // Returns the list of availability records

    } catch (error) {
        console.error("Failed to fetch availability data:", error);
        throw error;
    }
}


// POST: Inserts an availability record in the availability table
export async function insertAvailability(fields: InsertAvailability) {

    const { API_BASE_URL } = Constants.expoConfig?.extra || {};

    const url = `${API_BASE_URL}/availability/insert`;

    // Required db fields for POST
    const requiredFields: (keyof InsertAvailability)[] = [
        "employee_id", "day_of_week"
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
            throw new Error(`[Availability API] Failed to POST: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Failed to insert availability data:", error);
        throw error;
    }
}


// PATCH: Updates an availability record within the availability table
export async function updateAvailability(availability_id: number, fields: Partial<UpdateAvailability>) {

    const { API_BASE_URL } = Constants.expoConfig?.extra || {};

    if (!availability_id) {
        throw new Error("Updating availability requires an availability_id!");
    }

    const url = `${API_BASE_URL}/availability/update/${availability_id}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
        });

        if (!response.ok) {
            throw new Error(`[Availability API] Failed to PATCH: ${availability_id} - ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Failed to update availability data:", error);
        throw error;
    }
}


// DELETE: Deletes an availability record from the database (irreversible)
export async function deleteAvailability(availability_id: number) {
    
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};

    const url = `${API_BASE_URL}/availability/delete/${availability_id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`[Availability API] Failed to DELETE availability: ${availability_id} - ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Failed to delete availability record:", error);
        throw error;
    }
}

// Helper: Check if an employee is marked as "Unavailable" for a specific day
export async function isEmployeeUnavailable(employeeId: number, day: string): Promise<boolean> {
    const availabilityData = await getAvailability({
        employee_id: employeeId,
        day_of_week: day as GetAvailability["day_of_week"]
    });

    // If a record exists and is_available is 0, they are explicitly unavailable
    const record = availabilityData[0];
    return !!record && record.is_available === 0;
}