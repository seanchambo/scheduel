import * as React from 'react';
import { Grid } from 'react-virtualized/dist/commonjs/Grid';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');


import { AxesConfig, Ticks } from '../../index.d';

const styles = {
  cell: {
    display: 'flex',
  },
  axis: {
    overflowX: 'hidden' as 'hidden',
  },
}

interface TimeHeaderProps {
  axesConfig: AxesConfig
  ticks: Ticks;
  scrollLeft: number;
}

class TimeHeader extends React.PureComponent<TimeHeaderProps> {
  minorGrid: React.RefObject<Grid> = React.createRef()
  majorGrid: React.RefObject<Grid> = React.createRef()

  componentDidUpdate(prevProps: TimeHeaderProps) {
    if (this.props.ticks !== prevProps.ticks) {
      this.majorGrid.current.recomputeGridSize();
      this.minorGrid.current.recomputeGridSize();
    }
  }

  _renderMajorCell = ({ columnIndex, key, style }) => {
    const tick = this.props.ticks.major[columnIndex];

    if (columnIndex === this.props.ticks.major.length) {
      return <div style={style} key={key} />
    }

    return (
      <div style={{ ...style, ...styles.cell, height: this.props.axesConfig.time.ticks.major.rowHeight }} key={key}>
        {this.props.axesConfig.time.ticks.major.labelRenderer(tick)}
      </div>
    )
  }

  _renderMinorCell = ({ columnIndex, key, style }) => {
    const tick = this.props.ticks.minor[columnIndex];

    if (columnIndex === this.props.ticks.minor.length) {
      return <div style={style} key={key} />
    }

    return (
      <div style={{ ...style, ...styles.cell, height: this.props.axesConfig.time.ticks.minor.rowHeight }} key={key}>
        {this.props.axesConfig.time.ticks.minor.labelRenderer(tick)}
      </div>
    )
  }

  _getMajorColumnWidth = ({ index }) => {
    if (index === this.props.ticks.major.length) { return scrollbarSize(); }
    return this.props.ticks.major[index].width;
  }

  _getMinorColumnWidth = ({ index }) => {
    if (index === this.props.ticks.minor.length) { return scrollbarSize(); }
    return this.props.ticks.minor[index].width;
  }

  render() {
    const height = this.props.axesConfig.time.ticks.major.rowHeight + this.props.axesConfig.time.ticks.minor.rowHeight;
    const maxWidth = this.props.axesConfig.time.ticks.minor.width * this.props.ticks.minor.length;
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
                columnCount={this.props.ticks.major.length + 1}
                columnWidth={this._getMajorColumnWidth}
                height={this.props.axesConfig.time.ticks.major.rowHeight}
                overscanColumnCount={10}
                rowCount={1}
                rowHeight={this.props.axesConfig.time.ticks.major.rowHeight}
                width={actualWidth}
              />
              <Grid
                ref={this.minorGrid}
                style={{ ...styles.axis }}
                scrollLeft={this.props.scrollLeft}
                cellRenderer={this._renderMinorCell}
                columnCount={this.props.ticks.minor.length + 1}
                columnWidth={this._getMinorColumnWidth}
                overscanColumnCount={10}
                height={this.props.axesConfig.time.ticks.minor.rowHeight}
                rowCount={1}
                rowHeight={this.props.axesConfig.time.ticks.minor.rowHeight}
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