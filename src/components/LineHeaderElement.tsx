import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { DragSource } from 'intereactable';
import { DragSourceSpecification } from 'intereactable/dist/DragSource';
import { RegisterRef } from 'intereactable/dist/DropTarget';

import { LineElement, FeaturesConfig, Ticks } from '../../index.d';

import itemTypes from '../utils/itemTypes';

interface LineHeaderElementProps {
  element: LineElement;
  ticks: Ticks;
  featuresConfig: FeaturesConfig;
  registerRef?: RegisterRef;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    bottom: 0,
    display: 'flex',
  }
}

const lineHeaderElementSource: DragSourceSpecification<LineHeaderElementProps> = {
  canDrag(props, monitor) {
    return props.element.line.draggable !== false;
  },
  beginDrag(props, monitor) {
    props.featuresConfig.lines.listeners.drag(props.element.line);

    // TODO: Fix Me!

    // const domElement: Element = ReactDOM.findDOMNode(component) as Element;

    return { id: props.element.line.id, y: 0 }
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { date } = monitor.getDropResult();
      props.featuresConfig.lines.listeners.drop(props.element.line, date);
    }
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.element.line.id;
  }
}

class LineHeaderElement extends React.PureComponent<LineHeaderElementProps> {
  render() {
    const { element, registerRef, featuresConfig } = this.props;
    const actualX = element.x - featuresConfig.lines.header.width / 2;

    const style = {
      ...styles.root,
      width: featuresConfig.lines.header.width,
      transition: '0.1s ease-in-out',
      transform: `translateX(${actualX}px)`,
    };

    return (
      <div style={style} ref={registerRef}>
        {featuresConfig.lines.header.renderer(element.line)}
      </div>
    )
  }
}

export default DragSource<LineHeaderElementProps>(itemTypes.Line, lineHeaderElementSource, (monitor, registerRef) => ({ registerRef }))(LineHeaderElement);