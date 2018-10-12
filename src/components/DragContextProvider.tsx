import * as React from 'react';

import { Event, Assignment, Resource, DragContext, DragDropConfig } from '../../index.d';

interface DragContextProviderProps {
  children: (dragContext: DragContext) => React.ReactNode;
  config: DragDropConfig | false;
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
    if (this.props.config !== false && this.props.config.internal.enabled) {
      this.props.config.internal.listeners.drag(assignment, resource, event);
      this.setState({ dragging: true, draggedAssignment: assignment, draggedEvent: event, originalResource: resource });
    }
  }

  update = (resource: Resource) => {
    if (this.props.config !== false && this.props.config.internal.enabled) {
      this.setState({ hoveredResource: resource });
    }
  }

  end = (successful: boolean, start: Date) => {
    if (this.props.config !== false && this.props.config.internal.enabled) {
      if (successful) {
        this.props.config.internal.listeners.drop(this.state.draggedAssignment, this.state.hoveredResource, this.state.draggedEvent, start, this.state.originalResource);
      }
      this.setState({ dragging: false, draggedAssignment: null, hoveredResource: null, draggedEvent: null, originalResource: null });
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

export default DragContextProvider;