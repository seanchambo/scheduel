import * as React from 'react';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, AssignmentElement, DragContext, ResourceAssignmentMap, ResourceElement } from '../models';

import ResourceTimeline from './ResourceTimeline';
import TickStream from './TickStream';

interface ResourceTimelineStreamProps {
  ticksConfig: TicksConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  resourceAssignments: ResourceAssignmentMap;
  resourceElements: ResourceElement[];
  start: Date;
  end: Date;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column' as 'column',
    position: 'relative' as 'relative',
  }
}

class ResourceTimelineStream extends React.Component<ResourceTimelineStreamProps> {
  shouldComponentUpdate(nextProps: ResourceTimelineStreamProps) {
    if (this.props.ticksConfig !== nextProps.ticksConfig) return true;
    if (this.props.assignments !== nextProps.assignments) return true;
    if (this.props.resources !== nextProps.resources) return true;
    if (this.props.events !== nextProps.events) return true;
    if (this.props.viewConfig !== nextProps.viewConfig) return true;
    if (this.props.resourceAssignments !== nextProps.resourceAssignments) return true;
    if (this.props.resourceElements !== nextProps.resourceElements) return true;
    if (this.props.start !== nextProps.start) return true;
    if (this.props.end !== nextProps.end) return true
    return false;
  }

  render() {
    const { resources, ticksConfig, viewConfig, resourceElements, resourceAssignments, dragContext } = this.props;

    return (
      <div style={styles.root}>
        <TickStream ticksConfig={ticksConfig} viewConfig={viewConfig} resourceElements={resourceElements} />
        {resources.map((resource, index) => (
          <ResourceTimeline
            key={resource.id}
            height={resourceElements[index]}
            resource={resource}
            assignments={resourceAssignments.get(resource)}
            viewConfig={viewConfig}
            ticksConfig={ticksConfig}
            dragContext={dragContext} />
        ))}
      </div>
    );
  }
}

export default ResourceTimelineStream;