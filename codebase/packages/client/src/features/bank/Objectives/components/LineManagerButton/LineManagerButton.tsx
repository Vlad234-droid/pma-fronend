import React, { FC } from 'react';
import { CreateRule, Rule, useStyle } from '@pma/dex-wrapper';
import { Status } from 'config/enum';
import { useTranslation } from 'components/Translation';
import ButtonWithConfirmation from 'components/ButtonWithConfirmation';
import { ReviewAction } from '../../type';

export type Props = {
  onAction: (action: ReviewAction, status?: Status, uuid?: string, number?: number) => void;
  status?: Status;
  number?: number;
  uuid?: string;
  isBulkUpdate?: boolean;
};

export const LineManagerButton: FC<Props> = ({ status, uuid, number, onAction, isBulkUpdate = false }) => {
  const { css } = useStyle();
  const { t } = useTranslation();

  if (status && ![Status.WAITING_FOR_APPROVAL, Status.WAITING_FOR_COMPLETION].includes(status)) {
    return null;
  }

  return (
    <>
      <div className={css(titleStyle)}>Agree or request amend to this priority {number}</div>
      <div className={css({ display: 'flex' })}>
        <ButtonWithConfirmation
          withIcon
          onSave={() => (status ? onAction(ReviewAction.DECLINE, status, uuid) : onAction(ReviewAction.DECLINE))}
          graphic={'cancel'}
          styles={iconButtonStyles({ disabled: false })}
          iconSize={16}
          buttonName={t('amend', 'Amend')}
          confirmationTitle={'Amends to priority'}
          confirmationDescription={
            'You are requesting your colleague to make amends to their priority. This is what your colleague will receive “Your manager has reviewed your priority but wants to discuss this further, they’ll be in contact shortly”.'
          }
          confirmationButtonTitle={t('amend', 'Amend')}
        />
        <ButtonWithConfirmation
          withIcon
          onSave={() => (status ? onAction(ReviewAction.APPROVE, status, uuid) : onAction(ReviewAction.APPROVE))}
          graphic={'check'}
          styles={iconButtonStyles({ disabled: false, invertColors: true })}
          iconSize={16}
          iconProps={{ invertColors: true }}
          buttonName={t('agree', 'Agree')}
          confirmationTitle={'Agree to priority'}
          confirmationDescription={'Please ensure you have talked to your colleague prior to agreeing this priority.'}
          confirmationButtonTitle={t('agree', 'Agree')}
        />
      </div>
    </>
  );
};

const titleStyle: Rule = {
  lineHeight: '20px',
  fontSize: '16px',
  paddingTop: '20px',
  paddingBottom: '10px',
  fontWeight: 'bold',
};

const iconButtonStyles: CreateRule<{ disabled: boolean; invertColors?: boolean }> =
  ({ disabled = false, invertColors = false }) =>
  ({ theme }) => ({
    ...theme.font.fixed.f16,
    letterSpacing: '0px',
    fontWeight: theme.font.weight.bold,
    height: '40px',
    margin: `${theme.spacing.s0} ${theme.spacing.s0_5}`,
    background: invertColors ? `${theme.colors.tescoBlue}` : `${theme.colors.white}`,
    color: invertColors ? `${theme.colors.white}` : `${theme.colors.tescoBlue}`,
    justifyContent: 'space-between',
    padding: '0px 15px',
    opacity: disabled ? 0.4 : 1,
    borderRadius: '20px',
    border: `1px solid ${theme.colors.tescoBlue}`,
  });