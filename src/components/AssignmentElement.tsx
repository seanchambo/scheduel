import * as React from 'react';
import { DragSource, ConnectDragSource, DragSourceSpec, ConnectDragPreview } from 'react-dnd';
import getEmptyImage from 'react-dnd-html5-backend/lib/getEmptyImage';

import { AssignmentElement as AssignmentElementInterface, AxesConfig, DragContext, Resource, Ticks, DragDropConfig, AssignmentRenderer } from '../../index.d';
import itemTypes from '../utils/itemTypes';

interface AssignmentElementProps {
  element: AssignmentElementInterface;
  axesConfig: AxesConfig;
  ticks: Ticks;
  dragContext: DragContext;
  dragDropConfig: DragDropConfig;
  resource: Resource;
  assignmentRenderer: AssignmentRenderer;
  connectDragSource?: ConnectDragSource;
  connectDragPreview?: ConnectDragPreview;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    overflow: 'hidden',
  }
}

interface AssignmentSourceDragObject {
  id: number | string;
};

const assignmentSource: DragSourceSpec<AssignmentElementProps, AssignmentSourceDragObject> = {
  canDrag(props) {
    return props.dragDropConfig.internal.enabled && props.element.event.draggable !== false;
  },
  beginDrag(props, monitor, component) {
    props.dragContext.start(props.element.assignment, props.element.event, props.resource);

    return { id: props.element.assignment.id }
  },
  endDrag(props, monitor, component) {
    if (monitor.didDrop()) {
      const { date } = monitor.getDropResult();
      props.dragContext.end(true, date);
    } else {
      props.dragContext.end(false, null)
    }
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.element.assignment.id;
  }
}

@DragSource(itemTypes.Assignment, assignmentSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
}))
class AssignmentElement extends React.PureComponent<AssignmentElementProps> {
  componentDidMount() {
    if (this.props.connectDragPreview) {
      this.props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }
  }

  render() {
    const { element, connectDragSource, resource } = this.props;

    const style = {
      ...styles.root,
      width: element.endX - element.startX,
      height: element.height,
      transition: '0.1s ease-in-out',
      transform: `translate(${this.props.element.startX}px, ${this.props.element.top}px)`,
    };

    return connectDragSource(
      <div style={style}>
        {this.props.assignmentRenderer(element.assignment, element.event, resource)}
      </div>
    )
  }
}

export default AssignmentElement;