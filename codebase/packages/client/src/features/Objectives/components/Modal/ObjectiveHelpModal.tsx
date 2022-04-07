import React, { FC } from 'react';
import { useStyle, CreateRule, Rule } from '@pma/dex-wrapper';
import { Trans } from 'components/Translation';
import { VideoPlayer, VideoId } from 'features/VideoPlayer';

export const TEST_ID = 'objective-help-modal';

const ObjectiveHelpModal: FC = () => {
  const { css, matchMedia } = useStyle();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;

  return (
    <div data-test-id={TEST_ID} className={css(containerStyle)}>
      <div className={css(wrapperStyle({ mobileScreen }))}>
        <div>
          <div className={css(titleStyle)}>
            <Trans i18nKey={'need_help_with_objectives'}>Need help with writing your objectives?</Trans>
          </div>
          <div className={css(descriptionStyle)}>
            <Trans i18nKey={'need_help_with_objectives_description'}>
              Here are some resources to help you write relevant and meaningful objectives.
            </Trans>
          </div>
        </div>

        <div className={css(subTitleStyle)}>
          <Trans i18nKey={'learn'}>Learn</Trans>
        </div>
        <div className={css(descriptionStyle)}>
          <Trans i18nKey={'learn_objectives'}>
            This self-led eLearning will help you set objectives that are aligned, ambitious and assessable. Visit Click
            and Learn HERE or Learning at Tesco HERE (15 mins)
          </Trans>
        </div>
        <div className={css(subTitleStyle)}>
          <Trans i18nKey={'read'}>Read</Trans>
        </div>
        <div className={css(descriptionStyle)}>
          <Trans i18nKey={'read_description'}>
            Explore how the 3 A s model can help you write great strategic objectives with real examples to bring it to
            life.
          </Trans>
        </div>

        <div className={css(subTitleStyle)}>
          <Trans i18nKey={'watch'}>Watch</Trans>
        </div>
        <div className={css(descriptionStyle)}>
          <Trans i18nKey={'watch_description'}>
            Understand the 3 A s model and how this approach can help you write strong objectives (3 mins).
          </Trans>
        </div>

        <div className={css(videoPlayerWrapperStyle)}>
          <VideoPlayer videoId={VideoId.CREATE_OBJECTIVE} />
        </div>
      </div>
    </div>
  );
};

const containerStyle: Rule = { height: '100%' };

const wrapperStyle: CreateRule<{ mobileScreen: boolean }> = ({ mobileScreen }) => ({
  height: '100%',
  overflow: 'auto',
  padding: mobileScreen ? '0 16px' : '0 40px',
});

const titleStyle: Rule = ({ theme }) => ({
  fontSize: '24px',
  lineHeight: '28px',
  fontWeight: theme.font.weight.bold,
  paddingBottom: '32px',
});

const subTitleStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f20,
  fontWeight: theme.font.weight.bold,
  paddingTop: '32px',
  paddingBottom: '16px',
});

const descriptionStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
});

const videoPlayerWrapperStyle: Rule = {
  paddingTop: '32px',
};

export default ObjectiveHelpModal;
