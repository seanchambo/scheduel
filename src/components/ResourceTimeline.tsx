import * as React from 'react';

import { Resource, TicksConfig, ViewConfig, AssignmentElement, DragContext } from '../../index';

interface ResourceTimelineProps {
  resource: Resource;
  elements: AssignmentElement[];
  ticksConfig: TicksConfig;
  viewConfig: ViewConfig;
  dragContext: DragContext;
  height: number;
}

const styles = {
  root: {
    display: 'flex',
    flex: '1',
    position: 'relative' as 'relative',
  },
  event: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
  }
};

class ResourceTimeline extends React.PureComponent<ResourceTimelineProps> {
  render() {
    const rootStyle = { ...styles.root, height: this.props.height };

    return (
      <div style={rootStyle}>
        {this.props.elements.map((element) => {
          const style = {
            ...styles.event,
            left: element.startX,
            width: element.endX - element.startX,
            top: element.top,
            height: this.props.viewConfig.resourceAxis.height,
          };

          // TODO: Make based on assignment
          return <div key={element.event.id} style={style}>{this.props.viewConfig.events.renderer(element.event)}</div>
        })}
      </div>
    )
  }
}

export default ResourceTimeline;