import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";

import { ScheduleEmployee, ScheduleShift, ScheduleAPI } from "@/types/iShift";

// GET: Fetches data from the shift table
export async function getSchedule(params?: Partial<ScheduleAPI>) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params || {});

  const url = `${API_BASE_URL}/schedule?${queryString}`;

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

// SpreadSheet.tsx schedule rendering helper functions -----------------------------------------------

export const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getSunday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  d.setDate(d.getDate() - day); // go back to Sunday
  d.setHours(0, 0, 0, 0);
  return d;
};

export const navigateWeek = (date: Date, direction: "prev" | "next") => {
  const newWeek = new Date(date);
  newWeek.setDate(date.getDate() + (direction === "next" ? 7 : -7));
  return newWeek;
};

export const getWeekDateRange = (start: Date) => {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
};

export const getWeekDates = (start: Date, days = 7) => {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: d.toISOString().split("T")[0], // <-- REAL DATE (YYYY-MM-DD)
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });
};

export const buildBlockedDaysMap = (timeOffRequests: any[]) => {
  const blocked: Record<number, Set<string>> = {};

  timeOffRequests.forEach((tor) => {
    const empId = tor.employee_id;
    if (!blocked[empId]) blocked[empId] = new Set();

    const start = new Date(tor.start_date);
    const end = new Date(tor.end_date);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      blocked[empId].add(dateStr);
    }
  });

  return blocked;
};

export const attachBlockedDays = (
  schedule: ScheduleEmployee[],
  blockedDays: Record<number, Set<string>>
) => {
  return schedule.map((emp) => ({
    ...emp,
    blockedDays: blockedDays[emp.employee_id] ?? new Set(),
  }));
};
