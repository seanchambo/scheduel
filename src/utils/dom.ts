import * as areRangesOverlapping from 'date-fns/are_ranges_overlapping';

import { Tick, AxesConfig, ResourceAssignmentMap, Event, Resource, Assignment, AssignmentElement, ResourceElement, Ticks, ResourceZone, ResourceZoneMap, ResourceZoneElement, Line, LineElement } from '../../index.d';

export const getCoordinatesForTimeSpan = (start: Date, end: Date, ticks: Tick[], timeSpanStart: Date, timeSpanEnd: Date): { startX: number, endX: number } => {
  let currentX: number = 0;
  let startX: number;
  let endX: number;

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

  if (startX && endX) { return { startX, endX } }

  for (let i = 0; i < ticks.length; i++) {
    if (ticks[i].startTime.getTime() <= start.getTime() && start.getTime() < ticks[i].endTime.getTime() && !startX) {
      const msFromTickStartToStart = start.getTime() - ticks[i].startTime.getTime();
      const ratio = msFromTickStartToStart / ticks[i].incrementInMs;
      const width = ratio * ticks[i].width;
      startX = currentX + width;
    }
    if (ticks[i].startTime.getTime() < end.getTime() && end.getTime() <= ticks[i].endTime.getTime() && !endX) {
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

export const getResourceZones = (
  zones: ResourceZone[],
  resources: Resource[],
  ticks: Ticks,
  start: Date,
  end: Date,
): ResourceZoneMap => {
  const resourceZones: ResourceZoneMap = new Map<Resource, ResourceZoneElement[]>();
  const resourceMap: { [key: string]: Resource } = {};

  for (const resource of resources) {
    resourceMap[resource.id] = resource;
    resourceZones.set(resource, []);
  }

  for (const zone of zones) {
    if (areRangesOverlapping(zone.startTime, zone.endTime, start, end)) {
      const resource = resourceMap[zone.resourceId];
      if (!resource) { continue; }

      const { startX, endX } = getCoordinatesForTimeSpan(zone.startTime, zone.endTime, ticks.minor, start, end);
      const zoneElement: ResourceZoneElement = { startX, endX, resourceZone: zone };
      resourceZones.get(resource).push(zoneElement);
    }
  }

  return resourceZones;
}

export const getLines = (
  lines: Line[],
  ticks: Ticks,
  start: Date,
  end: Date,
): LineElement[] => {
  const lineElements: LineElement[] = [];

  for (const line of lines) {
    if (start <= line.date && line.date <= end) {
      const x = getPositionFromDate(line.date, ticks.minor);
      lineElements.push({ x, line });
    }
  }

  return lineElements;
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
  axesConfig: AxesConfig,
  ticks: Ticks,
  start: Date,
  end: Date,
): { resourceElements: ResourceElement[], resourceAssignments: ResourceAssignmentMap } => {
  const eventMap: { [key: string]: Event } = {};
  const resourceMap: { [key: string]: Resource } = {};
  const resourceEventsMap: { [key: string]: ResourceEventItem[] } = {};

  const resourceElements: ResourceElement[] = [];
  const resourceAssignments: ResourceAssignmentMap = new Map<Resource, AssignmentElement[]>();

  for (const resource of resources) {
    resourceMap[resource.id] = resource;
    resourceEventsMap[resource.id] = [];
    resourceAssignments.set(resource, []);
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
    if (!resource) { continue; }

    const { startX, endX } = getCoordinatesForTimeSpan(event.startTime, event.endTime, ticks.minor, start, end);

    const assignmentElement: AssignmentElement = { startX, endX, top: null, event, assignment, height: null, depth: null };

    const startEvent: ResourceEventItem = { date: new Date(event.startTime), type: 'start' as 'start', assignmentElement };
    const endEvent: ResourceEventItem = { date: new Date(event.endTime), type: 'end' as 'end', assignmentElement }
    startEvent.matching = endEvent;
    endEvent.matching = startEvent;

    resourceEventsMap[resource.id].push(startEvent);
    resourceEventsMap[resource.id].push(endEvent);

    resourceAssignments.get(resource).push(assignmentElement);
  }

  let accumTop: number = 0;

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

    const { maxDepth, rowHeight } = setAssignmentElementsHeight(resourceEvents, axesConfig);
    resourceElements.push({ depth: maxDepth, pixels: rowHeight, top: accumTop, resource });
    accumTop += rowHeight;
  }

  return { resourceAssignments, resourceElements };
}

const setAssignmentElementsHeight = (resourceEvents: ResourceEventItem[], axesConfig: AxesConfig): { maxDepth: number, rowHeight: number } => {
  if (axesConfig.resource.row.layout === 'stack') {
    const assignmentHeight = axesConfig.resource.row.height - 2 * axesConfig.resource.row.padding;
    let lanes: AssignmentElement[] = [];
    let stack: AssignmentElement[] = [];
    let maxLanesLength: number = 0;

    for (let i = 0; i < resourceEvents.length; i++) {
      const resourceEvent = resourceEvents[i];

      if (resourceEvent.type === 'start') {
        let nextLane = lanes.indexOf(null);
        if (nextLane === -1) { nextLane = lanes.length; }
        resourceEvent.assignmentElement.depth = nextLane;
        lanes[nextLane] = resourceEvent.assignmentElement;
        stack.push(resourceEvent.assignmentElement);

        if (lanes.length > maxLanesLength) { maxLanesLength = lanes.length }
      } else {
        if (resourceEvent.assignmentElement.depth === lanes.length - 1) { lanes.pop() }
        else { lanes[resourceEvent.assignmentElement.depth] = null; }
      }

      let isFinished = lanes.length === 0 ? true : lanes.every(lane => lane === null);

      if (isFinished) {
        stack.forEach((assignmentElement) => {
          assignmentElement.height = assignmentHeight;
          assignmentElement.top = assignmentElement.depth * assignmentHeight + (assignmentElement.depth + 1) * axesConfig.resource.row.padding;
        });

        stack = [];
      }
    }

    let rowHeight: number;
    if (maxLanesLength === 0) { rowHeight = axesConfig.resource.row.height }
    else { rowHeight = maxLanesLength * assignmentHeight + (maxLanesLength + 1) * axesConfig.resource.row.padding }

    return { maxDepth: maxLanesLength, rowHeight };
  }

  if (axesConfig.resource.row.layout === 'overlap') {
    const assignmentHeight = axesConfig.resource.row.height - 2 * axesConfig.resource.row.padding;

    for (const event of resourceEvents) {
      event.assignmentElement.top = axesConfig.resource.row.padding;
      event.assignmentElement.height = assignmentHeight;
      event.assignmentElement.depth = 0;
    }

    return { maxDepth: 0, rowHeight: axesConfig.resource.row.height };
  }

  if (axesConfig.resource.row.layout === 'pack') {
    let lanes: AssignmentElement[] = [];
    let stack: AssignmentElement[] = [];
    let maxLanesLength: number = 0;

    for (let i = 0; i < resourceEvents.length; i++) {
      const resourceEvent = resourceEvents[i];

      if (resourceEvent.type === 'start') {
        let nextLane = lanes.indexOf(null);
        if (nextLane === -1) { nextLane = lanes.length; }
        resourceEvent.assignmentElement.depth = nextLane;
        lanes[nextLane] = resourceEvent.assignmentElement;
        stack.push(resourceEvent.assignmentElement);

        if (lanes.length > maxLanesLength) { maxLanesLength = lanes.length }
      } else {
        if (resourceEvent.assignmentElement.depth === lanes.length - 1) { lanes.pop() }
        else { lanes[resourceEvent.assignmentElement.depth] = null; }
      }

      let isFinished = lanes.length === 0 ? true : lanes.every(lane => lane === null);

      if (isFinished) {
        const assignmentHeight = (axesConfig.resource.row.height - (1 + maxLanesLength) * axesConfig.resource.row.padding) / (maxLanesLength);

        stack.forEach((assignmentElement) => {
          assignmentElement.height = assignmentHeight;
          assignmentElement.top = assignmentElement.depth * assignmentHeight + (assignmentElement.depth + 1) * axesConfig.resource.row.padding;
        });

        stack = [];
        maxLanesLength = 0;
      }
    }

    return { maxDepth: 0, rowHeight: axesConfig.resource.row.height };
  }
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