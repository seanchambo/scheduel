import * as React from 'react';
import { ScrollSync } from 'react-virtualized/dist/commonjs/ScrollSync';

import { Assignment, Resource, Event, ViewConfig, ListenersConfig, ExternalDragContext } from '../models';

import ResourceStream from './ResourceStream';
import ViewDataProvider from './ViewDataProvider';
import DragContextProvider from './DragContextProvider';
import TimeHeader from './TimeHeader';
import DragLayer from './DragLayer';
import ResourceTimeStream from './ResourceTimeStream';

interface SchedulerPanelProps {
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  externalDragContext: ExternalDragContext;
  listeners: ListenersConfig;
}

const styles = {
  root: {
    position: 'relative' as 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  timeline: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  resourceStream: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as 'column',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
  },
  timeHeaderStyle: {
    overflow: 'hidden' as 'hidden',
  },
}

class SchedulerPanel extends React.PureComponent<SchedulerPanelProps> {
  resourceTimeStream: React.RefObject<ResourceTimeStream> = React.createRef();
  viewDataProvider: React.RefObject<ViewDataProvider> = React.createRef();
  dragContextProvider: React.RefObject<DragContextProvider> = React.createRef();

  componentDidUpdate(prevProps: SchedulerPanelProps) {
    if (this.props.externalDragContext !== prevProps.externalDragContext) {
      this.viewDataProvider.current.forceUpdate();
      this.dragContextProvider.current.forceUpdate();
    }
  }

  render() {
    const { resources, events, assignments, viewConfig, listeners, externalDragContext } = this.props;

    return (
      <ViewDataProvider ref={this.viewDataProvider} viewConfig={viewConfig} resources={resources} events={events} assignments={assignments}>
        {({ start, end, ticksConfig, resourceElements, resourceAssignments }) => (
          <DragContextProvider ref={this.dragContextProvider} listeners={listeners}>
            {(dragContext) => {
              const timeHeaderStyle = {
                ...styles.timeHeaderStyle,
                height: viewConfig.timeAxis.major.height + viewConfig.timeAxis.minor.height,
              }

              return (
                <ScrollSync>
                  {({ onScroll, scrollLeft, scrollTop }) => {
                    return (
                      <div style={styles.root}>
                        <DragLayer
                          resourceTimeStream={this.resourceTimeStream}
                          externalDragContext={externalDragContext}
                          dragContext={dragContext}
                          viewConfig={viewConfig}
                          ticksConfig={ticksConfig}
                          start={start}
                          end={end} />
                        <ResourceStream
                          scrollTop={scrollTop}
                          resources={resources}
                          viewConfig={viewConfig}
                          externalDragContext={externalDragContext}
                          dragContext={dragContext}
                          resourceElements={resourceElements}
                          resourceAssignments={resourceAssignments} />
                        <div style={styles.timeline}>
                          <div style={timeHeaderStyle}>
                            <TimeHeader
                              scrollLeft={scrollLeft}
                              ticksConfig={ticksConfig}
                              timeAxisConfig={viewConfig.timeAxis} />
                          </div>
                          <div style={styles.resourceStream}>
                            <ResourceTimeStream
                              {...this.props}
                              ref={this.resourceTimeStream}
                              onScroll={onScroll}
                              scrollLeft={scrollLeft}
                              scrollTop={scrollTop}
                              start={start}
                              end={end}
                              resourceAssignments={resourceAssignments}
                              resourceElements={resourceElements}
                              ticksConfig={ticksConfig}
                              externalDragContext={externalDragContext}
                              dragContext={dragContext} />
                          </div>
                        </div>
                      </div>
                    )
                  }}
                </ScrollSync>
              )
            }}
          </DragContextProvider>
        )}
      </ViewDataProvider>
    )
  }
}

export default SchedulerPanel;