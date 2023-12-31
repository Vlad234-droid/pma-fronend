import React, { forwardRef } from 'react';
import { useStyle, CreateRule, Rule } from '@pma/dex-wrapper';
import { useTranslation } from 'components/Translation';
import { View } from '../../types';

export const VIEW_WRAPPER = 'view-wrapper';

type Props = {
  active: View;
  setActive: (view: View) => void;
};

const ListView = forwardRef(function ListView<P extends Props>(props: P, ref) {
  const { active, setActive } = props;
  const { css } = useStyle();
  const { t } = useTranslation();

  const clickHandler = (e) => setActive(e.target?.id);

  return (
    <div className={css(viewContainer)} onClick={clickHandler} ref={ref} data-test-id={VIEW_WRAPPER}>
      <div id={View.GRAPH} className={css(viewStyle({ active: active === View.GRAPH }))}>
        {t('graph', 'Graph')}
      </div>
      <div id={View.LIST} className={css(viewStyle({ active: active === View.LIST }))}>
        {t('list', 'List')}
      </div>
      <div id={View.TABLE} className={css(viewStyle({ active: active === View.TABLE }))}>
        {t('table', 'Table')}
      </div>
    </div>
  );
});

const viewContainer: Rule = ({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: theme.colors.white,
  borderRadius: '32px',
  cursor: 'pointer',
});

const viewStyle: CreateRule<{ active: boolean }> =
  ({ active }) =>
  ({ theme }) => ({
    fontWeight: theme.font.weight.bold,
    transition: 'color 0.2s ease, background 0.2s ease',
    padding: '10px 20px',
    borderRadius: '32px',
    color: theme.colors.tescoBlue,
    ...(active && {
      color: theme.colors.white,
      background: theme.colors.tescoBlue,
    }),
  });

export default ListView;
