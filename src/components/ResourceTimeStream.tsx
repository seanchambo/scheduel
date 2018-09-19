import * as React from 'react';
import { Grid, AutoSizer, OnScrollCallback, defaultCellRangeRenderer } from 'react-virtualized';

import { ViewConfig, TicksConfig, Assignment, Resource, Event, DragContext, ResourceAssignmentMap, ResourceElement } from '../models';

import ResourceTimeline from './ResourceTimeline';
import TickStream from './TickStream';

interface ResourceTimelineStreamProps {
  ticksConfig: TicksConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  resourceAssignments: ResourceAssignmentMap;
  resourceElements: ResourceElement[];
  start: Date;
  end: Date;
  onScroll: OnScrollCallback;
}

class ResourceTimelineStream extends React.Component<ResourceTimelineStreamProps> {
  grid: React.RefObject<Grid>

  constructor(props) {
    super(props)

    this.grid = React.createRef();
  }

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
  }

  _addTicks = (props) => {
    console.log(props)
    const children = defaultCellRangeRenderer(props);
    children.push(
      <TickStream
        ticksConfig={this.props.ticksConfig}
        viewConfig={this.props.viewConfig}
        resourceElements={this.props.resourceElements}
      />);
    return children;
  }

  _renderRow = ({ rowIndex, key, style }) => {
    const resource = this.props.resources[rowIndex];
    const assignments = this.props.resourceAssignments.get(resource);
    const height = this.props.resourceElements[rowIndex];

    return (
      <div key={key} style={style}>
        <ResourceTimeline
          height={height}
          resource={resource}
          assignments={assignments}
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

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Grid
            ref={this.grid}
            onScroll={this.props.onScroll}
            columnCount={1}
            columnWidth={this.props.ticksConfig.minor.length * this.props.viewConfig.timeAxis.minor.width}
            height={height}
            width={width}
            cellRenderer={this._renderRow}
            rowHeight={this._getRowHeight}
            rowCount={resources.length}>
            <div id="test"></div>
          </Grid>
        )}
      </AutoSizer>
    );
  }
}

export default ResourceTimelineStream;