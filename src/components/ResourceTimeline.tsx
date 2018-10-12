import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DropTarget, ConnectDropTarget, DropTargetSpec } from 'react-dnd';

import { Resource, Ticks, DragContext, DragDropConfig, AxesConfig } from '../../index.d';

import { getDateFromPosition } from '../utils/dom';
import itemTypes from '../utils/itemTypes';
import { Grid } from 'react-virtualized';
import { roundTo } from '../utils/date';

interface ResourceTimelineProps {
  grid: Grid;
  resource: Resource;
  ticks: Ticks;
  dragContext: DragContext;
  dragDropConfig: DragDropConfig;
  axesConfig: AxesConfig;
  connectAssignmentDropTarget?: ConnectDropTarget;
  connectExternalDropTarget?: ConnectDropTarget;
  isAssignmentOver?: boolean;
  isExternalOver?: boolean;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    width: '100%',
    height: '100%',
  },
};

const resourceTarget: DropTargetSpec<ResourceTimelineProps> = {
  drop(props, monitor) {
    const finish = monitor.getSourceClientOffset();

    const panel: Element = ReactDOM.findDOMNode(props.grid) as Element;
    const xFromPanel = finish.x - panel.getBoundingClientRect().left;
    const xFromSchedulerStart = xFromPanel + panel.scrollLeft;
    let date = getDateFromPosition(xFromSchedulerStart, props.ticks.minor);
    date = roundTo(date, props.axesConfig.time.resolution.increment, props.axesConfig.time.resolution.unit);

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
    if (this.props.isAssignmentOver && !prevProps.isAssignmentOver && this.props.dragDropConfig.internal.enabled) {
      this.props.dragContext.update(this.props.resource);
    }
    if (this.props.isExternalOver && !prevProps.isExternalOver && this.props.dragDropConfig.external.enabled) {
      this.props.dragDropConfig.external.context.update(this.props.resource);
    }
  }

  render() {
    return this.props.connectAssignmentDropTarget(
      this.props.connectExternalDropTarget(
        <div style={styles.root}>
          {this.props.children}
        </div>
      )
    )
  }
}

export default ResourceTimeline;