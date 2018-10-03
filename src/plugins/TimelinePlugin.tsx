import * as React from 'react';
import { Resource, TicksConfig, Assignment, Event, ViewConfig, DragContext, ExternalDragContext, ResourceAssignmentMap, ResourceElement, TimelinePluginComponent, ListenersConfig, DragDropConfig } from "../models";
import { AutoSizer, Grid, OnScrollCallback, Index } from 'react-virtualized';
import { BasePlugin } from './BasePlugin';

export interface TimelineComponentProps {
  ticksConfig: TicksConfig;
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  dragDropConfig: DragDropConfig;
  listeners: ListenersConfig;
  externalDragContext: ExternalDragContext;
  resourceAssignments: ResourceAssignmentMap;
  resourceElements: ResourceElement[];
  start: Date;
  end: Date;
  onScroll: OnScrollCallback;
  scrollLeft: number;
  scrollTop: number;
}

abstract class TimelinePlugin<ItemType> extends BasePlugin<TimelineComponentProps> {
  abstract getStyle: (props: TimelineComponentProps) => React.CSSProperties;
  abstract getData: (props: TimelineComponentProps) => Map<Resource, ItemType[]>;
  abstract getColumnCount: (props: TimelineComponentProps) => number;
  abstract getRowCount: (props: TimelineComponentProps) => number;
  abstract getRowHeight: (props: TimelineComponentProps) => (params: Index) => number;
  abstract getColumnWidth: (props: TimelineComponentProps) => (params: Index) => number;
  abstract renderRow: (items: ItemType[], resource: Resource, grid: Grid, props: TimelineComponentProps) => React.ReactNode;
  abstract masterScroll: boolean;
  abstract subscribeScrollLeft: boolean;
  abstract subscribeScrollTop: boolean;

  createComponentClass = () => {
    const plugin = this;

    return class extends React.Component<TimelineComponentProps> implements TimelinePluginComponent {
      grid: React.RefObject<Grid> = React.createRef();

      _renderRow = ({ rowIndex, key, style }) => {
        const resource = this.props.resources[rowIndex];
        const items = plugin.getData(this.props).get(resource);

        if (rowIndex === this.props.resources.length) {
          return <div style={style} key={key} />
        }

        return (
          <div key={key} style={style}>
            {plugin.renderRow(items, resource, this.grid.current, this.props)}
          </div>
        )
      }

      componentDidUpdate(prevProps: TimelineComponentProps) {
        if (this.props.resourceElements !== prevProps.resourceElements) {
          this.grid.current.measureAllCells();
          this.grid.current.recomputeGridSize();
        }
      }

      _getRowHeight = ({ index }) => this.props.resourceElements[index].pixels

      render() {
        const maxWidth = this.props.viewConfig.timeAxis.minor.width * this.props.ticksConfig.minor.length;

        return (
          <AutoSizer>
            {({ width, height }) => {
              const actualWidth = maxWidth < width ? maxWidth : width;

              return (
                <Grid
                  ref={this.grid}
                  style={plugin.getStyle(this.props)}
                  onScroll={plugin.masterScroll ? this.props.onScroll : undefined}
                  scrollLeft={plugin.subscribeScrollLeft ? this.props.scrollLeft : undefined}
                  scrollTop={plugin.subscribeScrollTop ? this.props.scrollTop : undefined}
                  columnCount={plugin.getColumnCount(this.props)}
                  columnWidth={plugin.getColumnWidth(this.props)}
                  height={height}
                  width={actualWidth}
                  overscanRowCount={10}
                  cellRenderer={this._renderRow}
                  rowHeight={plugin.getRowHeight(this.props)}
                  rowCount={plugin.getRowCount(this.props)} />
              )
            }}
          </AutoSizer>
        );
      }
    }
  }
}

export default TimelinePlugin;