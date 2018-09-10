import { ReactNode } from 'react';

type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";

export declare interface Event {
  id: number | string;
  startTime: Date;
  endTime: Date;
  data?: { [key: string]: any };
}

export declare interface EventDomDetails {
  startX: number;
  endX: number;
  event: Event;
}

export declare interface Assignment {
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

export declare interface EventsViewConfig {
  renderer: (event: Event) => ReactNode;
}

export declare interface TicksViewConfig {
  major: {
    renderer: (left: number) => ReactNode,
  },
  minor: {
    renderer: (left: number) => ReactNode,
  },
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
  height: number;
  width: number;
  columns: ResourceColumn[];
}

export declare interface ResourceColumn {
  name: string;
  header: {
    renderer: () => ReactNode;
  };
  renderer: (resource: Resource) => ReactNode;
}