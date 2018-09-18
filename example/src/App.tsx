import * as React from 'react';
import * as format from 'date-fns/format'

import { TimeAxisConfig, TimeSpanConfig, Tick, ResourceRowLayout } from '../../index';
import Scheduler from './Scheduler';
import colours from './constants/colours';

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

const timeAxes: { timeSpan: TimeSpanConfig, timeAxis: TimeAxisConfig }[] = [{
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
      unit: 'days' as 'days',
    },
    minor: {
      height: 42,
      increment: 6,
      renderer: (tick: Tick) =>
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
    startTime: new Date(2018, 0, 1, 0, 0, 0, 0),
    unit: 'months' as 'months'
  },
}, {
  timeAxis: {
    major: {
      height: 42,
      increment: 1,
      renderer: (tick: Tick) =>
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
      renderer: (tick: Tick) =>
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
  };

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

  setLayout = (layout: ResourceRowLayout) => {
    return () => {
      this.setState({ layout });
    }
  }

  public render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div style={{ height: 42, padding: 8, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ width: 150, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <button onClick={this.zoomIn}>Zoom In</button>
            <button onClick={this.zoomOut}>Zoom Out</button>
          </div>
          <div style={{ width: 225, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button onClick={this.setLayout('stack')}>Stack</button>
            <button onClick={this.setLayout('overlap')}>Overlap</button>
            <button onClick={this.setLayout('pack')}>Pack</button>
          </div>
        </div>
        <div style={{ height: 900, width: '100%' }}>
          <Scheduler
            layout={this.state.layout as ResourceRowLayout}
            timeAxis={timeAxes[this.state.zoomLevel].timeAxis}
            timeSpan={timeAxes[this.state.zoomLevel].timeSpan} />
        </div>
      </div>
    );
  }
}

export default App;
