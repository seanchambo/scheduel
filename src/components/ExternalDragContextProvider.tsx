import * as React from 'react';

import { ExternalDragContext, Resource, ListenersConfig } from '../models';

interface ExternalDragContextProviderProps {
  children: (dragContext: ExternalDragContext) => React.ReactNode;
  listeners: ListenersConfig;
}

class ExternalDragContextProvider extends React.Component<ExternalDragContextProviderProps, ExternalDragContext> {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
      item: null,
      hoveredResource: null,
      start: this.start,
      update: this.update,
      end: this.end,
    }
  }

  start = (item: any) => {
    this.props.listeners.external.drag(this.state.item);
    this.setState({ dragging: true, item });
  }

  update = (resource: Resource) => {
    this.setState({ hoveredResource: resource });
  }

  end = (successful: boolean, start: Date) => {
    if (successful) {
      this.props.listeners.external.drop(this.state.item, this.state.hoveredResource, start);
    }
    this.setState({ dragging: false, item: null, hoveredResource: null });
  }

  render() {
    return this.props.children(this.state);
  }
}

export default ExternalDragContextProvider;