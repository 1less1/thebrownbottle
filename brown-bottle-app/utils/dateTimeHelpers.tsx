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
