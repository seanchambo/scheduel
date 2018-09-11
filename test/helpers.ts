import { TimeAxisConfig, TimeUnit, TimeAxisRowConfig, MinorTimeAxisRowConfig, TimeSpanConfig, Tick } from '../index';
import { getTicksInRange } from '../src/utils/ticks';

export const getTimeAxisConfig = (minorIncrement: number, minorUnit: TimeUnit, majorIncrement: number, majorUnit: TimeUnit): TimeAxisConfig => ({
  minor: {
    increment: minorIncrement,
    unit: minorUnit,
    width: 0,
    height: 0,
    renderer: () => null,
  },
  major: {
    increment: majorIncrement,
    unit: majorUnit,
    height: 0,
    renderer: () => null,
  }
});

export const getMinorTimeAxisConfig = (increment: number, unit: TimeUnit, width: number): MinorTimeAxisRowConfig => ({
  increment,
  unit,
  width,
  height: 0,
  renderer: () => null,
});

export const getTimeAxisRowConfig = (increment: number, unit: TimeUnit): TimeAxisRowConfig => ({
  increment,
  unit,
  height: 0,
  renderer: () => null,
});

export const getTimeSpanConfig = (start: Date, duration: number, unit: TimeUnit): TimeSpanConfig => ({
  startTime: start,
  duration,
  unit,
});

export const generateMinorTicks = (start: Date, end: Date, increment: number, unit: TimeUnit, width: number): Tick[] => {
  const config = getTimeAxisRowConfig(increment, unit);

  const ticks = getTicksInRange(start, end, config);
  ticks.forEach(tick => tick.width = width);
  return ticks;
}