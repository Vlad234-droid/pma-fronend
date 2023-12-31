import React from 'react';
import { useStyle } from '@pma/dex-wrapper';

import { invertColor } from '../utils';
import { FCGraphicProps } from './types';

export const ArrowUp: FCGraphicProps = ({ invertColors }) => {
  const { theme } = useStyle();

  const color = invertColor(theme.colors.link, invertColors, theme);

  return (
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M22 16.3655L12.0045 6L2 16.3653L3.07956 17.4072L12.004 8.161L20.92 17.407L22 16.3655Z'
      fill={color}
    />
  );
};
