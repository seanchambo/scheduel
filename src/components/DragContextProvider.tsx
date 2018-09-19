import * as React from 'react';

import { Event, Assignment, Resource, DragContext, ListenersConfig } from '../models';

interface DragContextProviderProps {
  events: Event[];
  assignments: Assignment[];
  resources: Resource[];
  children: (dragContext: DragContext) => React.ReactNode;
  listeners: ListenersConfig;
}

class DragContextProvider extends React.PureComponent<DragContextProviderProps, DragContext> {
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
    this.props.listeners.assignmentdrag(this.state.draggedAssignment, this.state.originalResource, this.state.draggedEvent);
    this.setState({ dragging: true, draggedAssignment: assignment, draggedEvent: event, originalResource: resource });
  }

  update = (resource: Resource) => {
    this.setState({ hoveredResource: resource });
  }

  end = (successful: boolean, start: Date) => {
    this.props.listeners.assignmentdrop(this.state.draggedAssignment, this.state.hoveredResource, this.state.draggedEvent, start, this.state.originalResource);
    this.setState({ dragging: false, draggedAssignment: null, hoveredResource: null, draggedEvent: null, originalResource: null });
  }

  render() {
    return this.props.children(this.state);
  }
}

export default DragContextProvider;