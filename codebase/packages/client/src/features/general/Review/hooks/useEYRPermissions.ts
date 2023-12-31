import { useSelector } from 'react-redux';
import {
  colleagueCurrentCycleSelector,
  colleagueCycleDataSelector,
  getColleagueSelector,
  getReviewByTypeSelector,
  getTimelineByReviewTypeSelector,
  isAnniversaryTimelineType,
} from '@pma/store';
import { useParams } from 'react-router-dom';
import { Review, ReviewType, Status } from 'config/types';
import { useRolesPermission } from 'hooks/useRolesPermission';

export const useEYRPermissions = (reviewType: ReviewType.MYR | ReviewType.EYR) => {
  const { uuid } = useParams<{ uuid: string }>();

  const { isPeopleTeam, isLineManager, isTalentAdmin } = useRolesPermission();

  const colleagueUuid = uuid!;
  const colleague = useSelector(getColleagueSelector(colleagueUuid));
  const review: Review = useSelector(getReviewByTypeSelector(reviewType)) || {};
  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));
  const cycle = useSelector(colleagueCycleDataSelector(colleagueUuid, currentCycle));
  const isAnniversary = useSelector(isAnniversaryTimelineType(colleagueUuid, currentCycle));
  const timeline = useSelector(getTimelineByReviewTypeSelector(reviewType, colleagueUuid, currentCycle)) || ({} as any);

  const yerOpenForPT =
    reviewType === ReviewType.EYR &&
    isPeopleTeam &&
    review?.status === Status.APPROVED &&
    [Status.LOCKED, Status.FINISHING].includes(timeline?.status);

  const yerOpenForLN =
    isLineManager &&
    reviewType === ReviewType.EYR &&
    ![Status.LOCKED, Status.FINISHING, Status.COMPLETED].includes(timeline?.status);

  const cycleCompletedCondition =
    cycle?.status &&
    (isAnniversary ? cycle.status === Status.COMPLETED : [Status.COMPLETED, Status.FINISHED].includes(cycle.status));

  const declineCondition =
    !isTalentAdmin &&
    !cycleCompletedCondition &&
    yerOpenForLN &&
    (review.status === Status.APPROVED || review.status === Status.WAITING_FOR_APPROVAL);

  const approveCondition =
    !isTalentAdmin &&
    !cycleCompletedCondition &&
    ((yerOpenForLN && review.status === Status.WAITING_FOR_APPROVAL) || yerOpenForPT);

  return {
    readonly: !yerOpenForPT || cycleCompletedCondition,
    cycleCompletedCondition,
    declineCondition,
    approveCondition,
    colleagueUuid,
    isAnniversary,
    currentCycle,
    colleague,
    timeline,
    review,
  };
};
