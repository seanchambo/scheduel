import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DropTargetViewModel } from 'long-drop';
import { DropTargetViewModelSpecification, RegisterRef } from 'long-drop/dist/DropTargetViewModel';

import { Ticks, AxesConfig, LineElement, FeaturesConfig } from '../../index.d';

import LineHeaderElement from './LineHeaderElement';
import AssignmentGrid from './AssignmentGrid';
import { getDateFromPosition } from '../utils/dom';
import itemTypes from '../utils/itemTypes';

interface LineHeaderProps {
  assignmentGrid: React.RefObject<AssignmentGrid>;
  ticks: Ticks;
  axesConfig: AxesConfig;
  lineElements: LineElement[];
  featuresConfig: FeaturesConfig;
  scrollLeft: number;
  width: number;
  height: number;
  innerWidth: number;
  registerRef?: RegisterRef;
}

const styles = {
  root: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  inner: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
  },
};

const lineHeaderTarget: DropTargetViewModelSpecification<LineHeaderProps> = {
  drop(props, monitor) {
    const finish = monitor.getSourceClientOffset();

    const panel: Element = ReactDOM.findDOMNode(props.assignmentGrid.current.grid.current) as Element;
    const xFromPanel = finish.x + (props.featuresConfig.lines.header.width / 2) - panel.getBoundingClientRect().left;
    const xFromSchedulerStart = xFromPanel + panel.scrollLeft;
    let date = getDateFromPosition(xFromSchedulerStart, props.ticks.minor);

    return { date };
  }
}

class LineHeader extends React.Component<LineHeaderProps> {
  root: HTMLDivElement;

  componentDidUpdate(prevProps: LineHeaderProps) {
    if (this.props.scrollLeft !== prevProps.scrollLeft) {
      this.root.scrollLeft = this.props.scrollLeft;
    }
  }

  setRootRef = (ref) => {
    this.root = ref;
    this.props.registerRef(ref);
  }

  render() {
    return (
      <div ref={this.setRootRef} style={{ ...styles.root, width: this.props.width, height: this.props.height }}>
        <div style={{ ...styles.inner, width: this.props.innerWidth, height: this.props.height }}>
          {this.props.lineElements.map(element =>
            <LineHeaderElement
              key={element.line.id}
              element={element}
              ticks={this.props.ticks}
              featuresConfig={this.props.featuresConfig} />
          )}
        </div>
      </div>
    )
  }
}

export default DropTargetViewModel<LineHeaderProps>(
  () => `LineHeader`,
  itemTypes.Line,
  lineHeaderTarget,
  (id, model, registerRef) => ({ registerRef })
)(LineHeader);
