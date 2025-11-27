/**
 * Converts "YYYY-MM-DD" → "Wed, 02 Nov"
 * Example: "2025-03-02" → "Sun, 02 Mar"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateString;

  const [, year, month, day] = match;

  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekdayName = weekdays[dateObj.getDay()];
  const dayNum = String(dateObj.getDate()).padStart(2, '0');
  const monthName = months[dateObj.getMonth()];

  return `${weekdayName}, ${dayNum} ${monthName}`;
};

export const formatDateWithYear = (dateString: string): string => {
  if (!dateString) return '';

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateString;

  const [, year, month, day] = match;

  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekdayName = weekdays[dateObj.getDay()];
  const dayNum = String(dateObj.getDate()).padStart(2, '0');
  const monthName = months[dateObj.getMonth()];

  return `${weekdayName}, ${dayNum} ${monthName} ${year}`;
};

export function formatDateNoTZ(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/**
 * Converts 12-hour time (e.g., "3:45 PM") to 24-hour (e.g., "15:45")
 */
export const to24HourFormat = (time12h: string): string => {
  if (!time12h) return '';

  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*([APap][Mm])$/);
  if (!match) return time12h; // fallback if already 24h or invalid

  let [_, hours, minutes, period] = match;
  let h = parseInt(hours, 10);

  const isPM = period.toLowerCase() === 'pm';
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;

  return `${String(h).padStart(2, '0')}:${minutes}`;
};

/**
 * Converts 24-hour time (e.g., "15:45") to 12-hour (e.g., "3:45 PM")
 */
export const to12HourFormat = (time24h: string): string => {
  if (!time24h) return '';

  const match = time24h.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time24h;

  let [_, hours, minutes] = match;
  let h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  return `${h}:${minutes} ${period}`;
};

export function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
  if (!time || typeof time !== "string") {
    return ""; // or throw a controlled error
  }

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

// Input: SQL Time HH:MM AM/PM
// Output: hours, minutes, meridiem (strings or null)
export const breakUpTime = (time: string) => {
  const trimmed = time.trim();
  const parts = trimmed.split(" ");

  if (parts.length !== 2) {
    return { hours: null, minutes: null, meridiem: null };
  }

  const [timePart, meridiemRaw] = parts;
  const [hours, minutes] = timePart.split(":") || [];

  const meridiem = meridiemRaw?.toUpperCase();
  const validMeridiem = meridiem === "AM" || meridiem === "PM" ? meridiem : null;

  return {
    hours: hours || null,
    minutes: minutes || null,
    meridiem: validMeridiem,
  };
};

export const isValidTime = (time: string): boolean => {
  // Regex: HH:MM AM/PM
  const regex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
  return regex.test(time.trim());
};


// Input: time string (e.g. "9:5", "13:45", "07:30", "1230", "7:30pm")
// Output: formatted time string (HH:MM AM/PM)
export const formatTime = (value: string): string => {
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, "");
  const match = cleaned.match(/^(\d{1,2})(:?)(\d{2})?(am|pm)?$/);

  if (!match) return "";

  let hours = parseInt(match[1], 10);
  let minutes = match[3] ? parseInt(match[3], 10) : 0;

  const modifier = match[4]?.toUpperCase() || (hours >= 8 && hours <= 11 ? "AM" : "PM");

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
export const formatShiftDate = (rawDate: string): string => {
  if (!rawDate) return "";

  // Extract just the date portion: "Sat, 01 Nov 2025"
  const parts = rawDate.split(" ");

  // Expected: ["Sat,", "01", "Nov", "2025", "00:00:00", "GMT"]
  if (parts.length < 4) return rawDate;

  const weekday = parts[0].replace(",", "");
  const day = parts[1];
  const month = parts[2];
  const year = parts[3];

  return `${weekday}, ${month} ${day}, ${year}`;
};
