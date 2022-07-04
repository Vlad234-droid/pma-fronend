import React, { FC, HTMLProps } from 'react';
import { useStyle } from '@pma/dex-wrapper';

import { ColleagueInfo } from 'features/general/MyTeam';
import { Employee } from 'config/types';
import { ConfirmModal as Modal } from 'components/ConfirmModal';

export type ConfirmAcceptModalProps = {
  title: string;
  onClose: () => void;
  onSave: (hasReason?: boolean, reason?: string) => void;
  onOverlayClick?: () => void;
  hasReason?: boolean;
  employee?: Employee;
  reason?: string;
  submitBtnTitle?: JSX.Element;
};

type Props = HTMLProps<HTMLInputElement> & ConfirmAcceptModalProps;

const ConfirmModal: FC<Props> = ({
  title,
  reason,
  children,
  hasReason = false,
  onClose,
  onSave,
  onOverlayClick,
  employee,
  submitBtnTitle,
}) => {
  const { css } = useStyle();

  const canSubmit = hasReason ? Boolean(reason?.length) : true;

  return (
    <Modal
      title={title}
      onCancel={onClose}
      onSave={() => onSave(hasReason, reason)}
      canSubmit={canSubmit}
      onOverlayClick={onOverlayClick}
      submitBtnTitle={submitBtnTitle}
    >
      <div data-test-id='actions-confirm-modal'>
        {employee && (
          <div className={css({ padding: '16px 0 0' })}>
            <ColleagueInfo
              firstName={employee.firstName || ''}
              lastName={employee.lastName || ''}
              jobName={employee.jobName || ''}
              businessType={employee.businessType || ''}
            />
          </div>
        )}
        {children}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
