import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

// Input: dateStr in the format YYYY-MM-DD 
// Returns: a formatted date string in the specified format or error message
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
// Returns: a Date object in local time OR an invalid Date if parsing fails
export const parseLocalDate = (dateStr: string): Date => {
  const date = dayjs(dateStr, 'YYYY-MM-DD', true);
  return date.isValid() ? date.toDate() : new Date(NaN);
};

// Input: date string
// Returns: true or false based off of date string validity
export const isValidDate = (dateStr: string): boolean => {
  const parsed = dayjs(dateStr, 'YYYY-MM-DD', true);
  return parsed.isValid() && parsed.format('YYYY-MM-DD') === dateStr;
};
