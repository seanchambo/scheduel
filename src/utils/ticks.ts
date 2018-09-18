import { TimeAxisRowConfig, Tick, MinorTimeAxisRowConfig, TimeAxisConfig, TicksConfig } from '../models';
import { addUnit } from './date';

export const getTicksInRange = (start: Date, end: Date, timeAxisRowConfig: TimeAxisRowConfig): Tick[] => {
  const result: Tick[] = []

  while (true) {
    const nextStart = addUnit(start, timeAxisRowConfig.increment, timeAxisRowConfig.unit);

    if (nextStart.getTime() >= end.getTime()) {
      const show = nextStart.getTime() === end.getTime();

      result.push({
        startTime: new Date(start),
        endTime: new Date(end),
        incrementInMs: end.getTime() - start.getTime(),
        unit: timeAxisRowConfig.unit,
        show,
      })

      return result;
    }

    result.push({
      startTime: new Date(start),
      endTime: new Date(nextStart),
      incrementInMs: nextStart.getTime() - start.getTime(),
      unit: timeAxisRowConfig.unit,
      show: true,
    });

    start = new Date(nextStart);
  }
}

export const getMajorTickWidth = (tick: Tick, minorTimeAxisConfig: MinorTimeAxisRowConfig): number => {
  let start = new Date(tick.startTime);
  let end = new Date(tick.endTime);
  let width: number = 0;
  const { increment: minorIncrement, width: minorWidth, unit: minorUnit } = minorTimeAxisConfig;

  while (true) {
    const nextStart = addUnit(start, minorIncrement, minorUnit);

    if (nextStart >= end) {
      const remaining = end.getTime() - start.getTime();
      const ratio = remaining / (nextStart.getTime() - start.getTime());
      width += Math.round(ratio * minorWidth);
      return width;
    }

    width += minorWidth;
    start = new Date(nextStart);
  }
}

export const getTicksConfig = (start: Date, end: Date, timeAxisConfig: TimeAxisConfig): TicksConfig => {
  const majorTicks = getTicksInRange(start, end, timeAxisConfig.major);
  const minorTicks = getTicksInRange(start, end, timeAxisConfig.minor);

  minorTicks.forEach(tick => tick.width = timeAxisConfig.minor.width);
  majorTicks.forEach(tick => tick.width = getMajorTickWidth(tick, timeAxisConfig.minor));

  return { major: majorTicks, minor: minorTicks };
}