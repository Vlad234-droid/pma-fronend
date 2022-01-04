import React, { FC } from 'react';
import { Rule, useStyle } from '@dex-ddl/core';
import { useTranslation } from 'components/Translation';
import useDispatch from 'hooks/useDispatch';
import { useSelector } from 'react-redux';
import { countByStatusReviews, countByTypeReviews, currentUserSelector, ReviewsActions } from '@pma/store';
import { ReviewType, Status } from 'config/enum';
import { ButtonWithConfirmation } from './index';
import useReviewSchema from '../../hooks/useReviewSchema';
import EditButton from './EditButton';

export type ObjectiveButtonsProps = {
  id: number;
  status: Status;
};

const ObjectiveButtons: FC<ObjectiveButtonsProps> = ({ id, status }) => {
  const dispatch = useDispatch();
  const { css } = useStyle();
  const { t } = useTranslation();
  const countReviews = useSelector(countByTypeReviews(ReviewType.OBJECTIVE)) || {};
  const countApprovedReviews = useSelector(countByStatusReviews(ReviewType.OBJECTIVE, Status.APPROVED)) || {};
  const { info } = useSelector(currentUserSelector);
  const [schema] = useReviewSchema(ReviewType.OBJECTIVE) || {};
  const { markup = { max: 0, min: 0 } } = schema;
  const canDelete = [Status.DRAFT, Status.APPROVED].includes(status) && countApprovedReviews > markup.min;
  const canEdit = [Status.DRAFT, Status.APPROVED, Status.DECLINED].includes(status);
  const isSingleObjectivesEditMode = countReviews > markup.min;

  const remove = () => {
    dispatch(
      ReviewsActions.deleteReview({
        pathParams: { colleagueUuid: info.colleagueUUID, type: ReviewType.OBJECTIVE, cycleUuid: 'CURRENT', number: id },
      }),
    );
  };

  return (
    <div className={css(WrapperStyle)}>
      {canEdit && (
        <EditButton
          isSingleObjectivesEditMode={isSingleObjectivesEditMode}
          buttonText={t('edit', 'Edit')}
          editNumber={id}
          icon={'edit'}
          styles={buttonStyle}
        />
      )}
      {canDelete && (
        <ButtonWithConfirmation
          onSave={remove}
          withIcon={true}
          buttonName={t('delete', 'Delete')}
          confirmationButtonTitle={t('confirm', 'Confirm')}
          confirmationTitle={t('objective_number', `Objective ${id}`, { number: id })}
          confirmationDescription={t('delete_objective_confirmation', 'Are you sure you want to delete objective?')}
          styles={[buttonStyle]}
        />
      )}
    </div>
  );
};
const WrapperStyle: Rule = ({ theme }) => ({ paddingBottom: theme.spacing.s5 });

const buttonStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f14,
  color: theme.colors.tescoBlue,
  fontWeight: theme.font.weight.bold,
  paddingRight: theme.spacing.s5,
  '& svg': {
    height: theme.spacing.s3_5,
    width: theme.spacing.s3_5,
    marginRight: theme.spacing.s2_5,
  },
});

export default ObjectiveButtons;
