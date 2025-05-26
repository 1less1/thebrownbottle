import { format, isValid } from 'date-fns';

// Accepts dateStr in the format YYYY-MM-DD
export const formatDATE = (dateStr: string | null | undefined, type?: string) => {
  if (!dateStr) return 'No due date';

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  if (!yearStr || !monthStr || !dayStr) return 'Invalid Date';

  // Create date in local time, months are 0-indexed
  const date = new Date(
    Number(yearStr),
    Number(monthStr) - 1,
    Number(dayStr)
  );

  if (!isValid(date)) return 'Invalid Date';

  switch (type) {
    case 'full':
      return format(date, 'PPpp'); // Full date and time 
      // Ex: May 24th, 2025 at 12:00 AM
    case 'month-year':
      return format(date, 'MMMM yyyy'); // Month and Year
      // Ex: May 2025
    case 'weekday':
      return format(date, 'EEEE, MMMM do'); // Ex: Saturday, May 24th
    case 'mm-dd-yyyy':
    default:
      return format(date, 'MM-dd-yyyy');
  }

};
