import * as React from 'react';

import { LineElement, Ticks, FeaturesConfig, AxesConfig, ResourceElement } from '../../index.d';

interface LinesStreamProps {
  lineElements: LineElement[];
  resourceElements: ResourceElement[];
  ticks: Ticks;
  featuresConfig: FeaturesConfig;
  axesConfig: AxesConfig;
  scrollLeft: number;
  scrollTop: number;
  width: number;
  innerWidth: number;
  height: number;
  innerHeight: number;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden' as 'hidden',
  },
  inner: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
  },
  ticks: {
    time: {
      position: 'absolute' as 'absolute',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as 'column',
    },
    resource: {
      position: 'absolute' as 'absolute',
      width: '100%',
      display: 'flex',
    },
  },
  line: {
    position: 'absolute' as 'absolute',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    zIndex: 2,
  }
}

class LinesStream extends React.PureComponent<LinesStreamProps> {
  root: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidUpdate(prevProps: LinesStreamProps) {
    if (this.props.scrollLeft !== prevProps.scrollLeft) {
      this.root.current.scrollLeft = this.props.scrollLeft;
    }
    if (this.props.scrollTop !== prevProps.scrollTop) {
      this.root.current.scrollTop = this.props.scrollTop;
    }
  }

  public render() {
    let lineElements: React.ReactNode[];
    let minorTicks: React.ReactNode[];
    let majorTicks: React.ReactNode[];
    let resourceTicks: React.ReactNode[];

    if (this.props.featuresConfig.lines.line.renderer) {
      lineElements = this.props.lineElements.map(element => {
        const x = element.x - this.props.featuresConfig.lines.line.width / 2;

        const style = {
          ...styles.line,
          transition: '0.1s ease-in-out',
          transform: `translateX(${x}px)`,
        };

        return (
          <div style={style} key={`line-${element.line.id}`}>
            {this.props.featuresConfig.lines.line.renderer(element.line)}
          </div>
        )
      });
    }

    if (this.props.axesConfig.time.ticks.major.tickRenderer) {
      let left: number = 0;

      majorTicks = this.props.ticks.major.map(tick => {
        left += tick.width;
        if (!tick.show) { return null; }

        return (
          <div style={{ ...styles.ticks.time, left }} key={`${tick.startTime.getTime()}-major-tick`}>
            {this.props.axesConfig.time.ticks.major.tickRenderer(tick)}
          </div>
        )
      });
    }

    if (this.props.axesConfig.time.ticks.minor.tickRenderer) {
      let left: number = 0;

      minorTicks = this.props.ticks.minor.map(tick => {
        left += tick.width;
        if (!tick.show) { return null; }

        return (
          <div style={{ ...styles.ticks.time, left }} key={`${tick.startTime.getTime()}-minor-tick`}>
            {this.props.axesConfig.time.ticks.minor.tickRenderer(tick)}
          </div>
        )
      });
    }

    if (this.props.axesConfig.resource.tickRenderer) {
      let top: number = 0;

      resourceTicks = this.props.resourceElements.map(element => {
        top += element.pixels;

        return (
          <div style={{ ...styles.ticks.resource, top }} key={`resource-${element.resource.id}`}>
            {this.props.axesConfig.resource.tickRenderer(element.resource)}
          </div>
        )
      });
    }

    return (
      <div ref={this.root} style={{ ...styles.root, width: this.props.width, height: this.props.height }}>
        <div style={{ ...styles.inner, width: this.props.innerWidth, height: this.props.innerHeight }}>
          {resourceTicks}
          {minorTicks}
          {majorTicks}
          {lineElements}
        </div>
      </div>
    )
  }
}

export default LinesStream;