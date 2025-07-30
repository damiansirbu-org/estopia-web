import dayjs, { Dayjs } from 'dayjs';

// Date format used by backend (LocalDate -> ISO 8601)
export const DATE_FORMAT = 'YYYY-MM-DD';

// Format date for display
export const formatDate = (date: string | Dayjs | null | undefined): string => {
  if (!date) return '';
  return dayjs(date).format(DATE_FORMAT);
};

// Parse date from string to dayjs object
export const parseDate = (date: string | null | undefined): Dayjs | null => {
  if (!date) return null;
  return dayjs(date, DATE_FORMAT);
};

// Check if date is valid
export const isValidDate = (date: string | null | undefined): boolean => {
  if (!date) return false;
  return dayjs(date, DATE_FORMAT, true).isValid();
};

// Compare dates
export const isDateAfter = (date1: string | Dayjs, date2: string | Dayjs): boolean => {
  return dayjs(date1).isAfter(dayjs(date2), 'day');
};

export const isDateBefore = (date1: string | Dayjs, date2: string | Dayjs): boolean => {
  return dayjs(date1).isBefore(dayjs(date2), 'day');
};

// Get today's date in backend format
export const getTodayFormatted = (): string => {
  return dayjs().format(DATE_FORMAT);
};