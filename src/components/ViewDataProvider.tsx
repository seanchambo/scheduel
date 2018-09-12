import * as React from 'react';

import { ViewConfig, TicksConfig, Assignment, Event, ResourceHeightsMap, ResourceElementMap, Resource } from '../../index';
import { getTicksConfig } from '../utils/ticks';
import { getStartEndForTimeSpan } from '../utils/timeSpan';
import { getResourceElementsAndHeights } from '../utils/dom';


interface ViewDataProviderProps {
  viewConfig: ViewConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  children: (viewData: ViewDataProviderChildProps) => React.ReactNode;
}

interface ViewDataProviderChildProps {
  start: Date;
  end: Date;
  ticksConfig: TicksConfig;
  resourceHeights: ResourceHeightsMap;
  resourceElements: ResourceElementMap;
}

interface ViewDataProviderState {
  start: Date;
  end: Date;
  ticksConfig: TicksConfig;
  resourceHeights: ResourceHeightsMap;
  resourceElements: ResourceElementMap;
}

class ViewDataProvider extends React.PureComponent<ViewDataProviderProps, ViewDataProviderState> {
  static getDerivedStateFromProps(props: ViewDataProviderProps, state: ViewDataProviderState): ViewDataProviderState {
    const { viewConfig, assignments, resources, events } = props;

    const { start, end } = getStartEndForTimeSpan(viewConfig.timeSpan, viewConfig.timeAxis);
    const ticksConfig = getTicksConfig(start, end, viewConfig.timeAxis);

    const { resourceHeights, resourceElements } = getResourceElementsAndHeights(events, resources, assignments, viewConfig, ticksConfig, start, end);

    return { ...state, start, end, ticksConfig, resourceHeights, resourceElements };
  }

  render() {
    const { start, end, ticksConfig, resourceElements, resourceHeights } = this.state;

    return this.props.children({ start, end, ticksConfig, resourceElements, resourceHeights })
  }
}

export default ViewDataProvider;