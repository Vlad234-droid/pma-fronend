import React from 'react';

import { FCGraphicProps } from './types';
import { useStyle } from '@pma/dex-wrapper';
import { invertColor } from 'components/Icon/utils';

export const Question: FCGraphicProps = ({ invertColors, color }) => {
  const { theme } = useStyle();

  const fill = color || invertColor(theme.colors.link, invertColors, theme);
  return (
    <>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.81775 3.42583C7.78989 4.08946 6.79944 5.29358 6.5975 7.53522L5.40234 7.42756C5.63741 4.81821 6.82845 3.28182 8.16685 2.4177C9.47431 1.57355 10.873 1.40039 11.5389 1.40039C13.3576 1.40039 14.8799 1.90892 15.9545 2.88139C17.0358 3.85989 17.5999 5.25099 17.5999 6.88039C17.5999 9.63601 15.7545 11.1194 14.3623 11.8722L14.3561 11.8755L14.3561 11.8755C13.614 12.2656 13.0667 12.6468 12.6956 13.1497C12.3351 13.6384 12.0999 14.2993 12.0999 15.3264V16.5004H10.8999V15.3264C10.8999 14.1015 11.1857 13.1749 11.73 12.4373C12.263 11.7149 13.0028 11.2315 13.7945 10.815C15.0276 10.1475 16.3999 8.98308 16.3999 6.88039C16.3999 5.53879 15.9436 4.48989 15.1493 3.77114C14.3484 3.04636 13.1403 2.60039 11.5389 2.60039C11.0288 2.60039 9.87653 2.74224 8.81775 3.42583ZM11.4999 20.6C11.0033 20.6 10.5999 21.0034 10.5999 21.5C10.5999 21.9966 11.0033 22.4 11.4999 22.4C11.9966 22.4 12.3999 21.9966 12.3999 21.5C12.3999 21.0034 11.9966 20.6 11.4999 20.6ZM9.39992 21.5C9.39992 20.3406 10.3406 19.4 11.4999 19.4C12.6593 19.4 13.5999 20.3406 13.5999 21.5C13.5999 22.6594 12.6593 23.6 11.4999 23.6C10.3406 23.6 9.39992 22.6594 9.39992 21.5Z'
        fill={fill}
      />
    </>
  );
};
