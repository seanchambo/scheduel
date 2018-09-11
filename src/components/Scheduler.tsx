import * as React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Assignment, Resource, Event, ViewConfig } from '../../index';

import SchedulerPanel from './SchedulerPanel';

interface SchedulerProps {
  assignments: Assignment[],
  resources: Resource[],
  events: Event[],
  viewConfig: ViewConfig,
}

class Scheduler extends React.PureComponent<SchedulerProps> {
  public render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <SchedulerPanel {...this.props} />
      </DragDropContextProvider>
    )
  }
}

export default Scheduler;