import { ReactNode } from 'react';

export declare type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
export declare type ResourceRowLayout = "stack" | "pack" | "overlap";

export declare interface Event {
  id: number | string;
  startTime: Date;
  endTime: Date;
  data?: { [key: string]: any };
}

export declare interface DragContext {
  dragging: boolean;
  draggedEvent: Event;
  hoveredResource: Resource;
  originalResource: Resource;
  draggedAssignment: Assignment;
  start: (assignment: Assignment, event: Event, resource: Resource) => void;
  update: (resource: Resource) => void;
  end: (successful: boolean, start: Date) => void
}

export declare interface ResourceElement {
  depth: number;
  pixels: number;
  top: number;
  resource: Resource;
}

export declare type ResourceAssignmentMap = Map<Resource, AssignmentElement[]>;

export declare interface AssignmentElement {
  startX: number;
  endX: number;
  top: number;
  height: number;
  event: Event;
  depth: number;
  assignment: Assignment;
}

// TODO: AssignmentId??
export declare interface Assignment {
  id: number | string;
  resourceId: number | string;
  eventId: number | string;
  data?: { [key: string]: any };
}

export declare interface Resource {
  id: number | string;
  name: string;
  data?: { [key: string]: any };
}

export declare interface Tick {
  startTime: Date;
  endTime: Date;
  incrementInMs: number;
  unit: TimeUnit;
  width?: number;
  show: boolean;
}

export declare interface TicksConfig {
  major: Tick[],
  minor: Tick[],
}

export declare interface ViewConfig {
  timeAxis: TimeAxisConfig;
  resourceAxis: ResourceAxisConfig;
  timeSpan: TimeSpanConfig;
  ticks: TicksViewConfig;
  events: EventsViewConfig;
}

export declare interface ListenersConfig {
  assignmentdrop: (assignment: Assignment, resource: Resource, event: Event, startTime: Date, originalResource: Resource) => void;
  assignmentdrag: (assignment: Assignment, resource: Resource, event: Event) => void;
}

export declare interface EventsViewConfig {
  renderer: (event: Event, assignment: Assignment, resource: Resource) => ReactNode;
  preview: {
    renderer: (context: EventDragPreviewRenderContext) => ReactNode;
  }
}

export declare interface TicksViewConfig {
  major: {
    renderer: (tick: Tick) => ReactNode,
  },
  minor: {
    renderer: (tick: Tick) => ReactNode,
  },
  resource: {
    renderer: (resource: Resource) => ReactNode,
  }
}

export declare interface EventDragPreviewRenderContext {
  assignment: Assignment;
  event: Event;
  originalResource: Resource;
  hoveredResource: Resource;
  start: Date;
  getWidthForEnd: (end: Date) => number;
  style: React.CSSProperties;
}

export declare interface TimeSpanConfig {
  startTime: Date;
  duration: number;
  unit: TimeUnit;
}

export declare interface TimeAxisConfig {
  major: MajorTimeAxisRowConfig;
  minor: MinorTimeAxisRowConfig;
}

export declare interface TimeAxisRowConfig {
  height: number;
  renderer: (tick: Tick) => ReactNode | string;
  increment: number;
  unit: TimeUnit;
}

export declare interface MajorTimeAxisRowConfig extends TimeAxisRowConfig { }

export declare interface MinorTimeAxisRowConfig extends TimeAxisRowConfig {
  width: number;
}

export declare interface ResourceAxisConfig {
  row: {
    height: number;
    padding: number;
    layout: 'stack' | 'pack' | 'overlap';
  };
  width: number;
  columns: ResourceColumn[];
}

export declare interface ResourceColumn {
  name: string;
  header: {
    renderer: () => ReactNode;
  };
  width: number;
  renderer: (resource: Resource, isOver: boolean, wasOriginal: boolean) => ReactNode;
}