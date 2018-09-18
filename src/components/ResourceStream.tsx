import * as React from 'react';
import { ScrollSyncChildProps } from 'react-virtualized';

import { Resource, ViewConfig, DragContext, ResourceElement, ResourceAssignmentMap } from '../models';

interface ResourceStreamProps {
  resources: Resource[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  resourceElements: ResourceElement[];
  resourceAssignments: ResourceAssignmentMap;
};

const styles = {
  root: {
    flex: 'none',
    height: '100%',
    overflowX: 'scroll' as 'scroll',
  },
  row: {
    display: 'flex',
    flexDirection: 'row' as 'row',
  },
  body: {
    overflowY: 'hidden' as 'hidden',
  },
  column: {
    display: 'flex',
    flex: 1,
  }
}

class ResourceStream extends React.PureComponent<ResourceStreamProps> {
  resourcesBody: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props);

    this.resourcesBody = React.createRef();
  }

  render() {
    const { viewConfig: { resourceAxis, timeAxis }, resourceElements, resources, dragContext } = this.props;
    const rootStyle = { ...styles.root, width: resourceAxis.width };
    const headerStyle = { ...styles.row, height: timeAxis.major.height + timeAxis.minor.height };
    const bodyStyle = { ...styles.body, height: `calc(100% - ${timeAxis.major.height}px - ${timeAxis.minor.height}px)` }

    return (
      <div style={rootStyle}>
        <div style={headerStyle}>
          {resourceAxis.columns.map((column) => {
            return (
              <div key={column.name} style={styles.column}>
                {column.header.renderer()}
              </div>
            )
          })}

        </div>
        <div style={bodyStyle} ref={this.resourcesBody}>
          {resources.map((resource, index) => {
            const rowStyle = { ...styles.row, height: resourceElements[index].pixels }

            return (
              <div key={resource.id} style={rowStyle}>
                {resourceAxis.columns.map((column) => {
                  return (
                    <div key={column.name} style={styles.column}>
                      {column.renderer(resource, dragContext.hoveredResource === resource, dragContext.originalResource === resource)}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ResourceStream;