import * as React from 'react';
import { DragSource, DropTarget, ConnectDropTarget, DropTargetSpec } from 'react-dnd';

import { Resource, TicksConfig, ViewConfig, AssignmentElement as AssignmentElementInterface, DragContext, ResourceElement } from '../../index';
import AssignmentElement from './AssignmentElement';

interface ResourceTimelineProps {
  resource: Resource;
  assignments: AssignmentElementInterface[];
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
  dragContext: DragContext;
  connectDropTarget?: ConnectDropTarget;
  isOver?: boolean;
  height: ResourceElement;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
  },
};

const resourceTarget: DropTargetSpec<ResourceTimelineProps> = {}

@DropTarget('assignment', resourceTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))
class ResourceTimeline extends React.PureComponent<ResourceTimelineProps> {
  componentDidUpdate(prevProps: ResourceTimelineProps) {
    if (this.props.isOver && !prevProps.isOver) {
      this.props.dragContext.update(this.props.resource);
    }
  }

  render() {
    const rootStyle = {
      ...styles.root,
      height: this.props.height.pixels,
      paddingTop: this.props.viewConfig.resourceAxis.row.padding,
      paddingBottom: this.props.viewConfig.resourceAxis.row.padding,
      width: this.props.ticksConfig.minor.length * this.props.viewConfig.timeAxis.minor.width,
    };

    return this.props.connectDropTarget(
      <div style={rootStyle}>
        {this.props.assignments.map((element) =>
          <AssignmentElement
            key={element.assignment.id}
            element={element}
            resource={this.props.resource}
            dragContext={this.props.dragContext}
            viewConfig={this.props.viewConfig} />)}
      </div>
    )
  }
}

export default ResourceTimeline;