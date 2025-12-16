
// Input: time string (HH:MM AM/PM - 12 hour time)
// Output: date string (HH:MM - 24 hour time)
// Ex: 3:45 PM => 15:45
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


// Input: time string (HH:MM - 24 hour time)
// Output: date string (HH:MM AM/PM - 12 hour time)
// Ex: 15:45 => 3:45 PM
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


// Input: Custom SQL datetime (YYYY-MM-DD HH:MM - 24 hour time)
// Output: date string (Day, DD Month YYYY)
// Ex: 2025-12-15 14:21 => Mon, 15 Dec 2025
export const parseDateFromDateTime = (rawDate: string): string => {
  if (!rawDate) return "";

  const [datePart] = rawDate.split(" ");
  if (!datePart) return rawDate;

  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return rawDate;

  // Normalize Date
  const localDate = new Date(Number(year), Number(month) - 1, Number(day));
  const date = normalizeDateUTC(localDate);

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });

  const monthShort = date.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

  const dayPadded = day.padStart(2, "0");

  return `${weekday}, ${dayPadded} ${monthShort} ${year}`;
};



// Input: Custom SQL timestamp datetime (MM-DD-YY HH:MM - 24 hour time)
// Output: Month DD YYYY, HH:MM AM/PM  (Dec 15, 2025, 04:45 PM)
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


// Input: date string (YYYY-MM-DD)
// Output: date string (Day, DD Month)
// Ex: 2025-03-02 → Sun, 02 Mar
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateString;

  const [, year, month, day] = match;

  // Normalize Date
  const localDate = new Date(Number(year), Number(month) - 1, Number(day));
  const dateObj = normalizeDateUTC(localDate);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekdayName = weekdays[dateObj.getDay()];
  const dayNum = String(dateObj.getDate()).padStart(2, '0');
  const monthName = months[dateObj.getMonth()];

  return `${weekdayName}, ${dayNum} ${monthName}`;
};


// Input: date string (YYYY-MM-DD)
// Output: date string (Day, DD Month Year)
// Ex: 2025-03-02 → Sun, 02 Mar 2025
export const formatDateWithYear = (dateString: string): string => {
  if (!dateString) return '';

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateString;

  const [, year, month, day] = match;

  // Normalize Date
  const localDate = new Date(Number(year), Number(month) - 1, Number(day));
  const dateObj = normalizeDateUTC(localDate);

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


// Input: date string (YY-MM-YYYY)
// Output: date string (MM/DD)
export function formatDateToCellHeader(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${Number(m)}/${Number(d)}`;
}


// Input: date object
// Output: date object normalized to midnight of the date object's date
export const normalizeDateObject = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Input: date object
// Output: date object normalized to be used in any timezone
export const normalizeDateUTC = (date: Date) => {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));
};


// Input: date string (YYYY-MM-DD)
// Output: local date object 
// Ex: 2025-12-15 => Mon Dec 15 2025 00:00:00 CST
export const convertSQLDate = (date: string): Date => {
  // Split into parts
  const [year, month, day] = date.split("-").map(Number);

  // Construct as local date (month is 0-based)
  return new Date(year, month - 1, day);
}


// Input: date object
// Output: date string (YYYY-MM-DD)
export const convertToSQLDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// Input: time string (HH:MM AM/PM)
// Output: SQL 24 Hour time (HH:MM)
export const convertToSQL24HRTime = (time: string): string => {
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

