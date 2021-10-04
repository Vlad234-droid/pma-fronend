import React, { FC, HTMLProps, useState } from 'react';
import { Trans, useTranslation } from 'components/Translation';
import { Rule, Button } from '@dex-ddl/core';
import { ConfirmModal } from 'features/Modal';

export type SubmitButton = {
  styles?: Rule[];
  onSave: () => void;
  isDisabled?: boolean;
};

type Props = HTMLProps<HTMLInputElement> & SubmitButton;

const SubmitButton: FC<Props> = ({ styles = [], onSave, isDisabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('');

  return (
    <>
      <Button
        styles={[...styles, isDisabled ? { opacity: 0.4 } : {}]}
        onPress={() => setIsOpen(true)}
        isDisabled={isDisabled}
      >
        <Trans i18nKey='submit'>Submit</Trans>
      </Button>
      {isOpen && (
        <ConfirmModal
          title={t('submit_objectives', 'Submit Objectives')}
          description={t(
            'submit_objectives_confirmation',
            'Are you sure you want to submit all of your objectives to your manager?',
          )}
          onSave={() => {
            onSave();
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
          onOverlayClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SubmitButton;
