import React, { FC } from 'react';
import { IconButton, Rule, Styles, useStyle, CreateRule } from '@pma/dex-wrapper';
import { useLocation, useNavigate } from 'react-router-dom';

import { Graphics, RoundIcon, Icon } from 'components/Icon';
import { AlertDrawer, AlertBadge, useMessagesContext } from 'features/general/Messages';
import { DataModal } from 'features/general/Profile';
import { MenuDrawer } from 'features/general/MenuDrawer';
import UnderlayModal from 'components/UnderlayModal';

export type HeaderProps = {
  title: string;
  onBack?: () => void;
  styles?: Styles | Rule;
  customSize?: boolean;
  withIcon?: boolean;
  iconName?: Graphics;
};

export const TEST_ID = 'header';
export const BACK_BTN_TEST_ID = 'header-back-test-id';
export const MENU_BTN = 'menu-btn';

const Header: FC<HeaderProps> = ({ title, onBack, withIcon, iconName = 'home', styles = {} }) => {
  const { css, matchMedia } = useStyle();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;
  const navigate = useNavigate();
  const { pathname, state, search }: { state: any; pathname: string; search: string } = useLocation();
  const { isMenuOpen, isAlertOpen } = (state as any) || {};

  const { fetchMessagesCount } = useMessagesContext();

  const handleMenuOpen = () => {
    navigate(`${pathname}${search}`, {
      state: {
        ...state,
        isMenuOpen: true,
      },
    });
  };

  const handleClose = () => {
    navigate(`${pathname}${search}`, { state: { ...state, isMenuOpen: false, isAlertOpen: false }, replace: true });
  };

  const handleAlertClose = async () => {
    handleClose();
    fetchMessagesCount();
  };

  const handleAlertOpen = () => {
    navigate(pathname, {
      state: {
        ...state,
        isAlertOpen: true,
      },
    });
  };

  return (
    <div className={css(wrapperStyles, styles)} data-test-id={TEST_ID}>
      <DataModal />
      {onBack ? <IconButton onPress={onBack} graphic='backwardLink' testId={BACK_BTN_TEST_ID} /> : <div />}
      <h3 className={css(headerStyles({ mobileScreen, hasPadding: !onBack }))}>
        {withIcon && (
          <div className={css(iconWrapperStyle)}>
            <Icon graphic={iconName} />
          </div>
        )}
        {title}
      </h3>
      <div className={css(itemsStyles({ mobileScreen }))}>
        <RoundIcon>
          <IconButton onPress={handleAlertOpen} graphic='alert' />
          <AlertBadge />
        </RoundIcon>
        <Icon onClick={handleMenuOpen} graphic='hamburger' iconStyles={iconStyles} containerTestId={MENU_BTN} />
      </div>
      {<MenuDrawer onClose={handleClose} isOpen={isMenuOpen} />}
      {isAlertOpen && (
        <UnderlayModal onClose={handleAlertClose}>{({ onClose }) => <AlertDrawer onClose={onClose} />}</UnderlayModal>
      )}
    </div>
  );
};

const iconStyles: Rule = {
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};

const itemsStyles: CreateRule<{ mobileScreen: boolean }> = ({ mobileScreen }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: mobileScreen ? '15px' : '30px',
  alignItems: 'center',
});

const wrapperStyles: Rule = {
  display: 'flex',
  justifyContent: 'space-between',
};

const headerStyles: CreateRule<{ mobileScreen: boolean; hasPadding: boolean }> =
  ({ mobileScreen, hasPadding }) =>
  ({ theme }) => ({
    fontSize: theme.font.fixed.f24.fontSize,
    lineHeight: theme.font.fixed.f24.lineHeight,
    letterSpacing: '0px',
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.tescoBlue,
    marginRight: 'auto',
    ...(mobileScreen
      ? {
          marginLeft: '25px',
          paddingLeft: 0,
        }
      : {
          marginLeft: 'auto',
          paddingLeft: hasPadding ? '91px' : '66px',
        }),
  });

const iconWrapperStyle: Rule = { height: '24px', marginRight: '10px', '& > span': { display: 'flex' } } as Styles;

export default Header;
