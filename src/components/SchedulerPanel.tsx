import * as React from 'react';
import { ScrollSync } from 'react-virtualized/dist/commonjs/ScrollSync';
import { AutoSizer } from 'react-virtualized';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');

import { Assignment, Resource, Event, AssignmentRenderer, FeaturesConfig, AxesConfig, ExternalDragDropConfig, ResizeRenderer } from '../../index.d';

import ResourceStream from './ResourceStream';
import ViewDataProvider from './ViewDataProvider';
import DragContextProvider from './DragContextProvider';
import TimeHeader from './TimeHeader';
import DragPreview from './DragPreview';
import AssignmentGrid from './AssignmentGrid';
import LinesStream from './LinesStream';
import LineHeader from './LineHeader';

interface SchedulerPanelProps {
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  axes: AxesConfig;
  assignmentRenderer: AssignmentRenderer;
  resizeRenderer: ResizeRenderer;
  features: FeaturesConfig;
}

const styles = {
  root: {
    position: 'relative' as 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  timeline: {
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  timelineBody: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as 'column',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
  },
  timeHeader: {
    overflow: 'hidden' as 'hidden',
  },
}

class SchedulerPanel extends React.PureComponent<SchedulerPanelProps> {
  assignmentGrid: React.RefObject<AssignmentGrid> = React.createRef();
  viewDataProvider: React.RefObject<ViewDataProvider> = React.createRef();
  dragContextProvider: React.RefObject<DragContextProvider> = React.createRef();

  componentDidUpdate(prevProps: SchedulerPanelProps) {
    if (
      this.props.features.dragDrop.external !== prevProps.features.dragDrop.external ||
      (this.props.features.dragDrop.external as ExternalDragDropConfig).context !== (prevProps.features.dragDrop.external as ExternalDragDropConfig).context
    ) {
      this.viewDataProvider.current.forceUpdate();
      this.dragContextProvider.current.forceUpdate();
    }
  }

  render() {
    const { resources, events, assignments, axes, features, assignmentRenderer, resizeRenderer } = this.props;

    return (
      <ViewDataProvider ref={this.viewDataProvider} featuresConfig={features} axesConfig={axes} resources={resources} events={events} assignments={assignments}>
        {({ start, end, ticks, resourceElements, resourceAssignments, resourceZones, lineElements }) => {
          const maxWidth = axes.time.ticks.minor.width * ticks.minor.length + scrollbarSize();
          const maxHeight = resourceElements.reduce((acc, element) => acc + element.pixels, 0) + scrollbarSize();

          return (
            <DragContextProvider ref={this.dragContextProvider} config={features.dragDrop}>
              {(dragContext) => {
                return (
                  <ScrollSync>
                    {({ onScroll, scrollLeft, scrollTop }) => {
                      return (
                        <div style={styles.root}>
                          <DragPreview
                            dragDropConfig={features.dragDrop}
                            resourceElements={resourceElements}
                            assignmentGrid={this.assignmentGrid}
                            dragContext={dragContext}
                            axesConfig={axes}
                            featuresConfig={features}
                            ticks={ticks}
                            start={start}
                            end={end} />
                          <ResourceStream
                            scrollTop={scrollTop}
                            resources={resources}
                            axesConfig={axes}
                            dragDropConfig={features.dragDrop}
                            dragContext={dragContext}
                            resourceElements={resourceElements}
                            resourceAssignments={resourceAssignments} />
                          <div style={styles.timeline}>
                            <AutoSizer>
                              {({ width, height }) => {
                                const actualWidth = maxWidth < width ? maxWidth : width;
                                const headerHeight = axes.time.ticks.major.rowHeight + axes.time.ticks.minor.rowHeight;
                                height -= headerHeight;
                                const actualHeight = maxHeight < height ? maxHeight : height;

                                return (
                                  <div style={{ height: height + headerHeight, width }}>
                                    <div style={{ ...styles.timeHeader, height: headerHeight, width: actualWidth }}>
                                      <TimeHeader
                                        height={headerHeight}
                                        scrollLeft={scrollLeft}
                                        width={actualWidth}
                                        innerWidth={maxWidth}
                                        ticks={ticks}
                                        axesConfig={axes} />
                                      <LineHeader
                                        assignmentGrid={this.assignmentGrid}
                                        scrollLeft={scrollLeft}
                                        width={actualWidth}
                                        innerWidth={maxWidth}
                                        height={headerHeight}
                                        lineElements={lineElements}
                                        ticks={ticks}
                                        axesConfig={axes}
                                        featuresConfig={features} />
                                    </div>
                                    <div style={{ ...styles.timelineBody, height }}>
                                      <LinesStream
                                        width={actualWidth}
                                        height={actualHeight}
                                        innerWidth={maxWidth}
                                        innerHeight={maxHeight}
                                        scrollLeft={scrollLeft}
                                        scrollTop={scrollTop}
                                        ticks={ticks}
                                        axesConfig={axes}
                                        featuresConfig={features}
                                        lineElements={lineElements}
                                        resourceElements={resourceElements} />
                                      <AssignmentGrid
                                        ref={this.assignmentGrid}
                                        width={actualWidth}
                                        height={actualHeight}
                                        ticks={ticks}
                                        axesConfig={axes}
                                        feautresConfig={features}
                                        resourceElements={resourceElements}
                                        lineElements={lineElements}
                                        resourceZones={resourceZones}
                                        resources={resources}
                                        onScroll={onScroll}
                                        assignmentRenderer={assignmentRenderer}
                                        resizeRenderer={resizeRenderer}
                                        dragContext={dragContext}
                                        dragDropConfig={features.dragDrop}
                                        resourceAssignments={resourceAssignments} />
                                    </div>
                                  </div>
                                )
                              }}
                            </AutoSizer>
                          </div>
                        </div>
                      )
                    }}
                  </ScrollSync>
                )
              }}
            </DragContextProvider>
          )
        }}
      </ViewDataProvider>
    )
  }
}

export default SchedulerPanel;
