import * as React from 'react';

import { Tick, TimeAxisRowConfig } from '../models';

interface TimeAxisProps {
  ticks: Tick[];
  config: TimeAxisRowConfig;
};

const styles = {
  root: {
    flex: '1 1 auto',
    display: 'flex',
  },
  cell: {
    display: 'flex',
  },
}

class TimeAxis extends React.PureComponent<TimeAxisProps> {
  render() {
    const { ticks, config } = this.props;
    const style = { ...styles.root, height: config.height };



    return (
      <div style={style}>
        {ticks.map(tick => {
          const cellStyle = { ...styles.cell, width: tick.width };
          return (
            <div key={tick.startTime.getTime()} style={cellStyle}>{config.renderer(tick)}</div>
          )
        })}
      </div>
    )
  }
}

export default TimeAxis
