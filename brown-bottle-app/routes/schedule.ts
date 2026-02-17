import Constants from "expo-constants";

import { buildQueryString } from "@/utils/apiHelpers";

import { ScheduleAPI, ScheduleEmployee } from "@/types/iSchedule";

// GET: Fetches data from the shift, availability, and time_off_request tables
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

    return data as ScheduleEmployee[]; // JSON Response
    
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

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getWeekDayList = (start: Date, days = 7) => {
  const startDate = new Date(start);
  return Array.from({ length: days }, (_, i) => {
    // Modify one date object instead of creating new ones daily
    const d = i === 0 ? startDate : new Date(startDate.setDate(startDate.getDate() + 1));
    const dayIndex = d.getDay();
    
    return {
      date: d.toISOString().split("T")[0],
      dayName: DAY_NAMES_SHORT[dayIndex],
      fullDayName: DAY_NAMES_LONG[dayIndex],
    };
  });
};

// Input: Date for current week start (Date Object)
// Output: weekStart and weekEnd strings
export function getWeekStartEnd (currentWeekStart: Date): { weekStartStr: string; weekEndStr: string } {
  // Week start in local timezone (YYYY-MM-DD)
  const weekStartStr = currentWeekStart.toLocaleDateString("en-CA");

  // Week end = start + 6 days, also in local timezone
  const weekEnd = new Date(currentWeekStart.getTime() + 6 * 86400000);
  const weekEndStr = weekEnd.toLocaleDateString("en-CA");

  return { weekStartStr, weekEndStr };
}

export const getWeekRangeString = (start: Date) => {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${formatDate(start)}-${formatDate(end)} ${start.getFullYear()}`;
};

