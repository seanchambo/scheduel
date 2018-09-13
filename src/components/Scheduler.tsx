import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Assignment, Resource, Event, ViewConfig } from '../../index';

import SchedulerPanel from './SchedulerPanel';

interface SchedulerProps {
  assignments: Assignment[],
  resources: Resource[],
  events: Event[],
  viewConfig: ViewConfig,
}

@DragDropContext(HTML5Backend)
class Scheduler extends React.PureComponent<SchedulerProps> {
  public render() {
    return (
      <SchedulerPanel {...this.props} />
    )
  }
}

export default Scheduler;