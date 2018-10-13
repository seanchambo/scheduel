import * as React from 'react';

import { Assignment, Event, ResourceAssignmentMap, Resource, ResourceElement, Ticks, AxesConfig, FeaturesConfig, ResourceZoneMap } from '../../index.d';

import { getTicks } from '../utils/ticks';
import { getStartEndForTimeRange } from '../utils/timeSpan';
import { getResourceElementsAndHeights, getResourceZones } from '../utils/dom';

interface ViewDataProviderProps {
  axesConfig: AxesConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  featuresConfig: FeaturesConfig;
  children: (viewData: ViewDataProviderState) => React.ReactNode;
}

interface ViewDataProviderState {
  start: Date;
  end: Date;
  ticks: Ticks;
  resourceAssignments: ResourceAssignmentMap;
  resourceZones: ResourceZoneMap;
  resourceElements: ResourceElement[];
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  axesConfig: AxesConfig;
  featuresConfig: FeaturesConfig;
}

class ViewDataProvider extends React.Component<ViewDataProviderProps, ViewDataProviderState> {
  state = {
    start: null,
    end: null,
    ticks: { major: null, minor: null },
    resourceAssignments: null,
    resourceZones: null,
    resourceElements: [],
    assignments: this.props.assignments,
    resources: this.props.resources,
    events: this.props.events,
    axesConfig: this.props.axesConfig,
    featuresConfig: this.props.featuresConfig,
  }

  shouldComponentUpdate(nextProps: ViewDataProviderProps, nextState: ViewDataProviderState) {
    if (this.state.start.getTime() !== nextState.start.getTime()) return true;
    if (this.state.end.getTime() !== nextState.end.getTime()) return true;
    if (this.state.axesConfig !== nextState.axesConfig) return true;
    if (this.state.featuresConfig.resourceZones !== nextState.featuresConfig.resourceZones) return true;
    if (this.state.resourceAssignments !== nextState.resourceAssignments) return true;
    if (this.state.resourceElements !== nextState.resourceElements) return true;
    return false;
  }

  static getDerivedStateFromProps(props: ViewDataProviderProps, state: ViewDataProviderState): ViewDataProviderState {
    const { axesConfig, assignments, resources, events, featuresConfig } = props;
    let { start, end, ticks, resourceAssignments, resourceElements, resourceZones } = state;

    if (state.axesConfig.time.range !== axesConfig.time.range || state.axesConfig.time.ticks !== axesConfig.time.ticks || !start) {
      const startEnd = getStartEndForTimeRange(axesConfig.time.range, axesConfig.time.ticks);
      start = startEnd.start;
      end = startEnd.end;
      ticks = getTicks(start, end, axesConfig.time.ticks);

      const result = getResourceElementsAndHeights(events, resources, assignments, axesConfig, ticks, start, end);
      resourceAssignments = result.resourceAssignments;
      resourceElements = result.resourceElements;
    } else if (
      props.assignments !== state.assignments ||
      props.events !== state.events ||
      props.resources !== state.resources ||
      props.axesConfig.resource.row.layout !== state.axesConfig.resource.row.layout
    ) {
      const result = getResourceElementsAndHeights(events, resources, assignments, axesConfig, ticks, start, end);
      resourceAssignments = result.resourceAssignments;
      resourceElements = result.resourceElements;
    }

    if (state.featuresConfig.resourceZones !== featuresConfig.resourceZones || !resourceZones) {
      resourceZones = getResourceZones(featuresConfig.resourceZones.zones, resources, axesConfig, ticks, start, end);
    }

    return { ...state, start, end, ticks, resourceAssignments, resourceElements, assignments, resources, events, axesConfig, resourceZones };
  }

  render() {
    return this.props.children(this.state)
  }
}

export default ViewDataProvider;