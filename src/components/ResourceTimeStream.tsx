import * as React from 'react';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, AssignmentElement, DragContext, ResourceElementMap, ResourceHeightsMap } from '../../index';

import ResourceTimeline from './ResourceTimeline';
import TickStream from './TickStream';

interface ResourceTimelineStreamProps {
  ticksConfig: TicksConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  resourceElements: ResourceElementMap;
  resourceHeights: ResourceHeightsMap;
  start: Date;
  end: Date;
}

const styles = {
  root: {
    display: 'flex',
    flex: 'none',
    flexDirection: 'column' as 'column',
    position: 'relative' as 'relative',
  }
}

class ResourceTimelineStream extends React.PureComponent<ResourceTimelineStreamProps> {
  render() {
    const { resources, ticksConfig, viewConfig, resourceElements, resourceHeights, dragContext } = this.props;

    const minHeight = Array.from(resourceHeights.values()).reduce((acc, height) => acc + height, 0);

    const style = {
      ...styles.root,
      width: ticksConfig.minor.length * viewConfig.timeAxis.minor.width,
      minHeight,
    };

    return (
      <div style={style}>
        <TickStream ticksConfig={ticksConfig} viewConfig={viewConfig} />
        {resources.map(resource =>
          <ResourceTimeline
            key={resource.id}
            resource={resource}
            elements={resourceElements.get(resource)}
            height={resourceHeights.get(resource)}
            viewConfig={viewConfig}
            ticksConfig={ticksConfig}
            dragContext={dragContext} />
        )}
      </div>
    )
  }
}

export default ResourceTimelineStream;