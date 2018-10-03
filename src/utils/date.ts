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

import { TimeUnit, IncrementTimeUnit } from '../models';

interface UnitFnInterface {
  add: Function;
  start: (date: Date) => Date;
  toMs?: (multiplier: number) => number;
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
    add: addMilliseconds,
    start: (date: Date) => new Date(date),
    toMs: (multiplier: number) => multiplier * 1,
  },
  seconds: {
    add: addSeconds,
    start: (date: Date) => startOfSecond(date),
    toMs: (multiplier: number) => multiplier * 1000,
  },
  minutes: {
    add: addMinutes,
    start: (date: Date) => startOfMinute(date),
    toMs: (multiplier: number) => multiplier * 60 * 1000,
  },
  hours: {
    add: addHours,
    start: (date: Date) => startOfHour(date),
    toMs: (multiplier: number) => multiplier * 60 * 60 * 1000,
  },
  days: {
    add: addDays,
    start: (date: Date) => startOfDay(date),
    toMs: (multiplier: number) => multiplier * 24 * 60 * 60 * 1000,
  },
  weeks: {
    add: addWeeks,
    start: (date: Date) => startOfWeek(date),
  },
  months: {
    add: addMonths,
    start: (date: Date) => startOfMonth(date),
  },
  years: {
    add: addYears,
    start: (date: Date) => startOfYear(date),
  }
}

export const startOfUnit = (date: Date, unit: TimeUnit): Date => fnMap[unit].start(date);

export const addUnit = (date: Date, quantity: number, unit: TimeUnit): Date => fnMap[unit].add(date, quantity);

export const getInMilliseconds = (quantity: number, unit: IncrementTimeUnit): number => fnMap[unit].toMs(quantity);

export const roundTo = (date: Date, increment: number, unit: IncrementTimeUnit) => {
  const roundedIncrementMs = getInMilliseconds(increment, unit);
  const halfIncrement = roundedIncrementMs / 2;
  let roundedStart = date.getTime();
  const mod = roundedStart % roundedIncrementMs;

  if (mod <= halfIncrement) {
    roundedStart -= mod;
  } else {
    roundedStart += roundedIncrementMs - mod;
  }

  return new Date(roundedStart + getTimezoneOffset(new Date(roundedStart)));
}

export const adjustToIncrement = (start: Date, end: Date, increment: number, unit: TimeUnit): Date => {
  while (start < end) {
    start = addUnit(start, increment, unit);
  }

  return new Date(start);
}

export const getTimezoneOffset = (date: Date = new Date()): number => {
  return date.getTimezoneOffset() * 60 * 1000;
}