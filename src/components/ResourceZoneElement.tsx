import * as React from 'react';

import { ResourceZoneElement as ResourceZoneElementInterface, ResourceZoneRenderer, Resource } from '../../index.d';

interface ResourceZoneElementProps {
  element: ResourceZoneElementInterface;
  resource: Resource;
  renderer: ResourceZoneRenderer;
  height: number;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    display: 'flex',
    overflow: 'hidden',
  }
}

class ResourceZoneElement extends React.PureComponent<ResourceZoneElementProps> {
  render() {
    const { element, renderer, height, resource } = this.props;

    const style = {
      ...styles.root,
      width: element.endX - element.startX,
      height: height,
      transition: '0.1s ease-in-out',
      transform: `translateX(${element.startX}px)`,
    };

    return (
      <div style={style}>
        {renderer(element.resourceZone, resource)}
      </div>
    )
  }
}

export default ResourceZoneElement;