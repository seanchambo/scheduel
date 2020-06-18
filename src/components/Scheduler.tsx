import * as React from 'react';
import { Provider } from 'long-drop';
const merge = require('deepmerge');

import { Assignment, Resource, Event, AssignmentRenderer, FeaturesConfig, AxesConfig } from '../../index.d';

import { assignmentRenderer, axesDefaults, featuresDefaults } from '../defaults';
import SchedulerPanel from './SchedulerPanel';

interface SchedulerProps {
  assignments?: Assignment[];
  resources?: Resource[];
  events?: Event[];
  axes?: AxesConfig;
  assignmentRenderer?: AssignmentRenderer;
  features?: FeaturesConfig;
}

class Scheduler extends React.PureComponent<SchedulerProps> {
  static defaultProps = {
    assignments: [],
    events: [],
    resources: [],
    assignmentRenderer,
    axes: {},
    features: {},
  };

  public render() {
    let { axes, features, assignments, resources, events, assignmentRenderer } = this.props;
    axes = merge(axesDefaults, axes);
    features = merge(featuresDefaults, features);

    return (
      <Provider>
        <SchedulerPanel
          assignments={assignments}
          resources={resources}
          events={events}
          assignmentRenderer={assignmentRenderer}
          axes={axes}
          features={features} />
      </Provider>
    )
  }
}

export default Scheduler;
