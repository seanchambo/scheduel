import * as React from 'react';
import { ScrollSync } from 'react-virtualized/dist/commonjs/ScrollSync';

import { Assignment, Resource, Event, ViewConfig, ListenersConfig, ExternalDragContext, Plugin, TimelinePluginComponent, DragDropConfig } from '../models';

import ResourceStream from './ResourceStream';
import ViewDataProvider from './ViewDataProvider';
import DragContextProvider from './DragContextProvider';
import TimeHeader from './TimeHeader';
import DragLayer from './DragLayer';
import ResourceAssignmentTimelinePlugin from '../plugins/ResourceAssignmentTimelinePlugin';
import { TimelineComponentProps } from '../plugins/TimelinePlugin';

interface SchedulerPanelProps {
  assignments: Assignment[];
  resources: Resource[];
  events: Event[];
  viewConfig: ViewConfig;
  externalDragContext: ExternalDragContext;
  dragDropConfig: DragDropConfig;
  listeners: ListenersConfig;
  plugins: Plugin[];
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
  resourceTimeStream: React.RefObject<TimelinePluginComponent> = React.createRef();
  viewDataProvider: React.RefObject<ViewDataProvider> = React.createRef();
  dragContextProvider: React.RefObject<DragContextProvider> = React.createRef();
  pluginComponents: React.ComponentClass<TimelineComponentProps>[];
  resourceAssignmentTimelineComponent: React.ComponentClass<TimelineComponentProps>;

  constructor(props: SchedulerPanelProps) {
    super(props);

    const resourceAssignmentTimelinePlugin = new ResourceAssignmentTimelinePlugin();
    this.resourceAssignmentTimelineComponent = resourceAssignmentTimelinePlugin.createComponentClass();
    this.pluginComponents = props.plugins.map(plugin => plugin.createComponentClass());
  }

  componentDidUpdate(prevProps: SchedulerPanelProps) {
    if (this.props.externalDragContext !== prevProps.externalDragContext) {
      this.viewDataProvider.current.forceUpdate();
      this.dragContextProvider.current.forceUpdate();
    }
  }

  render() {
    const { resources, events, assignments, viewConfig, listeners, externalDragContext, dragDropConfig } = this.props;

    return (
      <ViewDataProvider ref={this.viewDataProvider} viewConfig={viewConfig} resources={resources} events={events} assignments={assignments}>
        {({ start, end, ticksConfig, resourceElements, resourceAssignments }) => (
          <DragContextProvider ref={this.dragContextProvider} listeners={listeners}>
            {(dragContext) => {
              const timeHeaderStyle = {
                ...styles.timeHeader,
                height: viewConfig.timeAxis.major.height + viewConfig.timeAxis.minor.height,
              }

              return (
                <ScrollSync>
                  {({ onScroll, scrollLeft, scrollTop }) => {
                    return (
                      <div style={styles.root}>
                        <DragLayer
                          dragDropConfig={dragDropConfig}
                          resourceElements={resourceElements}
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
                          <div style={styles.timelineBody}>
                            <this.resourceAssignmentTimelineComponent
                              ref={this.resourceTimeStream}
                              onScroll={onScroll}
                              scrollLeft={scrollLeft}
                              scrollTop={scrollTop}
                              start={start}
                              end={end}
                              resources={resources}
                              events={events}
                              assignments={assignments}
                              listeners={listeners}
                              resourceAssignments={resourceAssignments}
                              resourceElements={resourceElements}
                              ticksConfig={ticksConfig}
                              viewConfig={viewConfig}
                              externalDragContext={externalDragContext}
                              dragContext={dragContext} />
                            {
                              this.pluginComponents.map((PluginComponent) =>
                                <PluginComponent
                                  onScroll={onScroll}
                                  scrollLeft={scrollLeft}
                                  scrollTop={scrollTop}
                                  start={start}
                                  end={end}
                                  listeners={listeners}
                                  resources={resources}
                                  events={events}
                                  assignments={assignments}
                                  resourceAssignments={resourceAssignments}
                                  resourceElements={resourceElements}
                                  ticksConfig={ticksConfig}
                                  viewConfig={viewConfig}
                                  externalDragContext={externalDragContext}
                                  dragContext={dragContext} />
                              )
                            }
                          </div>
                        </div>
                      </div>
                    )
                  }}
                </ScrollSync>
              )
            }}
          </DragContextProvider>
        )
        }
      </ViewDataProvider>
    )
  }
}

export default SchedulerPanel;