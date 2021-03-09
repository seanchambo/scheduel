import * as React from 'react';
import { DragSourceViewModel } from 'long-drop';
import { RegisterRef, DragSourceViewModelSpecification } from 'long-drop/dist/DragSourceViewModel';

import itemTypes from '../utils/itemTypes';
import { AssignmentElement, ResizeRenderer, Resource } from '../../index.d';

interface ResizeHandlerProps {
  element: AssignmentElement;
  side: 'left' | 'right';
  resource: Resource;
  registerRef?: RegisterRef;
  renderer: ResizeRenderer;
}

const resizeSource: DragSourceViewModelSpecification<ResizeHandlerProps> = {
  canDrag(props) {
    return true
  },
  beginDrag(props, model) {
  },
  endDrag(props, monitor) {
  }
}

class ResizeHandler extends React.PureComponent<ResizeHandlerProps> {
  render() {
    const { registerRef, renderer, element, side, resource } = this.props;

    const style: React.CSSProperties = {
      position: 'absolute',
      [side]: '0.25em',
      height: '100%',
      top: '0px',
      cursor: 'ew-resize',
      zIndex: 10,
    }

    return (
      <div ref={registerRef} style={style}>
        {renderer(element.assignment, element.event, resource, side)}
      </div>
    )
  }
}

export default DragSourceViewModel<ResizeHandlerProps>(
  (props) => `ResizeHandler-${props.side}(${props.element.assignment.id.toString()})`,
  itemTypes.Resize,
  resizeSource,
  (id, model, registerRef) => ({ registerRef }),
)(ResizeHandler);
