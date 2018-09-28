import * as React from 'react';
import { DragSource, ConnectDragSource, ConnectDragPreview, DragSourceSpec } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { models, itemTypes } from 'scheduel';

interface ExternalDragItemProps {
  externalDragContext: models.ExternalDragContext;
  connectDragSource?: ConnectDragSource;
  connectDragPreview?: ConnectDragPreview;
}

interface ExternalDragItemDragObject {
  id: any
}

const externalSource: DragSourceSpec<ExternalDragItemProps, ExternalDragItemDragObject> = {
  beginDrag(props) {
    props.externalDragContext.start({ id: 1 });

    return { id: 1 }
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { date } = monitor.getDropResult();
      props.externalDragContext.end(true, date);
    } else {
      props.externalDragContext.end(false, null);
    }
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === 1;
  }
}

@DragSource(itemTypes.External, externalSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
}))
class ExternalDragItem extends React.Component<ExternalDragItemProps> {
  componentDidMount() {
    if (this.props.connectDragPreview) {
      this.props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }
  }

  render() {
    const { connectDragSource } = this.props;

    if (connectDragSource) {
      return connectDragSource(
        <div><p>External Drag Item</p></div>
      )
    }

    return null
  }
}

export default ExternalDragItem;