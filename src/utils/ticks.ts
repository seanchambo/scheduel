import { TimeAxisRowConfig, Tick, MinorTimeAxisRowConfig } from "../../index";
import { addUnitToDate } from './date';

export const getTicksInRange = (start: Date, end: Date, timeAxisRowConfig: TimeAxisRowConfig): Tick[] => {
  const result: Tick[] = []

  while (true) {
    const nextStart = addUnitToDate(start, timeAxisRowConfig.increment, timeAxisRowConfig.unit);

    if (nextStart.getTime() >= end.getTime()) {
      const incrementInMs = end.getTime() - start.getTime();
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
    const nextStart = addUnitToDate(start, minorIncrement, minorUnit);

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