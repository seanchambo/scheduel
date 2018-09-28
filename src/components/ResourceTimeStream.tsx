import * as React from 'react';
import { OnScrollCallback } from 'react-virtualized';
import { Grid } from 'react-virtualized/dist/commonjs/Grid';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, DragContext, ResourceAssignmentMap, ResourceElement, ExternalDragContext } from '../models';

import ResourceTimeline from './ResourceTimeline';
import TickStream from './TickStream';

interface ResourceTimelineStreamProps {
  ticksConfig: TicksConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  externalDragContext: ExternalDragContext;
  resourceAssignments: ResourceAssignmentMap;
  resourceElements: ResourceElement[];
  start: Date;
  end: Date;
  onScroll: OnScrollCallback;
  scrollLeft: number;
  scrollTop: number;
}

class ResourceTimelineStream extends React.Component<ResourceTimelineStreamProps> {
  grid: React.RefObject<Grid> = React.createRef()
  tickStreamContainer: React.RefObject<HTMLDivElement> = React.createRef()

  shouldComponentUpdate(nextProps: ResourceTimelineStreamProps) {
    if (this.props.ticksConfig !== nextProps.ticksConfig) return true;
    if (this.props.assignments !== nextProps.assignments) return true;
    if (this.props.resources !== nextProps.resources) return true;
    if (this.props.events !== nextProps.events) return true;
    if (this.props.viewConfig !== nextProps.viewConfig) return true;
    if (this.props.resourceAssignments !== nextProps.resourceAssignments) return true;
    if (this.props.resourceElements !== nextProps.resourceElements) return true;
    if (this.props.start !== nextProps.start) return true;
    if (this.props.end !== nextProps.end) return true
    if (this.props.scrollLeft !== nextProps.scrollLeft) return true;
    if (this.props.scrollTop !== nextProps.scrollTop) return true;
    return false;
  }

  componentDidMount() {
    this.grid.current.measureAllCells();
  }

  componentDidUpdate(prevProps: ResourceTimelineStreamProps) {
    if (this.props.resourceElements !== prevProps.resourceElements) {
      this.grid.current.measureAllCells();
      this.grid.current.recomputeGridSize();
    }

    if (this.props.scrollLeft !== prevProps.scrollLeft) {
      this.tickStreamContainer.current.scrollLeft = this.props.scrollLeft;
    }

    if (this.props.scrollTop !== prevProps.scrollTop) {
      this.tickStreamContainer.current.scrollTop = this.props.scrollTop;
    }
  }

  _renderRow = ({ rowIndex, key, style }) => {
    const resource = this.props.resources[rowIndex];
    const assignments = this.props.resourceAssignments.get(resource);
    const height = this.props.resourceElements[rowIndex];

    return (
      <div key={key} style={{ ...style, overflow: 'hidden' }}>
        <ResourceTimeline
          grid={this.grid}
          height={height}
          resource={resource}
          assignments={assignments}
          externalDragContext={this.props.externalDragContext}
          viewConfig={this.props.viewConfig}
          ticksConfig={this.props.ticksConfig}
          dragContext={this.props.dragContext}
        />
      </div>
    )
  }

  _getRowHeight = ({ index }) => this.props.resourceElements[index].pixels

  render() {
    const { resources } = this.props;
    const maxWidth = this.props.viewConfig.timeAxis.minor.width * this.props.ticksConfig.minor.length;

    return (
      <AutoSizer>
        {({ width, height }) => {
          const actualWidth = maxWidth < width ? maxWidth : width;
          return (
            <React.Fragment>
              <Grid
                ref={this.grid}
                onScroll={this.props.onScroll}
                columnCount={1}
                columnWidth={this.props.ticksConfig.minor.length * this.props.viewConfig.timeAxis.minor.width}
                height={height}
                width={actualWidth}
                overscanRowCount={10}
                cellRenderer={this._renderRow}
                rowHeight={this._getRowHeight}
                rowCount={resources.length} />
              <div ref={this.tickStreamContainer} style={{ width: actualWidth, height, overflow: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
                <TickStream
                  viewConfig={this.props.viewConfig}
                  ticksConfig={this.props.ticksConfig}
                  resourceElements={this.props.resourceElements} />
              </div>
            </React.Fragment>
          )
        }}
      </AutoSizer>
    );
  }
}

export default ResourceTimelineStream;