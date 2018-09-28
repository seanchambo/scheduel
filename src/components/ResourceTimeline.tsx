import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DropTarget, ConnectDropTarget, DropTargetSpec } from 'react-dnd';

import { Resource, TicksConfig, ViewConfig, AssignmentElement as AssignmentElementInterface, DragContext, ResourceElement, ExternalDragContext } from '../models';

import AssignmentElement from './AssignmentElement';
import { getDateFromPosition } from '../utils/dom';
import itemTypes from '../utils/itemTypes';
import { Grid } from 'react-virtualized';

interface ResourceTimelineProps {
  grid: React.RefObject<Grid>
  resource: Resource;
  assignments: AssignmentElementInterface[];
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
  dragContext: DragContext;
  externalDragContext: ExternalDragContext;
  connectAssignmentDropTarget?: ConnectDropTarget;
  connectExternalDropTarget?: ConnectDropTarget;
  isAssignmentOver?: boolean;
  isExternalOver?: boolean;
  height: ResourceElement;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
  },
};

const resourceTarget: DropTargetSpec<ResourceTimelineProps> = {
  drop(props, monitor) {
    const finish = monitor.getSourceClientOffset();

    const panel: Element = ReactDOM.findDOMNode(props.grid.current) as Element;
    const xFromPanel = finish.x - panel.getBoundingClientRect().left;
    const xFromSchedulerStart = xFromPanel + panel.scrollLeft;
    const date = getDateFromPosition(xFromSchedulerStart, props.ticksConfig.minor);

    return {
      resource: props.resource,
      date,
    };
  }
}

@DropTarget(itemTypes.Assignment, resourceTarget, (connect, monitor) => ({
  connectAssignmentDropTarget: connect.dropTarget(),
  isAssignmentOver: monitor.isOver(),
}))
@DropTarget(itemTypes.External, resourceTarget, (connect, monitor) => ({
  connectExternalDropTarget: connect.dropTarget(),
  isExternalOver: monitor.isOver(),
}))
class ResourceTimeline extends React.PureComponent<ResourceTimelineProps> {
  componentDidUpdate(prevProps: ResourceTimelineProps) {
    if (this.props.isAssignmentOver && !prevProps.isAssignmentOver) {
      this.props.dragContext.update(this.props.resource);
    }
    if (this.props.isExternalOver && !prevProps.isExternalOver) {
      this.props.externalDragContext.update(this.props.resource);
    }
  }

  render() {
    const rootStyle = {
      ...styles.root,
      height: this.props.height.pixels,
      // paddingTop: this.props.viewConfig.resourceAxis.row.padding,
      // paddingBottom: this.props.viewConfig.resourceAxis.row.padding,
      width: '100%',
    };

    return this.props.connectAssignmentDropTarget(
      this.props.connectExternalDropTarget(
        <div style={rootStyle}>
          {this.props.assignments.map((element) =>
            <AssignmentElement
              key={element.assignment.id}
              element={element}
              ticksConfig={this.props.ticksConfig}
              resource={this.props.resource}
              dragContext={this.props.dragContext}
              viewConfig={this.props.viewConfig} />)}
        </div>
      )
    )
  }
}

export default ResourceTimeline;