import * as React from 'react';
import { DragSource, DropTarget, ConnectDropTarget } from 'react-dnd';

import { Resource, TicksConfig, ViewConfig, AssignmentElement as AssignmentElementInterface, DragContext, ResourceHeight } from '../../index';
import AssignmentElement from './AssignmentElement';

interface ResourceTimelineProps {
  resource: Resource;
  elements: AssignmentElementInterface[];
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
  dragContext: DragContext;
  connectDropTarget?: ConnectDropTarget;
  height: ResourceHeight;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
  },
};

const resourceTarget = {}

@DropTarget('assignment', resourceTarget, (connect, monitor) => ({ connectDropTarget: connect.dropTarget() }))
class ResourceTimeline extends React.PureComponent<ResourceTimelineProps> {
  render() {
    const rootStyle = {
      ...styles.root,
      height: this.props.height.pixels,
      paddingTop: this.props.viewConfig.resourceAxis.row.padding,
      paddingBottom: this.props.viewConfig.resourceAxis.row.padding
    };

    return this.props.connectDropTarget(
      <div style={rootStyle}>
        {this.props.elements.map((element) => <AssignmentElement key={element.assignment.id} element={element} viewConfig={this.props.viewConfig} />)}
      </div>
    )
  }
}

export default ResourceTimeline;