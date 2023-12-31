import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  colleagueCurrentCycleSelector,
  colleagueUUIDSelector,
  currentUserSelector,
  ReviewSharingActions,
  ReviewType,
  SchemaActions,
  TimelineActions,
  timelinesExistSelector,
  timelinesMetaSelector,
} from '@pma/store';

import useDispatch from 'hooks/useDispatch';
import { Page } from 'pages';

import ObjectiveAccordion from './components/ObjectivesSection';
import { useTimelineContainer } from 'contexts/timelineContext';

export const TEST_ID = 'my-objectives-page';
const CURRENT = 'CURRENT';

const MyObjectives: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const timelinesExist = useSelector(timelinesExistSelector(colleagueUuid));
  const { loaded: timelinesLoaded } = useSelector(timelinesMetaSelector);
  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));
  const { currentTimelines } = useTimelineContainer();
  const { code } = currentTimelines[ReviewType.QUARTER] || { code: '' };

  useEffect(() => {
    colleagueUuid && dispatch(ReviewSharingActions.checkSharing({ colleagueUuid, cycleUuid: CURRENT, code }));
    colleagueUuid && dispatch(ReviewSharingActions.getSharings({ colleagueUuid, code, cycleUuid: CURRENT }));
  }, [colleagueUuid, code]);

  useEffect(() => {
    if (colleagueUuid) {
      dispatch(TimelineActions.getTimeline({ colleagueUuid, cycleUuid: currentCycle }));
    }
  }, [colleagueUuid]);

  useEffect(() => {
    if (timelinesLoaded && !timelinesExist) {
      navigate(`/${Page.NOT_FOUND}`);
    }
  }, [timelinesLoaded, timelinesExist]);

  useEffect(() => {
    dispatch(SchemaActions.getSchema({ colleagueUuid, cycleUuid: currentCycle }));

    // return () => {
    //   dispatch(SchemaActions.clearSchemaData());
    // };
  }, [colleagueUuid]);

  return (
    <div data-test-id={TEST_ID}>
      <ObjectiveAccordion />
    </div>
  );
};

export default MyObjectives;
