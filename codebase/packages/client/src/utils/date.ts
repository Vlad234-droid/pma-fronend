import { DateTime, DurationUnit } from 'luxon';

export { DateTime };

const PRECISE_UNITS: Record<string, DurationUnit> = {
  days: 'hours',
  hours: 'minutes',
  minutes: 'seconds',
  seconds: 'milliseconds',
};

const diffBy = (unit: DurationUnit) => (endDate: DateTime, startDate?: DateTime) => {
  const units = [unit, PRECISE_UNITS[unit]];
  const diff = endDate.diff(startDate || DateTime.local(), units);
  return diff.toObject()[unit] || 0;
};

export const diffDays = diffBy('days');
export const diffHours = diffBy('hours');
export const diffSeconds = diffBy('seconds');
export const DATE_STRING_FORMAT = 'dd LLL yyyy';
export const DATE_TIME_STRING_FORMAT = 'dd LLL yyyy HH:mm';
export const DATE_FORMAT = 'yyyy-MM-dd';
export type DateFormat = string;

export const getLocalNow = () => DateTime.local();
export const resolveTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const filterByDate = (a: string, b: string) => (DateTime.fromISO(a) > DateTime.fromISO(b) ? 1 : -1);

export const formatDateStringFromISO = (date: string, format: DateFormat = DATE_STRING_FORMAT) =>
  DateTime.fromISO(date).setLocale('en').toFormat(format);

export const formatDateString = (date: string, format: DateFormat = DATE_STRING_FORMAT) =>
  DateTime.fromFormat(date, DATE_FORMAT).setLocale('en').toFormat(format);

export const formatDate = (date: Date, format: DateFormat = DATE_FORMAT) =>
  DateTime.fromISO(date.toISOString()).toFormat(format);

export const formatDateStringToIsoDate = (date: string) => DateTime.fromISO(date).setLocale('en').toISODate();

export const formatToRelativeDate = (date: string) => {
  return DateTime.fromISO(date).setLocale('en').toRelative()?.includes('second')
    ? 'just now'
    : DateTime.fromISO(date).setLocale('en').toRelative();
};
