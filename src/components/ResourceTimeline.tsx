import * as React from 'react';

import { Resource, TicksConfig, ViewConfig, EventDomDetails } from '../../index';

interface ResourceTimelineProps {
  resource: Resource;
  events: EventDomDetails[];
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
  },
  event: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
  }
};

class ResourceTimeline extends React.PureComponent<ResourceTimelineProps> {
  render() {
    return (
      <div style={styles.root}>
        {this.props.events.map((eventDomDetails) => {
          const style = {
            ...styles.event,
            left: eventDomDetails.startX,
            width: eventDomDetails.endX - eventDomDetails.startX,
          };

          return <div key={eventDomDetails.event.id} style={style}>{this.props.viewConfig.events.renderer(eventDomDetails.event)}</div>
        })}
      </div>
    )
  }
}

export default ResourceTimeline;