import React from 'react';
import { useStyle } from '@pma/dex-wrapper';

import { invertColor } from '../utils';
import { FCGraphicProps } from './types';

export const Print: FCGraphicProps = ({ invertColors }) => {
  const { theme } = useStyle();

  const stroke = invertColor(theme.colors.link, invertColors, theme);

  return (
    <path
      stroke='null'
      fill={stroke}
      d='m6.0813,0.24728l0.70201,0l10.53018,0l0.70194,0l0,0.70201l0,3.97806l3.82948,0c1.11672,0 2.02074,0.90399 2.02074,2.02061l0,9.06303c0,1.11658 -0.90402,2.0206 -2.02074,2.0206l-2.65944,0l0,5.148l0,0.70208l-0.70194,0l-12.87024,0l-0.70201,0l0,-0.70208l0,-5.148l-2.65946,0c-1.11663,0 -2.02061,-0.90402 -2.02061,-2.0206l0,-9.06303c0,-1.11663 0.90399,-2.02061 2.02061,-2.02061l3.82948,0l0,-3.97806l0,-0.70201zm1.40402,4.68008l9.12609,0l0,-3.27605l-9.12609,0l0,3.27605zm-2.57404,11.70021l0,-3.97809l0,-0.70201l0.70201,0l12.87024,0l0.70194,0l0,0.70201l0,3.97809l2.65944,0c0.34133,0 0.61672,-0.27539 0.61672,-0.61657l0,-9.06303c0,-0.3412 -0.27539,-0.61659 -0.61672,-0.61659l-19.5931,0c-0.3412,0 -0.61659,0.27539 -0.61659,0.61659l0,9.06303c0,0.34119 0.27539,0.61657 0.61659,0.61657l2.65946,0zm1.40402,-3.27601l0,9.12609l11.46615,0l0,-9.12609l-11.46615,0zm2.22303,3.50999l7.02017,0l0,-1.40402l-7.02017,0l0,1.40402zm7.02017,3.50999l-7.02017,0l0,-1.40402l7.02017,0l0,1.40402z'
      clipRule='evenodd'
      fillRule='evenodd'
    />
  );
};
