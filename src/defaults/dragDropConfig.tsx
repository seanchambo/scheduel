import { DragDropConfig } from "../models";

const config: DragDropConfig = {
  snapToResource: true,
  snapToRounededDate: true,
  roundDateToNearest: { unit: 'milliseconds', increment: 1 },
}

export default config;