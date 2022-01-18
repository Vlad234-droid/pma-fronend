import React, { Dispatch, FC, SetStateAction } from 'react';
import { IconButton } from 'components/IconButton';
import { useStyle, useBreakpoints, Rule, Styles } from '@dex-ddl/core';

type Info360ModalProps = {
  setModalGreatFeedback: Dispatch<SetStateAction<boolean>>;
};

const GreatFeedbackModal: FC<Info360ModalProps> = ({ setModalGreatFeedback }) => {
  const { css, theme } = useStyle();
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  return (
    <div className={css(WrapperInfo)}>
      <h2 className={css(title)}>
        Giving feedback helps us to make sure we&apos;re all contributing our best, whether that&apos;s celebrating
        what&apos;s gone well or letting someone know when something could be better.
      </h2>
      <p className={css(PreTitle)}>
        To help you give great feedback to your colleagues, follow these steps: <br />
      </p>
      <ol className={css(orderedList)}>
        <li>
          Make your good intentions clear. This builds trust and lets the receiver know that your words come from a
          positive place. This means they&apos;ll be more likely to listen and reflect on what you&apos;ve shared. An
          example of this would be starting your feedback with something like &quot;I&apos;m sharing this feedback with
          you so we can work better together&quot;.
        </li>
        <li>
          Describe the situation. It&apos;s important to be specific about the time, place, and situation you want to
          give feedback on. Being specific helps provide context for the receiver and ensures your feedback is clear. An
          example of this could be &quot;on Monday when we were working on the customer service desk&quot; or &quot;in
          last week&apos;s team meeting&quot;.
          <li>
            Give great examples. Describe what you observed, assumptions aren&apos;t helpful. For example, &quot;I
            noticed you&apos;ve been late twice this week&quot; is more helpful than &quot;you&apos;re never on
            time&quot;.
          </li>
          <li>
            Explain the impact. Sharing the impact your examples had gives the receiver an opportunity to reflect and
            think about specific actions they could take going forward. An example of impact &quot;this meant the
            customer received great service&quot; or &quot; this meant the rest of the team stayed late&quot;.
          </li>
        </li>
      </ol>
      <p className={css(PreRecomendationInfo)}>Remember:</p>
      <ul className={css(dotsList)}>
        <li>make your good intentions clear</li>
        <li>be specific about the situation</li>
        <li>describe the behaviour you observed</li>
        <li>highlight the impact it had</li>
      </ul>
      <h3 className={css(titleFeedback)}>
        Feedback shared will be named, this allows the receiver to ask you questions about the feedback when you next
        speak.
      </h3>
      <span
        className={css({
          position: 'fixed',
          top: theme.spacing.s5,
          left: mobileScreen ? theme.spacing.s5 : theme.spacing.s10,
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
        })}
      >
        <IconButton
          graphic='arrowLeft'
          onPress={() => setModalGreatFeedback(() => false)}
          iconProps={{ invertColors: true }}
        />
      </span>
    </div>
  );
};
const orderedList: Rule = {
  '& li': {
    marginTop: '8px',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '20px',
  },
} as Styles;

const dotsList: Rule = {
  marginTop: '0px',
  '& li': {
    marginTop: '8px',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '20px',
  },
} as Styles;

const WrapperInfo: Rule = {
  padding: '0px 36px',
  overflow: 'auto',
  height: '100%',
};
const titleFeedback: Rule = {
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '20px',
};

const PreTitle: Rule = {
  margin: '16px 0px 0px 0px',
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '20px',
};
const title: Rule = {
  margin: '0px',
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '20px',
};

const PreRecomendationInfo: Rule = {
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '20px',
  margin: '0px',
};

export default GreatFeedbackModal;