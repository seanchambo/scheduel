import * as React from 'react';

import { TicksConfig, TimeAxisConfig } from '../../index';

import TimeAxis from './TimeAxis';

interface TimeHeaderProps {
  ticksConfig: TicksConfig
  timeAxisConfig: TimeAxisConfig;
}

class TimeHeader extends React.PureComponent<TimeHeaderProps> {
  render() {
    const { ticksConfig, timeAxisConfig } = this.props;

    return (
      <div>
        <TimeAxis key="major" ticks={ticksConfig.major} config={timeAxisConfig.major} />
        <TimeAxis key="minor" ticks={ticksConfig.minor} config={timeAxisConfig.minor} />
      </div>
    )
  }
}

export default TimeHeader;