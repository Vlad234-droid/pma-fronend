import React, { FC } from 'react';
import { useStyle } from '@dex-ddl/core';

import { ReviewForApproval } from 'config/types';
import { ReviewType } from 'config/enum';
import { Select, Item } from 'components/Form';
import { useTranslation } from 'components/Translation';

import ConfirmModal from './ConfirmModal';
import { getDeclineReasonOptions } from '../../utils';

type Props = {
  onSave: (reason: string) => void;
  onClose: () => void;
  review?: ReviewForApproval;
  reviewType: ReviewType;
};

const DeclineModal: FC<Props> = ({ onSave, onClose, review, reviewType }) => {
  const { css } = useStyle();
  const { t } = useTranslation();
  const isObjective = reviewType === ReviewType.OBJECTIVE;
  const options = getDeclineReasonOptions(t);

  return (
    <ConfirmModal
      title={t('decline_reason', 'Decline reason')}
      hasReason={isObjective}
      renderContent={(setReason) => (
        <div className={css({ padding: '16px 0 8px' })}>
          {isObjective ? (
            <>
              <div className={css({ fontSize: '16px', lineHeight: '20px', marginBottom: '8px' })}>
                {t('decline_objective_agreement', `You’ve rejected your colleague’s objectives because they were not:`)}
              </div>
              <div className={css({ padding: '0 40px' })}>
                <Item withIcon={false}>
                  <Select
                    options={options}
                    placeholder={t('please_select', 'Please select')}
                    onChange={(e) => setReason(e.target.value)}
                    name='declineReason'
                  />
                </Item>
              </div>
            </>
          ) : (
            t(
              'decline_review_agreement',
              `Done, you’ve rejected this form as it doesn’t reflect the conversation you had with your colleague. Please pick up with them directly to discuss more.`,
            )
          )}
        </div>
      )}
      onSave={onSave}
      onClose={onClose}
      review={review}
    />
  );
};

export default DeclineModal;
