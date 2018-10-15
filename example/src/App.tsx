import * as React from 'react';
import Scheduler from 'scheduel';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Assignment, Resource, Event, ResourceRowLayout, Line } from '../../index.d';

import { generateData } from './generateData';

const start = new Date();
const end = new Date(new Date().setMonth(start.getMonth() + 2));

@DragDropContext(HTML5Backend)
class App extends React.Component {
  state = {
    layout: 'stack',
    ...generateData(start, end, 1000, 10, 2, 2),
  }

  updateEvent = (assignment: Assignment, resource: Resource, event: Event, date: Date) => {
    const newAssignment: Assignment = { id: assignment.id, eventId: event.id, resourceId: resource.id };
    const eventDuration = event.endTime.getTime() - event.startTime.getTime();
    const eventEnd = new Date(date.getTime() + eventDuration);
    const newEvent: Event = { ...event, startTime: new Date(date), endTime: new Date(eventEnd) };

    const assignmentIndex = this.state.assignments.indexOf(assignment);
    const eventIndex = this.state.events.indexOf(event);

    const newAssignments = [...this.state.assignments, newAssignment];
    const newEvents = [...this.state.events, newEvent];

    newAssignments.splice(assignmentIndex, 1);
    newEvents.splice(eventIndex, 1);

    this.setState({ assignments: newAssignments, events: newEvents });
  }

  updateLine = (line: Line, date: Date) => {
    console.log(date);
    let lines = this.state.lines.filter(l => l.id !== line.id);
    lines = [...lines, { ...line, date }];
    this.setState({ lines });
  }

  setLayout = (layout: ResourceRowLayout) => {
    return () => {
      this.setState({ layout });
    }
  }

  regenerate = () => {
    this.setState({ ...generateData(start, end, 1000, 10, 2, 2) });
  }

  public render() {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 42, padding: 8, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ width: 75, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <button onClick={this.regenerate}>Regenerate</button>
          </div>
          <div style={{ width: 225, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button onClick={this.setLayout('stack')}>Stack</button>
            <button onClick={this.setLayout('overlap')}>Overlap</button>
            <button onClick={this.setLayout('pack')}>Pack</button>
          </div>
        </div>
        <div style={{ flex: 1, width: '100%' }}>
          <Scheduler
            features={{
              dragDrop: {
                internal: {
                  listeners: {
                    drop: this.updateEvent,
                  }
                }
              },
              resourceZones: {
                zones: this.state.resourceZones,
              },
              lines: {
                lines: this.state.lines,
                listeners: {
                  drop: this.updateLine,
                }
              }
            }}
            axes={{
              resource: {
                row: {
                  layout: this.state.layout as ResourceRowLayout,
                  padding: 5,
                },
              },
              time: {
                range: {
                  duration: {
                    increment: 2,
                    unit: 'month',
                  }
                }
              }
            }}
            assignments={this.state.assignments}
            resources={this.state.resources}
            events={this.state.events} />
        </div>
      </div>
    );
  }
}

export default App;
