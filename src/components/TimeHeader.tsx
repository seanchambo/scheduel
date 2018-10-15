import * as React from 'react';
import { Grid } from 'react-virtualized/dist/commonjs/Grid';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');

import { AxesConfig, Ticks, LineElement, FeaturesConfig } from '../../index.d';

const styles = {
  root: {
    position: 'relative' as 'relative',
  },
  cell: {
    display: 'flex',
  },
  axis: {
    overflowX: 'hidden' as 'hidden',
  },
  lines: {
    root: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
    },
    wrapper: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
    },
    line: {
      position: 'absolute' as 'absolute',
      bottom: 0,
      display: 'flex',
    }
  }
}

interface TimeHeaderProps {
  axesConfig: AxesConfig
  ticks: Ticks;
  lineElements: LineElement[];
  featuresConfig: FeaturesConfig;
  scrollLeft: number;
}

class TimeHeader extends React.PureComponent<TimeHeaderProps> {
  minorGrid: React.RefObject<Grid> = React.createRef();
  majorGrid: React.RefObject<Grid> = React.createRef();
  linesRoot: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidUpdate(prevProps: TimeHeaderProps) {
    if (this.props.ticks !== prevProps.ticks) {
      this.majorGrid.current.recomputeGridSize();
      this.minorGrid.current.recomputeGridSize();
    }
    if (this.props.scrollLeft !== prevProps.scrollLeft) {
      this.linesRoot.current.scrollLeft = this.props.scrollLeft;
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
    const maxWidth = this.props.axesConfig.time.ticks.minor.width * this.props.ticks.minor.length + scrollbarSize();

    return (
      <AutoSizer disableHeight>
        {({ width }) => {
          const actualWidth = maxWidth < width ? maxWidth : width;

          return (
            <div style={{ ...styles.root, width: actualWidth, height }}>
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
              <div ref={this.linesRoot} style={{ ...styles.lines.root, width: actualWidth, height }}>
                <div style={{ ...styles.lines.wrapper, width: maxWidth, height }}>
                  {this.props.lineElements.map(element =>
                    <div key={element.line.id} style={{ ...styles.lines.line, left: element.x - this.props.featuresConfig.lines.header.width / 2, width: this.props.featuresConfig.lines.header.width }}>
                      {this.props.featuresConfig.lines.header.renderer(element.line)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }}
      </AutoSizer>
    )
  }
}

export default TimeHeader;