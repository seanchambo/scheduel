import * as React from 'react'
import { DragLayer as DragLayerWrapper, XYCoord } from 'react-dnd'
import { DragContext, ViewConfig, ResourceElement, TicksConfig, Resource, EventDragPreviewRenderContext } from '../models';
import { getDateFromPosition, getCoordinatesForTimeSpan } from '../utils/dom';

interface DragLayerProps {
  item?: any;
  currentOffset?: XYCoord;
  isDragging?: boolean;
  dragContext: DragContext;
  viewConfig: ViewConfig;
  ticksConfig: TicksConfig;
  start: Date;
  end: Date;
}

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

const DragLayer: React.SFC<DragLayerProps> = props => {
  const { isDragging, dragContext, viewConfig, ticksConfig, start, end, currentOffset } = props

  if (!isDragging || !dragContext.draggedEvent || !currentOffset) {
    return null
  }

  const { x, y } = currentOffset;

  const currentStart = getDateFromPosition(x, ticksConfig.minor);
  const getWidthForEnd = (currentEnd: Date): number => {
    const { startX, endX } = getCoordinatesForTimeSpan(currentStart, currentEnd, ticksConfig.minor, start, end);
    return endX - startX;
  }
  const height = viewConfig.resourceAxis.row.height - viewConfig.resourceAxis.row.padding;
  const style = { transform: `translate(${x}px, ${y}px)`, height };


  const context: EventDragPreviewRenderContext = {
    event: dragContext.draggedEvent,
    assignment: dragContext.draggedAssignment,
    originalResource: dragContext.originalResource,
    hoveredResource: dragContext.hoveredResource,
    start: currentStart,
    getWidthForEnd,
    style,
  }

  return (
    <div style={layerStyles}>
      {viewConfig.events.preview.renderer(context)}
    </div>
  )
}

export default DragLayerWrapper<DragLayerProps>(monitor => ({
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(DragLayer)