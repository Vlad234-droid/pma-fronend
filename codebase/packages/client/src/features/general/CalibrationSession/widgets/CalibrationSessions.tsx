import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import { Rule, theme } from '@pma/dex-wrapper';

import { Page } from 'pages';

import { useTranslation } from 'components/Translation';
import BaseWidget from 'components/BaseWidget';
import { role, usePermission } from 'features/general/Permission';
import { buildPath } from 'features/general/Routes';

const CreateCalibrationSession: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isPerform = usePermission([role.TALENT_ADMIN]);
  const onClick = () => {
    navigate(buildPath(Page.CALIBRATION_SESSION_LIST));
  };

  return (
    <BaseWidget
      iconGraphic={'chart'}
      title={t('calibration_sessions', 'Calibration sessions')}
      hover={false}
      withButton={false}
      onClick={onClick}
      customStyle={{
        fontSize: theme.font.fixed.f16.fontSize,
        lineHeight: theme.font.fixed.f16.lineHeight,
        letterSpacing: '0px',
        cursor: 'pointer',
        ...tileWrapperStyles,
        ...(isPerform && {
          cursor: 'none',
          display: 'none',
        }),
        '& span': {
          '&:last-child': {
            fontSize: theme.font.fixed.f16.fontSize,
            marginBottom: '8px',
          },
        },
      }}
    />
  );
};

export default CreateCalibrationSession;

const tileWrapperStyles: Rule = { minWidth: '350px' };
