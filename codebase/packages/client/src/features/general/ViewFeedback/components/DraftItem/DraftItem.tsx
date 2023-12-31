import React, { FC, useMemo, useState } from 'react';
import { Rule, Styles, useStyle, colors, theme } from '@pma/dex-wrapper';
import { TileWrapper } from 'components/Tile';
import { Accordion, BaseAccordion, Panel, Section } from 'components/Accordion';
import { IconButton } from 'components/IconButton';
import { Trans } from 'components/Translation';
import { FeedbackProfileInfo } from 'features/general/Feedback/components';
import { useDispatch } from 'react-redux';
import { FeedbackActions } from '@pma/store';
import { usePDF, FeedbackDocument, downloadPDF } from '@pma/pdf-renderer';
import { formatToRelativeDate } from 'utils';

type QuestionItem = {
  code: string;
  content: string;
  feedbackUuid: string;
  question: string;
  uuid: string;
};

export type DraftItem = {
  uuid: string;
  firstName: string;
  lastName: string;
  read: boolean;
  jobName: string;
  departmentName: string;
  updatedTime: string;
  targetType: string;
  targetId: string;
  feedbackItems: QuestionItem[];
};

type DraftItemProps = {
  item: DraftItem;
  downloadable?: boolean;
};

const QUESTION_ORDER = ['Question 1', 'Question 2', 'Anything else?'];
const HARDCODED_QUESTION = {
  'Question 1':
    "Looking back at what you've seen recently, what would you like to say to this colleague about what they've delivered or how they've gone about it?",
  'Question 2': 'Looking forward, what should this colleague do more (or less) of in order to be at their best?',
  'Anything else?': 'Add any other comments you would like to share with your colleague.',
};

export const TEST_QUESTION_ITEM = 'TEST_QUESTION_ITEM';

export const defaultSerializer = (item) => ({
  ...item,
  firstName: item?.colleagueProfile?.colleague?.profile?.firstName || '',
  lastName: item?.colleagueProfile?.colleague?.profile?.lastName || '',
  jobName: item?.colleagueProfile?.colleague?.workRelationships[0]?.job?.name || '',
  departmentName: item?.colleagueProfile?.colleague?.workRelationships[0]?.department?.name || '',
  feedbackItems: item?.feedbackItems
    .sort((i1, i2) => QUESTION_ORDER.indexOf(i1.code) - QUESTION_ORDER.indexOf(i2.code))
    .map(({ code, content, ...rest }) => ({
      ...rest,
      code,
      question: HARDCODED_QUESTION[code],
      content: content ?? '-',
    })),
  updatedTime: formatToRelativeDate(item.updatedTime),
});

const DraftItemDocument: FC<{ item: DraftItem }> = ({ item }) => {
  const document = useMemo(() => <FeedbackDocument items={[item as any]} />, [item.uuid]);
  const [instance] = usePDF({ document });

  return (
    <IconButton
      customVariantRules={{ default: iconBtnStyle }}
      onPress={() => downloadPDF(instance.url!, 'feedback.pdf')}
      graphic='download'
      iconProps={{ invertColors: false }}
      iconStyles={iconStyle}
    >
      {instance.loading ? <Trans i18nKey='loading'>Loading...</Trans> : <Trans i18nKey='download'>Download</Trans>}
    </IconButton>
  );
};

const DraftItem: FC<DraftItemProps> = ({ item, downloadable = true }) => {
  const { css } = useStyle();
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);

  const markAsReadFeedback = (uuid) => {
    dispatch(FeedbackActions.readFeedback({ uuid }));
  };

  return (
    <TileWrapper customStyle={wrapperStyles}>
      <Accordion
        id={`draft-accordion-${item.uuid}`}
        customStyle={{
          borderBottom: 'none',
          marginTop: 0,
        }}
      >
        <BaseAccordion id={`draft-base-accordion-${item.uuid}`}>
          {() => (
            <Section>
              <FeedbackProfileInfo
                firstName={item?.firstName}
                lastName={item?.lastName}
                job={item?.jobName}
                department={item?.departmentName}
                updatedTime={item?.updatedTime}
                isFormattedDate={true}
                onExpandPress={(expanded) => {
                  setShow(expanded);
                  if (expanded) {
                    !item.read && markAsReadFeedback(item.uuid);
                  }
                }}
              />

              <Panel>
                <TileWrapper
                  customStyle={{
                    width: 'auto',
                    padding: '24px',
                    margin: '24px 28px 0 0',
                    border: `2px solid ${colors.backgroundDarkest}`,
                  }}
                >
                  {item?.feedbackItems
                    ?.filter(({ question }) => question)
                    ?.map(({ question, content }, idx) => (
                      <div data-test-id={TEST_QUESTION_ITEM} key={idx} className={css(infoBlockStyle)}>
                        <h3>{`${question}`}</h3>
                        <p>{content}</p>
                      </div>
                    ))}
                </TileWrapper>
                {downloadable && show && <DraftItemDocument item={item} />}
              </Panel>
            </Section>
          )}
        </BaseAccordion>
      </Accordion>
    </TileWrapper>
  );
};

const infoBlockStyle: Rule = {
  marginBottom: '16px',
  '& > h3': {
    margin: '0px',
    fontWeight: theme.font.weight.bold,
    ...theme.font.fixed.f14,
  },
  '& > p': {
    margin: '0px',
    ...theme.font.fixed.f14,
  },
} as Styles;

const wrapperStyles: Rule = {
  padding: '24px 24px 24px 24px',
};

const iconBtnStyle: Rule = ({ theme }) => ({
  padding: '12px 20px 12px 14px',
  display: 'flex',
  height: '40px',
  borderRadius: '20px',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '140px',
  fontWeight: theme.font.weight.bold,
  outline: 0,
  background: theme.colors.white,
  color: theme.colors.tescoBlue,
  cursor: 'pointer',
  width: '176px',
  border: '2px solid #00539F',
  whiteSpace: 'nowrap',
  margin: '28px 24px 6px auto',
});

const iconStyle: Rule = {
  marginRight: '8px',
  marginTop: '6px',
};

export default DraftItem;
