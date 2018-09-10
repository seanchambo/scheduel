import * as React from 'react';

import { TicksConfig, ViewConfig } from '../../index';

interface TickStreamProps {
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: -1,
  }
}

class TickStream extends React.PureComponent<TickStreamProps> {
  render() {
    let minorLeft: number = 0;
    let majorLeft: number = 0;
    return (
      <div style={styles.root}>
        {
          this.props.ticksConfig.major.map((tick) => {
            majorLeft += tick.width;
            if (!tick.show) { return null; }
            const elem = <div key={`${tick.startTime.getTime()}-major`}>{this.props.viewConfig.ticks.major.renderer(majorLeft)}</div>
            return elem;
          })
        }
        {
          this.props.ticksConfig.minor.map((tick) => {
            minorLeft += tick.width;
            if (!tick.show) { return null; }
            const elem = <div key={`${tick.startTime.getTime()}-minor`}>{this.props.viewConfig.ticks.minor.renderer(minorLeft)}</div>;
            return elem;
          })
        }
      </div>
    )
  }
}

export default TickStream;