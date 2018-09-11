import { getCoordinatesForTimeSpan } from '../../src/utils/dom';
import { generateMinorTicks } from '../helpers';

describe('#getCoordinatesForTimeSpan', () => {
  describe('within timespan', () => {
    test('start and end of tick', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2018, 0, 4, 0, 0, 0, 0);
      const end = new Date(2018, 0, 5, 0, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(150);
      expect(endX).toBe(200);
    });

    test('start part way through tick', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2018, 0, 4, 12, 0, 0, 0);
      const end = new Date(2018, 0, 5, 0, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(175);
      expect(endX).toBe(200);
    });

    test('end part way through tick', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2018, 0, 4, 0, 0, 0, 0);
      const end = new Date(2018, 0, 5, 12, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(150);
      expect(endX).toBe(225);
    });

    test('both part way through tick', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2018, 0, 4, 12, 0, 0, 0);
      const end = new Date(2018, 0, 5, 12, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(175);
      expect(endX).toBe(225);
    });

    test('both part way through same tick', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2018, 0, 4, 6, 0, 0, 0);
      const end = new Date(2018, 0, 4, 18, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(162.5);
      expect(endX).toBe(187.5);
    });
  });

  describe('partway through timespan', () => {
    test('start before timespan', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2019, 0, 1, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2017, 0, 4, 0, 0, 0, 0);
      const end = new Date(2018, 0, 5, 0, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(0);
      expect(endX).toBe(200);
    });

    test('end after timespan', () => {
      const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
      const ticksEnd = new Date(2018, 0, 5, 0, 0, 0, 0);
      const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

      const start = new Date(2018, 0, 4, 0, 0, 0, 0);
      const end = new Date(2018, 0, 7, 0, 0, 0, 0);

      const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

      expect(startX).toBe(150);
      expect(endX).toBe(200);
    });
  });

  test('outer overlaps', () => {
    const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
    const ticksEnd = new Date(2018, 0, 5, 0, 0, 0, 0);
    const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

    const start = new Date(2017, 0, 4, 0, 0, 0, 0);
    const end = new Date(2018, 0, 7, 0, 0, 0, 0);

    const { startX, endX } = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

    expect(startX).toBe(0);
    expect(endX).toBe(200);
  });

  test('before timespan', () => {
    const ticksStart = new Date(2018, 0, 1, 0, 0, 0, 0);
    const ticksEnd = new Date(2018, 0, 5, 0, 0, 0, 0);
    const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

    const start = new Date(2017, 0, 4, 0, 0, 0, 0);
    const end = new Date(2017, 0, 7, 0, 0, 0, 0);

    const result = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

    expect(result).toBeNull();
  });

  test('after timespan', () => {
    const ticksStart = new Date(2017, 0, 1, 0, 0, 0, 0);
    const ticksEnd = new Date(2017, 0, 5, 0, 0, 0, 0);
    const ticks = generateMinorTicks(ticksStart, ticksEnd, 1, 'days', 50);

    const start = new Date(2018, 0, 4, 0, 0, 0, 0);
    const end = new Date(2018, 0, 7, 0, 0, 0, 0);

    const result = getCoordinatesForTimeSpan(start, end, ticks, ticksStart, ticksEnd);

    expect(result).toBeNull();
  });
});