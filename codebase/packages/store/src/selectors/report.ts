import { createSelector } from 'reselect';
//@ts-ignore
import { RootState } from 'typesafe-actions';
import { ReportTags, ReviewType } from '@pma/store/src/config/types';

export const reportSelector = (state: RootState) => state.report;
export const statisticsSelector = (state: RootState) => state.statistics;

export const getReportMetaSelector = createSelector(reportSelector, (report) => report.meta);
export const getStatisticsMetaSelector = createSelector(statisticsSelector, (report) => report.meta);

export const getTableChartData = (type: string) =>
  createSelector(reportSelector, (report: any) => {
    const { colleagues } = report;

    if ((type !== ReportTags.REPORT_MYR_BREAKDOWN && type !== ReportTags.REPORT_EYR_BREAKDOWN) || !colleagues.length)
      return {};

    return colleagues.reduce(
      (acc, colleague) => {
        if (colleague.tags[type] !== '') acc?.[colleague.tags[type]]?.push(colleague);
        return acc;
      },
      {
        'Below expected': [],
        Satisfactory: [],
        Great: [],
        Outstanding: [],
      },
    );
  });

export const getTotalWlSelector = createSelector(reportSelector, (report: any) => {
  const { limitedObjectiveReports } = report;

  return limitedObjectiveReports?.[0]?.[0];
});

export const getAnniversaryStatistics = createSelector(statisticsSelector, (statistics: any) => {
  const { statistics: colleagues } = statistics;

  const initialState = { quarter1: [], quarter2: [], quarter3: [], quarter4: [] };

  if (!colleagues.length) return initialState;

  return colleagues.reduce(
    (acc, colleague) => {
      acc[`quarter${colleague.tags?.quarter}`]?.push(colleague);
      return acc;
    },
    { ...initialState },
  );
});

export const getTableChartDataStatistics = createSelector(statisticsSelector, (statistics: any) => {
  const { statistics: colleagues } = statistics;

  const initialState = {
    'Below expected': [],
    Satisfactory: [],
    Great: [],
    Outstanding: [],
  };

  if (!colleagues.length) return initialState;

  return colleagues.reduce(
    (acc, colleague) => {
      acc[colleague.tags?.overall_rating]?.push(colleague);
      return acc;
    },
    { ...initialState },
  );
});

export const getChartDataStatistics = createSelector(statisticsSelector, (statistics: any) => {
  const { statistics: colleagues } = statistics;

  if (!colleagues.length) return [];

  if (colleagues.some((colleague) => !colleague.tags)) return { new_to_business: colleagues };

  return colleagues.reduce(
    (acc, colleague) => ({
      ...acc,
      [colleague.tags?.status]: acc[colleague.tags?.status]?.length
        ? [...acc[colleague.tags?.status], colleague]
        : [colleague],
    }),
    {},
  );
});

export const getListStatistics = createSelector(statisticsSelector, (statistics) => {
  return Object.entries(statistics).reduce(
    (acc, [key, value]) => ({
      ...acc,
      //@ts-ignore
      ...(!!value?.length && { [key]: value }),
    }),
    {},
  );
});

export const getTotalReviewsByType = (data) =>
  createSelector(reportSelector, (report) => {
    if (!data) return 0;
    const { configType, key } = data;
    const details = report?.[key];
    if (!details) return 0;
    return details.find((item) => item.type === configType)?.totalCount ?? 0;
  });

export const colleaguesCountSelector = createSelector(reportSelector, (report: any) => {
  const { feedbacks } = report;

  if (!feedbacks?.length) return 0;

  return feedbacks.find((colleague) => colleague.type === ReviewType.FEEDBACK)?.totalCount;
});
export const totalColleaguesSelector = createSelector(reportSelector, ({ total }: any) => total);

export const getReportByType = (type) => createSelector(reportSelector, (report: any) => report[type]);
