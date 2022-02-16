import React, { FC } from 'react';
import { Rule, useStyle } from '@dex-ddl/core';

import { BasicTile } from 'components/Tile';
import { Icon } from 'components/Icon';
import { LINKS } from 'config/constants';
import { useTranslation } from 'components/Translation';

const HelpWidgets: FC = () => {
  const { css } = useStyle();
  const { t } = useTranslation();

  const handleSupportClick = () => {
    window.open(LINKS.help, '_blank')?.focus();
  };

  return (
    <div data-test-id='help-widgets' className={css(wrapperStyles)}>
      <div data-test-id='question-tile' className={css({ height: '100%' })}>
        <BasicTile
          img={<Icon graphic='question' />}
          title={t('want_to_learn_more', 'Want to learn more about Your Contribution at Tesco?')}
          imgCustomStyle={imageStyles}
          customStyle={{
            ...widgetStyles,
          }}
          icon={true}
        >
          <div className={css(contentStyle)}>Coming soon</div>
        </BasicTile>
      </div>
    </div>
  );
};

export default HelpWidgets;

const contentStyle: Rule = {
  fontWeight: 'bold',
  fontStyle: 'italic',
};

const wrapperStyles: Rule = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 216px',
  gap: '8px',
  alignItems: 'stretch',
};

const widgetStyles: Rule = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  height: '100%',
  padding: '24px 27px 24px 10px',
};

const imageStyles: Rule = {
  width: '30px',
  margin: '8px auto 0px',
};