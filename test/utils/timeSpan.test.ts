import { TimeSpanConfig, TimeAxisConfig } from '../../index';

import { getTimeAxisConfig, getTimeSpanConfig } from '../helpers';
import { getStartEndForTimeSpan } from '../../src/utils/timeSpan';

describe('#getStartEndForTimeSpan', () => {
  const testTimeSpan = (timeSpan: TimeSpanConfig, timeAxisConfig: TimeAxisConfig, expectedStart: Date, expectedEnd: Date) => {
    const { start, end } = getStartEndForTimeSpan(timeSpan, timeAxisConfig);
    expect(start.getTime()).toBe(expectedStart.getTime());
    expect(end.getTime()).toBe(expectedEnd.getTime());
  }

  test('when major starts at timespan start', () => {
    const timeSpanStart = new Date(2018, 0, 1, 0, 0, 0, 0);
    const timeSpan = getTimeSpanConfig(timeSpanStart, 10, 'seconds');
    const timeAxisConfig = getTimeAxisConfig(100, 'milliseconds', 1000, 'milliseconds');
    const expectedEnd = new Date(2018, 0, 1, 0, 0, 10, 0);
    testTimeSpan(timeSpan, timeAxisConfig, timeSpanStart, expectedEnd);
  });

  describe('when major doesnt start at timespan start', () => {
    test('years', () => {
      const timeSpanStart = new Date(2018, 0, 2, 0, 0, 0, 0);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 10, 'years');
      const timeAxisConfig = getTimeAxisConfig(1, 'months', 1, 'years');
      const expectedStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const expectedEnd = new Date(2028, 0, 1, 0, 0, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

    test('months', () => {
      const timeSpanStart = new Date(2018, 0, 2, 0, 0, 0, 0);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 1, 'years');
      const timeAxisConfig = getTimeAxisConfig(1, 'days', 1, 'months');
      const expectedStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const expectedEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

    test('weeks', () => {
      const timeSpanStart = new Date(2018, 0, 9, 0, 0, 0, 0);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 1, 'years');
      const timeAxisConfig = getTimeAxisConfig(1, 'days', 1, 'weeks');
      const expectedStart = new Date(2018, 0, 7, 0, 0, 0, 0);
      const expectedEnd = new Date(2019, 0, 7, 0, 0, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

    test('days', () => {
      const timeSpanStart = new Date(2018, 0, 9, 6, 0, 0, 0);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 1, 'months');
      const timeAxisConfig = getTimeAxisConfig(1, 'hours', 1, 'days');
      const expectedStart = new Date(2018, 0, 9, 0, 0, 0, 0);
      const expectedEnd = new Date(2018, 1, 9, 0, 0, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

    test('hours', () => {
      const timeSpanStart = new Date(2018, 0, 9, 0, 30, 0, 0);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 1, 'days');
      const timeAxisConfig = getTimeAxisConfig(1, 'minutes', 1, 'hours');
      const expectedStart = new Date(2018, 0, 9, 0, 0, 0, 0);
      const expectedEnd = new Date(2018, 0, 10, 0, 0, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

    test('minutes', () => {
      const timeSpanStart = new Date(2018, 0, 9, 0, 0, 30, 0);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 1, 'hours');
      const timeAxisConfig = getTimeAxisConfig(1, 'seconds', 1, 'minutes');
      const expectedStart = new Date(2018, 0, 9, 0, 0, 0, 0);
      const expectedEnd = new Date(2018, 0, 9, 1, 0, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

    test('seconds', () => {
      const timeSpanStart = new Date(2018, 0, 9, 0, 0, 0, 500);
      const timeSpan = getTimeSpanConfig(timeSpanStart, 1, 'minutes');
      const timeAxisConfig = getTimeAxisConfig(1, 'milliseconds', 1, 'seconds');
      const expectedStart = new Date(2018, 0, 9, 0, 0, 0, 0);
      const expectedEnd = new Date(2018, 0, 9, 0, 1, 0, 0);
      testTimeSpan(timeSpan, timeAxisConfig, expectedStart, expectedEnd);
    });

  });
});