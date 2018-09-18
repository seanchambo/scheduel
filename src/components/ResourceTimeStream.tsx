import * as React from 'react';
import { List, ScrollSyncChildProps, AutoSizer } from 'react-virtualized';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, AssignmentElement, DragContext, ResourceAssignmentMap, ResourceElement } from '../../index';

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
  scrollContext: ScrollSyncChildProps;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column' as 'column',
    position: 'relative' as 'relative',
  }
}

class ResourceTimelineStream extends React.PureComponent<ResourceTimelineStreamProps> {
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