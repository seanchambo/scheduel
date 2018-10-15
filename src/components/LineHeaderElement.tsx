import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource, ConnectDragSource, DragSourceSpec, ConnectDragPreview } from 'react-dnd';
import getEmptyImage from 'react-dnd-html5-backend/lib/getEmptyImage';

import { LineElement, FeaturesConfig, Ticks } from '../../index.d';

import itemTypes from '../utils/itemTypes';

interface LineHeaderElementProps {
  element: LineElement;
  ticks: Ticks;
  featuresConfig: FeaturesConfig;
  connectDragSource?: ConnectDragSource;
  connectDragPreview?: ConnectDragPreview;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    bottom: 0,
    display: 'flex',
  }
}

interface LineHeaderElementSourceDragObject {
  id: number | string;
};

const lineHeaderElementSource: DragSourceSpec<LineHeaderElementProps, LineHeaderElementSourceDragObject> = {
  canDrag(props, monitor) {
    return props.element.line.draggable !== false;
  },
  beginDrag(props, monitor, component) {
    props.featuresConfig.lines.listeners.drag(props.element.line);

    const domElement: Element = ReactDOM.findDOMNode(component) as Element;

    return { id: props.element.line.id, y: domElement.getBoundingClientRect().top }
  },
  endDrag(props, monitor, component) {
    if (monitor.didDrop()) {
      const { date } = monitor.getDropResult();
      props.featuresConfig.lines.listeners.drop(props.element.line, date);
    }
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.element.line.id;
  }
}

@DragSource(itemTypes.Line, lineHeaderElementSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
}))
class LineHeaderElement extends React.PureComponent<LineHeaderElementProps> {
  componentDidMount() {
    if (this.props.connectDragPreview) {
      this.props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }
  }

  render() {
    const { element, connectDragSource } = this.props;
    const actualX = element.x - this.props.featuresConfig.lines.header.width / 2;

    const style = {
      ...styles.root,
      width: this.props.featuresConfig.lines.header.width,
      transition: '0.1s ease-in-out',
      transform: `translateX(${actualX}px)`,
    };

    return connectDragSource(
      <div style={style}>
        {this.props.featuresConfig.lines.header.renderer(element.line)}
      </div>
    )
  }
}

export default LineHeaderElement;
