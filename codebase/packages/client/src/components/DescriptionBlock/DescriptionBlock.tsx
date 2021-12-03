import React from 'react';
import { Rule, useStyle } from '@dex-ddl/core';

const DescriptionBlock = (props) => {
  const { css } = useStyle();

  return <div className={css(description, props.style ? props.style : null)}>{props.children}</div>;
};

const description = {
  backgroundColor: '#FFFFFF',
  boxShadow: '3px 3px 1px 1px rgba(0, 0, 0, 0.05)',
  borderRadius: '10px',
  padding: '24px',
  boxSizing: 'border-box',
  '@media (max-width: 900px)': {
    width: '100%',
  },
  '@media (min-width: 900px)': {
    width: '640px',
  },
} as Rule;

export default DescriptionBlock;