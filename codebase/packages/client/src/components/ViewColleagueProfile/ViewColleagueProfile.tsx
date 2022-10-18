import React, { FC } from 'react';
import { useStyle, Rule } from '@pma/dex-wrapper';
import { TileWrapper } from 'components/Tile';
import { Trans } from 'components/Translation';

import defaultImg from 'images/default.png';

export const TILE_WRAPPER = 'tile-wrapper';
export const NAME = 'name';

type colleagueValue = string | null;

export type ColleagueProfile = {
  businessType: colleagueValue;
  firstName: colleagueValue;
  jobName: colleagueValue;
  lastName: colleagueValue;
  lineManager?: colleagueValue;
  middleName?: colleagueValue;
  uuid: string;
};

export type Props = {
  colleague: ColleagueProfile;
  onClick: (uuid: string) => void;
  title?: string;
};

const ViewColleagueProfile: FC<Props> = ({ colleague, onClick, title }) => {
  const { css } = useStyle();

  return (
    <TileWrapper customStyle={wrapperStyles}>
      <div className={css(sectionStyle)}>
        <div className={css(blockInfo)}>
          <div className={css({ alignSelf: 'flex-start' })}>
            <img className={css(imgStyle)} src={defaultImg} alt='photo' />
          </div>
          <div className={css({ marginLeft: '16px' })}>
            <h3 className={css(namesStyle)} data-test-id={NAME}>{`${colleague.firstName} ${colleague.lastName}`}</h3>
            <p className={css(industryStyle)}>{`${colleague.jobName || ''}, ${colleague.businessType || ''}`}</p>
          </div>
        </div>

        <div className={css({ display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          <div className={css({ display: 'flex', alignItems: 'center' })}>
            <span className={css(viewStyle)} onClick={() => onClick(colleague.uuid)}>
              <Trans i18nKey={title ? title : 'view_profile'} />
            </span>
          </div>
        </div>
      </div>
    </TileWrapper>
  );
};

const industryStyle: Rule = {
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '20px',
  margin: '4px 0px 0px 0px',
};

const viewStyle: Rule = ({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: `${theme.font.fixed.f16.fontSize}`,
  lineHeight: `${theme.font.fixed.f20.lineHeight}`,
  color: `${theme.colors.link}`,
  cursor: 'pointer',
  padding: '2px',
});

const wrapperStyles: Rule = {
  padding: '24px 24px 24px 24px',
};

const sectionStyle: Rule = {
  display: 'flex',
  justifyContent: 'space-between',
};

const blockInfo: Rule = {
  display: 'inline-flex',
  alignItems: 'center',
};

const imgStyle: Rule = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
};
const namesStyle: Rule = {
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '22px',
  margin: '0px',
  color: '#00539F',
};

export default ViewColleagueProfile;
