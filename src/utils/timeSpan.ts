import { TimeRangeConfig, TicksConfig } from '../../index.d';

import { startOfUnit, addUnit, adjustToIncrement } from './date';

export const getStartEndForTimeRange = (range: TimeRangeConfig, ticksConfig: TicksConfig): { start: Date, end: Date } => {
  const start = startOfUnit(range.from, ticksConfig.major.unit);
  const proposedEnd = addUnit(start, range.duration.increment, range.duration.unit);
  const minorAdjustedEnd = adjustToIncrement(start, proposedEnd, ticksConfig.minor.increment, ticksConfig.minor.unit);

  return { start, end: minorAdjustedEnd };
}