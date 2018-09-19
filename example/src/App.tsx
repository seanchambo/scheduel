import * as React from 'react';
import * as format from 'date-fns/format'
import Scheduler, { models, defaults } from 'scheduel';

import colours from './constants/colours';
import { generateData } from './generateData';

const styles = {
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

const timeAxes: { timeSpan: models.TimeSpanConfig, timeAxis: models.TimeAxisConfig }[] = [{
  timeAxis: {
    major: {
      height: 42,
      increment: 1,
      renderer: (tick: models.Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span>{format(tick.startTime, 'DD')}</span>
        </div >,
      unit: 'days' as 'days',
    },
    minor: {
      height: 42,
      increment: 6,
      renderer: (tick: models.Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span style={styles.timeAxis.cell}>{format(tick.startTime, 'HH:mm')}</span>
        </div>,
      unit: 'hours' as 'hours',
      width: 100,
    },
  },
  timeSpan: {
    duration: 3,
    startTime: new Date(2018, 0, 1, 0, 0, 0, 0),
    unit: 'months' as 'months'
  },
}, {
  timeAxis: {
    major: {
      height: 42,
      increment: 1,
      renderer: (tick: models.Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span>{format(tick.startTime, 'MM')}</span>
        </div >,
      unit: 'months' as 'months',
    },
    minor: {
      height: 42,
      increment: 1,
      renderer: (tick: models.Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span style={styles.timeAxis.cell}>{format(tick.startTime, 'DD')}</span>
        </div>,
      unit: 'weeks' as 'weeks',
      width: 100,
    },
  },
  timeSpan: {
    duration: 10,
    startTime: new Date(2018, 0, 1, 0, 0, 0, 0),
    unit: 'months' as 'months'
  },
}, {
  timeAxis: {
    major: {
      height: 42,
      increment: 1,
      renderer: (tick: models.Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span>{format(tick.startTime, 'MM')}</span>
        </div >,
      unit: 'months' as 'months',
    },
    minor: {
      height: 42,
      increment: 1,
      renderer: (tick: models.Tick) =>
        <div
          key={tick.startTime.getTime()}
          style={{ ...styles.timeAxis.root, width: tick.width }}>
          <span style={styles.timeAxis.cell}>{format(tick.startTime, 'DD')}</span>
        </div>,
      unit: 'weeks' as 'weeks',
      width: 100,
    },
  },
  timeSpan: {
    duration: 3,
    startTime: new Date(2018, 0, 1, 0, 0, 0, 0),
    unit: 'months' as 'months'
  },
}]

class App extends React.Component {
  state = {
    zoomLevel: 1,
    layout: 'stack',
    ...generateData(new Date(2018, 0, 1, 0, 0, 0, 0), new Date(2018, 10, 1, 0, 0, 0, 0), 1000, 50),
  }

  updateEvent = (assignment: models.Assignment, resource: models.Resource, event: models.Event, date: Date) => {
    const newAssignment: models.Assignment = { id: assignment.id, eventId: event.id, resourceId: resource.id };
    const eventDuration = event.endTime.getTime() - event.startTime.getTime();
    const eventEnd = new Date(date.getTime() + eventDuration);
    const newEvent: models.Event = { ...event, startTime: new Date(date), endTime: new Date(eventEnd) };

    const assignmentIndex = this.state.assignments.indexOf(assignment);
    const eventIndex = this.state.events.indexOf(event);

    const newAssignments = [...this.state.assignments, newAssignment];
    const newEvents = [...this.state.events, newEvent];

    newAssignments.splice(assignmentIndex, 1);
    newEvents.splice(eventIndex, 1);

    this.setState({ assignments: newAssignments, events: newEvents });
  }

  zoomIn = () => {
    if (this.state.zoomLevel - 1 >= 0) {
      this.setState({ zoomLevel: this.state.zoomLevel - 1 });
    }
  }

  zoomOut = () => {
    if (this.state.zoomLevel + 1 <= timeAxes.length - 1) {
      this.setState({ zoomLevel: this.state.zoomLevel + 1 });
    }
  }

  setLayout = (layout: models.ResourceRowLayout) => {
    return () => {
      this.setState({ layout });
    }
  }

  regenerate = () => {
    this.setState({ ...generateData(new Date(2018, 0, 1, 0, 0, 0, 0), new Date(2018, 10, 1, 0, 0, 0, 0), 1000, 50) });
  }

  public render() {
    console.log(this.state.assignments, this.state.events, this.state.resources);
    const config = {
      ...defaults.viewConfig,
      resourceAxis: {
        ...defaults.viewConfig.resourceAxis,
        row: {
          ...defaults.viewConfig.resourceAxis.row,
          layout: this.state.layout as models.ResourceRowLayout,
        }
      }
    }

    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 42, padding: 8, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ width: 150, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <button onClick={this.zoomIn}>Zoom In</button>
            <button onClick={this.zoomOut}>Zoom Out</button>
          </div>
          <div style={{ width: 75, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <button onClick={this.regenerate}>Regenerate</button>
          </div>
          <div style={{ width: 225, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button onClick={this.setLayout('stack')}>Stack</button>
            <button onClick={this.setLayout('overlap')}>Overlap</button>
            <button onClick={this.setLayout('pack')}>Pack</button>
          </div>
        </div>
        <div style={{ flex: 1, width: '100%' }}>
          <Scheduler
            assignments={this.state.assignments}
            resources={this.state.resources}
            events={this.state.events}
            listeners={{ ...defaults.listeners, assignmentdrop: this.updateEvent }}
            viewConfig={{ ...config, timeSpan: timeAxes[this.state.zoomLevel].timeSpan, timeAxis: timeAxes[this.state.zoomLevel].timeAxis }} />
        </div>
      </div>
    );
  }
}

export default App;
