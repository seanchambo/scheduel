import * as React from 'react';
import * as areRangesOverlapping from 'date-fns/are_ranges_overlapping';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, EventDomDetails } from '../../index';

import ResourceTimeline from './ResourceTimeline';
import TickStream from './TickStream';
import { getCoordinatesForTimeSpan } from '../utils/dom';

interface ResourceTimelineStreamProps {
  ticksConfig: TicksConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
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
    const { resources, ticksConfig, viewConfig, events, assignments, start, end } = this.props;

    const style = {
      ...styles.root,
      width: ticksConfig.minor.length * viewConfig.timeAxis.minor.width,
      minHeight: resources.length * viewConfig.resourceAxis.height
    };

    const eventsMap: { [key: string]: EventDomDetails } = events.reduce((acc, event) => {
      if (areRangesOverlapping(event.startTime, event.endTime, start, end)) {
        const coordinates = getCoordinatesForTimeSpan(event.startTime, event.endTime, ticksConfig.minor, start, end);

        if (coordinates) {
          return { ...acc, [event.id]: { ...coordinates, event } };
        }

        return acc;
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