import { TickConfig, Tick, MinorTickConfig, TimeAxisConfig, TicksConfig, Ticks } from '../../index.d';
import { addUnit } from './date';

export const getTicksInRange = (start: Date, end: Date, tickConfig: TickConfig): Tick[] => {
  const result: Tick[] = []

  while (true) {
    const nextStart = addUnit(start, tickConfig.increment, tickConfig.unit);

    if (nextStart.getTime() >= end.getTime()) {
      const show = nextStart.getTime() === end.getTime();

      result.push({
        startTime: new Date(start),
        endTime: new Date(end),
        incrementInMs: end.getTime() - start.getTime(),
        unit: tickConfig.unit,
        show,
      })

      return result;
    }

    result.push({
      startTime: new Date(start),
      endTime: new Date(nextStart),
      incrementInMs: nextStart.getTime() - start.getTime(),
      unit: tickConfig.unit,
      show: true,
    });

    start = new Date(nextStart);
  }
}

export const getMajorTickWidth = (tick: Tick, minorTickConfig: MinorTickConfig): number => {
  let start = new Date(tick.startTime);
  let end = new Date(tick.endTime);
  let width: number = 0;
  const { increment: minorIncrement, width: minorWidth, unit: minorUnit } = minorTickConfig;

  while (true) {
    const nextStart = addUnit(start, minorIncrement, minorUnit);

    if (nextStart >= end) {
      const remaining = end.getTime() - start.getTime();
      const ratio = remaining / (nextStart.getTime() - start.getTime());
      width += ratio * minorWidth;
      return width;
    }

    width += minorWidth;
    start = new Date(nextStart);
  }
}

export const getTicks = (start: Date, end: Date, ticksConfig: TicksConfig): Ticks => {
  const majorTicks = getTicksInRange(start, end, ticksConfig.major);
  const minorTicks = getTicksInRange(start, end, ticksConfig.minor);

  minorTicks.forEach(tick => {
    tick.width = ticksConfig.minor.width
    tick.type = 'minor';
  });
  majorTicks.forEach(tick => {
    tick.width = getMajorTickWidth(tick, ticksConfig.minor)
    tick.type = 'major';
  });

  return { major: majorTicks, minor: minorTicks };
}