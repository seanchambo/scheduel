import * as React from 'react';

import { ViewConfig, TicksConfig, Assignment, Event, ResourceAssignmentMap, Resource, ResourceElement } from '../models';
import { getTicksConfig } from '../utils/ticks';
import { getStartEndForTimeSpan } from '../utils/timeSpan';
import { getResourceElementsAndHeights } from '../utils/dom';

interface ViewDataProviderProps {
  viewConfig: ViewConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  children: (viewData: ViewDataProviderState) => React.ReactNode;
}

interface ViewDataProviderState {
  start: Date;
  end: Date;
  ticksConfig: TicksConfig;
  resourceAssignments: ResourceAssignmentMap;
  resourceElements: ResourceElement[];
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
}

class ViewDataProvider extends React.Component<ViewDataProviderProps, ViewDataProviderState> {
  state = {
    start: null,
    end: null,
    ticksConfig: { major: null, minor: null },
    resourceAssignments: null,
    resourceElements: [],
    assignments: this.props.assignments,
    resources: this.props.resources,
    events: this.props.events,
    viewConfig: this.props.viewConfig,
  }

  shouldComponentUpdate(nextProps: ViewDataProviderProps, nextState: ViewDataProviderState) {
    if (this.state.start.getTime() !== nextState.start.getTime()) return true;
    if (this.state.end.getTime() !== nextState.end.getTime()) return true;
    if (this.state.ticksConfig !== nextState.ticksConfig) return true;
    if (this.state.resourceAssignments !== nextState.resourceAssignments) return true;
    if (this.state.resourceElements !== nextState.resourceElements) return true;
    return false;
  }

  static getDerivedStateFromProps(props: ViewDataProviderProps, state: ViewDataProviderState): ViewDataProviderState {
    const { viewConfig, assignments, resources, events } = props;
    let { start, end, ticksConfig, resourceAssignments, resourceElements } = state;

    if (state.viewConfig.timeSpan !== viewConfig.timeSpan || state.viewConfig.timeAxis !== viewConfig.timeAxis || !start) {
      const startEnd = getStartEndForTimeSpan(viewConfig.timeSpan, viewConfig.timeAxis);
      start = startEnd.start;
      end = startEnd.end;
      ticksConfig = getTicksConfig(start, end, viewConfig.timeAxis);

      const result = getResourceElementsAndHeights(events, resources, assignments, viewConfig, ticksConfig, start, end);
      resourceAssignments = result.resourceAssignments;
      resourceElements = result.resourceElements;
    }

    if (
      props.assignments !== state.assignments ||
      props.events !== state.events ||
      props.resources !== state.resources ||
      props.viewConfig.resourceAxis.row.layout !== state.viewConfig.resourceAxis.row.layout
    ) {
      const result = getResourceElementsAndHeights(events, resources, assignments, viewConfig, ticksConfig, start, end);
      resourceAssignments = result.resourceAssignments;
      resourceElements = result.resourceElements;
    }

    return { ...state, start, end, ticksConfig, resourceAssignments, resourceElements, assignments, resources, events, viewConfig };
  }

  render() {
    return this.props.children(this.state)
  }
}

export default ViewDataProvider;