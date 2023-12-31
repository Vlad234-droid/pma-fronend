import React, { FC } from 'react';
import { Rule, useStyle } from '@pma/dex-wrapper';

import { Accordion, Panel, Section } from 'components/Accordion';
import { Trans } from 'components/Translation';
import * as T from 'features/general/Review/types';

import { ObjectiveButtons } from '../Buttons';
import { ObjectiveDetails } from '../Tile';
import ObjectiveHeader from '../ObjectiveHeader';

export type ObjectiveAccordionProps = {
  objectives: T.Objective[];
  canShowStatus?: boolean;
  isButtonsVisible?: boolean;
};

export const TEST_ID = 'objective-accordion';

const DeclineReason: FC<{ reason: string }> = ({ reason }) => {
  const { css } = useStyle();
  return (
    <div className={css(declineReasonStyles)}>
      <Trans i18nKey={'objective_decline_reason_prefix'}>Your objective was declined because it was not:</Trans>{' '}
      {reason}
    </div>
  );
};

const ObjectiveAccordion: FC<ObjectiveAccordionProps> = ({ objectives, canShowStatus, isButtonsVisible = true }) => (
  <Accordion id='objective-accordion'>
    <div data-test-id={TEST_ID}>
      {objectives.map(({ id, title, subTitle, description, declineReason, status, explanations }) => {
        return (
          <Section key={id}>
            <ObjectiveHeader {...{ title, subTitle, description, ...(canShowStatus ? { status } : {}) }} />
            <Panel>
              {declineReason && <DeclineReason reason={declineReason} />}
              <ObjectiveDetails explanations={explanations} />
              {isButtonsVisible && <ObjectiveButtons id={id} status={status} />}
            </Panel>
          </Section>
        );
      })}
    </div>
  </Accordion>
);

const declineReasonStyles: Rule = ({ theme }) => ({
  padding: '10px 0',
  fontSize: `${theme.font.fixed.f14.fontSize}`,
  lineHeight: `${theme.font.fixed.f14.lineHeight}`,
  letterSpacing: '0px',
  fontWeight: theme.font.weight.bold,
});

export default ObjectiveAccordion;
