import * as areRangesOverlapping from 'date-fns/are_ranges_overlapping';

import { Tick, ViewConfig, ResourceHeightsMap, ResourceElementMap, Event, Resource, Assignment, AssignmentElement, TicksConfig, ResourceHeight } from '../../index';

export const getCoordinatesForTimeSpan = (start: Date, end: Date, ticks: Tick[], timeSpanStart: Date, timeSpanEnd: Date): { startX: number, endX: number } => {
  let currentX: number = 0;
  let startX: number = -1;
  let endX: number = -1;

  if (start < timeSpanStart && end > timeSpanEnd) {
    startX = 0;
    endX = ticks.length * ticks[0].width;
    return { startX, endX };
  }
  if (end < timeSpanStart || start > timeSpanEnd) {
    return null;
  }
  if (start < timeSpanStart) {
    startX = 0;
  }
  if (end > timeSpanEnd) {
    endX = ticks.length * ticks[0].width;
  }

  for (let i = 0; i < ticks.length; i++) {
    if (ticks[i].startTime.getTime() <= start.getTime() && start.getTime() < end.getTime()) {
      const msFromTickStartToStart = start.getTime() - ticks[i].startTime.getTime();
      const ratio = msFromTickStartToStart / ticks[i].incrementInMs;
      const width = ratio * ticks[i].width;
      startX = currentX + width;

      if (endX >= 0) { break; }
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

  return { startX, endX };
}

interface ResourceEventItem {
  date: Date;
  type: 'start' | 'end';
  assignmentElement: AssignmentElement;
  matching?: ResourceEventItem;
};

export const getResourceElementsAndHeights = (
  events: Event[],
  resources: Resource[],
  assignments: Assignment[],
  viewConfig: ViewConfig,
  ticksConfig: TicksConfig,
  start: Date,
  end: Date,
): { resourceHeights: ResourceHeightsMap, resourceElements: ResourceElementMap } => {
  const eventMap: { [key: string]: Event } = {};
  const resourceMap: { [key: string]: Resource } = {};
  const resourceEventsMap: { [key: string]: ResourceEventItem[] } = {};

  const resourceHeights: ResourceHeightsMap = new Map<Resource, ResourceHeight>();
  const resourceElements: ResourceElementMap = new Map<Resource, AssignmentElement[]>();

  const assignmentHeight = viewConfig.resourceAxis.row.height - 2 * viewConfig.resourceAxis.row.padding;
  let accumTop: number = 0;

  for (const resource of resources) {
    resourceMap[resource.id] = resource;
    resourceEventsMap[resource.id] = [];
    resourceElements.set(resource, []);
  }

  for (const event of events) {
    if (areRangesOverlapping(event.startTime, event.endTime, start, end)) {
      eventMap[event.id] = event;
    }
  }

  for (const assignment of assignments) {
    const event = eventMap[assignment.eventId];
    if (!event) { continue; }

    const resource = resourceMap[assignment.resourceId];

    const { startX, endX } = getCoordinatesForTimeSpan(event.startTime, event.endTime, ticksConfig.minor, start, end);

    const assignmentElement: AssignmentElement = { startX, endX, top: null, event, assignment, height: assignmentHeight };

    const startEvent: ResourceEventItem = { date: new Date(event.startTime), type: 'start' as 'start', assignmentElement };
    const endEvent: ResourceEventItem = { date: new Date(event.endTime), type: 'end' as 'end', assignmentElement }
    startEvent.matching = endEvent;
    endEvent.matching = startEvent;

    resourceEventsMap[resource.id].push(startEvent);
    resourceEventsMap[resource.id].push(endEvent);

    resourceElements.get(resource).push(assignmentElement);
  }

  for (const resource of resources) {
    const resourceEvents = resourceEventsMap[resource.id];

    resourceEvents.sort((a, b) => {
      const aMs = a.date.getTime();
      const bMs = b.date.getTime();

      if (aMs === bMs) {
        if (a.type === b.type) {
          return a.matching.date.getTime() - b.matching.date.getTime();
        }
        if (a.type === 'start' && b.type === 'end') {
          return 1;
        }
        if (a.type === 'end' && b.type === 'start') {
          return -1;
        }
      }

      return aMs - bMs;
    });

    let currentDepth = -1;
    let maxDepth = -1;

    for (let i = 0; i < resourceEvents.length; i++) {
      const resourceEvent = resourceEvents[i];

      if (resourceEvent.type === 'start') {
        if (!resourceEvents[i - 1] || resourceEvents[i - 1].type === 'start') {
          currentDepth += 1;
          if (currentDepth > maxDepth) {
            maxDepth = currentDepth
          }
        }
        resourceEvent.assignmentElement.top = currentDepth * assignmentHeight + (currentDepth + 1) * viewConfig.resourceAxis.row.padding;
      } else {
        currentDepth -= 1;
      }
    }

    let height: number;
    if (maxDepth === -1) { height = viewConfig.resourceAxis.row.height }
    else { height = (maxDepth + 1) * assignmentHeight + (maxDepth + 2) * viewConfig.resourceAxis.row.padding }
    resourceHeights.set(resource, { depth: maxDepth, pixels: height, top: accumTop });
    accumTop += height;
  }

  return { resourceElements, resourceHeights };
}

// // Returns -1 if distance cant be found
// export const getDistanceBetweenDates = (start: Date, end: Date, ticks: Tick[]): number => {
//   let width: number = 0;
//   let startTickIndex: number;
//   let endTickIndex: number;

//   // TODO: Implement Binary Search
//   for (let i = 0; i < ticks.length; i++) {
//     if (ticks[i].startTime <= start) {
//       startTickIndex = i;
//     }
//     if (ticks[i].endTime >= end) {
//       endTickIndex = i;
//       break;
//     }
//   }

//   if (!startTickIndex || !endTickIndex || endTickIndex < startTickIndex) {
//     return -1;
//   }

//   if (startTickIndex === endTickIndex) {
//     const tick = ticks[startTickIndex];

//     const msFromTickStartToStart = start.getTime() - tick.startTime.getTime();
//     const startRatio = msFromTickStartToStart / tick.incrementInMs;
//     const startWidth = startRatio * tick.width;

//     const msFromEndToTickEnd = tick.endTime.getTime() - end.getTime();
//     const endRatio = msFromEndToTickEnd / tick.incrementInMs;
//     const endWidth = endRatio * tick.width;

//     return tick.width - startWidth - endWidth;
//   }

//   const msFromStartTickEnd = ticks[startTickIndex].endTime.getTime() - start.getTime();
//   const startRatio = msFromStartTickEnd / ticks[startTickIndex].incrementInMs;
//   const startWidth = startRatio * ticks[startTickIndex].width;

//   const msFromEndTickStart = end.getTime() - ticks[endTickIndex].startTime.getTime();
//   const endRatio = msFromEndTickStart / ticks[endTickIndex].incrementInMs;
//   const endWidth = endRatio * ticks[endTickIndex].width;

//   const middleWidth = (endTickIndex - startTickIndex - 1) * ticks[0].width;

//   return startWidth + endWidth + middleWidth;
// }

// // Returns null if position does not exist within ticks
// export const getDateFromPosition = (x: number, ticks: Tick[]): Date => {
//   let currentX = 0;
//   let currentIndex = 0;

//   while (true) {
//     const tick = ticks[currentIndex];

//     if (currentX + tick.width >= x) {
//       const distanceFromXToTickStart = x - currentX;
//       const ratio = distanceFromXToTickStart / tick.width;
//       const msFromTickStartToX = ratio * tick.incrementInMs;
//       return new Date(tick.startTime.getTime() + msFromTickStartToX);
//     }

//     currentX += tick.width;
//     currentIndex += 1;

//     if (currentIndex === ticks.length) {
//       return null;
//     }
//   }
// }

// // Returns -1 if date does not exist within ticks
// export const getPositionFromDate = (date: Date, ticks: Tick[]): number => {
//   let currentIndex = 0;
//   let currentX = 0;

//   while (true) {
//     const tick = ticks[currentIndex];

//     if (tick.startTime <= date && date <= tick.endTime) {
//       const msFromTickStartToDate = date.getTime() - tick.startTime.getTime();
//       const ratio = msFromTickStartToDate / tick.incrementInMs;
//       const width = ratio * tick.width;
//       return currentX + width;
//     }

//     currentX += tick.width;
//     currentIndex += 1;

//     if (currentIndex === ticks.length) {
//       return -1;
//     }
//   }
// }