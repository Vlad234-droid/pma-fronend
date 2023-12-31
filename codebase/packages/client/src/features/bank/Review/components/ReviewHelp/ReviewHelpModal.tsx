import React, { FC } from 'react';
import { useStyle, Rule, CreateRule } from '@pma/dex-wrapper';
import { Trans } from 'components/Translation';

export const TEST_ID = 'review-help-modal';

const ReviewHelpModal: FC = () => {
  const { css, matchMedia } = useStyle();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;

  return (
    <div data-test-id={TEST_ID} className={css(wrapperStyle)}>
      <div className={css(wrapperBlockStyle({ mobileScreen }))}>
        <div>
          <div className={css(titleStyle)}>
            <Trans i18nKey={'hint_review_title'}>Here are some hints and tips for writing your review:</Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_1'}>Keep it short and to the point. It’s just a summary.</Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_2'}>
              What’s most important is the quality of the review conversation you’ve had.
            </Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_3'}>
              Write as much about your ’how’ as your ’what’. Most people find it easier to write about the ’what’ but
              the ’how’ really is equally important.
            </Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_4'}>Be clear on the work you’re most proud of and want to celebrate.</Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_5'}>
              But be equally honest about what didn’t go so well and what you can do better.
            </Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_6'}>
              Write and commit to what you’re going to work on for your development in the coming review period. This
              will then be helpful to look back on later in the year.
            </Trans>
          </div>
          <div className={css(tipsStyle)}>
            <span className={css(dotStyle)} />
            <Trans i18nKey={'hint_review_7'} ns='bank'>
              Make sure what you write properly captures the conversation you and your manager had – remember they will
              be sent this for their agreement.
            </Trans>
          </div>
        </div>
      </div>
    </div>
  );
};

const wrapperStyle: Rule = {
  height: '100%',
};

const wrapperBlockStyle: CreateRule<{ mobileScreen: boolean }> = ({ mobileScreen }) => ({
  height: '100%',
  overflow: 'auto',
  padding: mobileScreen ? '0 16px' : '0 40px',
});

const titleStyle: Rule = ({ theme }) => ({
  fontSize: theme.font.fixed.f24.fontSize,
  lineHeight: theme.font.fixed.f24.lineHeight,
  letterSpacing: '0px',
  fontWeight: theme.font.weight.bold,
});

const tipsStyle: Rule = ({ theme }) => {
  return {
    fontSize: theme.font.fixed.f16.fontSize,
    lineHeight: theme.font.fixed.f16.lineHeight,
    letterSpacing: '0px',
    paddingTop: '20px',
    display: 'flex',
  };
};

const dotStyle: Rule = ({ theme }) => ({
  ':before': {
    margin: '0px 15px 3px 0px',
    content: '""',
    width: '5px',
    height: '5px',
    background: theme.colors.black,
    display: 'inline-block',
  },
});

export default ReviewHelpModal;
