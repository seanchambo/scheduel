import * as React from 'react';
import { AutoSizer, Grid, OnScrollCallback } from 'react-virtualized';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');

import { Ticks, ResourceElement, AxesConfig, ResourceAssignmentMap, DragDropConfig, DragContext, AssignmentRenderer, Resource, ResourceZoneMap, FeaturesConfig } from '../../index.d';

import ResourceTimeline from './ResourceTimeline';
import AssignmentElement from './AssignmentElement';
import ResourceZoneElement from './ResourceZoneElement';

interface AssignmentGridProps {
  ticks: Ticks;
  axesConfig: AxesConfig;
  resourceElements: ResourceElement[];
  resources: Resource[];
  resourceAssignments: ResourceAssignmentMap;
  resourceZones: ResourceZoneMap;
  dragDropConfig: DragDropConfig;
  dragContext: DragContext;
  assignmentRenderer: AssignmentRenderer;
  feautresConfig: FeaturesConfig;
  onScroll: OnScrollCallback;
}

const styles = {
  resourceTimeline: {
    inner: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  },
  timeTick: {
    position: 'absolute' as 'absolute',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  resourceTick: {
    position: 'absolute' as 'absolute',
    width: '100%',
    display: 'flex',
  }
};

class AssignmentGrid extends React.Component<AssignmentGridProps> {
  grid: React.RefObject<Grid> = React.createRef();

  _getColumnWidth = () => this.props.ticks.minor.length * this.props.axesConfig.time.ticks.minor.width;

  _getRowHeight = ({ index }) => this.props.resourceElements[index].pixels

  _renderRow = ({ rowIndex, key, style }) => {
    const resource = this.props.resources[rowIndex];
    const height = this.props.resourceElements[rowIndex].pixels;
    const assignments = this.props.resourceAssignments.get(resource);
    const zones = this.props.resourceZones.get(resource);

    let zoneElements: React.ReactNode[];
    let minorTicks: React.ReactNode[];
    let majorTicks: React.ReactNode[];
    let resourceTick: React.ReactNode;

    const assignmentElements = assignments.map(element =>
      <AssignmentElement
        key={element.assignment.id}
        element={element}
        ticks={this.props.ticks}
        resource={resource}
        assignmentRenderer={this.props.assignmentRenderer}
        dragDropConfig={this.props.dragDropConfig}
        dragContext={this.props.dragContext}
        axesConfig={this.props.axesConfig} />
    );

    if (this.props.feautresConfig.resourceZones.renderer) {
      zoneElements = zones.map(zone =>
        <ResourceZoneElement
          element={zone}
          resource={resource}
          height={height}
          renderer={this.props.feautresConfig.resourceZones.renderer} />
      )
    }

    if (this.props.axesConfig.time.ticks.major.tickRenderer) {
      let left: number = 0;

      majorTicks = this.props.ticks.major.map(tick => {
        left += tick.width;
        if (!tick.show) { return null; }

        return (
          <div style={{ ...styles.timeTick, left }} key={`${tick.startTime.getTime()}-major-tick`}>
            {this.props.axesConfig.time.ticks.major.tickRenderer(tick)}
          </div>
        )
      });
    }

    if (this.props.axesConfig.time.ticks.minor.tickRenderer) {
      let left: number = 0;

      minorTicks = this.props.ticks.minor.map(tick => {
        left += tick.width;
        if (!tick.show) { return null; }

        return (
          <div style={{ ...styles.timeTick, left }} key={`${tick.startTime.getTime()}-minor-tick`}>
            {this.props.axesConfig.time.ticks.minor.tickRenderer(tick)}
          </div>
        )
      });
    }

    if (this.props.axesConfig.resource.tickRenderer) {
      resourceTick = <div style={{ ...styles.resourceTick, bottom: 0 }}>
        {this.props.axesConfig.resource.tickRenderer(resource)}
      </div>
    }

    return (
      <div key={key} style={style}>
        <ResourceTimeline
          grid={this.grid.current}
          resource={resource}
          dragDropConfig={this.props.dragDropConfig}
          ticks={this.props.ticks}
          axesConfig={this.props.axesConfig}
          dragContext={this.props.dragContext}>
          <div style={styles.resourceTimeline.inner}>
            {majorTicks}
            {minorTicks}
            {resourceTick}
          </div>
          <div style={styles.resourceTimeline.inner}>
            {zoneElements}
          </div>
          <div style={styles.resourceTimeline.inner}>
            {assignmentElements}
          </div>
        </ResourceTimeline>
      </div>
    )
  }

  componentDidUpdate(prevProps: AssignmentGridProps) {
    if (this.props.resourceElements !== prevProps.resourceElements) {
      this.grid.current.measureAllCells();
      this.grid.current.recomputeGridSize();
    }
  }

  render() {
    const maxWidth = this.props.axesConfig.time.ticks.minor.width * this.props.ticks.minor.length + scrollbarSize();
    const maxHeight = this.props.resourceElements.reduce((acc, element) => acc + element.pixels, 0) + scrollbarSize();

    return (
      <AutoSizer>
        {({ width, height }) => {
          const actualWidth = maxWidth < width ? maxWidth : width;
          const actualHeight = maxHeight < height ? maxHeight : height;

          return (
            <Grid
              ref={this.grid}
              onScroll={this.props.onScroll}
              columnCount={1}
              columnWidth={this._getColumnWidth}
              height={actualHeight}
              width={actualWidth}
              overscanRowCount={10}
              cellRenderer={this._renderRow}
              rowHeight={this._getRowHeight}
              rowCount={this.props.resources.length} />
          )
        }}
      </AutoSizer>
    );
  }
}

export default AssignmentGrid;
