import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DragLayer as DragLayerWrapper } from 'intereactable'
import { XYCoordinate } from 'intereactable/dist/Monitor';

import { DragContext, AxesConfig, Ticks, DragDropConfig, ResourceElement, InternalDragDropPreviewContext, ExternalDragDropPreviewContext, FeaturesConfig } from '../../index.d';

import { getDateFromPosition, getCoordinatesForTimeSpan, getPositionFromDate } from '../utils/dom';
import itemTypes from '../utils/itemTypes';
import { roundTo } from '../utils/date';
import AssignmentGrid from './AssignmentGrid';

interface DragLayerProps {
  item?: any;
  itemType?: string;
  domOffset?: XYCoordinate;
  pointerOffset?: XYCoordinate;
  isDragging?: boolean;
  dragContext: DragContext;
  assignmentGrid: React.RefObject<AssignmentGrid>;
  axesConfig: AxesConfig;
  featuresConfig: FeaturesConfig;
  ticks: Ticks;
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

class DragLayer extends React.PureComponent<DragLayerProps> {
  render() {
    const {
      dragDropConfig,
      resourceElements,
      isDragging,
      dragContext,
      assignmentGrid,
      axesConfig,
      ticks,
      start,
      end,
      domOffset,
      pointerOffset,
      itemType,
      featuresConfig,
      item,
    } = this.props


    if (
      !isDragging ||
      !domOffset ||
      !pointerOffset ||
      dragDropConfig.internal.enabled === false && itemType === itemTypes.Assignment ||
      dragDropConfig.external.enabled === false && itemType === itemTypes.External
    ) {
      return null
    }

    let { x, y } = domOffset
    console.log(x, y);

    const panel: Element = ReactDOM.findDOMNode(assignmentGrid.current.grid.current) as Element;
    const xFromPanel = x - panel.getBoundingClientRect().left;
    const xFromSchedulerStart = xFromPanel + panel.scrollLeft;
    let currentStart: Date;

    if (itemType === itemTypes.Line) {
      currentStart = getDateFromPosition(xFromSchedulerStart + featuresConfig.lines.header.width / 2, ticks.minor);
    } else {
      currentStart = getDateFromPosition(xFromSchedulerStart, ticks.minor);
    }

    if (
      (itemType === itemTypes.Assignment && dragDropConfig.internal.enabled && dragDropConfig.internal.snapToResource) ||
      (itemType === itemTypes.External && dragDropConfig.external.enabled && dragDropConfig.external.snapToResource)
    ) {
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

        y = resource.top + panel.getBoundingClientRect().top + axesConfig.resource.row.padding;
      }
    }

    if (
      (itemType === itemTypes.Assignment && dragDropConfig.internal.enabled && dragDropConfig.internal.snapToTimeResolution) ||
      (itemType === itemTypes.External && dragDropConfig.external.enabled && dragDropConfig.external.snapToTimeResolution)
    ) {
      ({ x } = pointerOffset);
      currentStart = roundTo(currentStart, axesConfig.time.resolution.increment, axesConfig.time.resolution.unit);
      x = getPositionFromDate(currentStart, ticks.minor) + panel.getBoundingClientRect().left - panel.scrollLeft;
    }

    const getWidthForEnd = (currentEnd: Date): number => {
      const { startX, endX } = getCoordinatesForTimeSpan(currentStart, currentEnd, ticks.minor, start, end);
      return endX - startX;
    }

    const height = axesConfig.resource.row.height - 2 * axesConfig.resource.row.padding;
    const style = { transform: `translate(${x}px, ${y}px)`, height };

    let content: React.ReactNode;

    if (itemType === itemTypes.Assignment && dragDropConfig.internal.enabled) {
      if (!dragContext.dragging) { return null; }

      const context: InternalDragDropPreviewContext = {
        event: dragContext.draggedEvent,
        assignment: dragContext.draggedAssignment,
        originalResource: dragContext.originalResource,
        hoveredResource: dragContext.hoveredResource,
        start: currentStart,
        getWidthForEnd,
        style,
      }

      content = dragDropConfig.internal.previewRenderer(context);
    }

    if (itemType === itemTypes.External && dragDropConfig.external.enabled) {
      if (!dragDropConfig.external.context.dragging) { return null; }

      const context: ExternalDragDropPreviewContext = {
        item: dragDropConfig.external.context.item,
        hoveredResource: dragDropConfig.external.context.hoveredResource,
        start: currentStart,
        getWidthForEnd,
        style,
      }

      content = dragDropConfig.external.previewRenderer(context);
    }

    if (itemType === itemTypes.Line) {
      const line = featuresConfig.lines.lines.find(line => line.id === item.id);
      const style = { transform: `translate(${x}px, ${item.y}px)` }

      content = <div style={style}>{featuresConfig.lines.header.renderer(line)}</div>
    }

    return (
      <div style={layerStyles}>
        {content}
      </div>
    )
  }
}

export default DragLayerWrapper<DragLayerProps>((monitor) => ({
  domOffset: monitor.getClientSourceOffset(),
  pointerOffset: monitor.getClientOffset(),
  isDragging: monitor.isDragging(),
  itemType: monitor.getItemType(),
  item: monitor.getItem(),
}))(DragLayer);