import Constants from "expo-constants";

import { buildQueryString } from "@/utils/Helper";

import { ScheduleEmployee, ScheduleShift, ScheduleAPI } from "@/types/api";

// GET: Fetches data from the shift table
export async function getSchedule(params?: Partial<ScheduleAPI>) {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params || {})

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
    const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); 
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
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });
};