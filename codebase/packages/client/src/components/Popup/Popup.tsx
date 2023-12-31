import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { CreateRule, Icon, ModalWithHeader, Rule, useStyle } from '@pma/dex-wrapper';
import Details from 'components/Details';
import { Page } from 'pages';
import { buildPath } from 'features/general/Routes';
import { paramsReplacer } from 'utils';
import useLocation from 'hooks/useLocation';

export const TEST_ID = 'popup-test-id';

export type Props = {
  items: Array<{
    title: string;
    uuid: string;
  }>;
};

const Popup: FC<Props> = ({ items }) => {
  const { css, matchMedia } = useStyle();
  const { state } = useLocation<{ uuid?: string }>();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;
  const navigate = useNavigate();

  if (items.length < 1) return null;

  return (
    <ModalWithHeader
      containerRule={templatesModalWindowStyles({ mobileScreen })}
      title='Strategic drivers'
      modalPosition='middle'
      closeOptions={{
        closeOptionContent: <Icon graphic={'close'} invertColors={true} />,
        closeOptionStyles: {},
        onClose: () =>
          state?.uuid
            ? navigate(buildPath(paramsReplacer(Page.USER_REVIEWS, { ':uuid': state.uuid })))
            : navigate(buildPath(Page.REVIEWS_VIEW)),
      }}
    >
      <div data-test-id={TEST_ID} className={css(main)}>
        <div className={css(descriptionHeader)}>Your organisation&#39;s strategic drivers</div>
        <div className={css(templatesListStyles)}>
          {items.map((obj, idx) => {
            return (
              obj.title && <Details key={obj.uuid} title={`Strategic driver ${idx + 1}`} description={obj.title} />
            );
          })}
        </div>
      </div>
    </ModalWithHeader>
  );
};

const main: Rule = {
  position: 'relative',
  overflowY: 'auto',
  height: '100%',
  padding: '40px',
};

const templatesListStyles: Rule = () => ({
  margin: '0px',
});

const templatesModalWindowStyles: CreateRule<{ mobileScreen }> = ({ mobileScreen }) => {
  return {
    width: mobileScreen ? '100%' : '60%',
    padding: '0',
    height: mobileScreen ? 'calc(100% - 50px)' : 'calc(100% - 100px)',
    marginTop: mobileScreen ? '50px' : 0,
    overflow: 'hidden',
  };
};

const descriptionHeader: Rule = ({ theme }) => ({
  fontSize: theme.font.fixed.f24.fontSize,
  lineHeight: theme.font.fixed.f24.lineHeight,
  letterSpacing: '0px',
  fontWeight: theme.font.weight.bold,
  paddingBottom: '8px',
});

export default Popup;
