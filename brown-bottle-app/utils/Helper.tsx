import { format, isValid } from 'date-fns';

export const formatDATE = (dateStr: string | null | undefined, type?: string) => {
  if (!dateStr) return 'No due date';

  const date = new Date(dateStr);
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
