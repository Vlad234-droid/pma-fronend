import { min } from 'lodash';
import { DateTime, Duration, DurationUnit } from 'luxon';
import { DurationObject } from 'luxon/src/duration';

export { DateTime };

export const parseDurationFromIso = (duration: string): DurationObject => Duration.fromISO(duration).toObject();

const PRECISE_UNITS: Record<string, DurationUnit> = {
  days: 'hours',
  hours: 'minutes',
  minutes: 'seconds',
  seconds: 'milliseconds',
  years: 'years',
};

export const convertDuration = (duration: string): string => {
  const durationUnits = duration.match(/(\d+)\s*(years?|months?|weeks?|days?)/gi);
  if (!durationUnits) return '';
  return durationUnits.reduce((acc, unit, index) => {
    const matchResult = unit.match(/(\d+)\s*(years?|months?|weeks?|days?)/i);
    if (!matchResult) return acc;
    const [_, value, unitType] = matchResult;
    const singularUnitType = unitType.replace(/s$/, '');

    return index ? `${acc}, ${parseInt(value)}${singularUnitType.charAt(0)}` : `${value}${singularUnitType.charAt(0)}`;
  }, '');
};

export const parseDurationToIso = (durationObject: DurationObject): string =>
  Duration.fromObject(durationObject).toISO();

export const fromDurationObjectToString = (duration, duration_map) =>
  Object.entries(duration)
    .filter(([_, value]) => value !== 0)
    .sort(([a], [b]) => duration_map.indexOf(a) - duration_map.indexOf(b))
    .map(([key, value]) => `${value} ${key}`)
    .join(', ');

export const EXPIRATION_DATE = 'expiration_date';

const diffBy = (unit: DurationUnit) => (endDate: DateTime, startDate?: DateTime) => {
  const units = [unit, PRECISE_UNITS[unit]];
  const diff = endDate.diff(startDate || DateTime.local(), units);
  return diff.toObject()[unit] || 0;
};

export const diffDays = diffBy('days');
export const diffYears = diffBy('years');
export const diffHours = diffBy('hours');
export const diffSeconds = diffBy('seconds');
export const DATE_STRING_FORMAT = 'dd LLL yyyy';
export const MONTH_FORMAT = 'LLL yyyy';
export const YEAR_FORMAT = 'yyyy';
export const DATE_TIME_STRING_FORMAT = 'dd LLL yyyy HH:mm';
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_FORMAT_FULL_MONTH = 'yyyy-mmm-dd';
export type DateFormat = string;

export const getLocalNow = () => DateTime.local();
export const resolveTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const minDate = (arr: Array<string>) => min(arr);

export const filterByDate = (a: string, b: string) => (DateTime.fromISO(a) > DateTime.fromISO(b) ? 1 : -1);
export const filterByDateDESC = (a: string, b: string) => (DateTime.fromISO(a) > DateTime.fromISO(b) ? -1 : 1);

export const formatDateStringFromISO = (date: string, format: DateFormat = DATE_STRING_FORMAT) =>
  DateTime.fromISO(date).setLocale('en').toFormat(format);

export const formatDateString = (date: string, format: DateFormat = DATE_STRING_FORMAT) =>
  DateTime.fromFormat(date, DATE_FORMAT).setLocale('en').toFormat(format);

export const formatDate = (date: Date, format: DateFormat = DATE_FORMAT) =>
  DateTime.fromISO(date.toISOString()).toFormat(format);

export const formatDateTime = (date: DateTime, format: DateFormat = DATE_FORMAT) => date.toFormat(format);

export const formatDateStringToIsoDate = (date: string) => DateTime.fromISO(date).setLocale('en').toISODate();

export const formatToRelativeDate = (date: string) => {
  const relativeDate = DateTime.fromISO(date).setLocale('en').toRelative();
  return relativeDate?.includes('second') ? 'just now' : relativeDate;
};

export const addYearToDateString = (date: string, format = DATE_FORMAT) =>
  DateTime.fromFormat(date, format).plus({ years: 1 });

export const minusDayToDateString = (date: DateTime) => date.minus({ days: 1 });

export const minusMonthFromDateString = (date: string, format = DATE_FORMAT) =>
  DateTime.fromFormat(date, format).minus({ month: 1 });

export const minusMonthFromISODateString = (date: string) => DateTime.fromISO(date).minus({ month: 1 });

export const minusMonthFromDateTime = (date: DateTime) => date.minus({ month: 1 });

export const inDayRange = (date: string, checkDate: string) => {
  const compare = DateTime.fromISO(checkDate);
  return compare >= DateTime.fromISO(date).startOf('day') && compare <= DateTime.fromISO(date).endOf('day');
};

export const dateToIso = (date: Date) => DateTime.fromJSDate(date).toISO();

export const getCurrentYear = () => DateTime.local().year;
export const getYearFromISO = (date: string) => DateTime.fromISO(date).year;
export const getNextYear = (year: number) => DateTime.local().plus({ year }).toFormat('yyyy');
export const getPrevYear = (year: number) => DateTime.local().minus({ year }).toFormat('yyyy');

export const getISODateStringWithTimeFromDateString = (dateString: string): string => {
  const date = DateTime.fromFormat(dateString, DATE_FORMAT);

  return date.toISO().replace(/\+.+$/, 'Z');
};

export const getYearsFromCurrentYear = (currentYear, depth = 3): Array<{ value: string }> =>
  Array.from(new Array(depth), (_, index) => ({
    value: (currentYear - index).toString(),
  }));

export const getToday = () => {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setMilliseconds(0);
  return now;
};

export const getFinancialYear = (): string =>
  (DateTime.local().get('month') >= 2
    ? DateTime.local().year
    : DateTime.local().minus({ year: 1 }).toFormat('yyyy')
  ).toString();

export const getDepthByYears = (startYear = 2021) => {
  const start = DateTime.local(startYear);
  const now = DateTime.local(Number(getFinancialYear()));
  return diffYears(now, start) + 1;
};

export const isDateFromISOBeforeNow = (date: string) => DateTime.now() <= DateTime.fromISO(date);

export const isDateFromISOAfterNow = (date: string) => DateTime.now() >= DateTime.fromISO(date);
