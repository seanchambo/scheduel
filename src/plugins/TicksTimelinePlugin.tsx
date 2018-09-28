import * as React from 'react';
import { Grid } from 'react-virtualized';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');

import { Resource, TicksConfig } from '../models';

import TimelinePlugin, { TimelineComponentProps } from './TimelinePlugin';

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    width: '100%',
    height: '100%',
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
};

class TicksTimelinePlugin extends TimelinePlugin<TicksConfig> {
  masterScroll = false;
  subscribeScrollLeft = true;
  subscribeScrollTop = true;

  getStyle = () => ({ position: 'absolute' as 'absolute', top: 0, left: 0, zIndex: -1 });

  getColumnCount = () => 2;
  getColumnWidth = (props: TimelineComponentProps) => ({ index }) => {
    if (index === 1) { return scrollbarSize(); }
    return props.ticksConfig.minor.length * props.viewConfig.timeAxis.minor.width;
  }

  getRowCount = (props: TimelineComponentProps) => props.resources.length + 1;
  getRowHeight = (props: TimelineComponentProps) => ({ index }) => {
    if (index === props.resources.length) { return scrollbarSize() }
    return props.resourceElements[index].pixels
  }

  getData = (props: TimelineComponentProps): Map<Resource, TicksConfig[]> => {
    const map: Map<Resource, TicksConfig[]> = new Map<Resource, TicksConfig[]>();

    for (const resource of props.resources) {
      map.set(resource, [props.ticksConfig]);
    }

    return map;
  }

  renderRow = (ticksConfig: TicksConfig[], resource: Resource, grid: Grid, props: TimelineComponentProps) => {
    let minorLeft: number = 0;
    let majorLeft: number = 0;

    return (
      <div style={styles.root}>
        {
          ticksConfig[0].major.map((tick) => {
            majorLeft += tick.width;
            if (!tick.show) { return null; }
            return (
              <div style={{ ...styles.timeTick, left: majorLeft }} key={`${tick.startTime.getTime()}-major-tick`}>
                {props.viewConfig.renderers.ticks.major(tick)}
              </div>
            )
          })
        }
        {
          ticksConfig[0].minor.map((tick) => {
            minorLeft += tick.width;
            if (!tick.show) { return null; }
            return (
              <div style={{ ...styles.timeTick, left: minorLeft }} key={`${tick.startTime.getTime()}-minor-tick`}>
                {props.viewConfig.renderers.ticks.minor(tick)}
              </div>
            )
          })
        }
        <div style={{ ...styles.resourceTick, bottom: 0 }}>
          {props.viewConfig.renderers.ticks.resource(resource)}
        </div>
      </div>
    )
  }
}

export default TicksTimelinePlugin;