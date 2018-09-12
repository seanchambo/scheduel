import * as React from 'react';

import { Event, Assignment, Resource, DragContext } from '../../index';

interface DragContextProviderProps {
  events: Event[];
  assignments: Assignment[];
  resources: Resource[];
  children: (dragContext: DragContext) => React.ReactNode;
}

interface DragContextProviderState {
  dragging: boolean;
  draggedEvent: Event;
  hoveredResource: Resource;
  originalResource: Resource;
}

class DragContextProvider extends React.PureComponent<DragContextProviderProps, DragContextProviderState> {
  state = {
    dragging: false,
    draggedEvent: null,
    hoveredResource: null,
    originalResource: null,
  }

  initaliseContext = (event: Event, resource: Resource) => {
    this.setState({ dragging: true, draggedEvent: event, originalResource: resource });
  }

  updateContext = (resource: Resource) => {
    this.setState({ hoveredResource: resource });
  }

  cleanupContext = () => {
    this.setState({ dragging: false, hoveredResource: null, draggedEvent: null, originalResource: null });
  }

  render() {
    return this.props.children({
      ...this.state,
      initialiseContext: this.initaliseContext,
      updateContext: this.updateContext,
      cleanupContext: this.cleanupContext
    });
  }
}

export default DragContextProvider;