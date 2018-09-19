import * as React from 'react';

import { TicksConfig, ViewConfig, ResourceElement } from '../models';

interface TickStreamProps {
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
  resourceElements: ResourceElement[];
}

const styles = {
  root: {
    height: '100%',
    width: '100%',
    zIndex: -1,
  },
  timeTick: {
    position: 'absolute' as 'absolute',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  resourceTick: {
    position: 'absolute' as 'absolute',
    width: '100%',
    display: 'flex',
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
            return (
              <div style={{ ...styles.timeTick, left: majorLeft }} key={`${tick.startTime.getTime()}-major-tick`}>
                {this.props.viewConfig.ticks.major.renderer(tick)}
              </div>
            )
          })
        }
        {
          this.props.ticksConfig.minor.map((tick) => {
            minorLeft += tick.width;
            if (!tick.show) { return null; }
            return (
              <div style={{ ...styles.timeTick, left: minorLeft }} key={`${tick.startTime.getTime()}-minor-tick`}>
                {this.props.viewConfig.ticks.minor.renderer(tick)}
              </div>
            )
          })
        }
        {
          this.props.resourceElements.map((element) => {
            return (
              <div style={{ ...styles.resourceTick, top: element.top + element.pixels }} key={`${element.resource.id}-resource-tick`}>
                {this.props.viewConfig.ticks.resource.renderer(element.resource)}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default TickStream;