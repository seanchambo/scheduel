import * as React from 'react';

import { ViewConfig, TicksConfig, Assignment, Event, ResourceAssignmentMap, Resource, ResourceElement } from '../../index';
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
}

class ViewDataProvider extends React.PureComponent<ViewDataProviderProps, ViewDataProviderState> {
  state = {
    start: null,
    end: null,
    ticksConfig: { major: null, minor: null },
    resourceAssignments: null,
    resourceElements: null,
  }

  static getDerivedStateFromProps(props: ViewDataProviderProps, state: ViewDataProviderState): ViewDataProviderState {
    const { viewConfig, assignments, resources, events } = props;

    const { start, end } = getStartEndForTimeSpan(viewConfig.timeSpan, viewConfig.timeAxis);
    const ticksConfig = getTicksConfig(start, end, viewConfig.timeAxis);

    const { resourceAssignments, resourceElements } = getResourceElementsAndHeights(events, resources, assignments, viewConfig, ticksConfig, start, end);

    return { ...state, start, end, ticksConfig, resourceAssignments, resourceElements };
  }

  render() {
    return this.props.children(this.state)
  }
}

export default ViewDataProvider;