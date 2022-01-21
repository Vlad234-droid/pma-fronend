import React, { FC, HTMLProps } from 'react';
import { Trans, useTranslation } from 'components/Translation';
import { CreateRule, Rule, Styles, useBreakpoints, useStyle } from '@dex-ddl/core';
import { BasicTile } from 'components/Tile';

export type DashboardProfileProps = {
  user?: any;
};

type Props = HTMLProps<HTMLInputElement> & DashboardProfileProps;

const wrapperStyle = {
  padding: '0',
} as Styles;

const bodyBlockStyle = {
  minWidth: '200px',
  display: 'grid',
  paddingRight: '20px',
  paddingTop: '14px',
  flex: '1 1 0',
} as Styles;

const titleStyle: Rule = ({ theme }) =>
  ({
    fontStyle: 'normal',
    fontWeight: `${theme.font.weight.bold}`,
    fontSize: '16px',
    lineHeight: '20px',
  } as Styles);

const descriptionStyle = {
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '20px',
} as Styles;

const bodyStyle = {
  flexWrap: 'wrap',
  gap: '16px 8px',
  alignItems: 'center',
  display: 'inline-flex',
} as Styles;

const tileStyle: CreateRule<{ mobileScreen }> = ({ mobileScreen }) => ({
  ...(mobileScreen ? {
    padding: '6px 0 0',
  } : {
    padding: '14px 10px 10px',
  })
});

const ProfessionalInformation: FC<Props> = ({ user }) => {
  const { css } = useStyle();
  const { t } = useTranslation();
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  const { hireDate, job, department, businessType, manager, employmentType, countryCode } = user;
  return (
    <BasicTile
      title={t('ProfessionalInformation', 'Professional information')}
      description={''}
      customStyle={tileStyle({mobileScreen})}
    >
      <div className={css(wrapperStyle)}>
        <div className={css(bodyStyle)}>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Job title</Trans>
            </span>
            <span className={css(descriptionStyle)}>{job}</span>
          </div>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Function</Trans>
            </span>
            <span className={css(descriptionStyle)}>{department}</span>
          </div>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Business unit</Trans>
            </span>
            <span className={css(descriptionStyle)}>{businessType}</span>
          </div>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Line manager</Trans>
            </span>
            <span className={css(descriptionStyle)}>{manager}</span>
          </div>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Employment</Trans>
            </span>
            <span className={css(descriptionStyle)}>{employmentType}</span>
          </div>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Hire date</Trans>
            </span>
            <span className={css(descriptionStyle)}>{hireDate}</span>
          </div>
          <div className={css(bodyBlockStyle)}>
            <span className={css(titleStyle)}>
              <Trans>Location</Trans>
            </span>
            <span className={css(descriptionStyle)}>{countryCode}</span>
          </div>
        </div>
      </div>
    </BasicTile>
  );
};

export default ProfessionalInformation;
