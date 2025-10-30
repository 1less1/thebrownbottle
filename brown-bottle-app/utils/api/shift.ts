import Constants from "expo-constants";
import { buildQueryString } from "@/utils/helper";

export async function getUserShifts(employee_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const base_url = API_BASE_URL;

  try {
    console.log(base_url);
    const response = await fetch(
      `${base_url}/shift?employee_id=${employee_id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    throw error;
  }
}
// POST - Create new shift
export async function createShift(
  employee_id: number,
  date: string, // 'YYYY-MM-DD'
  start_time: string, // 'HH:MM'
  end_time: string, // 'HH:MM'
  section_id: number
) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    const response = await fetch(`${API_BASE_URL}/shift/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id,
        date,
        start_time,
        end_time,
        section_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    
    return data;
  } catch (error) {
    console.error("Failed to create shift:", error);
    throw error;
  }
}

// PATCH - Update existing shift
export async function updateShift(
  shift_id: number,
  updates: {
    start_time?: string;
    end_time?: string;
    section_id?: number;
    date?: string;
  }
) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    const response = await fetch(`${API_BASE_URL}/shift/update/${shift_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update shift:", error);
    throw error;
  }
}

// DELETE - Remove shift
export async function deleteShift(shift_id: number) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    const response = await fetch(`${API_BASE_URL}/shift/delete/${shift_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete shift:", error);
    throw error;
  }
}

// Interface for API parameters
interface ScheduleParams {
  start_date?: string; // '2025-10-14'
  end_date?: string; // '2025-10-20'
  section_id?: number; // Filter by section
  role_id?: number; // Filter by role
  employee_name?: string; // Search by name
  include_all_employees?: boolean; // Include employees without shifts
}

// Fetch schedule data from backend
export async function getScheduleData(params?: ScheduleParams) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  try {
    // Convert boolean to string for query parameter
    const queryParams = { ...params };
    if (queryParams.include_all_employees !== undefined) {
      (queryParams as any).include_all_employees =
        queryParams.include_all_employees ? "true" : "false";
    }

    // Build query string from parameters
    const queryString = buildQueryString(params || {});
    const url = `${API_BASE_URL}/schedule${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const shifts = await response.json();
    return shifts; // Returns ScheduleShift[] from backend
  } catch (error) {
    console.error("Failed to fetch schedule data:", error);
    throw error;
  }
}

// Process raw API data into spreadsheet format
export function processScheduleForSpreadsheet(
  data: any[],  // Can be shifts OR employee records with nullable shifts
  startDate: Date, 
  days: number = 7
) {
  const dates: string[] = [];
  const dayNames: string[] = [];
  const employeeMap: { [key: number]: any } = {};

  // --- Generate visible dates for the spreadsheet header ---
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    const dayStr = currentDate.toLocaleDateString('en-US', { weekday: 'short' });

    dates.push(dateStr);
    dayNames.push(dayStr);
  }

  // --- Process every record (either employee with or without shifts) ---
  data.forEach((record: any) => {
    const employeeId = record.employee_id;

    // Initialize employee if not exists
    if (!employeeMap[employeeId]) {
      employeeMap[employeeId] = {
        employee_id: employeeId,
        employee_name: record.employee_name,
        primary_role_name: record.primary_role_name,
        shifts: new Array(days).fill(null)
      };
    }

    // --- Handle shift data only if present ---
    if (record.shift_id && record.date) {
      // Parse as *local* date, not UTC, to avoid day-offset bug
      let shiftDate: Date;
      if (record.date.includes('T')) {
        // Handles backend sending full ISO datetimes like "2025-10-29T00:00:00Z"
        shiftDate = new Date(record.date);
      } else {
        const [year, month, day] = record.date.split('-').map(Number);
        shiftDate = new Date(year, month - 1, day);
      }

      // Compute index within the week
      const dayIndex = Math.floor(
        (shiftDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Place shift in correct day cell if it falls within range
      if (dayIndex >= 0 && dayIndex < days) {
        employeeMap[employeeId].shifts[dayIndex] = {
          shift_id: record.shift_id,
          time: `${record.start_time}-${record.end_time}`,
          section: record.section_name,
          section_id: record.section_id
        };
      }
    }
  });

  // --- Convert map to array for rendering ---
  const employees = Object.values(employeeMap);

  return {
    dates,
    dayNames,
    employees
  };
}
