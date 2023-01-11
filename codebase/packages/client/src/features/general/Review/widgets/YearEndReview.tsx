import React, { FC, useMemo } from 'react';
import { Rule, useStyle } from '@pma/dex-wrapper';
import { getTimelineByCodeSelector, uuidCompareSelector } from '@pma/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useTranslation } from 'components/Translation';
import { ReviewWidget } from '../components/ReviewWidget';
import { getContent } from '../utils';
import { useTenant } from 'features/general/Permission';
import { buildPath } from 'features/general/Routes';
import { paramsReplacer } from 'utils';
import { ReviewType, Status } from 'config/enum';
import { Page } from 'pages';

type Props = {
  colleagueUuid: string;
};

const YearEndReview: FC<Props> = ({ colleagueUuid }) => {
  const { t } = useTranslation();
  const { css } = useStyle();
  const tenant = useTenant();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const isUserView = useSelector(uuidCompareSelector(colleagueUuid));

  const review = useSelector(getTimelineByCodeSelector(ReviewType.EYR, colleagueUuid));

  if (!review || (!isUserView && review.status === Status.DRAFT)) {
    return null;
  }

  const { summaryStatus, startTime, lastUpdatedTime } = review;

  const [graphic, iconColor, background, shadow, hasDescription, content, buttonText] = useMemo(
    () =>
      getContent(
        {
          status: summaryStatus,
          startTime,
          lastUpdatedTime,
        },
        t,
        tenant,
      ),
    [summaryStatus, startTime, lastUpdatedTime],
  );
  const disabled = isUserView
    ? summaryStatus === Status.NOT_STARTED
    : summaryStatus === Status.NOT_STARTED || summaryStatus === Status.DRAFT;

  return (
    <div data-test-id='feedback' className={css(basicTileStyle)}>
      <ReviewWidget
        onClick={() =>
          navigate(
            (state as any)?.prevBackPath ||
              buildPath(
                paramsReplacer(isUserView ? Page.REVIEWS : Page.USER_TL_REVIEW, {
                  ':type': ReviewType.EYR.toLocaleLowerCase(),
                  ...(!isUserView && { ':uuid': colleagueUuid }),
                }),
              ),
            {
              state: {
                backPath: pathname,
                prevBackPath: (state as any)?.backPath,
              },
            },
          )
        }
        title={t('review_type_description_eyr', 'Year-end review')}
        description={
          hasDescription
            ? summaryStatus === Status.APPROVED
              ? t('end_year_review_widget_title_approved', 'Your year-end review is complete.')
              : t(
                  'end_year_review_widget_title',
                  'Complete this once you’ve had your year-end conversation with your line manager.',
                )
            : undefined
        }
        disabled={disabled}
        graphic={graphic}
        iconColor={iconColor}
        background={background}
        shadow={shadow}
        content={content}
        buttonText={buttonText}
        customStyle={{ height: '100%' }}
      />
    </div>
  );
};

export default YearEndReview;

const basicTileStyle: Rule = {
  flex: '1 0 230px',
};
