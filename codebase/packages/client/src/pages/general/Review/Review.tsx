import React, { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useTenant } from 'features/general/Permission';
import { buildPath } from 'features/general/Routes';
import { ReviewType } from 'config/enum';
import { Page } from 'pages/general/types';
import { paramsReplacer } from 'utils';
import { useTranslation } from 'components/Translation';
import { BasicFormModal } from 'components/BasicFormModal';

// TODO: fix
const ReviewPage = () => {
  const tenant = useTenant();
  const { type } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();
  const { state } = useLocation();

  const Review = useMemo(
    () => React.lazy(() => import(`features/${tenant}/Review`).then((module) => ({ default: module.Review }))),
    [],
  );

  const handleClose = () => {
    navigate(
      buildPath(
        !uuid
          ? (state as any)?.backPath?.replace('/', '') || Page.REVIEWS_VIEW
          : paramsReplacer(Page.USER_REVIEWS, { ':uuid': uuid }),
      ),
      {
        state: { backPath: (state as any)?.prevBackPath },
      },
    );
  };

  useEffect(() => {
    const reviewType = type?.toUpperCase();
    if (reviewType !== ReviewType.EYR && reviewType !== ReviewType.MYR) {
      handleClose();
    }
  }, []);

  return (
    <BasicFormModal
      onClose={handleClose}
      title={
        type?.toUpperCase() === ReviewType.MYR
          ? t('mid_year_review', 'Mid-year review')
          : t('review_type_description_eyr', 'Year-end review')
      }
    >
      <Review reviewType={type?.toUpperCase()} onClose={handleClose} />
    </BasicFormModal>
  );
};

export default ReviewPage;
