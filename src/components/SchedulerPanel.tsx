import * as React from 'react';

import { Assignment, Resource, Event, ViewConfig } from '../../index';
import Timeline from './Timeline';
import ResourceStream from './ResourceStream';

interface SchedulerPanelProps {
  assignments: Assignment[],
  resources: Resource[],
  events: Event[],
  viewConfig: ViewConfig;
}

const styles = {
  root: {
    display: 'flex',
  }
}

class SchedulerPanel extends React.PureComponent<SchedulerPanelProps> {
  render() {
    const { resources, viewConfig } = this.props;

    return (
      <div style={styles.root}>
        <ResourceStream resources={resources} viewConfig={viewConfig} />
        <Timeline {...this.props} />
      </div>
    );
  }
}

export default SchedulerPanel;