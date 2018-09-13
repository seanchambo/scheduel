import * as format from 'date-fns/format'
import * as React from 'react';

import Scheduler from 'scheduel';

import { Assignment, Event, Resource, Tick } from '../../index';
import colours from './constants/colours';

const styles = {
  event: {
    alignItems: 'center',
    background: 'rgba(244, 67, 54, 0.7)',
    display: 'block',
    flex: '1',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
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
      height: '100%',
      marginLeft: -1,
      position: 'absolute' as 'absolute',
      width: 1,
      zIndex: -1,
    },
    minor: {
      borderLeftColor: colours.canvas,
      borderLeftStyle: 'solid' as 'solid',
      borderLeftWidth: 1,
      height: '100%',
      marginLeft: -1,
      position: 'absolute' as 'absolute',
      width: 1,
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

const viewConfig = {
  events: {
    renderer: (event: Event) => <div style={styles.event}>{event.data && event.data.name || ''}</div>
  },
  resourceAxis: {
    columns: [{
      header: {
        renderer: () => <div style={styles.resourceAxis.root}><span>Name</span></div>
      },
      name: 'Name',
      renderer: (resource: Resource) => {
        const style = { ...styles.resourceAxis.root, ...styles.resourceAxis.cell };
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
      height: 50,
      padding: 5,
    },
    width: 300,
  },
  ticks: {
    major: {
      renderer: (left: number) => <div style={{ ...styles.ticks.major, left }} />
    },
    minor: {
      renderer: (left: number) => <div style={{ ...styles.ticks.minor, left }} />
    }
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
    duration: 1,
    startTime: new Date(2018, 8, 1, 0, 0, 0, 0),
    unit: 'months' as 'months'
  },
}

const resources: Resource[] = [{
  data: { age: 24 },
  id: 1,
  name: 'Sean Chamberlain',
}, {
  data: { age: 26 },
  id: 2,
  name: 'Lorien Bennett',
}];

const assignments: Assignment[] = [{
  id: 1,
  eventId: 1,
  resourceId: 1,
}, {
  id: 2,
  eventId: 2,
  resourceId: 1,
}, {
  id: 3,
  eventId: 3,
  resourceId: 2,
}, {
  id: 4,
  eventId: 4,
  resourceId: 1,
}];

const events: Event[] = [{
  id: 1,
  startTime: new Date(2017, 9, 4, 0, 0, 0, 0),
  endTime: new Date(2018, 8, 5, 0, 0, 0, 0),
  data: {
    name: 'Make Tea'
  },
}, {
  id: 2,
  startTime: new Date(2018, 8, 4, 0, 10, 0, 0),
  endTime: new Date(2018, 8, 5, 12, 30, 40, 1),
  data: {
    name: 'Do Dishes'
  },
}, {
  id: 4,
  startTime: new Date(2018, 8, 5, 0, 10, 0, 0),
  endTime: new Date(2018, 8, 5, 12, 30, 40, 1),
  data: {
    name: 'Make Bed'
  },
}, {
  id: 3,
  startTime: new Date(2018, 8, 10, 22, 0, 0, 0),
  endTime: new Date(2018, 8, 11, 7, 30, 0, 0),
  data: {
    name: 'Go to bed'
  },
}]

class App extends React.Component {
  public render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Scheduler
          assignments={assignments}
          resources={resources}
          events={events}
          viewConfig={viewConfig} />
      </div>
    );
  }
}

export default App;
