import React from 'react';
import { useStyle } from '@pma/dex-wrapper';

import { invertColor } from '../utils';

import { FCGraphicProps } from './types';

export const Edit: FCGraphicProps = ({ invertColors }) => {
  const { theme } = useStyle();

  const stroke = invertColor(theme.colors.link, invertColors, theme);

  return (
    <path
      stroke='null'
      fill={stroke}
      d='M21.3775 4.43367L19.5652 2.62117C18.7371 1.79309 17.3898 1.79313 16.5618 2.62117C15.7821 3.4009 3.87368 15.3102 3.07786 16.1061C2.9931 16.1908 2.9363 16.3035 2.91606 16.4137L2.00989 21.3074C1.97478 21.4972 2.03524 21.692 2.17169 21.8285C2.30829 21.9651 2.50321 22.0254 2.69271 21.9903L7.58602 21.084C7.69911 21.0629 7.81028 21.0056 7.89364 20.9222L21.3775 7.4373C22.2075 6.6073 22.2077 5.26379 21.3775 4.43367ZM3.31731 20.6827L3.86548 17.7224L6.27743 20.1345L3.31731 20.6827ZM7.47934 19.6792L4.32079 16.5204L15.8524 4.98793L19.011 8.14671L7.47934 19.6792ZM20.5489 6.60867L19.8396 7.31808L16.681 4.1593L17.3904 3.44988C17.7615 3.07871 18.3654 3.07867 18.7366 3.44988L20.5489 5.26238C20.921 5.63445 20.921 6.23656 20.5489 6.60867Z'
    />
  );
};
