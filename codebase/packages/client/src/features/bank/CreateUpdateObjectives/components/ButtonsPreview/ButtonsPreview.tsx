import React, { FC } from 'react';
import { useStyle, Button, Rule, CreateRule } from '@pma/dex-wrapper';

import { Trans, useTranslation } from 'components/Translation';
import { ButtonWithConfirmation } from 'features/general/Modal';

import { FormStateType } from '../../type';

type ButtonsProps = {
  onBack: (state: FormStateType) => void;
  onSubmit: (T?) => void;
};

const Buttons: FC<ButtonsProps> = ({ onSubmit, onBack }) => {
  const { css, matchMedia } = useStyle();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;
  const { t } = useTranslation();
  const handleBack = () => {
    onBack(FormStateType.MODIFY);
  };

  return (
    <div className={css(containerStyle)}>
      <div className={css(wrapperStyle)}>
        <div className={css(buttonWrapperStyle({ mobileScreen }))}>
          <Button onPress={handleBack} styles={[buttonWhiteStyle]}>
            <Trans i18nKey='back'>Back</Trans>
          </Button>
          <Button onPress={onSubmit} styles={[buttonBlueStyle]}>
            <Trans i18nKey='submit'>Submit</Trans>
          </Button>
        </div>
      </div>
    </div>
  );
};
const containerStyle: Rule = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
};

const wrapperStyle: Rule = ({ theme }) => ({
  position: 'relative',
  bottom: theme.spacing.s0,
  left: theme.spacing.s0,
  right: theme.spacing.s0,
  // @ts-ignore
  borderTop: `${theme.border.width.b2} solid ${theme.colors.lightGray}`,
});

const buttonWrapperStyle: CreateRule<{ mobileScreen: boolean }> =
  ({ mobileScreen }) =>
  ({ theme }) => ({
    padding: mobileScreen ? theme.spacing.s7 : theme.spacing.s9,
    display: 'flex',
    justifyContent: 'center',
  });

const buttonWhiteStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  fontWeight: theme.font.weight.bold,
  width: '50%',
  margin: `${theme.spacing.s0} ${theme.spacing.s0_5}`,
  background: theme.colors.white,
  border: `${theme.border.width.b2} solid ${theme.colors.tescoBlue}`,
  color: `${theme.colors.tescoBlue}`,
});

const buttonBlueStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  fontWeight: theme.font.weight.bold,
  width: '50%',
  margin: `${theme.spacing.s0} ${theme.spacing.s0_5}`,
  background: `${theme.colors.tescoBlue}`,
});

export default Buttons;
