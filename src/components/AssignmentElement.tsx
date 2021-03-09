import * as React from 'react';
import { DragSourceViewModel } from 'long-drop';
import { RegisterRef, DragSourceViewModelSpecification } from 'long-drop/dist/DragSourceViewModel';

import { AssignmentElement as AssignmentElementInterface, AxesConfig, DragContext, Resource, Ticks, DragDropConfig, AssignmentRenderer, ResizeRenderer } from '../../index.d';
import itemTypes from '../utils/itemTypes';
import ResizeHandler from './ResizeHandler';

interface AssignmentElementProps {
  element: AssignmentElementInterface;
  axesConfig: AxesConfig;
  ticks: Ticks;
  dragContext: DragContext;
  dragDropConfig: DragDropConfig;
  resource: Resource;
  assignmentRenderer: AssignmentRenderer;
  resizeRenderer: ResizeRenderer;
  registerRef?: RegisterRef,
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    overflow: 'hidden',
  }
}

const assignmentSource: DragSourceViewModelSpecification<AssignmentElementProps> = {
  canDrag(props) {
    return props.dragDropConfig.internal.enabled && props.element.event.draggable !== false;
  },
  beginDrag(props, model) {
    props.dragContext.start(props.element.assignment, props.element.event, props.resource);
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { date } = monitor.getDropResult();
      props.dragContext.end(true, date);
    } else {
      props.dragContext.end(false, null)
    }
  },
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

    const ResizeHandlers = <>
      <ResizeHandler side="left" element={element} resource={resource} renderer={this.props.resizeRenderer} />
      <ResizeHandler side="right" element={element} resource={resource} renderer={this.props.resizeRenderer} />
    </>

    return (
      <div style={style} ref={registerRef}>
        {this.props.assignmentRenderer(element.assignment, element.event, resource, null)}
      </div>
    )
  }
}

export default DragSourceViewModel<AssignmentElementProps>(
  (props) => `Assignment(${props.element.assignment.id.toString()})`,
  itemTypes.Assignment,
  assignmentSource,
  (id, model, registerRef) => ({ registerRef }),
)(AssignmentElement);
