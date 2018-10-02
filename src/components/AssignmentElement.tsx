import * as React from 'react';
import { DragSource, ConnectDragSource, DragSourceSpec, ConnectDragPreview } from 'react-dnd';
import getEmptyImage from 'react-dnd-html5-backend/lib/getEmptyImage';

import { AssignmentElement as AssignmentElementInterface, ViewConfig, DragContext, Resource, TicksConfig, ListenersConfig } from '../models';
import itemTypes from '../utils/itemTypes';


interface AssignmentElementProps {
  element: AssignmentElementInterface;
  viewConfig: ViewConfig;
  ticksConfig: TicksConfig;
  dragContext: DragContext;
  resource: Resource;
  connectDragSource?: ConnectDragSource;
  connectDragPreview?: ConnectDragPreview;
  listeners: ListenersConfig;
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
      <div
        style={style}
        onClick={() => { this.props.listeners.assignments.click(element.assignment, element.event) }}
        onDoubleClick={() => { this.props.listeners.assignments.dbclick(element.assignment, element.event) }}>
        {this.props.viewConfig.renderers.events.assignment(element.event, element.assignment, resource)}
      </div>
    )
  }
}

export default AssignmentElement;