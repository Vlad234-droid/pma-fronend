import { useSelector } from 'react-redux';
import {
  colleagueCurrentCycleSelector,
  colleagueCycleDataSelector,
  getColleagueSelector,
  getReviewByTypeSelector,
  getTimelineByReviewTypeSelector,
} from '@pma/store';
import { useParams } from 'react-router-dom';
import { role, usePermission } from 'features/general/Permission';
import { Review, ReviewType, Status } from 'config/types';

export const usePermissions = (reviewType: ReviewType.MYR | ReviewType.EYR) => {
  const { uuid } = useParams<{ uuid: string }>();
  const isPerform = usePermission([role.EXECUTIVE, role.LINE_MANAGER]);
  const isPeopleTeam = usePermission([role.PEOPLE_TEAM]);
  const isLineManager = usePermission([role.LINE_MANAGER]);
  const canPeopleTeamPerform = isPeopleTeam && !isLineManager;

  const colleagueUuid = uuid!;
  const colleague = useSelector(getColleagueSelector(colleagueUuid));
  const review: Review = useSelector(getReviewByTypeSelector(reviewType)) || {};

  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));
  const cycle = useSelector(colleagueCycleDataSelector(colleagueUuid, currentCycle));
  const timeline = useSelector(getTimelineByReviewTypeSelector(reviewType, colleagueUuid, currentCycle)) || ({} as any);

  const yerLockedCondition =
    reviewType === ReviewType.EYR &&
    canPeopleTeamPerform &&
    review?.status === Status.APPROVED &&
    [Status.LOCKED, Status.FINISHING, Status.COMPLETED].includes(timeline?.status);

  const yerLockedForLineManagerCondition =
    reviewType === ReviewType.EYR &&
    isLineManager &&
    [Status.LOCKED, Status.FINISHING, Status.COMPLETED].includes(timeline?.status);

  const cycleCompletedCondition = cycle?.status && [Status.COMPLETED, Status.FINISHING].includes(cycle.status);
  const declineCondition =
    !cycleCompletedCondition &&
    !yerLockedCondition &&
    !yerLockedForLineManagerCondition &&
    isPerform &&
    (review.status === Status.APPROVED || review.status === Status.WAITING_FOR_APPROVAL);
  const approveCondition =
    !cycleCompletedCondition &&
    !yerLockedForLineManagerCondition &&
    (yerLockedCondition || (isPerform && review.status === Status.WAITING_FOR_APPROVAL));

  return {
    timeline,
    declineCondition,
    approveCondition,
    yerLockedCondition,
    currentCycle,
    colleague,
    colleagueUuid,
    canPeopleTeamPerform,
    review,
  };
};
