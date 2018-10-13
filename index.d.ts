export as namespace Scheduel;

export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ResourceRowLayout = 'stack' | 'pack' | 'overlap';

export interface TimeDuration {
  increment: number;
  unit: TimeUnit;
}

export declare interface Event {
  id: number | string;
  startTime: Date;
  endTime: Date;
  data?: { [key: string]: any };
}

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
  type?: 'minor' | 'major';
}

export declare interface Ticks {
  major: Tick[];
  minor: Tick[];
}

export declare interface TimeResolution {
  increment: number;
  unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day';
}

export declare interface AxesConfig {
  time?: TimeAxisConfig;
  resource?: ResourceAxisConfig;
}

export declare interface ResourceAxisRowConfig {
  height?: number;
  padding?: number;
  layout?: ResourceRowLayout;
}

export declare interface ResourceAxisConfig {
  row?: ResourceAxisRowConfig;
  width?: number;
  columns?: ResourceColumn[];
  tickRenderer?: (resource: Resource) => React.ReactNode;
}

export declare interface TimeAxisConfig {
  ticks?: TicksConfig;
  range?: TimeRangeConfig;
  resolution?: TimeResolution;
}

export declare interface TimeRangeConfig {
  from?: Date;
  duration?: TimeDuration;
}

export declare interface TicksConfig {
  major?: MajorTickConfig;
  minor?: MinorTickConfig;
}

export declare interface TickConfig {
  rowHeight: number;
  labelRenderer: (tick: Tick) => React.ReactNode;
  tickRenderer: (tick: Tick) => React.ReactNode;
  increment: number;
  unit: TimeUnit;
}

export declare type ResourceAssignmentMap = Map<Resource, AssignmentElement[]>;
export declare type ResourceZoneMap = Map<Resource, ResourceZoneElement[]>;

export declare interface ResourceZoneElement {
  startX: number;
  endX: number;
  resourceZone: ResourceZone;
}

export declare interface ResourceElement {
  depth: number;
  pixels: number;
  top: number;
  resource: Resource;
}

export declare interface AssignmentElement {
  startX: number;
  endX: number;
  top: number;
  height: number;
  event: Event;
  depth: number;
  assignment: Assignment;
}

export declare interface MajorTickConfig extends TickConfig { }

export declare interface MinorTickConfig extends TickConfig {
  width: number;
}

export declare type AssignmentRenderer = (assignment: Assignment, event: Event, resource: Resource) => React.ReactNode;

export declare interface ResourceColumnContext {
  isOver: boolean;
  wasOriginal: boolean;
}

export declare interface ResourceColumn {
  name: string;
  labelRenderer: () => React.ReactNode;
  width: number;
  rowRenderer: (resource: Resource, context: ResourceColumnContext) => React.ReactNode;
}

export declare interface FeaturesConfig {
  dragDrop?: DragDropConfig;
  resourceZones?: ResourceZonesConfig;
  lines?: LinesConfig;
}

export declare interface InternalDragDropPreviewContext {
  assignment: Assignment;
  event: Event;
  originalResource: Resource;
  hoveredResource: Resource;
  start: Date;
  getWidthForEnd: (end: Date) => number;
  style: React.CSSProperties;
}

export declare interface ExternalDragDropPreviewContext {
  item: any;
  hoveredResource: Resource;
  start: Date;
  getWidthForEnd: (end: Date) => number;
  style: React.CSSProperties;
}

export declare interface ExternalDragContext {
  dragging: boolean;
  item: any;
  hoveredResource: Resource;
  start: (item: any) => void;
  update: (resource: Resource) => void;
  end: (successful: boolean, start: Date | null) => void;
}

export declare interface DragContext {
  dragging: boolean;
  draggedEvent: Event;
  hoveredResource: Resource;
  originalResource: Resource;
  draggedAssignment: Assignment;
  start: (assignment: Assignment, event: Event, resource: Resource) => void;
  update: (resource: Resource) => void;
  end: (successful: boolean, start: Date | null) => void;
}

export declare interface InternalDragDropListeners {
  drag?: (assignment: Assignment, resource: Resource, event: Event) => void;
  drop?: (assignment: Assignment, resource: Resource, event: Event, startTime: Date, originalResource: Resource) => void;
}

export declare interface ExternalDragDropListeners {
  drag?: (item: any) => void;
  drop?: (item: any, resource: Resource, startTime: Date) => void;
}

export declare interface DragDropConfig {
  internal?: InternalDragDropConfig;
  external?: ExternalDragDropConfig;
}

export declare interface InternalDragDropConfig {
  enabled?: boolean;
  snapToResource?: boolean;
  snapToTimeResolution?: boolean;
  previewRenderer?: (context: InternalDragDropPreviewContext) => React.ReactNode;
  listeners?: InternalDragDropListeners
}

export declare interface ExternalDragDropConfig {
  enabled?: boolean;
  snapToResource?: boolean;
  snapToTimeResolution?: boolean;
  previewRenderer?: (context: ExternalDragDropPreviewContext) => React.ReactNode;
  listeners?: ExternalDragDropListeners;
  context?: ExternalDragContext;
}

export declare interface ResourceZone {
  id: number | string;
  resourceId: number | string;
  startTime: Date;
  endTime: Date;
  data?: { [key: string]: any };
}

export declare type ResourceZoneRenderer = (zone: ResourceZone, resource: Resource) => React.ReactNode;

export declare interface ResourceZonesConfig {
  zones?: ResourceZone[];
  renderer?: ResourceZoneRenderer;
}

export declare interface Line {
  id: number | string;
  date: Date;
  data?: { [key: string]: any };
}

export declare interface LinesConfig {
  lines?: Line[];
  lineRenderer?: (line: Line) => React.ReactNode;
  headerRenderer?: (line: Line) => React.ReactNode;
}