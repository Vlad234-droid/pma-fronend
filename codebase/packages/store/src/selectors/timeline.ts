import { createSelector } from 'reselect';
// @ts-ignore
import { RootState } from 'typesafe-actions';
//TODO: should move to store or separate package @pma/types
import { ReviewType, TimelineStatus } from '@pma/client/src/config/enum';
import { usersSelector } from './users';
import { Timeline } from '@pma/client/src/config/types';

export enum Type {
  OBJECTIVE = 'OBJECTIVE',
  MYR = 'MYR',
  EYR = 'EYR',
  START_CYCLE = 'START_CYCLE',
}

export const USER = {
  current: 'me',
};

export const timelineSelector = (state: RootState) => state.timeline;

export const allUserTimelineSelector = (uuid: string) =>
  createSelector(timelineSelector, (timeline) => timeline?.data?.[uuid] || {});

export const userTimelineSelector = (uuid: string, cycle = 'CURRENT') =>
  createSelector(timelineSelector, (timeline) => timeline?.data?.[uuid]?.[cycle] || []);

export const userReviewTypesSelector = (uuid: string, cycle = 'CURRENT') =>
  createSelector(
    timelineSelector,
    (timeline) => timeline.data?.[uuid]?.[cycle]?.map((item: { code: string }) => item.code) || [],
  );

export const timelinesExistSelector = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(timelineSelector, (timelines) => !!timelines.data?.[colleagueUuid]?.[cycle]?.length);

export const timelineStartedSelector = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline) => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    return !data?.some((item) => item.code === Type.START_CYCLE);
  });

export const timelinesMetaSelector = createSelector(timelineSelector, (timeline) => timeline.meta);

export const getTimelineSelector = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(
    usersSelector,
    timelineSelector,
    timelineTypesAvailabilitySelector(colleagueUuid, cycle),
    (user, timeline, timelineTypes) => {
      const isAnniversary =
        !!timelineTypes[ReviewType.EYR] &&
        !timelineTypes[ReviewType.MYR] &&
        !timelineTypes[ReviewType.OBJECTIVE] &&
        !timelineTypes[ReviewType.QUARTER];

      // TODO: bugfix. extract to separate function
      const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
      const data = timeline.data?.[uuid]?.[cycle];

      const isActive = (status) => status !== TimelineStatus.STARTED && status !== TimelineStatus.NOT_STARTED;
      const getStartDate = (startTime, endTime, properties, code) =>
        getDateString(code === Type.EYR ? (isAnniversary ? properties?.OVERDUE_DATE : endTime) : startTime, code);
      const getDateString = (time, code) =>
        ['Q1', 'Q3'].includes(code)
          ? ''
          : `${new Date(time).toLocaleString('default', { month: 'long' })} ${new Date(time).getFullYear()}`;

      const filteredData = data?.filter(({ properties }) => properties?.TIMELINE_POINT_HIDDEN !== 'true') || [];
      const result = { codes: [], types: [], summaryStatuses: [], descriptions: [], startDates: [], currentStep: 0 };

      filteredData.forEach(({ code, type, description, summaryStatus, startTime, endTime, properties }, index) => {
        const { codes, types, summaryStatuses, descriptions, startDates, currentStep } = result as any;

        codes.push(code);
        types.push(type);
        summaryStatuses.push(summaryStatus);
        descriptions.push(description);

        startDates.push(getStartDate(startTime, endTime, properties, code));
        result.currentStep = isActive(summaryStatus) ? index : currentStep;
      });

      return result;
    },
  );

export const getCalibrationPointSelector = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline) => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    return (
      data?.find(({ code }) => {
        return code === 'CALIBRATION';
      }) || {}
    );
  });

export const getBankTimelineSelector = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline) => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];

    const getDesc = (description) => description.replace(/(review)/g, '');
    const isActive = (status) => status !== TimelineStatus.STARTED && status !== TimelineStatus.NOT_STARTED;
    const getStartDate = (startTime, endTime, code) => getDateString(code === Type.EYR ? endTime : startTime);
    const getDateString = (time) =>
      `${new Date(time).toLocaleString('default', { month: 'short' })} ${new Date(time).getFullYear()}`;

    const result = { codes: [], types: [], summaryStatuses: [], descriptions: [], startDates: [], currentStep: 0 };

    data?.forEach(({ code, type, summaryStatus, description, startTime, endTime }, index) => {
      const { codes, types, summaryStatuses, descriptions, startDates, currentStep } = result as any;

      codes.push(code);
      types.push(type);
      summaryStatuses.push(summaryStatus);
      descriptions.push(getDesc(description));
      startDates.push(getStartDate(startTime, endTime, code));
      result.currentStep = isActive(summaryStatus) ? index : currentStep;
    });

    return result;
  });

// todo think about remove this selector
export const timelineTypesAvailabilitySelector = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline) => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    const reviewTypes = data?.map(({ reviewType }) => reviewType);
    if (reviewTypes?.length) {
      return {
        [ReviewType.QUARTER]: reviewTypes.includes(ReviewType.QUARTER),
        [ReviewType.OBJECTIVE]: reviewTypes.includes(ReviewType.OBJECTIVE),
        [ReviewType.MYR]: reviewTypes.includes(ReviewType.MYR),
        [ReviewType.EYR]: reviewTypes.includes(ReviewType.EYR),
      };
    }
    return {};
  });

export const isAnniversaryTimelineType = (colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(timelineTypesAvailabilitySelector(colleagueUuid, cycle), (timelineTypes) => {
    return (
      !!timelineTypes[ReviewType.EYR] &&
      !timelineTypes[ReviewType.MYR] &&
      !timelineTypes[ReviewType.OBJECTIVE] &&
      !timelineTypes[ReviewType.QUARTER]
    );
  });

export const getTimelineByCodeSelector = (code: string, colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline): Timeline | undefined => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    return data?.find((timeline) => timeline.code === code);
  });

export const getTimelineByReviewTypeSelector = (type: ReviewType, colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline): Timeline | undefined => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    return data?.find((timeline) => timeline.reviewType === type);
  });

export const getTimelinesByReviewTypeSelector = (type: ReviewType, colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline): Timeline[] | undefined => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    return data?.filter((timeline) => timeline.reviewType === type);
  });

export const getActiveTimelineByReviewTypeSelector = (type: ReviewType, colleagueUuid: string, cycle = 'CURRENT') =>
  createSelector(usersSelector, timelineSelector, (user, timeline): Timeline | undefined => {
    const uuid = colleagueUuid === USER.current ? user?.current.info.colleague.colleagueUUID : colleagueUuid;
    const data = timeline.data?.[uuid]?.[cycle];
    return data?.find((timeline) => timeline.reviewType === type && timeline.status === 'STARTED');
  });
