import * as React from 'react';

import { Assignment, Resource, Event, ViewConfig, ListenersConfig, ExternalDragContext, Plugin } from '../models';

import SchedulerPanel from './SchedulerPanel';

interface SchedulerProps {
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  externalDragContext: ExternalDragContext;
  listeners: ListenersConfig;
  plugins: Plugin[];
}

class Scheduler extends React.PureComponent<SchedulerProps> {
  public render() {
    return (
      <SchedulerPanel {...this.props} />
    )
  }
}

export default Scheduler;