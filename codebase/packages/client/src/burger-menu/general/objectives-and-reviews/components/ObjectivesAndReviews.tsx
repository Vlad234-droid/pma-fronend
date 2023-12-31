import React from 'react';
import {
  colleagueCurrentCycleSelector,
  colleagueUUIDSelector,
  timelinesExistSelector,
  timelineTypesAvailabilitySelector,
} from '@pma/store';
import { useSelector } from 'react-redux';

import { buildPath } from 'features/general/Routes';
import { MenuItem as Item } from 'components/MenuItem';
import { useTranslation } from 'components/Translation';
import { Page } from 'pages';
import { ReviewType } from 'config/enum';

const MenuItem = () => {
  const { t } = useTranslation();
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));
  const timelineExist = useSelector(timelinesExistSelector(colleagueUuid, currentCycle));
  const timelineTypes = useSelector(timelineTypesAvailabilitySelector(colleagueUuid)) || {};

  const canShowAnnualReview =
    (!timelineTypes[ReviewType.MYR] && timelineTypes[ReviewType.EYR]) || !timelineTypes[ReviewType.OBJECTIVE];

  if (!timelineExist) return null;

  return (
    <Item
      iconGraphic={'goal'}
      linkTo={buildPath(Page.REVIEWS_VIEW)}
      title={
        canShowAnnualReview ? t('reviews', 'Reviews') : t('my_objectives_and_reviews', 'My objectives and reviews')
      }
    />
  );
};

export default MenuItem;
