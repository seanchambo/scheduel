import * as React from 'react';

import Scheduler, { defaults, models } from 'scheduel';

import { generateData } from './generateData';

const { resources, assignments, events } = generateData(new Date(2018, 0, 1, 0, 0, 0, 0), new Date(2018, 10, 1, 0, 0, 0, 0), 1000, 100);

interface SchedulerWrapperProps {
  timeAxis: models.TimeAxisConfig;
  timeSpan: models.TimeSpanConfig;
  layout: models.ResourceRowLayout;
}

class SchedulerWrapper extends React.Component<SchedulerWrapperProps> {
  public render() {
    const config = { ...defaults.viewConfig }
    config.resourceAxis.row.layout = this.props.layout;

    return (
      <Scheduler
        assignments={assignments}
        resources={resources}
        events={events}
        listeners={defaults.listeners}
        viewConfig={{ ...config, timeSpan: this.props.timeSpan, timeAxis: this.props.timeAxis }} />
    );
  }
}

export default SchedulerWrapper;

