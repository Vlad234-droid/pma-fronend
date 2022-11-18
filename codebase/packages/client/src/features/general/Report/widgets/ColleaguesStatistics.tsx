import React, { FC } from 'react';
import { Rule, Styles, useStyle } from '@pma/dex-wrapper';
import { getReportByType } from '@pma/store';
import { useSelector } from 'react-redux';

import TableWidget from 'features/general/Report/widgets/TableWidget';
import ChartWidget from 'features/general/Report/widgets/ChartWidget';
import { useTranslation } from 'components/Translation';
import { PieChart } from 'components/PieChart';
import InfoTable from 'components/InfoTable';
import { View } from 'features/general/Report/config';
import { getReportTitles, getTitle, checkBusinessType, checkTableChart } from '../utils';
import { ReportPage, ReportType, TitlesReport } from 'config/enum';
import { isSingular } from 'utils';

export const ColleaguesStatistics: FC<{ type: ReportPage }> = ({ type }) => {
  const { t } = useTranslation();
  const { css } = useStyle();
  const anniversary = useSelector(getReportByType('anniversaryReviews'));
  const anniversaryReport = anniversary?.find(({ type }) => type === ReportType.EYR) || {};

  const isBusinessType = checkBusinessType(type);
  const isTableChart = checkTableChart(type);

  return (
    <>
      {isTableChart ? (
        <TableWidget configKey={type}>
          {({ data }) => {
            const isAnniversary = type === ReportPage.REPORT_ANNIVERSARY_REVIEWS;
            const totalCount = anniversaryReport.totalCount ?? 0;
            const completed = anniversaryReport?.statistics?.approved?.count ?? 0;
            return isAnniversary ? (
              <>
                <InfoTable
                  mainTitle={t(TitlesReport.ANNIVERSARY_REVIEWS, 'Anniversary Reviews')}
                  preTitle={t(TitlesReport.HOURLY_PAID, 'Hourly paid colleagues only')}
                />
                <div className={css(anniversaryInfo)}>
                  <span className={css(infoStatistics)}>
                    <span>{totalCount}</span>{' '}
                    {isSingular(totalCount) ? t('colleague', 'Colleague') : t('colleagues', 'Colleagues')}
                  </span>
                  <span className={css(infoStatistics, { marginTop: '6px' })}>
                    <span>{completed}</span>{' '}
                    {isSingular(completed) ? t('review_completed', 'Review completed') : t('co', 'Reviews completed')}
                  </span>
                </div>
              </>
            ) : (
              <InfoTable mainTitle={getTitle(t, type)} data={data} />
            );
          }}
        </TableWidget>
      ) : (
        <ChartWidget configKey={type as ReportPage}>
          {({ data }) => (
            <PieChart
              title={getReportTitles(t, type)?.chart}
              display={!isBusinessType ? View.CHART : View.QUANTITY}
              data={data}
            />
          )}
        </ChartWidget>
      )}
    </>
  );
};

const infoStatistics: Rule = ({ theme }) =>
  ({
    color: theme.colors.base,
    fontSize: theme.font.fixed.f16.fontSize,
    fontWeight: theme.font.weight.bold,
    '& > span': {
      fontSize: '20px',
      color: theme.colors.link,
    },
  } as Styles);
const anniversaryInfo: Rule = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '12px',
};
