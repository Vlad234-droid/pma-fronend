import React, { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CalibrationReviewAction,
  calibrationReviewDataSelector,
  calibrationReviewMetaSelector,
  isAnniversaryTimelineType,
  getCalibrationPointSelector,
  colleagueCurrentCycleSelector,
} from '@pma/store';

import BaseWidget from 'components/BaseWidget';
import { buildPath } from 'features/general/Routes';
import { Page } from 'pages';
import { paramsReplacer, isDateFromISOBeforeNow, isDateFromISOAfterNow } from 'utils';
import { useTranslation } from 'components/Translation';
import useDispatch from 'hooks/useDispatch';
import { Status } from 'config/enum';

type Props = {
  userUuid: string;
};

const SubmitCalibrationRatings: FC<Props> = React.memo(({ userUuid }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname, state } = useLocation();
  const { backPath, filters } = (state as any) || {};

  const calibrationReview = useSelector(calibrationReviewDataSelector(userUuid)) || {};
  const currentCycle = useSelector(colleagueCurrentCycleSelector(userUuid));
  const {
    endTime,
    startTime,
    status: TLPStatus,
    statistics = {},
  } = useSelector(getCalibrationPointSelector(userUuid, currentCycle));
  const isAnniversaryColleague = useSelector(isAnniversaryTimelineType(userUuid, currentCycle));
  const hasActions = Object.keys(statistics).length > 0;

  const { loading, loaded } = useSelector(calibrationReviewMetaSelector);
  const { uuid = 'new', status } = calibrationReview;
  const isStartedPoint =
    ![Status.NOT_STARTED, Status.COMPLETED].includes(TLPStatus) &&
    isDateFromISOAfterNow(startTime) &&
    isDateFromISOBeforeNow(endTime);

  const isSubmitting = uuid === 'new' || status === Status.DRAFT;
  const isEditing = !isSubmitting && status === Status.WAITING_FOR_APPROVAL;
  const isViewing = !isSubmitting && !isEditing && status !== Status.WAITING_FOR_APPROVAL;

  useEffect(() => {
    if (!isStartedPoint || isAnniversaryColleague) return;
    if (hasActions && !loading && !loaded) {
      dispatch(CalibrationReviewAction.getCalibrationReview({ colleagueUuid: userUuid, cycleUuid: currentCycle }));
    }
  }, [loading, loaded, isStartedPoint, hasActions]);

  if (isAnniversaryColleague || loading || !isStartedPoint) return null;

  return (
    <BaseWidget
      buttonTitle={'view'}
      iconGraphic={isSubmitting || isEditing ? 'edit' : 'rating'}
      title={
        isSubmitting
          ? t('submit_calibration_ratings', 'Submit Calibration ratings')
          : isEditing
          ? t('edit_calibration_ratings', 'Edit Calibration ratings')
          : isViewing
          ? t('view_calibration_ratings', 'View Calibration ratings')
          : ''
      }
      description={
        isSubmitting
          ? t('ratings_ready_to_submit', 'Ratings ready to submit')
          : isViewing || isEditing
          ? t('ratings_are_submitted', 'Ratings are submitted')
          : ''
      }
      customStyle={{ cursor: 'pointer' }}
      background={isViewing ? 'white' : 'tescoBlue'}
      onClick={() =>
        navigate(buildPath(paramsReplacer(Page.CREATE_CALIBRATION_RATING, { ':userUuid': userUuid, ':uuid': uuid })), {
          state: { backPath: pathname, prevBackPath: backPath, filters },
        })
      }
    />
  );
});

export default SubmitCalibrationRatings;
