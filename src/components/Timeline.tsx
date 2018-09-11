import * as React from 'react';

import { Assignment, Resource, Event, ViewConfig } from '../../index';
import { getTicksConfig } from '../utils/ticks';
import TimeHeader from './TimeHeader';
import ResourceTimeStream from './ResourceTimeStream';
import { getStartEndForTimeSpan } from '../utils/timeSpan';

interface TimelineProps {
  assignments: Assignment[],
  resources: Resource[],
  events: Event[],
  viewConfig: ViewConfig;
}

const styles = {
  root: {
    overflowX: 'scroll' as 'scroll',
  },
};

class Timeline extends React.PureComponent<TimelineProps> {
  render() {
    const { viewConfig: { timeSpan, timeAxis } } = this.props;
    const { start, end } = getStartEndForTimeSpan(timeSpan, timeAxis);
    const ticksConfig = getTicksConfig(start, end, timeAxis);

    return (
      <div style={styles.root}>
        <TimeHeader ticksConfig={ticksConfig} timeAxisConfig={timeAxis} />
        <ResourceTimeStream ticksConfig={ticksConfig} start={start} end={end} {...this.props} />
      </div>
    )
  }
}

export default Timeline;