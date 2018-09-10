import * as getDaysInMonth from 'date-fns/get_days_in_month';
import * as getDaysInYear from 'date-fns/get_days_in_year';
import * as startOfSecond from 'date-fns/start_of_second';
import * as startOfMinute from 'date-fns/start_of_minute';
import * as startOfHour from 'date-fns/start_of_hour';
import * as startOfDay from 'date-fns/start_of_day';
import * as startOfWeek from 'date-fns/start_of_week';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfYear from 'date-fns/start_of_year';
import * as endOfSecond from 'date-fns/end_of_second';
import * as endOfMinute from 'date-fns/end_of_minute';
import * as endOfHour from 'date-fns/end_of_hour';
import * as endOfDay from 'date-fns/end_of_day';
import * as endOfWeek from 'date-fns/end_of_week';
import * as endOfMonth from 'date-fns/end_of_month';
import * as endOfYear from 'date-fns/end_of_year';
import * as addMilliseconds from 'date-fns/add_milliseconds';
import * as addSeconds from 'date-fns/add_seconds';
import * as addMinutes from 'date-fns/add_minutes';
import * as addHours from 'date-fns/add_hours';
import * as addDays from 'date-fns/add_days';
import * as addWeeks from 'date-fns/add_weeks';
import * as addMonths from 'date-fns/add_months';
import * as addYears from 'date-fns/add_years';
import * as differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import * as differenceInSeconds from 'date-fns/difference_in_seconds';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import * as differenceInHours from 'date-fns/difference_in_hours';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as differenceInWeeks from 'date-fns/difference_in_weeks';
import * as differenceInMonths from 'date-fns/difference_in_months';
import * as differenceInYears from 'date-fns/difference_in_years';

import { TimeUnit } from '../../index';

interface UnitFnInterface {
  addFn: Function;
  differenceFn: Function;
  start: (date: Date) => Date;
  end: (date: Date) => Date;
  convertToMs: (date: Date) => number;
}

interface FnMapInterface {
  milliseconds: UnitFnInterface;
  seconds: UnitFnInterface;
  minutes: UnitFnInterface;
  hours: UnitFnInterface;
  days: UnitFnInterface;
  weeks: UnitFnInterface;
  months: UnitFnInterface;
  years: UnitFnInterface;
}

const fnMap: FnMapInterface = {
  milliseconds: {
    addFn: addMilliseconds,
    differenceFn: differenceInMilliseconds,
    start: (date: Date) => new Date(date),
    end: (date: Date) => new Date(date),
    convertToMs: () => 1,
  },
  seconds: {
    addFn: addSeconds,
    differenceFn: differenceInSeconds,
    start: (date: Date) => startOfSecond(date),
    end: (date: Date) => endOfSecond(date),
    convertToMs: () => 1000,
  },
  minutes: {
    addFn: addMinutes,
    differenceFn: differenceInMinutes,
    start: (date: Date) => startOfMinute(date),
    end: (date: Date) => endOfMinute(date),
    convertToMs: () => 60000,
  },
  hours: {
    addFn: addHours,
    differenceFn: differenceInHours,
    start: (date: Date) => startOfHour(date),
    end: (date: Date) => endOfHour(date),
    convertToMs: () => 3600000,
  },
  days: {
    addFn: addDays,
    differenceFn: differenceInDays,
    start: (date: Date) => startOfDay(date),
    end: (date: Date) => endOfDay(date),
    convertToMs: (date) => 86400000,
  },
  weeks: {
    addFn: addWeeks,
    differenceFn: differenceInWeeks,
    start: (date: Date) => startOfWeek(date),
    end: (date: Date) => endOfWeek(date),
    convertToMs: () => 604800000,
  },
  months: {
    addFn: addMonths,
    differenceFn: differenceInMonths,
    start: (date: Date) => startOfMonth(date),
    end: (date: Date) => endOfMonth(date),
    convertToMs: (date: Date) => {
      const days = getDaysInMonth(date);
      return 86400000 * days;
    },
  },
  years: {
    addFn: addYears,
    differenceFn: differenceInYears,
    start: (date: Date) => startOfYear(date),
    end: (date: Date) => endOfYear(date),
    convertToMs: (date: Date) => {
      const days = getDaysInYear(date);
      return 86400000 * days;
    },
  }
}

export const unitToMillseconds = (unit: TimeUnit, date?: Date): number => {
  return fnMap[unit].convertToMs(date);
}

export const startOfUnit = (date: Date, unit: TimeUnit): Date => {
  return fnMap[unit].start(date);
}

export const endOfUnit = (date: Date, unit: TimeUnit): Date => {
  return fnMap[unit].end(date);
}

export const addUnitToDate = (date: Date, quantity: number, unit: TimeUnit): Date => {
  const addFn = fnMap[unit].addFn;
  return addFn(date, quantity);
}

export const adjustToIncrement = (start: Date, end: Date, increment: number, unit: TimeUnit): Date => {
  while (start < end) {
    start = addUnitToDate(start, increment, unit);
  }

  return new Date(start);
}