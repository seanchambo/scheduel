import * as React from 'react';

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
  },
  timeline: {
    overflowX: 'scroll' as 'scroll',
  }
}

class SchedulerPanel extends React.PureComponent<SchedulerPanelProps> {
  render() {
    const { resources, events, assignments, viewConfig } = this.props;

    return (
      <ViewDataProvider viewConfig={viewConfig} resources={resources} events={events} assignments={assignments}>
        {({ start, end, ticksConfig, resourceElements, resourceHeights }) => {
          if (!start) return null;

          return (
            <DragContextProvider resources={resources} events={events} assignments={assignments}>
              {(dragContext) => {
                return (
                  <div style={styles.root}>
                    <ResourceStream
                      resources={resources}
                      viewConfig={viewConfig}
                      dragContext={dragContext}
                      resourceElements={resourceElements}
                      resourceHeights={resourceHeights} />
                    <div style={styles.timeline}>
                      <TimeHeader
                        ticksConfig={ticksConfig}
                        timeAxisConfig={viewConfig.timeAxis} />
                      <ResourceTimeStream
                        {...this.props}
                        start={start}
                        end={end}
                        resourceHeights={resourceHeights}
                        resourceElements={resourceElements}
                        ticksConfig={ticksConfig}
                        dragContext={dragContext} />
                    </div>
                  </div>
                )
              }}
            </DragContextProvider>
          )
        }}
      </ViewDataProvider>
    );
  }
}

export default SchedulerPanel;