import * as React from 'react';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, EventDomDetails } from '../../index';

import ResourceTimeline from './ResourceTimeline';
import TickStream from './TickStream';
import { getPositionFromDate, getCoordinatesForTimeSpan } from '../utils/dom';

interface ResourceTimelineStreamProps {
  ticksConfig: TicksConfig
  assignments: Assignment[],
  resources: Resource[],
  events: Event[],
  viewConfig: ViewConfig;
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
    const { resources, ticksConfig, viewConfig, events, assignments } = this.props;

    const style = {
      ...styles.root,
      width: ticksConfig.minor.length * viewConfig.timeAxis.minor.width,
      minHeight: resources.length * viewConfig.resourceAxis.height
    };

    const eventsMap: { [key: string]: EventDomDetails } = events.reduce((acc, event) => {
      if (event.startTime < ticksConfig.major[ticksConfig.major.length - 1].endTime || event.endTime > ticksConfig.major[0].startTime) {
        const eventDom: EventDomDetails = { ...getCoordinatesForTimeSpan(event.startTime, event.endTime, ticksConfig.minor), event };

        return { ...acc, [event.id]: eventDom }
      }
      return acc;
    }, {});
    const resourceEvents = new Map<string | number, EventDomDetails[]>();

    assignments.forEach((assignment) => {
      let currentResourceEvents = resourceEvents.get(assignment.resourceId);

      if (!currentResourceEvents) {
        currentResourceEvents = [];
        resourceEvents.set(assignment.resourceId, currentResourceEvents);
      }

      if (Object.keys(eventsMap).includes(assignment.eventId.toString())) {
        currentResourceEvents.push(eventsMap[assignment.eventId]);
      }
    });


    return (
      <div style={style}>
        <TickStream ticksConfig={ticksConfig} viewConfig={viewConfig} />
        {resources.map(resource =>
          <ResourceTimeline
            key={resource.id}
            resource={resource}
            events={resourceEvents.get(resource.id) || []}
            viewConfig={viewConfig}
            ticksConfig={ticksConfig} />
        )}
      </div>
    )
  }
}

export default ResourceTimelineStream;