import React, { FC, SyntheticEvent } from 'react';
import { Rule, useStyle } from '@dex-ddl/core';

import { Radio } from 'components/Form';

import { View } from '../../config/types';

type Props = {
  onChange: (event: SyntheticEvent) => void;
  view: View;
};

const ViewFilters: FC<Props> = ({ view, onChange }) => {
  const { css } = useStyle();

  return (
    <div className={css({ display: 'flex', flexDirection: 'row' })}>
      <label className={css({ ...filterItemStyles, marginRight: '32px' })}>
        <Radio
          id={View.DIRECT_REPORTS}
          value={View.DIRECT_REPORTS}
          name={View.DIRECT_REPORTS}
          onChange={onChange}
          checked={view === View.DIRECT_REPORTS}
        />
        <span className={css(filterLabelStyles)}>My direct reports</span>
      </label>
      <label className={css(filterItemStyles)}>
        <Radio
          id={View.FULL_TEAM}
          value={View.FULL_TEAM}
          name={View.FULL_TEAM}
          onChange={onChange}
          checked={view === View.FULL_TEAM}
        />
        <span className={css(filterLabelStyles)}>My full team</span>
      </label>
    </div>
  );
};

const filterItemStyles: Rule = {
  display: 'flex',
  alignItems: 'center',
};

const filterLabelStyles: Rule = {
  marginLeft: '11px',
  fontSize: '16px',
  lineHeight: '20px',
};

export default ViewFilters;
