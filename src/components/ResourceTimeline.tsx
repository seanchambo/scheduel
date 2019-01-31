import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid } from 'react-virtualized';
import { DropTarget } from 'intereactable';
import { DropTargetSpecification } from 'intereactable/dist/DropTarget';
import { RegisterRef } from 'intereactable/dist/DragSource';

import { Resource, Ticks, DragContext, DragDropConfig, AxesConfig } from '../../index.d';

import { getDateFromPosition } from '../utils/dom';
import itemTypes from '../utils/itemTypes';
import { roundTo } from '../utils/date';

interface ResourceTimelineProps {
  grid: Grid;
  resource: Resource;
  ticks: Ticks;
  dragContext: DragContext;
  dragDropConfig: DragDropConfig;
  axesConfig: AxesConfig;
  isAssignmentOver?: boolean;
  isExternalOver?: boolean;
  registerRef?: RegisterRef;
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

const resourceTarget: DropTargetSpecification<ResourceTimelineProps> = {
  drop(props, monitor) {
    const finish = monitor.getClientSourceOffset();

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

class ResourceTimeline extends React.PureComponent<ResourceTimelineProps> {
  componentDidUpdate(prevProps: ResourceTimelineProps) {
    const { isAssignmentOver, isExternalOver, dragDropConfig, dragContext, resource } = this.props;

    if (isAssignmentOver && !prevProps.isAssignmentOver && dragDropConfig.internal.enabled) {
      dragContext.update(resource);
    }
    if (isExternalOver && !prevProps.isExternalOver && dragDropConfig.external.enabled) {
      dragDropConfig.external.context.update(resource);
    }
  }

  render() {
    const { registerRef } = this.props;

    return (
      <div style={styles.root} ref={registerRef}>
        {this.props.children}
      </div>
    )
  }
}

export default DropTarget<ResourceTimelineProps>(itemTypes.Assignment, resourceTarget, (assignmentMonitor, registerRef) => ({
  isAssignmentOver: assignmentMonitor.isOver(),
  registerRef,
}))(ResourceTimeline);