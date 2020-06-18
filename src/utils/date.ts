import * as startOfSecond from 'date-fns/start_of_second';
import * as startOfMinute from 'date-fns/start_of_minute';
import * as startOfHour from 'date-fns/start_of_hour';
import * as startOfDay from 'date-fns/start_of_day';
import * as startOfWeek from 'date-fns/start_of_week';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfYear from 'date-fns/start_of_year';
import * as addMilliseconds from 'date-fns/add_milliseconds';
import * as addSeconds from 'date-fns/add_seconds';
import * as addMinutes from 'date-fns/add_minutes';
import * as addHours from 'date-fns/add_hours';
import * as addDays from 'date-fns/add_days';
import * as addWeeks from 'date-fns/add_weeks';
import * as addMonths from 'date-fns/add_months';
import * as addYears from 'date-fns/add_years';

import { TimeUnit } from '../../index.d';

interface UnitFnInterface {
  add: Function;
  start: (date: Date) => Date;
  toMs?: (multiplier: number) => number;
}

interface FnMapInterface {
  millisecond: UnitFnInterface;
  second: UnitFnInterface;
  minute: UnitFnInterface;
  hour: UnitFnInterface;
  day: UnitFnInterface;
  week: UnitFnInterface;
  month: UnitFnInterface;
  year: UnitFnInterface;
}

const fnMap: FnMapInterface = {
  millisecond: {
    add: addMilliseconds,
    start: (date: Date) => new Date(date),
    toMs: (multiplier: number) => multiplier * 1,
  },
  second: {
    add: addSeconds,
    start: (date: Date) => startOfSecond(date),
    toMs: (multiplier: number) => multiplier * 1000,
  },
  minute: {
    add: addMinutes,
    start: (date: Date) => startOfMinute(date),
    toMs: (multiplier: number) => multiplier * 60 * 1000,
  },
  hour: {
    add: addHours,
    start: (date: Date) => startOfHour(date),
    toMs: (multiplier: number) => multiplier * 60 * 60 * 1000,
  },
  day: {
    add: addDays,
    start: (date: Date) => startOfDay(date),
    toMs: (multiplier: number) => multiplier * 24 * 60 * 60 * 1000,
  },
  week: {
    add: addWeeks,
    start: (date: Date) => startOfWeek(date),
  },
  month: {
    add: addMonths,
    start: (date: Date) => startOfMonth(date),
  },
  year: {
    add: addYears,
    start: (date: Date) => startOfYear(date),
  }
}

export const startOfUnit = (date: Date, unit: TimeUnit): Date => fnMap[unit].start(date);

export const addUnit = (date: Date, quantity: number, unit: TimeUnit): Date => fnMap[unit].add(date, quantity);

export const getInMilliseconds = (quantity: number, unit: TimeUnit): number => fnMap[unit].toMs(quantity);

export const roundTo = (date: Date, increment: number, unit: 'minute') => {
  const coeff = getInMilliseconds(increment, unit);
  return new Date(Math.ceil(date.getTime() / coeff) * coeff);
}

export const adjustToIncrement = (start: Date, end: Date, increment: number, unit: TimeUnit): Date => {
  while (start < end) {
    start = addUnit(start, increment, unit);
  }

  return new Date(start);
}
