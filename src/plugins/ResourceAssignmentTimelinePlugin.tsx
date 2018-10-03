import * as React from 'react';
import { Grid } from 'react-virtualized';

import { AssignmentElement as AssignmentElementInterface, Resource } from '../models';

import ResourceTimeline from '../components/ResourceTimeline';
import AssignmentElement from '../components/AssignmentElement';
import TimelinePlugin, { TimelineComponentProps } from './TimelinePlugin';

class ResourceAssignmentTimelinePlugin extends TimelinePlugin<AssignmentElementInterface> {
  masterScroll = true;
  subscribeScrollLeft = false;
  subscribeScrollTop = false;

  getStyle = () => ({});

  getColumnCount = () => 1;
  getColumnWidth = (props: TimelineComponentProps) => () => props.ticksConfig.minor.length * props.viewConfig.timeAxis.minor.width;

  getRowCount = (props: TimelineComponentProps) => props.resources.length;
  getRowHeight = (props: TimelineComponentProps) => ({ index }) => props.resourceElements[index].pixels

  getData = (props: TimelineComponentProps): Map<Resource, AssignmentElementInterface[]> => props.resourceAssignments;

  renderRow = (elements: AssignmentElementInterface[], resource: Resource, grid: Grid, props: TimelineComponentProps) => {
    return (
      <ResourceTimeline
        grid={grid}
        resource={resource}
        externalDragContext={props.externalDragContext}
        dragDropConfig={props.dragDropConfig}
        ticksConfig={props.ticksConfig}
        dragContext={props.dragContext}>
        {elements.map(element =>
          <AssignmentElement
            key={element.assignment.id}
            element={element}
            ticksConfig={props.ticksConfig}
            resource={resource}
            dragContext={props.dragContext}
            listeners={props.listeners}
            viewConfig={props.viewConfig} />
        )}
      </ResourceTimeline>
    )
  }
}

export default ResourceAssignmentTimelinePlugin;