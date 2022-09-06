import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { getBankTimelineSelector, userCycleTypeSelector } from '@pma/store';
import { Rule, useStyle } from '@pma/dex-wrapper';

import { StepIndicator } from 'components/StepIndicator/StepIndicator';
import { useTranslation } from 'components/Translation';
import { CycleType } from 'config/enum';

const Timeline: FC<{ colleagueUuid: string }> = ({ colleagueUuid }) => {
  const { t } = useTranslation();
  const { css } = useStyle();
  const { descriptions, startDates, summaryStatuses, types, currentStep } =
    useSelector(getBankTimelineSelector(colleagueUuid)) || {};
  const cycleType = useSelector(userCycleTypeSelector);

  if (cycleType === CycleType.HIRING) return null;

  return (
    <div className={css(timelineWrapperStyles)}>
      <StepIndicator
        mainTitle={t('quarterly_priority_timeline', 'Quarterly Priority Timeline')}
        titles={descriptions}
        activeStep={currentStep}
        descriptions={startDates}
        statuses={summaryStatuses}
        types={types}
      />
    </div>
  );
};

export default Timeline;

const timelineWrapperStyles: Rule = {
  flex: '3 1 70%',
  display: 'flex',
  flexDirection: 'column',
};
