import { useLocation } from 'react-router-dom';
import { useTranslation } from 'components/Translation';
import { ReportPage, TitlesReport } from 'config/enum';
import { getCurrentYear } from 'utils';
import useQueryString from 'hooks/useQueryString';
import { convertToReportEnum } from 'features/TileReport/utils';

export const useChartTitle = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const query = useQueryString() as Record<string, string>;

  const getChartTitle = () => {
    const titles = {
      //TODO: rewrite this
      [ReportPage.REPORT_NEW_TO_BUSINESS]: t(TitlesReport.EYR_BREAKDOWN, 'Breakdown of End-year review'),
    };

    return titles[ReportPage[convertToReportEnum(pathname)]];
  };

  return {
    title: getChartTitle(),
    year: query.year || getCurrentYear(),
  };
};
