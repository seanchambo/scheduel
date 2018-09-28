import * as React from 'react';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');

import { TicksConfig, ViewConfig, ResourceElement } from '../models';

interface TickStreamProps {
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
  resourceElements: ResourceElement[];
}

const styles = {
  root: {
    zIndex: -1,
    position: 'relative' as 'relative',
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
    const height = this.props.resourceElements.reduce((acc, element) => acc + element.pixels, 0) + scrollbarSize();
    const width = this.props.ticksConfig.minor.length * this.props.viewConfig.timeAxis.minor.width + scrollbarSize();
    const rootStyle = { ...styles.root, height, width }

    let minorLeft: number = 0;
    let majorLeft: number = 0;

    return (
      <div style={rootStyle}>
        {
          this.props.ticksConfig.major.map((tick) => {
            majorLeft += tick.width;
            if (!tick.show) { return null; }
            return (
              <div style={{ ...styles.timeTick, left: majorLeft }} key={`${tick.startTime.getTime()}-major-tick`}>
                {this.props.viewConfig.renderers.ticks.major(tick)}
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
                {this.props.viewConfig.renderers.ticks.minor(tick)}
              </div>
            )
          })
        }
        {
          this.props.resourceElements.map((element) => {
            return (
              <div style={{ ...styles.resourceTick, top: element.top + element.pixels }} key={`${element.resource.id}-resource-tick`}>
                {this.props.viewConfig.renderers.ticks.resource(element.resource)}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default TickStream;