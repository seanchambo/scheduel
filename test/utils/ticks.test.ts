import { Tick } from '../../index';

import { getTimeAxisRowConfig, getMinorTimeAxisConfig, getTimeAxisConfig } from '../helpers';
import { getTicksInRange, getMajorTickWidth, getTicksConfig } from '../../src/utils/ticks';

const MS_IN_2018 = 31536000000
const MS_IN_MONTH = 604800000
const WEEKS_IN_YEAR = 52

describe('#getTicksInRange', () => {
  test('when increment fits exactly into range', () => {
    const config = getTimeAxisRowConfig(1, 'months');
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2019, 0, 1, 0, 0, 0, 0);

    const ticks = getTicksInRange(start, end, config);
    expect(ticks.length).toBe(12);

    ticks.forEach((tick, index) => {
      expect(tick.startTime.getMonth()).toBe(index % 12);
    });
  });

  test('when increment does not fit exactly into range', () => {
    const config = getTimeAxisRowConfig(1, 'weeks');
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2019, 0, 1, 0, 0, 0, 0);

    const ticks = getTicksInRange(start, end, config);
    expect(ticks.length).toBe(53);

    expect(ticks[52].incrementInMs).toBe(MS_IN_2018 - WEEKS_IN_YEAR * MS_IN_MONTH);
  });
});

describe('#getMajorTickWidth', () => {
  test('when minor ticks fit exactly into major tick', () => {
    const config = getMinorTimeAxisConfig(1, 'hours', 10);

    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2018, 0, 2, 0, 0, 0, 0);

    const tick: Tick = {
      startTime: start,
      endTime: end,
      incrementInMs: end.getTime() - start.getTime(),
      unit: 'days',
      show: true,
    }

    const width = getMajorTickWidth(tick, config);
    expect(width).toBe(240);
  });

  test('when minor ticks dont fit exactly into major tick', () => {
    const config = getMinorTimeAxisConfig(5, 'hours', 10);

    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2018, 0, 2, 0, 0, 0, 0);

    const tick: Tick = {
      startTime: start,
      endTime: end,
      incrementInMs: end.getTime() - start.getTime(),
      unit: 'days',
      show: true,
    }

    const width = getMajorTickWidth(tick, config);
    expect(width).toBe((24 / 5) * 10);
  });
});

describe('#getTicksConfig', () => {
  test('months/years', () => {
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2019, 0, 1, 0, 0, 0, 0);
    const config = getTimeAxisConfig(1, 'months', 1, 'years');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(1);
    expect(ticksConfig.minor.length).toBe(12);
  });

  test('weeks/months', () => {
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2019, 0, 1, 0, 0, 0, 0);
    const config = getTimeAxisConfig(1, 'weeks', 1, 'months');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(12);
    expect(ticksConfig.minor.length).toBe(53);
  });

  test('days/weeks', () => {
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2019, 0, 1, 0, 0, 0, 0);
    const config = getTimeAxisConfig(1, 'days', 1, 'weeks');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(53);
    expect(ticksConfig.minor.length).toBe(365);
  });

  test('hours/days', () => {
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2018, 0, 5, 0, 0, 0, 0);
    const config = getTimeAxisConfig(1, 'hours', 1, 'days');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(4);
    expect(ticksConfig.minor.length).toBe(96);
  });

  test('minutes/hours', () => {
    const start = new Date(2018, 0, 1, 0, 0, 0, 0);
    const end = new Date(2018, 0, 1, 6, 0, 0, 0);
    const config = getTimeAxisConfig(1, 'minutes', 1, 'hours');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(6);
    expect(ticksConfig.minor.length).toBe(360);
  });

  test('seconds/minutes', () => {
    const start = new Date(2018, 0, 1, 0, 30, 0, 0);
    const end = new Date(2018, 0, 1, 2, 30, 0, 0);
    const config = getTimeAxisConfig(1, 'seconds', 1, 'minutes');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(120);
    expect(ticksConfig.minor.length).toBe(120 * 60);
  });

  test('milliseconds/seconds', () => {
    const start = new Date(2018, 0, 1, 0, 30, 0, 0);
    const end = new Date(2018, 0, 1, 0, 30, 50, 0);
    const config = getTimeAxisConfig(1, 'milliseconds', 1, 'seconds');

    const ticksConfig = getTicksConfig(start, end, config);

    expect(ticksConfig.major.length).toBe(50);
    expect(ticksConfig.minor.length).toBe(50 * 1000);
  });
});