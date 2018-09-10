import * as React from 'react';

import { Assignment, Resource, Event, ViewConfig } from '../../index';
import { getTicksInRange, getMajorTickWidth } from '../utils/ticks';
import { startOfUnit, addUnitToDate, adjustToIncrement } from '../utils/date';
import TimeHeader from './TimeHeader';
import ResourceTimeStream from './ResourceTimeStream';

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

class Timeline extends React.Component<TimelineProps> {
  render() {
    const { viewConfig: { timeSpan, timeAxis } } = this.props;
    const start = startOfUnit(timeSpan.startTime, timeAxis.major.unit);
    const proposedEnd = addUnitToDate(start, timeSpan.duration, timeSpan.unit);
    const majorAdjustedEnd = adjustToIncrement(start, proposedEnd, timeAxis.major.increment, timeAxis.major.unit);
    const minorAdjustedEnd = adjustToIncrement(start, majorAdjustedEnd, timeAxis.minor.increment, timeAxis.minor.unit);

    let majorTicks = getTicksInRange(start, minorAdjustedEnd, timeAxis.major);
    let minorTicks = getTicksInRange(start, minorAdjustedEnd, timeAxis.minor);

    minorTicks.forEach(tick => tick.width = timeAxis.minor.width);
    majorTicks.forEach(tick => tick.width = getMajorTickWidth(tick, timeAxis.minor));

    const ticksConfig = { major: majorTicks, minor: minorTicks };

    return (
      <div style={styles.root}>
        <TimeHeader ticksConfig={ticksConfig} timeAxisConfig={timeAxis} />
        <ResourceTimeStream ticksConfig={ticksConfig} {...this.props} />
      </div>
    )
  }
}

export default Timeline;