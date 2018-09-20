import * as React from 'react';

import { Assignment, Resource, Event, ViewConfig, ListenersConfig } from '../models';

import SchedulerPanel from './SchedulerPanel';

interface SchedulerProps {
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  listeners: ListenersConfig;
}

class Scheduler extends React.PureComponent<SchedulerProps> {
  public render() {
    return (
      <SchedulerPanel {...this.props} />
    )
  }
}

export default Scheduler;