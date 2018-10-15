import * as React from 'react';
import { Grid } from 'react-virtualized/dist/commonjs/Grid';
import { ScrollSync } from 'react-virtualized/dist/commonjs/ScrollSync';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');

import { Resource, AxesConfig, DragContext, ResourceElement, ResourceAssignmentMap, DragDropConfig, ExternalDragDropConfig } from '../../index.d';

interface ResourceStreamProps {
  resources: Resource[];
  axesConfig: AxesConfig;
  dragContext: DragContext;
  dragDropConfig: DragDropConfig;
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
  grid: React.RefObject<Grid> = React.createRef()

  componentDidUpdate(prevProps: ResourceStreamProps) {
    if (this.props.resourceElements !== prevProps.resourceElements) {
      this.grid.current.recomputeGridSize();
    }

    if (this.props.dragContext !== prevProps.dragContext) {
      this.grid.current.forceUpdate();
    }

    if (
      this.props.dragDropConfig.external.enabled !== prevProps.dragDropConfig.external.enabled ||
      (this.props.dragDropConfig.external as ExternalDragDropConfig).context !== (prevProps.dragDropConfig.external as ExternalDragDropConfig).context) {
      this.grid.current.forceUpdate();
    }
  }

  _renderHeaderCell = ({ columnIndex, style, key }) => {
    return (
      <div style={{ ...style, ...styles.cell }} key={key}>
        {this.props.axesConfig.resource.columns[columnIndex].labelRenderer()}
      </div>
    )
  }

  _renderResourceCell = ({ rowIndex, columnIndex, style, key }) => {
    const resource = this.props.resources[rowIndex];
    const column = this.props.axesConfig.resource.columns[columnIndex];
    const isOver = this.props.dragContext.hoveredResource === resource || this.props.dragDropConfig.external.enabled && this.props.dragDropConfig.external.context.hoveredResource === resource;
    const wasOriginal = this.props.dragContext.originalResource === resource;
    const context = { isOver, wasOriginal };

    if (rowIndex === this.props.resources.length) {
      return <div key={key} style={{ ...style, ...styles.cell, height: scrollbarSize() }} />
    }

    return (
      <div style={{ ...style, ...styles.cell }} key={key}>
        {column.rowRenderer(resource, context)}
      </div>
    )
  }

  _getColumnWidth = ({ index }) => {
    return this.props.axesConfig.resource.columns[index].width;
  }

  _getResourceHeight = ({ index }) => {
    if (index === this.props.resources.length) { return scrollbarSize(); }
    return this.props.resourceElements[index].pixels;
  }

  render() {
    const headerHeight = this.props.axesConfig.time.ticks.major.rowHeight + this.props.axesConfig.time.ticks.minor.rowHeight;
    const maxHeight = this.props.resourceElements.reduce((acc, element) => acc + element.pixels, 0) + scrollbarSize();

    return (
      <ScrollSync>
        {({ onScroll, scrollLeft }) => {
          return (
            <div style={{ ...styles.root, width: this.props.axesConfig.resource.width }}>
              <div style={{ height: headerHeight, width: this.props.axesConfig.resource.width }}>
                <Grid
                  scrollLeft={scrollLeft}
                  cellRenderer={this._renderHeaderCell}
                  columnCount={this.props.axesConfig.resource.columns.length}
                  columnWidth={this._getColumnWidth}
                  overscanColumnCount={10}
                  height={headerHeight}
                  rowCount={1}
                  rowHeight={headerHeight}
                  width={this.props.axesConfig.resource.width}
                />
              </div>
              <div style={{ ...styles.body, width: this.props.axesConfig.resource.width }}>
                <AutoSizer disableWidth>
                  {({ height }) => {
                    const actualHeight = maxHeight < height ? maxHeight : height;

                    return (
                      <Grid
                        ref={this.grid}
                        style={styles.bodyGrid}
                        scrollTop={this.props.scrollTop}
                        onScroll={onScroll}
                        cellRenderer={this._renderResourceCell}
                        columnCount={this.props.axesConfig.resource.columns.length}
                        columnWidth={this._getColumnWidth}
                        overscanColumnCount={10}
                        overscanRowCount={10}
                        height={actualHeight}
                        rowCount={this.props.resources.length + 1}
                        rowHeight={this._getResourceHeight}
                        width={this.props.axesConfig.resource.width}
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