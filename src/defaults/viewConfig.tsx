import * as React from 'react';
import * as format from 'date-fns/format'

import { Assignment, Event, Resource, ResourceRowLayout, ViewConfig, Tick } from '../models';
import colours from './constants';

const styles = {
  events: {
    root: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-start',
      background: '#4dadf7',
      border: '1px solid #0a7fd9',
      opacity: 0.5,
      borderRadius: 3,
      color: '#fff',
      fontSize: 12,
      width: 'inherit',
      minWidth: 1,
      overflow: 'hidden'
    },
    inner: {
      paddingLeft: '0.75em',
    },
  },
  resourceAxis: {
    cell: {
      fontSize: 10,
    },
    root: {
      alignItems: 'center',
      background: colours.canvas,
      borderBottomColor: colours.border,
      borderBottomStyle: 'solid' as 'solid',
      borderBottomWidth: 1,
      borderRightColor: colours.border,
      borderRightStyle: 'solid' as 'solid',
      borderRightWidth: 1,
      display: 'inline-flex',
      flex: '1',
      flexDirection: 'column' as 'column',
      justifyContent: 'center',
    }
  },
  ticks: {
    major: {
      borderLeftColor: colours.border,
      borderLeftStyle: 'solid' as 'solid',
      borderLeftWidth: 1,
      marginLeft: -1,
      flex: '1',
      width: 1,
      zIndex: -1,
    },
    minor: {
      borderLeftColor: colours.canvas,
      borderLeftStyle: 'solid' as 'solid',
      borderLeftWidth: 1,
      marginLeft: -1,
      width: 1,
      flex: '1',
      zIndex: -2,
    },
    resource: {
      borderTop: colours.canvas,
      borderTopStyle: 'solid' as 'solid',
      borderTopWidth: 1,
      marginTop: -1,
      height: 1,
      flex: '1',
      zIndex: -2,
    }
  },
  timeAxis: {
    cell: {
      fontSize: 10,
    },
    root: {
      alignItems: 'center',
      background: colours.canvas,
      borderBottomColor: colours.border,
      borderBottomStyle: 'solid' as 'solid',
      borderBottomWidth: 1,
      borderRightColor: colours.border,
      borderRightStyle: 'solid' as 'solid',
      borderRightWidth: 1,
      display: 'inline-flex',
      flex: 'none',
      flexDirection: 'column' as 'column',
      justifyContent: 'center',
    },
  },
};

const eventRenderer = (event: any, style: React.CSSProperties) => {
  return <div style={style}><div style={styles.events.inner}>{event.data && event.data.name || ''}</div></div>
}

const config: ViewConfig = {
  renderers: {
    events: {
      assignment: (event, assignment) => {
        const style = {
          ...styles.events.root,
          backgroundColor: event.data && event.data.colour || styles.events.root.background,
          borderColor: event.data && event.data.colour || styles.events.root.background,
        };

        return eventRenderer(event, style)
      },
      preview: ({ event, assignment, hoveredResource, start, getWidthForEnd, style }) => {
        const duration = event.endTime.getTime() - event.startTime.getTime();
        const end = new Date(start.getTime() + duration);
        const width = getWidthForEnd(end);
        const newStyles = {
          ...style,
          ...styles.events.root,
          width,
        }

        return eventRenderer(event, newStyles);
      }
    },
    ticks: {
      major: () => <div style={styles.ticks.major} />,
      minor: () => <div style={styles.ticks.minor} />,
      resource: () => <div style={styles.ticks.resource} />,
    },
    external: {
      preview: ({ item, start, getWidthForEnd, style }) => {
        const data = { data: { name: 'External Item' } };
        const duration = 3000000000;
        const end = new Date(start.getTime() + duration);
        const width = getWidthForEnd(end);
        const newStyles = {
          ...style,
          ...styles.events.root,
          width,
        }

        return eventRenderer(data, newStyles);
      }
    }
  },
  resourceAxis: {
    columns: [{
      header: {
        renderer: () => <div style={styles.resourceAxis.root}><span>Name</span></div>
      },
      width: 150,
      name: 'Name',
      renderer: (resource: Resource, isOver: boolean, wasOriginal: boolean) => {
        const style = {
          ...styles.resourceAxis.root,
          ...styles.resourceAxis.cell,
          backgroundColor: wasOriginal ? 'yellow' : isOver ? 'green' : styles.resourceAxis.root.background,
        };
        return (
          <div style={style}><span>{resource.name}</span></div>
        )
      }
    }],
    row: {
      height: 100,
      padding: 5,
      layout: 'pack' as ResourceRowLayout,
    },
    width: 150,
  },
  timeAxis: {
    major: {
      height: 42,
      increment: 1,
      renderer: (tick: Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span>{format(tick.startTime, 'DD')}</span>
        </div >,
      unit: 'weeks' as 'weeks',
    },
    minor: {
      height: 42,
      increment: 1,
      renderer: (tick: Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span style={styles.timeAxis.cell}>{format(tick.startTime, 'DD')}</span>
        </div>,
      unit: 'days' as 'days',
      width: 100,
    },
  },
  timeSpan: {
    duration: 3,
    startTime: new Date(),
    unit: 'months' as 'months'
  },
}

export default config;