import Scheduler from './components/Scheduler';
import defaultViewConfig from './defaults/viewConfig';
import defaultListeners from './defaults/listeners';
import * as models from './models';
import itemTypes from './utils/itemTypes';
import ExternalDragContextProvider from './components/ExternalDragContextProvider';
import TicksTimelinePlugin from './plugins/TicksTimelinePlugin';

export { models, ExternalDragContextProvider, itemTypes }
export const defaults = { viewConfig: defaultViewConfig, listeners: defaultListeners };
export const plugins = { TicksTimelinePlugin };

export default Scheduler;