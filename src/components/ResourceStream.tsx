import * as React from 'react';

import { Resource, ViewConfig } from '../../index';

interface ResourceStreamProps {
  resources: Resource[],
  viewConfig: ViewConfig
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
    const { resourceAxis, timeAxis } = this.props.viewConfig;
    const rootStyle = { ...styles.root, width: resourceAxis.width };
    const headerStyle = { ...styles.row, height: timeAxis.major.height + timeAxis.minor.height };
    const rowStyle = { ...styles.row, flex: 1, height: resourceAxis.height };

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
          {this.props.resources.map((resource) => {
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