import { Status, TimelineType } from 'config/enum';
import { Employee } from 'config/types';

export const getLastTimelineStatus = (employee: Employee) =>
  employee.timeline.reduce((prev, current) => {
    if (
      current.type !== TimelineType.TIMELINE_POINT &&
      ![Status.STARTED, Status.NOT_STARTED].includes(current.status)
    ) {
      prev = current.status;
    }

    return prev;
  }, Status.STARTED);