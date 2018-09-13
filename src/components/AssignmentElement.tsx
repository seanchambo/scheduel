import * as React from 'react';
import { DragSource, ConnectDragSource } from 'react-dnd';

import { AssignmentElement as AssignmentElementInterface, ViewConfig } from '../../index';

interface AssignmentElementProps {
  element: AssignmentElementInterface;
  viewConfig: ViewConfig;
  connectDragSource?: ConnectDragSource;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    overflow: 'hidden',
  }
}

const assignmentSource = {
  beginDrag(props, monitor, component) {
    const item = { id: props.element.assignment.id }
    return item;
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