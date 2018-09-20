import * as React from 'react';
import { ScrollSync } from 'react-virtualized/dist/commonjs/ScrollSync';

import { Assignment, Resource, Event, ViewConfig, ListenersConfig } from '../models';

import ResourceStream from './ResourceStream';
import ViewDataProvider from './ViewDataProvider';
import DragContextProvider from './DragContextProvider';
import TimeHeader from './TimeHeader';
import ResourceTimeStream from './ResourceTimeStream';
import DragLayer from './DragLayer';

interface SchedulerPanelProps {
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
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
  render() {
    const { resources, events, assignments, viewConfig, listeners } = this.props;

    return (
      <ViewDataProvider viewConfig={viewConfig} resources={resources} events={events} assignments={assignments}>
        {({ start, end, ticksConfig, resourceElements, resourceAssignments }) => (
          <DragContextProvider resources={resources} events={events} assignments={assignments} listeners={listeners}>
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
                          dragContext={dragContext}
                          viewConfig={viewConfig}
                          ticksConfig={ticksConfig}
                          start={start}
                          end={end} />
                        <ResourceStream
                          scrollTop={scrollTop}
                          resources={resources}
                          viewConfig={viewConfig}
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
                              onScroll={onScroll}
                              start={start}
                              end={end}
                              resourceAssignments={resourceAssignments}
                              resourceElements={resourceElements}
                              ticksConfig={ticksConfig}
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