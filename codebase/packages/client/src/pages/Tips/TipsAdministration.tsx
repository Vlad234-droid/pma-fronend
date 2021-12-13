import React, { FC, Fragment, useEffect } from 'react';
import { useStyle, Rule, useBreakpoints } from '@dex-ddl/core';
import { IconButton } from 'components/IconButton';
import { NoTips, TipsCard } from 'features/Tips';
import { tipsActions, getTipsSelector } from '@pma/store';
import { useDispatch, useSelector } from 'react-redux';

const TipsAdministration: FC = () => {
  const { css } = useStyle();
  const dispatch = useDispatch();
  const tips = useSelector(getTipsSelector);

  useEffect(() => {
    dispatch(
      tipsActions.getAllTips({}),
    );
  }, []);

  const handleCreateTip = () => {
    console.log("Button Clicked!")
  };

  return (
    <Fragment>
      <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' })}>
        <div>
          <IconButton
            customVariantRules={{ default: iconBtnStyle }}
            onPress={handleCreateTip}
            graphic='add'
            iconProps={{ invertColors: true }}
            iconStyles={iconStyle}
          >
            <span>Create new tip</span>
          </IconButton>
        </div>
      </div>
      
      {/* <NoTips /> */}

      {tips.map(item => {
        return <TipsCard card={item} key={item.uuid} />
      })}
    </Fragment>
  )
}

const iconBtnStyle: Rule = ({ theme }) => {
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  return {
    padding: '12px 20px 12px 22px',
    display: 'flex',
    height: '40px',
    borderRadius: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    outline: 0,
    background: theme.colors.tescoBlue,
    color: theme.colors.white,
    cursor: 'pointer',
    fontSize: mobileScreen ? '14px' : '16px',
    fontWeight: 'bold'
  }
};

const iconStyle: Rule = {
  marginRight: '10px',
  height: '20px'
};

export default TipsAdministration;