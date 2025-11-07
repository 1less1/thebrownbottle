// Universal App Helper Functions

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

// General Helper Functions -----------------------------------------------------------------------------

// Input: dateStr in the format YYYY-MM-DD 
// Output: a formatted date string in the specified format or error message
export const formatDATE = (dateStr: string | null | undefined, type?: string) => {
  if (!dateStr) return 'No date string provided';

  const date = dayjs(dateStr, 'YYYY-MM-DD', true); // strict parsing

  if (!date.isValid()) return 'Invalid Date';

  switch (type) {
    case 'full':
      return date.format('LL LT'); // Localized full date and time
    // Ex: May 24, 2025 12:00 AM
    case 'month-year':
      return date.format('MMMM YYYY'); // Month and Year
    // Ex: May 2025
    case 'weekday':
      return date.format('dddd, MMMM D, YYYY'); // Ex: Saturday, May 24, 2025
    case 'mm-dd-yyyy':
    default:
      return date.format('MM-DD-YYYY');
  }
};

// Input: date string
// Output: a Date object in local time OR an invalid Date if parsing fails
export const parseLocalDate = (dateStr: string): Date => {
  const date = dayjs(dateStr, 'YYYY-MM-DD', true);
  return date.isValid() ? date.toDate() : new Date(NaN);
};

// Input: date string
// Output: true or false based off of date string validity
export const isValidDate = (dateStr: string): boolean => {
  const parsed = dayjs(dateStr, 'YYYY-MM-DD', true);
  return parsed.isValid() && parsed.format('YYYY-MM-DD') === dateStr;
};

// Input: date object
// Output: date string (YYYY-MM-DD)
export const formatSQLDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Input: time string (HH:MM AM/PM)
// Output: SQL 24 Hour time (HH:MM)
export const formatSQLTime = (time: string): string => {
  const [rawTime, modifier] = time.trim().split(" ");
  let [hours, minutes] = rawTime.split(":").map(Number);

  if (modifier.toUpperCase() === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

// Input: time string (e.g. "9:5", "13:45", "07:30", "1230", "7:30pm")
// Output: formatted time string (HH:MM AM/PM)
export const formatTime = (value: string): string => {
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, "");
  const match = cleaned.match(/^(\d{1,2})(:?)(\d{2})?(am|pm)?$/);

  if (!match) return "";

  let hours = parseInt(match[1], 10);
  let minutes = match[3] ? parseInt(match[3], 10) : 0;
  const modifier = match[4]?.toUpperCase() || (hours >= 12 ? "PM" : "AM");

  if (
    isNaN(hours) || isNaN(minutes) ||
    hours < 0 || hours > 23 ||
    minutes < 0 || minutes > 59
  ) return "";

  // Convert to 12-hour format
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedHours = String(displayHours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${modifier}`;
};



// Input: wage string
// Output: formatted wage string (00.00)
export const formatWage = (value: string) => {
  // Remove invalid characters
  const cleaned = value.replace(/[^0-9.]/g, "");

  // Prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts[1];

  // Limit to two decimal places
  if (parts[1]?.length > 2) {
    parts[1] = parts[1].slice(0, 2);
  }

  return parts.join(".");
};

// Input: phone number string
// Output: formatted phone number string (XXX-XXX-XXXX)
export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

// Input: phone string
// Output: true or false depending on phone formatting (XXX-XXX-XXXX)
export const isValidPhone = (phone: string) => {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
};

// Input: email string
// Output: true or false depending on email formatting (email@domain.com)
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Input: Record of a particular type
// Output: The input record cast to the target type T
// Example: const employee = castTo<Employee>(rawJSON);
export function castTo<T>(source: Record<string, any>): T {
  return source as T;
}

// ------------------------------------------------------------------------------------------------------


// API Helper Functions ---------------------------------------------------------------------------------

// Builds a parameter string for GET Requests
// Input: Array of [key, value] pairs
// Output: Query String: employee_id=1&name=John...
export function buildQueryString(params: Record<string, any>) {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
}


// Compares original and current data to generate fields for PATCH Requests
// Input: originalData (Dictionary), currentData (Dictionary), patchableKeys (List)
// Output: Dictionary of [key, value] pairs that have been changed
export function buildPatchData<T extends Record<string, any>>(
  originalData: T,
  currentData: T,
  keys: (keyof T)[]
): Partial<T> {
  const patch: Partial<T> = {};

  keys.forEach((key) => {
    const originalValue = originalData[key];
    const currentValue = currentData[key];

    const bothNullish = originalValue == null && currentValue == null;

    if (!bothNullish && originalValue !== currentValue) {
      patch[key] = currentValue;
    }
  });

  return patch;
}

