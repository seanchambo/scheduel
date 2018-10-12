import * as React from 'react';

import { ExternalDragContext, Resource, DragDropConfig } from '../../index.d';

interface ExternalDragContextProviderProps {
  children: (dragContext: ExternalDragContext) => React.ReactNode;
  dragDropConfig: DragDropConfig;
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
    if (this.props.dragDropConfig.external.enabled) {
      this.props.dragDropConfig.external.listeners.drag(this.state.item);
      this.setState({ dragging: true, item });
    }
  }

  update = (resource: Resource) => {
    if (this.props.dragDropConfig.external.enabled) {
      this.setState({ hoveredResource: resource });
    }
  }

  end = (successful: boolean, start: Date) => {
    if (this.props.dragDropConfig.external.enabled) {
      if (successful) {
        this.props.dragDropConfig.external.listeners.drop(this.state.item, this.state.hoveredResource, start);
      }
      this.setState({ dragging: false, item: null, hoveredResource: null });
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

export default ExternalDragContextProvider;