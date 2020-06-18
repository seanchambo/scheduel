const colours = ['#2cb743', '#0838fa', '#1e95a4']

const randomBetween = (start, end) => Math.floor(Math.random() * end) + start;
const randomDateRange = (start, end) => {
  const msFromStart = randomBetween(1, end.getTime() - start.getTime());
  const startTime = new Date(start.getTime() + msFromStart);
  const maxDuration = end.getTime() - startTime.getTime();

  const duration = randomBetween(1, maxDuration);

  if (duration > 864000000) { return randomDateRange(start, end) };
  const dateEnd = new Date(startTime.getTime() + duration);
  return { start: new Date(startTime), end: dateEnd };
}
const randomColour = () => {
  const index = randomBetween(0, 2);
  return colours[index];
}

export const generateData = (
  start,
  end,
  resourceNumber,
  eventsPerResource,
  zonesPerResource,
  lineNumber
) => {
  const resources = [];
  const events = [];
  const assignments = [];
  const resourceZones = [];
  const lines = [];

  for (let i = 0; i < resourceNumber; i++) {
    resources.push({ id: i, name: `Resource ${i}`, data: { age: randomBetween(1, 100) } });
    for (let j = 0; j < eventsPerResource; j++) {
      const eventId = i * eventsPerResource + j;
      let result = randomDateRange(start, end);

      events.push({ id: eventId, startTime: result.start, endTime: result.end, data: { name: `Event ${eventId}`, colour: randomColour() } })
      assignments.push({ id: eventId, eventId, resourceId: i });
    }

    for (let j = 0; j < zonesPerResource; j++) {
      const resourceZoneId = i * zonesPerResource + j;
      let result = randomDateRange(start, end);

      resourceZones.push({ id: resourceZoneId, resourceId: i, startTime: result.start, endTime: result.end });
    }
  }

  for (let i = 0; i < lineNumber; i++) {
    const result = randomDateRange(start, end);
    lines.push({ id: i, date: result.start });
  }

  return { assignments, resources, events, resourceZones, lines };
}
