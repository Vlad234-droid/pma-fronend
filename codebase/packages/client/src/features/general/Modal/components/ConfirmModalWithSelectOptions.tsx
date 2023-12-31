import React, { FC, HTMLProps, useState } from 'react';
import { useStyle, CreateRule, Modal, Button, Rule } from '@pma/dex-wrapper';
import { Trans } from 'components/Translation';
import { Radio } from 'components/Form';

type LabelType = {
  value: string;
  label: string;
};

export type ConfirmModal = {
  title: string;
  description?: string;
  onCancel: () => void;
  onSave: any;
  onOverlayClick?: () => void;
  submitBtnTitle?: string;
  options: Array<LabelType>;
  testId?: string;
};

type Props = HTMLProps<HTMLInputElement> & ConfirmModal;

export const ConfirmModalWithSelectOptions: FC<Props> = ({
  title,
  description,
  onCancel,
  onSave,
  onOverlayClick,
  submitBtnTitle,
  options,
  testId = '',
}) => {
  const { css, matchMedia } = useStyle();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;
  const [checked, setChecked] = useState<string>('');

  const submitForm = () => {
    onSave(checked);
  };

  return (
    <Modal
      overlayStyles={{ background: 'rgba(0, 83, 159, 0.7)' }}
      modalPosition={'middle'}
      modalContainerRule={[containerRule({ mobileScreen })]}
      title={{
        content: title,
        styles: [modalTitleStyle],
      }}
      onOverlayClick={onOverlayClick}
    >
      <div data-test-id={testId}>
        {description && (
          <div
            className={css({
              padding: '16px 0',
            })}
          >
            {description}
          </div>
        )}

        {options?.map(({ label, value }) => (
          <label key={label} htmlFor={`${label}-status`} className={css(labelStyle)}>
            <Radio
              name={`${label}-status`}
              checked={checked === value}
              value={value}
              id={`${label}-status`}
              onChange={(e) => setChecked(e.target.value)}
            />
            <span className={css(textLabel)}>
              <Trans>{label}</Trans>
            </span>
          </label>
        ))}

        <div className={css(flexStyle)}>
          <Button styles={[cancelBtnStyle]} onPress={onCancel}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            styles={[submitBtnStyle, !checked ? { opacity: '0.6' } : {}]}
            onPress={submitForm}
            isDisabled={!checked}
          >
            {submitBtnTitle || <Trans>Submit</Trans>}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const textLabel: Rule = {
  fontSize: '16px',
  lineHeight: '20px',
  padding: '2px 0px 0px 11px',
};
const labelStyle: Rule = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  marginBottom: '24px',
};

const flexStyle: Rule = {
  display: 'flex',
  justifyContent: 'center',
};
const modalTitleStyle: Rule = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
};

const cancelBtnStyle: Rule = ({ theme }) => ({
  background: 'white',
  border: `2px solid ${theme.colors.tescoBlue}`,
  fontSize: '16px',
  lineHeight: '20px',
  fontWeight: 'bold',
  color: `${theme.colors.tescoBlue}`,
  width: '50%',
  margin: '0px 4px',
});

const submitBtnStyle: Rule = ({ theme }) => ({
  background: `${theme.colors.tescoBlue}`,
  fontSize: '16px',
  lineHeight: '20px',
  fontWeight: 'bold',
  width: '50%',
  margin: '0px 4px 1px 4px',
  opacity: '1',
});

const containerRule: CreateRule<{
  mobileScreen: boolean;
}> = ({ mobileScreen }) => ({
  width: mobileScreen ? '345px' : '500px',
  padding: '24px 38px 24px',
});
