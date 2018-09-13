import * as React from 'react';
import { DragSource, ConnectDragSource, DragSourceSpec } from 'react-dnd';

import { AssignmentElement as AssignmentElementInterface, ViewConfig, DragContext, Resource } from '../../index';

interface AssignmentElementProps {
  element: AssignmentElementInterface;
  viewConfig: ViewConfig;
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
    props.dragContext.end(true);
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
    const { element, connectDragSource } = this.props;

    const style = {
      ...styles.root,
      left: element.startX,
      width: element.endX - element.startX,
      top: element.top,
      height: element.height,
    };

    return connectDragSource(
      <div
        key={element.event.id}
        style={style}>
        {this.props.viewConfig.events.renderer(element.event, element.assignment)}
      </div>
    )
  }
}

export default AssignmentElement;