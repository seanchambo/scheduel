import * as React from 'react';
import * as format from 'date-fns/format'

import { AxesConfig, AssignmentRenderer, Assignment, Event, Resource, FeaturesConfig, Tick } from "../index.d";

const colours = {
  border: '#BDBDBD',
  canvas: '#EEEEEE',
  zone: '#AAAAAA',
}

const styles = {
  resourceZones: {
    root: {
      display: 'flex',
      background: colours.zone,
      width: '100%',
      overflow: 'hidden'
    },
  },
  lines: {
    header: {
      borderRadius: 10,
      height: 10,
      width: 10,
      transform: 'rotate(45deg)',
      border: '2px solid red',
      backgroundColor: 'white',
    },
    line: {
      borderLeftColor: colours.border,
      borderLeftStyle: 'dotted' as 'dotted',
      borderLeftWidth: 1,
      flex: '1',
      width: 1,
      zIndex: -1,
    }
  },
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
      width: '100%',
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

export const axesDefaults: AxesConfig = {
  time: {
    ticks: {
      major: {
        rowHeight: 40,
        labelRenderer: (tick: Tick) => {
          return (
            <div
              key={tick.startTime.getTime()}
              style={{ ...styles.timeAxis.root, width: tick.width }}>
              <span style={styles.timeAxis.cell}>{format(tick.startTime, 'MM DD')}</span>
            </div>
          )
        },
        tickRenderer: (tick: Tick) => <div style={styles.ticks.major} />,
        increment: 1,
        unit: 'week',
      },
      minor: {
        rowHeight: 40,
        labelRenderer: (tick: Tick) => {
          return (
            <div
              key={tick.startTime.getTime()}
              style={{ ...styles.timeAxis.root, width: tick.width }}>
              <span>{format(tick.startTime, 'DD')}</span>
            </div >
          )
        },
        tickRenderer: (tick: Tick) => <div style={styles.ticks.minor} />,
        increment: 1,
        unit: 'day',
        width: 40,
      },
    },
    range: {
      from: new Date(),
      duration: {
        unit: 'month',
        increment: 1,
      },
    },
    resolution: {
      unit: 'minute',
      increment: 5,
    },
  },
  resource: {
    row: {
      height: 40,
      padding: 2,
      layout: 'stack',
    },
    tickRenderer: (resource: Resource) => <div style={styles.ticks.resource} />,
    width: 100,
    columns: [{
      name: 'Name',
      labelRenderer: () => <div style={styles.resourceAxis.root}><span>Name</span></div>,
      width: 100,
      rowRenderer: (resource: Resource, { wasOriginal, isOver }) => {
        const style = {
          ...styles.resourceAxis.root,
          ...styles.resourceAxis.cell,
          backgroundColor: wasOriginal ? 'yellow' : isOver ? 'green' : styles.resourceAxis.root.background,
        };

        return (
          <div style={style}><span>{resource.name}</span></div>
        );
      }
    }]
  }
}

export const assignmentRenderer: AssignmentRenderer = (assignment: Assignment, event: Event, resource: Resource) => {
  const style = {
    ...styles.events.root,
    backgroundColor: event.data && event.data.colour || styles.events.root.background,
    borderColor: event.data && event.data.colour || styles.events.root.background,
  };

  return (<div style={style}><div style={styles.events.inner}>{event.data && event.data.name || ''}</div></div >);
}

export const featuresDefaults: FeaturesConfig = {
  dragDrop: {
    internal: {
      enabled: true,
      snapToResource: false,
      snapToTimeResolution: true,
      previewRenderer: ({ event, start, getWidthForEnd, style }) => {
        const duration = event.endTime.getTime() - event.startTime.getTime();
        const end = new Date(start.getTime() + duration);
        const width = getWidthForEnd(end);
        const newStyles = {
          ...style,
          ...styles.events.root,
          width,
        }

        return (<div style={newStyles}><div style={styles.events.inner}>{event.data && event.data.name || ''}</div></div >);
      },
      listeners: {
        drag: () => { },
        drop: () => { },
      }
    },
    external: {
      enabled: false,
    },
  },
  resourceZones: {
    zones: [],
    renderer: () => <div style={styles.resourceZones.root}></div>,
  },
  lines: {
    lines: [],
    line: {
      renderer: () => <div style={styles.lines.line}></div>,
      width: 1,
    },
    header: {
      renderer: () => <div style={styles.lines.header}></div>,
      width: 10,
    },
  }
}