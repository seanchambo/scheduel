import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DragLayer as DragLayerWrapper, XYCoord } from 'react-dnd'

import { DragContext, ViewConfig, TicksConfig, EventDragPreviewRenderContext, ExternalDragContext, ExternalDragPreviewRenderContext, TimelinePluginComponent, DragDropConfig, ResourceElement } from '../models';

import { getDateFromPosition, getCoordinatesForTimeSpan, getPositionFromDate } from '../utils/dom';
import itemTypes from '../utils/itemTypes';
import { roundTo } from '../utils/date';

interface DragLayerProps {
  item?: any;
  itemType?: string;
  domOffset?: XYCoord;
  pointerOffset?: XYCoord;
  isDragging?: boolean;
  dragContext: DragContext;
  externalDragContext: ExternalDragContext;
  resourceTimeStream: React.RefObject<TimelinePluginComponent>;
  viewConfig: ViewConfig;
  ticksConfig: TicksConfig;
  dragDropConfig: DragDropConfig;
  resourceElements: ResourceElement[];
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

@DragLayerWrapper(monitor => ({
  domOffset: monitor.getSourceClientOffset(),
  pointerOffset: monitor.getClientOffset(),
  isDragging: monitor.isDragging(),
  itemType: monitor.getItemType(),
  item: monitor.getItem(),
}))
class DragLayer extends React.PureComponent<DragLayerProps> {
  render() {
    const {
      dragDropConfig,
      resourceElements,
      isDragging,
      dragContext,
      externalDragContext,
      resourceTimeStream,
      viewConfig,
      ticksConfig,
      start,
      end,
      domOffset,
      pointerOffset,
      itemType
    } = this.props


    if (!isDragging || !domOffset || !pointerOffset) {
      return null
    }

    let { x, y } = domOffset

    const panel: Element = ReactDOM.findDOMNode(resourceTimeStream.current.grid.current) as Element;
    const xFromPanel = x - panel.getBoundingClientRect().left;
    const xFromSchedulerStart = xFromPanel + panel.scrollLeft;
    let currentStart = getDateFromPosition(xFromSchedulerStart, ticksConfig.minor);

    if (dragDropConfig.snapToResource) {
      ({ y } = pointerOffset);
      if (y >= resourceElements[0].top + panel.getBoundingClientRect().top) {
        let resource: ResourceElement = null;

        for (const resourceElement of resourceElements) {
          if (resourceElement.top + panel.getBoundingClientRect().top <= y && resourceElement.top + resourceElement.pixels + panel.getBoundingClientRect().top > y) {
            resource = resourceElement;
            break;
          }
        }

        if (!resource) { resource = resourceElements[resourceElements.length - 1] }

        y = resource.top + panel.getBoundingClientRect().top + viewConfig.resourceAxis.row.padding;
      }
    }

    if (dragDropConfig.snapToRounededDate) {
      ({ x } = pointerOffset);
      currentStart = roundTo(currentStart, dragDropConfig.roundDateToNearest.increment, dragDropConfig.roundDateToNearest.unit);
      x = getPositionFromDate(currentStart, ticksConfig.minor) + panel.getBoundingClientRect().left - panel.scrollLeft;
    }

    const getWidthForEnd = (currentEnd: Date): number => {
      const { startX, endX } = getCoordinatesForTimeSpan(currentStart, currentEnd, ticksConfig.minor, start, end);
      return endX - startX;
    }

    const height = viewConfig.resourceAxis.row.height - 2 * viewConfig.resourceAxis.row.padding;
    const style = { transform: `translate(${x}px, ${y}px)`, height };

    let content: React.ReactNode;

    if (itemType === itemTypes.Assignment) {
      if (!dragContext.dragging) { return null; }

      const context: EventDragPreviewRenderContext = {
        event: dragContext.draggedEvent,
        assignment: dragContext.draggedAssignment,
        originalResource: dragContext.originalResource,
        hoveredResource: dragContext.hoveredResource,
        start: currentStart,
        getWidthForEnd,
        style,
      }

      content = viewConfig.renderers.events.preview(context);
    }

    if (itemType === itemTypes.External) {
      if (!externalDragContext.dragging) { return null; }

      const context: ExternalDragPreviewRenderContext = {
        item: externalDragContext.item,
        hoveredResource: externalDragContext.hoveredResource,
        start: currentStart,
        getWidthForEnd,
        style,
      }

      content = viewConfig.renderers.external.preview(context);
    }

    return (
      <div style={layerStyles}>
        {content}
      </div>
    )
  }
}

export default DragLayer;