import React, { FC, useEffect, useState } from 'react';
import { Button, fontWeight, useStyle } from '@dex-ddl/core';
import { ReviewsActions } from '@pma/store';

import { TileWrapper } from 'components/Tile';
import { Icon } from 'components/Icon';
import { Trans } from 'components/Translation';
import useDispatch from 'hooks/useDispatch';
import { ReviewType, Status } from 'config/enum';
import { ReviewForApproval } from 'config/types';

import { DeclineModal, SubmitModal } from '../Modal';
import { filterApprovedFn, filterApprovedReviewFn } from '../../utils';

export type WidgetObjectiveApprovalProps = {
  isDisabled?: boolean;
  canDecline?: boolean;
  reviewsForApproval: ReviewForApproval[];
  onSave: () => void;
};

export const WidgetObjectiveApproval: FC<WidgetObjectiveApprovalProps> = ({
  isDisabled = false,
  canDecline = false,
  reviewsForApproval,
  onSave,
}) => {
  const [isOpenDeclinePopup, setIsOpenDeclinePopup] = useState(false);
  const [isOpenApprovePopup, setIsOpenApprovePopup] = useState(false);
  const [declines, setDeclines] = useState<(string | null)[]>([]);
  const [currentReview, setCurrentReview] = useState<ReviewForApproval | null>(null);
  // TODO: check case if several waiting timelines with different ReviewType
  const currentTimeline = currentReview?.timeline.filter(filterApprovedFn);

  const { css, theme } = useStyle();
  const dispatch = useDispatch();

  useEffect(() => {
    if (declines.length && declines.length === reviewsForApproval.length) {
      // if there is at least one declined entity
      if (declines.some((decline) => !!decline) || reviewsForApproval.some(filterApprovedReviewFn)) {
        declineColleagues(declines);
      } else {
        // in other case, clear declines to start again
        setDeclines([]);
      }
    }
  }, [declines, reviewsForApproval]);

  const handleDeclineBtnClick = () => {
    setIsOpenDeclinePopup(true);
    setCurrentReview(reviewsForApproval[0]);
  };

  const handleApproveBtnClick = () => {
    setIsOpenApprovePopup(true);
  };

  const handleDeclineSubmit = (reason: string) => {
    if (declines.length + 1 < reviewsForApproval.length) {
      setCurrentReview(reviewsForApproval[declines.length]);
      setIsOpenDeclinePopup(false);
      setIsOpenDeclinePopup(true);
    } else {
      setIsOpenDeclinePopup(false);
    }

    setDeclines((declines) => [...declines, reason]);
  };

  const handleDeclineClose = () => {
    if (reviewsForApproval.length === declines.length + 1) {
      // if all reviews were opened already, close popup
      setIsOpenDeclinePopup(false);
      setCurrentReview(null);
    } else {
      // update currentReview with next one
      setCurrentReview(reviewsForApproval[declines.length + 1]);
    }

    setDeclines((declines) => [...declines, null]); // set empty decline
  };

  const handleApproveSubmit = () => {
    approveColleagues();
    setIsOpenApprovePopup(false);
  };

  const updateReviewStatus = (status: Status) => (reasons?: (string | null)[]) => {
    reviewsForApproval.forEach((colleague, index) => {
      if ((reasons && !reasons[index] && currentTimeline![0].reviewType === ReviewType.OBJECTIVE) || !currentTimeline)
        return;

      const [timeline] = currentTimeline;
      const update = {
        pathParams: { colleagueUuid: colleague.uuid, type: timeline.reviewType, cycleUuid: 'CURRENT', status },
        data: {
          ...(reasons ? { reason: reasons[index] as string } : {}),
          status,
          colleagueUuid: colleague.uuid,
          reviews: colleague.reviews.filter(
            ({ status, type }) => status === Status.WAITING_FOR_APPROVAL && type === timeline.reviewType,
          ),
        },
      };

      dispatch(ReviewsActions.updateReviewStatus(update));

      onSave();
      // clean declines after submit
      setDeclines([]);
      setCurrentReview(null);
    });
  };
  const approveColleagues = updateReviewStatus(Status.APPROVED);
  const declineColleagues = updateReviewStatus(Status.DECLINED);

  return (
    <>
      <TileWrapper>
        <div className={css({ textAlign: 'center', padding: '24px' }, isDisabled ? { opacity: '0.4' } : {})}>
          <div
            className={css({
              display: 'block',
              fontSize: '20px',
              lineHeight: '24px',
              paddingBottom: '10px',
              fontWeight: fontWeight.bold,
            })}
          >
            Approve or decline colleague’s objectives or reviews
          </div>
          <div
            className={css({
              justifyContent: 'center',
              display: 'flex',
            })}
          >
            <div className={css({ display: 'inline-block' })}>
              <Button
                isDisabled={!canDecline}
                styles={[
                  {
                    background: theme.colors.white,
                    border: `1px solid ${theme.colors.tescoBlue}`,
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontWeight: 'bold',
                    color: `${theme.colors.tescoBlue}`,
                    margin: '0px 4px',
                  },
                  !canDecline ? { opacity: '0.6' } : {},
                ]}
                onPress={handleDeclineBtnClick}
              >
                <Icon graphic='decline' iconStyles={{ paddingRight: '8px' }} />
                <Trans i18nKey='decline'>Decline</Trans>
              </Button>
            </div>
            <div className={css({ display: 'inline-block' })}>
              <Button
                isDisabled={isDisabled}
                styles={[
                  {
                    background: `${theme.colors.tescoBlue}`,
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontWeight: 'bold',
                    margin: '0px 4px 1px 4px',
                  },
                ]}
                onPress={handleApproveBtnClick}
              >
                <Icon graphic='check' invertColors={true} iconStyles={{ paddingRight: '8px' }} />
                <Trans i18nKey='approve'>Approve</Trans>
              </Button>
            </div>
            {isOpenDeclinePopup &&
              currentTimeline && ( // TODO: display separate modal for each colleague; add separate modal for reviews
                <DeclineModal
                  onSave={handleDeclineSubmit}
                  onClose={handleDeclineClose}
                  review={currentReview || undefined}
                  reviewType={currentTimeline[0].reviewType}
                />
              )}
            {isOpenApprovePopup && ( // TODO: display separate modal for each colleague;
              <SubmitModal onSave={handleApproveSubmit} onClose={() => setIsOpenApprovePopup(false)} />
            )}
          </div>
        </div>
      </TileWrapper>
    </>
  );
};
