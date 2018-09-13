import * as React from 'react';

import { Event, Assignment, Resource, DragContext } from '../../index';

interface DragContextProviderProps {
  events: Event[];
  assignments: Assignment[];
  resources: Resource[];
  children: (dragContext: DragContext) => React.ReactNode;
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
    this.setState({ dragging: true, draggedAssignment: assignment, draggedEvent: event, originalResource: resource });
  }

  update = (resource: Resource) => {
    this.setState({ hoveredResource: resource });
  }

  end = (successful: boolean) => {
    this.setState({ dragging: false, draggedAssignment: null, hoveredResource: null, draggedEvent: null, originalResource: null });
  }

  render() {
    return this.props.children(this.state);
  }
}

export default DragContextProvider;