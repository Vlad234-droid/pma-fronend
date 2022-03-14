import React, { useState } from 'react';
import { Accordion, BaseAccordion, ExpandButton, Panel, Section } from 'components/Accordion';
import { Button, Rule, theme, useStyle } from '@dex-ddl/core';
import { ConfirmModal } from 'features/Modal';
import { Icon } from 'components/Icon';
import { Trans, useTranslation } from 'components/Translation';
import { DATE_STRING_FORMAT, EXPIRATION_DATE, formatDateString } from 'utils';

export const DELETE_TEST_ID = 'goal-delete';
export const EDIT_TEST_ID = 'goal-edit';

const GoalInfo = (props) => {
  const { id, title, subtitle, description, data, formElements, deleteGoal, editGoal } = props;
  const modifiedTitleRegex = new RegExp(/\*/, 'g');
  const { css, theme } = useStyle();
  const { t } = useTranslation();
  const [toogled, setToogled] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={css(fullGoals)}>
      {confirmDelete && (
        <ConfirmModal
          title={t('are_you_sure_you_want_to_delete_this_goal', 'Are you sure you want to delete this goal?')}
          description={t('this_is_permanent_and_cannot_be_undone', 'This is permanent and cannot be undone.')}
          submitBtnTitle={<Trans i18nKey='delete'>Delete</Trans>}
          onSave={() => {
            deleteGoal(id);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
          onOverlayClick={() => setConfirmDelete(false)}
        />
      )}
      <Accordion
        id={`pdp-goal-accordion-${title}`}
        customStyle={{
          borderBottom: 'none',
          marginTop: 0,
        }}
      >
        <BaseAccordion id={`pdp-goal-${title}`}>
          {() => (
            <>
              <Section defaultExpanded={false}>
                <div className={css(titleBlock)} onClick={() => setToogled(!toogled)}>
                  {title?.replace(modifiedTitleRegex, '')}
                  <div className={css({ paddingLeft: '12px' })}>
                    <ExpandButton />
                  </div>
                </div>
                <div className={css(goalBlock)}>
                  <div className={css({ fontWeight: `${theme.font.weight.bold}` })}>
                    {subtitle.replace(modifiedTitleRegex, '')}
                  </div>
                  <div>{description}</div>
                </div>
                <Panel>
                  <div>
                    {data &&
                      Object.keys(data).map((key, index) => {
                        const isExpDate = key === EXPIRATION_DATE;

                        if (index !== 0)
                          return (
                            <div
                              key={formElements[index].label + Math.random()}
                              className={`${css(fullDesc)} ${css(goalBlock)}`}
                            >
                              <div className={css({ fontWeight: `${theme.font.weight.bold}` })}>
                                {formElements[index].label.replace(modifiedTitleRegex, '')}
                              </div>
                              <div>{isExpDate ? formatDateString(data[key], DATE_STRING_FORMAT) : data[key]}</div>
                            </div>
                          );
                      })}

                    <div className={css(btnBlock)}>
                      <Button data-test-id={EDIT_TEST_ID} styles={[btns]} onPress={() => editGoal(id)}>
                        <div>
                          <Icon graphic='edit' iconStyles={{ height: '13.33px', width: '13.33px' }} />
                        </div>
                        <div className={css({ marginLeft: '5px' })}>{t('edit', 'Edit')}</div>
                      </Button>

                      <Button
                        data-test-id={DELETE_TEST_ID}
                        styles={[btns]}
                        onPress={() => setConfirmDelete(!confirmDelete)}
                      >
                        <div className={css({ height: '16px' })}>
                          <Icon
                            graphic='delete'
                            fill={theme.colors.link}
                            iconStyles={{ maxHeight: '16px', maxWidth: '14.84px' }}
                          />
                        </div>
                        <div className={css({ marginLeft: '5px' })}>{t('delete', 'Delete')}</div>
                      </Button>
                    </div>
                  </div>
                </Panel>
              </Section>
            </>
          )}
        </BaseAccordion>
      </Accordion>
    </div>
  );
};

const btnBlock = {
  margin: '24px 0 32px 0',
  display: 'flex',
  fontWeight: `${theme.font.weight.bold}`,
} as Rule;

const btns = {
  background: 'none',
  color: `${theme.colors.tescoBlue}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  height: '34px',
  boxSizing: 'border-box',
  padding: '8px 16px',
  marginRight: '21px',
} as Rule;

const fullGoals = {
  borderBottom: `1px solid ${theme.colors.backgroundDarkest}`,
} as Rule;

const goalBlock = {
  paddingBottom: '16px',
  fontSize: `${theme.font.fixed.f14}`,
  lineHeight: '18px',
  userSelect: 'none',
  fontFamily: '"TESCO Modern", Arial, sans-serif',
} as Rule;

const fullDesc = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  flexDirection: 'column',
} as Rule;

const titleBlock = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 0 16px 0',
  fontFamily: '"TESCO Modern", Arial, sans-serif',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: `${theme.font.weight.bold}`,
  lineHeight: '20px',
  letterSpacing: '0px',
  color: `${theme.colors.link}`,
} as Rule;

export default GoalInfo;
