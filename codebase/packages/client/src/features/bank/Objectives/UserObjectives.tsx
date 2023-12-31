import React, { FC, useState } from 'react';
import { Rule, useStyle } from '@pma/dex-wrapper';
import {
  colleagueCurrentCycleSelector,
  colleagueCycleDataSelector,
  colleagueUUIDSelector,
  filterReviewsByTypeSelector,
  ReviewsActions,
  reviewsMetaSelector,
  timelineTypesAvailabilitySelector,
} from '@pma/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'components/Translation';
import ExternalAccordion from './components/ExternalAccordion';
import Section from 'components/Section';
import Spinner from 'components/Spinner';
import { Plug } from 'components/Plug';
import { ReviewType, Status } from 'config/enum';
import { useTimelineContainer } from 'contexts/timelineContext';
import { ExclamationMark, SuccessMark } from 'components/Icon';
import SuccessModal from 'components/SuccessModal';
import useDispatch from 'hooks/useDispatch';

import { useObjectivesData } from './hooks';
import { LineManagerButton } from './components/LineManagerButton';
import { ReviewAction } from './type';

export const TEST_WRAPPER_ID = 'TEST_WRAPPER_ID';

const statusMap: Record<ReviewAction, Record<Status.WAITING_FOR_APPROVAL | Status.WAITING_FOR_COMPLETION, Status>> = {
  [ReviewAction.APPROVE]: {
    [Status.WAITING_FOR_APPROVAL]: Status.APPROVED,
    [Status.WAITING_FOR_COMPLETION]: Status.COMPLETED,
  },
  [ReviewAction.DECLINE]: {
    [Status.WAITING_FOR_APPROVAL]: Status.DECLINED,
    [Status.WAITING_FOR_COMPLETION]: Status.REQUESTED_TO_AMEND,
  },
};

const UserObjectives: FC = () => {
  const dispatch = useDispatch();
  const { css } = useStyle();
  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();
  const [successModal, setSuccessModal] = useState<{
    reviewAction?: ReviewAction;
    isBulkUpdate?: boolean;
    shouldShowModal: boolean;
  }>({ shouldShowModal: false });
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));
  const cycle = useSelector(colleagueCycleDataSelector(colleagueUuid, currentCycle));
  const { saving } = useSelector(reviewsMetaSelector);

  const priorities = useSelector(filterReviewsByTypeSelector(ReviewType.QUARTER));
  const timelineTypes = useSelector(timelineTypesAvailabilitySelector(uuid!));
  const { currentTimelines } = useTimelineContainer();
  const { code } = currentTimelines[ReviewType.QUARTER] || { code: '' };
  const canShowObjectives = timelineTypes[ReviewType.QUARTER];

  const {
    objectives,
    meta: { loading, loaded },
  } = useObjectivesData(uuid as string);

  const prioritiesWaitingForApproval =
    priorities.filter(
      (priority) =>
        priority.status === Status.WAITING_FOR_APPROVAL || priority.status === Status.WAITING_FOR_COMPLETION,
    ).length > 1;

  const handleUpdateReviews = ({
    action,
    currentStatus,
    reviewUuid,
  }: {
    action: ReviewAction;
    currentStatus?: Status;
    reviewUuid?: string;
  }) => {
    const isBulkUpdate = !reviewUuid;

    if (isBulkUpdate) {
      for (const item of priorities?.filter((priority) =>
        [Status.WAITING_FOR_COMPLETION, Status.WAITING_FOR_APPROVAL].includes(priority?.status),
      )) {
        dispatch(
          ReviewsActions.updateReviewStatus({
            updateParams: {},
            pathParams: {
              colleagueUuid: uuid!,
              approverUuid: colleagueUuid,
              cycleUuid: cycle.uuid,
              code,
              status: statusMap[action][item?.status],
            },
            data: {
              colleagueUuid: uuid,
              reviews: priorities.filter((priority) => priority.status === item?.status),
            },
          }),
        );
      }
    } else {
      dispatch(
        ReviewsActions.updateReviewStatus({
          updateParams: {},
          pathParams: {
            colleagueUuid: uuid!,
            approverUuid: colleagueUuid,
            cycleUuid: cycle.uuid,
            code,
            status: statusMap[action][currentStatus!],
          },
          data: {
            colleagueUuid: uuid,
            reviews: priorities.filter((priority) => priority.uuid === reviewUuid),
          },
        }),
      );
    }
    setSuccessModal({ reviewAction: action, isBulkUpdate, shouldShowModal: true });
  };

  if (successModal?.shouldShowModal) {
    const bulkDescription =
      successModal.reviewAction === ReviewAction.APPROVE
        ? t('UserObjectives_priorities_agree_plural_desc', { ns: 'bank' })
        : t('UserObjectives_priorities_amend_plural_desc', { ns: 'bank' });

    const singleDescription =
      successModal.reviewAction === ReviewAction.APPROVE
        ? t('UserObjectives_priorities_agree_singular_desc', { ns: 'bank' })
        : t('UserObjectives_priorities_amend_singular_desc', { ns: 'bank' });

    return (
      <SuccessModal
        title={'Quarterly Priorities'}
        onClose={() => {
          setSuccessModal({ shouldShowModal: false });
          dispatch(ReviewsActions.updateReviewMeta({ saved: false }));
        }}
        description={successModal.isBulkUpdate ? bulkDescription : singleDescription}
        mark={successModal.reviewAction === ReviewAction.APPROVE ? <SuccessMark /> : <ExclamationMark />}
        loading={saving}
      />
    );
  }
  if (loading) return <Spinner fullHeight />;
  if (!canShowObjectives) return null;

  return (
    <>
      {loaded && !objectives.length ? (
        <Plug text={t('no_objectives_created', 'No objectives created')} />
      ) : (
        <Section
          testId={TEST_WRAPPER_ID}
          left={{
            content: (
              <div className={css(tileStyles)}>
                <Trans i18nKey='their_quarterly_priorities'>Their Quarterly Priorities</Trans>
              </div>
            ),
          }}
          right={{
            content: <div />,
          }}
        >
          <ExternalAccordion objectives={objectives}>
            {({ status, uuid }) => <LineManagerButton status={status} uuid={uuid} onAction={handleUpdateReviews} />}
          </ExternalAccordion>
          {prioritiesWaitingForApproval && <LineManagerButton onAction={handleUpdateReviews} isBulkUpdate={true} />}
        </Section>
      )}
    </>
  );
};

const tileStyles: Rule = {
  display: 'flex',
  alignItems: 'center',
};

export default UserObjectives;
