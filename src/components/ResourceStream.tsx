import * as React from 'react';

import { Resource, ViewConfig, DragContext, ResourceHeightsMap, ResourceElementMap } from '../../index';

interface ResourceStreamProps {
  resources: Resource[];
  viewConfig: ViewConfig;
  dragContext: DragContext;
  resourceHeights: ResourceHeightsMap;
  resourceElements: ResourceElementMap;
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    flex: 'none',
    overflowX: 'scroll' as 'scroll',
  },
  row: {
    display: 'flex',
    flexDirection: 'row' as 'row',
  },
  body: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  column: {
    display: 'flex',
    flex: 1,
  }
}

class ResourceStream extends React.PureComponent<ResourceStreamProps> {
  render() {
    const { viewConfig: { resourceAxis, timeAxis }, resourceHeights, resources } = this.props;
    const rootStyle = { ...styles.root, width: resourceAxis.width };
    const headerStyle = { ...styles.row, height: timeAxis.major.height + timeAxis.minor.height };

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
        <div style={styles.body}>
          {resources.map((resource) => {
            const rowStyle = { ...styles.row, flex: 1, height: resourceHeights.get(resource).pixels }

            return (
              <div key={resource.id} style={rowStyle}>
                {resourceAxis.columns.map((column) => {
                  return (
                    <div key={column.name} style={styles.column}>
                      {column.renderer(resource)}
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