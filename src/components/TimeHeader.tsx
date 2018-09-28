import * as React from 'react';
import { Grid } from 'react-virtualized/dist/commonjs/Grid';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');


import { TicksConfig, TimeAxisConfig } from '../models';

const styles = {
  cell: {
    display: 'flex',
  },
  axis: {
    overflowX: 'hidden' as 'hidden',
  },
}

interface TimeHeaderProps {
  ticksConfig: TicksConfig
  timeAxisConfig: TimeAxisConfig;
  scrollLeft: number;
}

class TimeHeader extends React.PureComponent<TimeHeaderProps> {
  minorGrid: React.RefObject<Grid> = React.createRef()
  majorGrid: React.RefObject<Grid> = React.createRef()

  componentDidUpdate(prevProps: TimeHeaderProps) {
    if (this.props.ticksConfig !== prevProps.ticksConfig) {
      this.majorGrid.current.recomputeGridSize();
      this.minorGrid.current.recomputeGridSize();
    }
  }

  _renderMajorCell = ({ columnIndex, key, style }) => {
    const tick = this.props.ticksConfig.major[columnIndex];

    if (columnIndex === this.props.ticksConfig.major.length) {
      return <div style={style} key={key} />
    }

    return (
      <div style={{ ...style, ...styles.cell, height: this.props.timeAxisConfig.major.height }} key={key}>
        {this.props.timeAxisConfig.major.renderer(tick)}
      </div>
    )
  }

  _renderMinorCell = ({ columnIndex, key, style }) => {
    const tick = this.props.ticksConfig.minor[columnIndex];

    if (columnIndex === this.props.ticksConfig.minor.length) {
      return <div style={style} key={key} />
    }

    return (
      <div style={{ ...style, ...styles.cell, height: this.props.timeAxisConfig.minor.height }} key={key}>
        {this.props.timeAxisConfig.minor.renderer(tick)}
      </div>
    )
  }

  _getMajorColumnWidth = ({ index }) => {
    if (index === this.props.ticksConfig.major.length) { return scrollbarSize(); }
    return this.props.ticksConfig.major[index].width;
  }

  _getMinorColumnWidth = ({ index }) => {
    if (index === this.props.ticksConfig.minor.length) { return scrollbarSize(); }
    return this.props.ticksConfig.minor[index].width;
  }

  render() {
    const height = this.props.timeAxisConfig.major.height + this.props.timeAxisConfig.minor.height;
    const maxWidth = this.props.timeAxisConfig.minor.width * this.props.ticksConfig.minor.length;
    return (
      <AutoSizer disableHeight>
        {({ width }) => {
          const actualWidth = maxWidth < width ? maxWidth : width;

          return (
            <div style={{ width: actualWidth, height }}>
              <Grid
                ref={this.majorGrid}
                style={{ ...styles.axis }}
                scrollLeft={this.props.scrollLeft}
                cellRenderer={this._renderMajorCell}
                columnCount={this.props.ticksConfig.major.length + 1}
                columnWidth={this._getMajorColumnWidth}
                height={this.props.timeAxisConfig.major.height}
                overscanColumnCount={10}
                rowCount={1}
                rowHeight={this.props.timeAxisConfig.major.height}
                width={actualWidth}
              />
              <Grid
                ref={this.minorGrid}
                style={{ ...styles.axis }}
                scrollLeft={this.props.scrollLeft}
                cellRenderer={this._renderMinorCell}
                columnCount={this.props.ticksConfig.minor.length + 1}
                columnWidth={this._getMinorColumnWidth}
                overscanColumnCount={10}
                height={this.props.timeAxisConfig.minor.height}
                rowCount={1}
                rowHeight={this.props.timeAxisConfig.minor.height}
                width={actualWidth}
              />
            </div>
          )
        }}
      </AutoSizer>
    )
  }
}

export default TimeHeader;