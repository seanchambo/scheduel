import { TimeSpanConfig, TimeAxisConfig } from "../../index";

import { startOfUnit, addUnit, adjustToIncrement } from './date';

export const getStartEndForTimeSpan = (timeSpan: TimeSpanConfig, timeAxisConfig: TimeAxisConfig): { start: Date, end: Date } => {
  const start = startOfUnit(timeSpan.startTime, timeAxisConfig.major.unit);
  const proposedEnd = addUnit(start, timeSpan.duration, timeSpan.unit);
  const minorAdjustedEnd = adjustToIncrement(start, proposedEnd, timeAxisConfig.minor.increment, timeAxisConfig.minor.unit);

  return { start, end: minorAdjustedEnd };
}