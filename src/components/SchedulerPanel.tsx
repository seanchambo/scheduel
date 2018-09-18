import * as React from 'react';
import { ScrollSync } from 'react-virtualized';

import { Assignment, Resource, Event, ViewConfig } from '../../index';
import ResourceStream from './ResourceStream';
import ViewDataProvider from './ViewDataProvider';
import DragContextProvider from './DragContextProvider';
import TimeHeader from './TimeHeader';
import ResourceTimeStream from './ResourceTimeStream';

interface SchedulerPanelProps {
  assignments: Assignment[],
  resources: Resource[],
  events: Event[],
  viewConfig: ViewConfig;
}

const styles = {
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  timeline: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  resourceStream: {
    overflowY: 'scroll' as 'scroll',
  },
  timeHeaderStyle: {
    overflow: 'hidden' as 'hidden',
  }
}

class SchedulerPanel extends React.PureComponent<SchedulerPanelProps> {
  timeHeader: React.RefObject<HTMLDivElement>
  resourcesTimeStream: React.RefObject<HTMLDivElement>
  resourcesStream: React.RefObject<ResourceStream>

  constructor(props) {
    super(props);

    this.timeHeader = React.createRef();
    this.resourcesTimeStream = React.createRef();
    this.resourcesStream = React.createRef();
  }

  componentDidMount() {
    const { timeHeader, resourcesStream } = this;
    this.resourcesTimeStream.current.addEventListener('scroll', function () {
      timeHeader.current.scrollLeft = this.scrollLeft;
      resourcesStream.current.resourcesBody.current.scrollTop = this.scrollTop;
    });
  }

  render() {
    const { resources, events, assignments, viewConfig } = this.props;

    return (
      <ScrollSync>
        {(scrollContext) => (
          <ViewDataProvider viewConfig={viewConfig} resources={resources} events={events} assignments={assignments}>
            {({ start, end, ticksConfig, resourceElements, resourceAssignments }) => {
              if (!start) return null;

              return (
                <DragContextProvider resources={resources} events={events} assignments={assignments}>
                  {(dragContext) => {
                    const timelineStyle = { ...styles.timeline, maxWidth: `calc(100% - ${viewConfig.resourceAxis.width}px)` };
                    const resourceStreamStyle = {
                      ...styles.resourceStream,
                      height: `calc(100% - ${viewConfig.timeAxis.major.height}px - ${viewConfig.timeAxis.minor.height}px)`,
                    }
                    const timeHeaderStyle = {
                      ...styles.timeHeaderStyle,
                      height: viewConfig.timeAxis.major.height + viewConfig.timeAxis.minor.height,
                    }

                    return (
                      <div style={styles.root}>
                        <ResourceStream
                          ref={this.resourcesStream}
                          scrollContext={scrollContext}
                          resources={resources}
                          viewConfig={viewConfig}
                          dragContext={dragContext}
                          resourceElements={resourceElements}
                          resourceAssignments={resourceAssignments} />
                        <div style={timelineStyle}>
                          <div style={timeHeaderStyle} ref={this.timeHeader}>
                            <TimeHeader
                              ticksConfig={ticksConfig}
                              timeAxisConfig={viewConfig.timeAxis} />
                          </div>
                          <div style={resourceStreamStyle} ref={this.resourcesTimeStream}>
                            <ResourceTimeStream
                              {...this.props}
                              scrollContext={scrollContext}
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
                </DragContextProvider>
              )
            }}
          </ViewDataProvider>
        )}
      </ScrollSync>
    );
  }
}

export default SchedulerPanel;