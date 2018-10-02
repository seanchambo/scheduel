import * as React from 'react';

import { Event, Assignment, Resource, DragContext, ListenersConfig, DragDropConfig } from '../models';

interface DragContextProviderProps {
  children: (dragContext: DragContext) => React.ReactNode;
  listeners: ListenersConfig;
}

class DragContextProvider extends React.Component<DragContextProviderProps, DragContext> {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
      draggedEvent: null,
      draggedAssignment: null,
      hoveredResource: null,
      originalResource: null,
      start: this.start,
      update: this.update,
      end: this.end,
    }
  }

  start = (assignment: Assignment, event: Event, resource: Resource) => {
    this.props.listeners.assignments.drag(assignment, resource, event);
    this.setState({ dragging: true, draggedAssignment: assignment, draggedEvent: event, originalResource: resource });
  }

  update = (resource: Resource) => {
    this.setState({ hoveredResource: resource });
  }

  end = (successful: boolean, start: Date) => {
    if (successful) {
      this.props.listeners.assignments.drop(this.state.draggedAssignment, this.state.hoveredResource, this.state.draggedEvent, start, this.state.originalResource);
    }
    this.setState({ dragging: false, draggedAssignment: null, hoveredResource: null, draggedEvent: null, originalResource: null });
  }

  render() {
    return this.props.children(this.state);
  }
}

export default DragContextProvider;