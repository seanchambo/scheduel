import * as React from 'react';
import { DragSource, ConnectDragSource, DragSourceSpec } from 'react-dnd';

import { AssignmentElement as AssignmentElementInterface, ViewConfig, DragContext, Resource, TicksConfig } from '../models';
import { getDateFromPosition } from '../utils/dom';

interface AssignmentElementProps {
  element: AssignmentElementInterface;
  viewConfig: ViewConfig;
  ticksConfig: TicksConfig;
  dragContext: DragContext;
  resource: Resource;
  connectDragSource?: ConnectDragSource;
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
    const result = monitor.getDropResult();

    if (!result) { props.dragContext.end(false, null) }

    const cursorX = result.start.x - props.viewConfig.resourceAxis.width;
    const cursorOffset = cursorX - props.element.startX;

    const finishX = result.finish.x - props.viewConfig.resourceAxis.width - cursorOffset;
    const date = getDateFromPosition(finishX, props.ticksConfig.minor);

    props.dragContext.end(true, date);
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.element.assignment.id;
  }
}

@DragSource('assignment', assignmentSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
}))
class AssignmentElement extends React.PureComponent<AssignmentElementProps> {
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
        key={element.event.id}
        style={style}>
        {this.props.viewConfig.events.renderer(element.event, element.assignment, resource)}
      </div>
    )
  }
}

export default AssignmentElement;