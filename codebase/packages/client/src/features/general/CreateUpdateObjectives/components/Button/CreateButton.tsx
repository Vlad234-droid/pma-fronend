import React, { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Rule, useStyle } from '@pma/dex-wrapper';
import {
  colleagueCurrentCycleSelector,
  colleagueUUIDSelector,
  countByTypeReviews,
  filterReviewsByTypeSelector,
  getReviewSchema,
  getTimelineByCodeSelector,
  isReviewsNumbersInStatus,
} from '@pma/store';

import { IconButton } from 'components/IconButton';
import { useTranslation } from 'components/Translation';
import { ReviewType, Status } from 'config/enum';
import { USER } from 'config/constants';
import { buildPath } from 'features/general/Routes';
import { Page } from 'pages';
import { REVIEW_MODIFICATION_MODE, reviewModificationMode } from '../../utils';
import { useCurrentCycle } from 'hooks/useCurrentCycle';

export type Props = {
  withIcon?: boolean;
};
const CreateButton: FC<Props> = memo(({ withIcon = false }) => {
  const { t } = useTranslation();
  const { css } = useStyle();
  const navigate = useNavigate();

  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));

  const schema = useSelector(getReviewSchema(ReviewType.OBJECTIVE));
  const { markup = { max: 0, min: 0 } } = schema;

  const reviewsMinNumbersInStatusApproved = useSelector(
    isReviewsNumbersInStatus(ReviewType.OBJECTIVE)(Status.APPROVED, markup.min),
  );
  const originObjectives = useSelector(filterReviewsByTypeSelector(ReviewType.OBJECTIVE));
  const timelineObjective = useSelector(getTimelineByCodeSelector(ReviewType.OBJECTIVE, USER.current, currentCycle));
  const countReviews = useSelector(countByTypeReviews(ReviewType.OBJECTIVE)) || 0;
  const objectiveSchema = useSelector(getReviewSchema(ReviewType.OBJECTIVE));
  const modificationMode = reviewModificationMode(countReviews, objectiveSchema);

  const { status: cycleStatus } = useCurrentCycle();

  const isAvailable =
    ![Status.COMPLETED, Status.FINISHED].includes(cycleStatus) &&
    (reviewsMinNumbersInStatusApproved ||
      timelineObjective?.status === Status.DRAFT ||
      originObjectives?.length === 0) &&
    countReviews < markup.max &&
    modificationMode !== REVIEW_MODIFICATION_MODE.NONE;

  const handleCreate = () => navigate(buildPath(Page.CREATE_OBJECTIVES));

  if (!isAvailable) return null;

  return (
    <div className={css({ display: 'flex', marginBottom: '20px' })}>
      {withIcon ? (
        <IconButton
          customVariantRules={{ default: iconBtnStyle }}
          onPress={handleCreate}
          graphic='add'
          iconProps={{ invertColors: true }}
          iconStyles={iconStyle}
        >
          {t('create_objectives', 'Create objective')}
        </IconButton>
      ) : (
        <Button styles={[buttonStyle]} onPress={handleCreate}>
          {t('create_objectives', 'Create objective')}
        </Button>
      )}
    </div>
  );
});

const iconBtnStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  letterSpacing: '0px',
  padding: '0 16px',
  display: 'flex',
  height: '40px',
  paddingLeft: '12px',
  paddingRight: '12px',
  borderRadius: '20px',
  justifyContent: 'center',
  alignItems: 'center',
  outline: 0,
  background: theme.colors.tescoBlue,
  color: theme.colors.white,
  cursor: 'pointer',
});

const iconStyle: Rule = {
  marginRight: '10px',
};

const buttonStyle: Rule = ({ theme }) => ({
  border: `${theme.border.width.b2} solid ${theme.colors.white}`,
  ...theme.font.fixed.f14,
  letterSpacing: '0px',
});

export default CreateButton;
