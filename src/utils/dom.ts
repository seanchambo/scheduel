import { Tick } from '../../index';

// Returns null if cant find coordinates
export const getCoordinatesForTimeSpan = (start: Date, end: Date, ticks: Tick[]): { startX: number, endX: number } => {
  let currentX: number = 0;
  let startX: number = 0;
  let endX: number = 0;

  for (let i = 0; i < ticks.length; i++) {
    if (ticks[i].startTime.getTime() <= start.getTime() && start.getTime() < end.getTime()) {
      const msFromTickStartToStart = start.getTime() - ticks[i].startTime.getTime();
      const ratio = msFromTickStartToStart / ticks[i].incrementInMs;
      const width = ratio * ticks[i].width;
      startX = currentX + width;
    }
    if (ticks[i].startTime.getTime() < end.getTime() && end.getTime() <= ticks[i].endTime.getTime()) {
      const msFromTickStartToEnd = end.getTime() - ticks[i].startTime.getTime();
      const ratio = msFromTickStartToEnd / ticks[i].incrementInMs;
      const width = ratio * ticks[i].width;
      endX = currentX + width;
      break;
    }

    currentX += ticks[i].width;
  }

  if (!startX || !endX) { return null };

  return { startX, endX };
}

// Returns -1 if distance cant be found
export const getDistanceBetweenDates = (start: Date, end: Date, ticks: Tick[]): number => {
  let width: number = 0;
  let startTickIndex: number;
  let endTickIndex: number;

  // TODO: Implement Binary Search
  for (let i = 0; i < ticks.length; i++) {
    if (ticks[i].startTime <= start) {
      startTickIndex = i;
    }
    if (ticks[i].endTime >= end) {
      endTickIndex = i;
      break;
    }
  }

  if (!startTickIndex || !endTickIndex || endTickIndex < startTickIndex) {
    return -1;
  }

  if (startTickIndex === endTickIndex) {
    const tick = ticks[startTickIndex];

    const msFromTickStartToStart = start.getTime() - tick.startTime.getTime();
    const startRatio = msFromTickStartToStart / tick.incrementInMs;
    const startWidth = startRatio * tick.width;

    const msFromEndToTickEnd = tick.endTime.getTime() - end.getTime();
    const endRatio = msFromEndToTickEnd / tick.incrementInMs;
    const endWidth = endRatio * tick.width;

    return tick.width - startWidth - endWidth;
  }

  const msFromStartTickEnd = ticks[startTickIndex].endTime.getTime() - start.getTime();
  const startRatio = msFromStartTickEnd / ticks[startTickIndex].incrementInMs;
  const startWidth = startRatio * ticks[startTickIndex].width;

  const msFromEndTickStart = end.getTime() - ticks[endTickIndex].startTime.getTime();
  const endRatio = msFromEndTickStart / ticks[endTickIndex].incrementInMs;
  const endWidth = endRatio * ticks[endTickIndex].width;

  const middleWidth = (endTickIndex - startTickIndex - 1) * ticks[0].width;

  return startWidth + endWidth + middleWidth;
}

// Returns null if position does not exist within ticks
export const getDateFromPosition = (x: number, ticks: Tick[]): Date => {
  let currentX = 0;
  let currentIndex = 0;

  while (true) {
    const tick = ticks[currentIndex];

    if (currentX + tick.width >= x) {
      const distanceFromXToTickStart = x - currentX;
      const ratio = distanceFromXToTickStart / tick.width;
      const msFromTickStartToX = ratio * tick.incrementInMs;
      return new Date(tick.startTime.getTime() + msFromTickStartToX);
    }

    currentX += tick.width;
    currentIndex += 1;

    if (currentIndex === ticks.length) {
      return null;
    }
  }
}

// Returns -1 if date does not exist within ticks
export const getPositionFromDate = (date: Date, ticks: Tick[]): number => {
  let currentIndex = 0;
  let currentX = 0;

  while (true) {
    const tick = ticks[currentIndex];

    if (tick.startTime <= date && date <= tick.endTime) {
      const msFromTickStartToDate = date.getTime() - tick.startTime.getTime();
      const ratio = msFromTickStartToDate / tick.incrementInMs;
      const width = ratio * tick.width;
      return currentX + width;
    }

    currentX += tick.width;
    currentIndex += 1;

    if (currentIndex === ticks.length) {
      return -1;
    }
  }
}