import * as React from 'react';
import { DragSource } from 'intereactable';
import { RegisterRef, DragSourceSpecification } from 'intereactable/dist/DragSource';

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
  registerRef?: RegisterRef,
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    overflow: 'hidden',
  }
}

const assignmentSource: DragSourceSpecification<AssignmentElementProps> = {
  canDrag(props) {
    return props.dragDropConfig.internal.enabled && props.element.event.draggable !== false;
  },
  beginDrag(props) {
    props.dragContext.start(props.element.assignment, props.element.event, props.resource);

    return { id: props.element.assignment.id }
  },
  endDrag(props, monitor) {
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

class AssignmentElement extends React.PureComponent<AssignmentElementProps> {
  render() {
    const { element, resource, registerRef } = this.props;

    const style = {
      ...styles.root,
      width: element.endX - element.startX,
      height: element.height,
      transition: '0.1s ease-in-out',
      transform: `translate(${this.props.element.startX}px, ${this.props.element.top}px)`,
    };

    return (
      <div style={style} ref={registerRef}>
        {this.props.assignmentRenderer(element.assignment, element.event, resource)}
      </div>
    )
  }
}

export default DragSource<AssignmentElementProps>(itemTypes.Assignment, assignmentSource, (monitor, registerRef) => ({ registerRef }))(AssignmentElement);