import * as React from 'react';
import { Grid, OnScrollCallback } from 'react-virtualized';

import { Ticks, ResourceElement, AxesConfig, ResourceAssignmentMap, DragDropConfig, DragContext, AssignmentRenderer, Resource, ResourceZoneMap, FeaturesConfig, LineElement, ResizeRenderer } from '../../index.d';

import ResourceTimeline from './ResourceTimeline';
import AssignmentElement from './AssignmentElement';
import ResourceZoneElement from './ResourceZoneElement';

interface AssignmentGridProps {
  ticks: Ticks;
  axesConfig: AxesConfig;
  resourceElements: ResourceElement[];
  lineElements: LineElement[];
  resources: Resource[];
  resourceAssignments: ResourceAssignmentMap;
  resourceZones: ResourceZoneMap;
  dragDropConfig: DragDropConfig;
  dragContext: DragContext;
  assignmentRenderer: AssignmentRenderer;
  resizeRenderer: ResizeRenderer;
  feautresConfig: FeaturesConfig;
  onScroll: OnScrollCallback;
  width: number;
  height: number;
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

    const assignmentElements = assignments.map(element =>
      <AssignmentElement
        key={`assignment-${element.assignment.id}`}
        element={element}
        ticks={this.props.ticks}
        resource={resource}
        assignmentRenderer={this.props.assignmentRenderer}
        resizeRenderer={this.props.resizeRenderer}
        dragDropConfig={this.props.dragDropConfig}
        dragContext={this.props.dragContext}
        axesConfig={this.props.axesConfig} />
    );

    if (this.props.feautresConfig.resourceZones.renderer) {
      zoneElements = zones.map(zone =>
        <ResourceZoneElement
          key={`zone-${zone.resourceZone.id}`}
          element={zone}
          resource={resource}
          height={height}
          renderer={this.props.feautresConfig.resourceZones.renderer} />
      )
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
    return (
      <Grid
        ref={this.grid}
        onScroll={this.props.onScroll}
        columnCount={1}
        columnWidth={this._getColumnWidth}
        height={this.props.height}
        width={this.props.width}
        overscanRowCount={10}
        cellRenderer={this._renderRow}
        rowHeight={this._getRowHeight}
        rowCount={this.props.resources.length} />
    )
  }
}

export default AssignmentGrid;
