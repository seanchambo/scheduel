import * as React from 'react';
import { Grid, AutoSizer } from 'react-virtualized';

import { TicksConfig, TimeAxisConfig } from '../models';

const styles = {
  cell: {
    display: 'flex',
  },
  axis: {
    overflow: 'hidden',
  },
}

interface TimeHeaderProps {
  ticksConfig: TicksConfig
  timeAxisConfig: TimeAxisConfig;
  scrollLeft: number;
}

class TimeHeader extends React.PureComponent<TimeHeaderProps> {
  minorGrid: React.RefObject<Grid>
  majorGrid: React.RefObject<Grid>

  constructor(props) {
    super(props);

    this.majorGrid = React.createRef();
    this.minorGrid = React.createRef();
  }

  componentDidUpdate(prevProps: TimeHeaderProps) {
    if (this.props.ticksConfig !== prevProps.ticksConfig) {
      this.majorGrid.current.recomputeGridSize();
      this.minorGrid.current.recomputeGridSize();
    }
  }

  _renderMajorCell = ({ columnIndex, key, style }) => {
    const tick = this.props.ticksConfig.major[columnIndex];

    return (
      <div style={{ ...style, ...styles.cell, height: this.props.timeAxisConfig.major.height }} key={key}>
        {this.props.timeAxisConfig.major.renderer(tick)}
      </div>
    )
  }

  _renderMinorCell = ({ columnIndex, key, style }) => {
    const tick = this.props.ticksConfig.minor[columnIndex];

    return (
      <div style={{ ...style, ...styles.cell, height: this.props.timeAxisConfig.minor.height }} key={key}>
        {this.props.timeAxisConfig.minor.renderer(tick)}
      </div>
    )
  }

  _getMajorColumnWidth = ({ index }) => {
    return this.props.ticksConfig.major[index].width;
  }

  render() {
    const height = this.props.timeAxisConfig.major.height + this.props.timeAxisConfig.minor.height;
    return (
      <AutoSizer disableHeight>
        {({ width }) => {
          return (
            <div style={{ width: width, height }}>
              <Grid
                autoContainerWidth
                ref={this.majorGrid}
                style={styles.axis}
                scrollLeft={this.props.scrollLeft}
                cellRenderer={this._renderMajorCell}
                columnCount={this.props.ticksConfig.major.length}
                columnWidth={this._getMajorColumnWidth}
                height={this.props.timeAxisConfig.major.height}
                rowCount={1}
                rowHeight={this.props.timeAxisConfig.major.height}
                width={width}
              />
              <Grid
                autoContainerWidth
                ref={this.minorGrid}
                style={styles.axis}
                scrollLeft={this.props.scrollLeft}
                cellRenderer={this._renderMinorCell}
                columnCount={this.props.ticksConfig.minor.length}
                columnWidth={this.props.timeAxisConfig.minor.width}
                height={this.props.timeAxisConfig.minor.height}
                rowCount={1}
                rowHeight={this.props.timeAxisConfig.minor.height}
                width={width}
              />
            </div>
          )
        }}
      </AutoSizer>
    )
  }
}

export default TimeHeader;