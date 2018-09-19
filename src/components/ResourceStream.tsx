import * as React from 'react';
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized';

import { Resource, ViewConfig, DragContext, ResourceElement, ResourceAssignmentMap } from '../models';

interface ResourceStreamProps {
  resources: Resource[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  resourceElements: ResourceElement[];
  resourceAssignments: ResourceAssignmentMap;
  scrollTop: number;
};

const styles = {
  root: {
    flexDirection: 'column' as 'column',
    display: 'flex',
    height: '100%'
  },
  body: {
    flex: '1',
  },
  bodyGrid: {
    overflowY: 'hidden' as 'hidden',
  },
  cell: {
    display: 'flex',
  }
}

class ResourceStream extends React.PureComponent<ResourceStreamProps> {
  grid: React.RefObject<Grid>

  constructor(props) {
    super(props);

    this.grid = React.createRef();
  }

  componentDidUpdate(prevProps: ResourceStreamProps) {
    if (this.props.resourceElements !== prevProps.resourceElements) {
      this.grid.current.recomputeGridSize();
    }

    if (this.props.dragContext !== prevProps.dragContext) {
      this.grid.current.forceUpdate()
    }
  }

  _renderHeaderCell = ({ columnIndex, style, key }) => {
    return (
      <div style={{ ...style, ...styles.cell }} key={key}>
        {this.props.viewConfig.resourceAxis.columns[columnIndex].header.renderer()}
      </div>
    )
  }

  _renderResourceCell = ({ rowIndex, columnIndex, style, key }) => {
    const resource = this.props.resources[rowIndex];
    const column = this.props.viewConfig.resourceAxis.columns[columnIndex];
    const isOver = this.props.dragContext.hoveredResource === resource;
    const wasOriginal = this.props.dragContext.originalResource === resource;

    return (
      <div style={{ ...style, ...styles.cell }} key={key}>
        {column.renderer(resource, isOver, wasOriginal)}
      </div>
    )
  }

  _getColumnWidth = ({ index }) => {
    return this.props.viewConfig.resourceAxis.columns[index].width;
  }

  _getResourceHeight = ({ index }) => {
    return this.props.resourceElements[index].pixels;
  }

  render() {
    const headerHeight = this.props.viewConfig.timeAxis.major.height + this.props.viewConfig.timeAxis.minor.height;

    return (
      <ScrollSync>
        {({ onScroll, scrollLeft }) => {
          return (
            <div style={{ ...styles.root, width: this.props.viewConfig.resourceAxis.width }}>
              <div style={{ height: headerHeight, width: this.props.viewConfig.resourceAxis.width }}>
                <Grid
                  scrollLeft={scrollLeft}
                  cellRenderer={this._renderHeaderCell}
                  columnCount={this.props.viewConfig.resourceAxis.columns.length}
                  columnWidth={this._getColumnWidth}
                  overscanColumnCount={10}
                  height={headerHeight}
                  rowCount={1}
                  rowHeight={headerHeight}
                  width={this.props.viewConfig.resourceAxis.width}
                />
              </div>
              <div style={{ ...styles.body, width: this.props.viewConfig.resourceAxis.width }}>
                <AutoSizer disableWidth>
                  {({ height }) => {
                    return (
                      <Grid
                        autoContainerWidth
                        ref={this.grid}
                        style={styles.bodyGrid}
                        scrollTop={this.props.scrollTop}
                        onScroll={onScroll}
                        cellRenderer={this._renderResourceCell}
                        columnCount={this.props.viewConfig.resourceAxis.columns.length}
                        columnWidth={this._getColumnWidth}
                        overscanColumnCount={10}
                        overscanRowCount={10}
                        height={height}
                        rowCount={this.props.resources.length}
                        rowHeight={this._getResourceHeight}
                        width={this.props.viewConfig.resourceAxis.width}
                      />
                    )
                  }}
                </AutoSizer>
              </div>
            </div>
          )
        }
        }
      </ScrollSync >
    )
  }
}

export default ResourceStream;