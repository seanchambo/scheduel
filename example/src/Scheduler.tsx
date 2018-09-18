import * as React from 'react';

import Scheduler from 'scheduel';

import { Assignment, Event, Resource, TimeAxisConfig, TimeSpanConfig, ResourceRowLayout } from '../../index';
import colours from './constants/colours';
import { generateData } from './generateData';

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

const config = {
  events: {
    renderer: (event: Event, assignment: Assignment) => {
      const style = {
        ...styles.events.root,
        backgroundColor: event.data && event.data.colour || styles.events.root.background,
        borderColor: event.data && event.data.colour || styles.events.root.background,
      };

      return <div style={style}><div style={styles.events.inner}>{event.data && event.data.name || ''}</div></div>
    }
  },
  resourceAxis: {
    columns: [{
      header: {
        renderer: () => <div style={styles.resourceAxis.root}><span>Name</span></div>
      },
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
    }, {
      header: {
        renderer: () => <div style={styles.resourceAxis.root}><span>Age</span></div>
      },
      name: 'Age',
      renderer: (resource: Resource) => {
        const style = { ...styles.resourceAxis.root, ...styles.resourceAxis.cell };
        return (
          <div style={style}><span>{resource.data && resource.data.age || ''}</span></div>
        )
      }
    }],
    row: {
      height: 100,
      padding: 5,
      layout: 'pack' as ResourceRowLayout,
    },
    width: 300,
  },
  ticks: {
    major: {
      renderer: () => <div style={styles.ticks.major} />
    },
    minor: {
      renderer: () => <div style={styles.ticks.minor} />
    },
    resource: {
      renderer: () => <div style={styles.ticks.resource} />
    }
  },
}

const { resources, assignments, events } = generateData(new Date(2018, 0, 1, 0, 0, 0, 0), new Date(2018, 3, 1, 0, 0, 0, 0), 100, 10);

interface SchedulerWrapperProps {
  timeAxis: TimeAxisConfig;
  timeSpan: TimeSpanConfig;
  layout: ResourceRowLayout;
}

class SchedulerWrapper extends React.Component<SchedulerWrapperProps> {
  public render() {
    config.resourceAxis.row.layout = this.props.layout;

    return (
      <Scheduler
        assignments={assignments}
        resources={resources}
        events={events}
        viewConfig={{ ...config, timeSpan: this.props.timeSpan, timeAxis: this.props.timeAxis }} />
    );
  }
}

export default SchedulerWrapper;

