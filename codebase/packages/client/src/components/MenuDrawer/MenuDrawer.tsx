import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rule, useStyle } from '@dex-ddl/core';
import { Page } from 'pages';
import { LINKS } from 'config/constants';
import { buildPath } from 'features/Routes';
import { ConfirmModal } from 'features/Modal';
import {
  CanPerform,
  ADMIN,
  COLLEAGUE,
  PEOPLE_TEAM,
  TALENT_ADMIN,
  LINE_MANAGER,
  PROCESS_MANAGER,
} from 'features/Permission';
import { useTranslation } from 'components/Translation';
import { MenuItem } from 'components/MenuItem';
import TescoLogo from './TescoLogo.svg';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

export type MenuDrawerProps = { onClose: () => void };

export const MenuDrawer: FC<MenuDrawerProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropdown, toggleOpen] = useState(false);

  const { css } = useStyle();
  const { t } = useTranslation();

  const handleToggleDropdown = () => {
    toggleOpen((isOpen) => !isOpen);
  };

  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleSignOutConfirm = () => {
    window.location.href = LINKS.signOut;
    setIsOpen(false);
  };

  return (
    <div className={css(menuDrawerWrapperStyle)}>
      <div className={css(menuDrawerContentStyle)}>
        <div className={css(menuDrawerTopStyle)}>
          <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
            <img className={css({ maxWidth: 'inherit' })} src={TescoLogo} alt='TescoLogo' />
            <IconButton graphic={'cancel'} onPress={onClose} />
          </div>
          <div className={css(menuDrawerTitleStyle)}>Your Contribution</div>
          <div className={css(menuDrawerButtonsStyle)}>
            <MenuItem iconGraphic={'home'} linkTo={buildPath(Page.CONTRIBUTION)} title={'Your contribution'} />
            <MenuItem
              iconGraphic={'aim'}
              linkTo={buildPath(Page.OBJECTIVES_VIEW)}
              title={t('my_objectives_and_reviews', 'My objectives and reviews')}
            />
            <CanPerform
              perform={[LINE_MANAGER, PEOPLE_TEAM, COLLEAGUE]}
              yes={() => (
                <MenuItem
                  iconGraphic={'list'}
                  linkTo={buildPath(Page.PERSONAL_DEVELOPMENT_PLAN)}
                  title={'Personal Development Plan'}
                />
              )}
            />
            <MenuItem iconGraphic={'edit'} linkTo={buildPath(Page.NOTES)} title={'My notes'} />
            <MenuItem iconGraphic={'account'} linkTo={buildPath(Page.PROFILE)} title={'My profile'} />
            <MenuItem iconGraphic={'chatSq'} linkTo={buildPath(Page.FEEDBACK)} title={'Feedback'} />
            <MenuItem iconGraphic={'performance'} linkTo={'/'} title={'Support your performance'} />
            <CanPerform
              perform={[LINE_MANAGER, PEOPLE_TEAM, TALENT_ADMIN]}
              yes={() => <MenuItem iconGraphic={'team'} linkTo={buildPath(Page.REPORT)} title={'Team reporting'} />}
            />
            <MenuItem iconGraphic={'calibration'} linkTo={'/'} title={'Calibration ratings'} />
          </div>
        </div>
        <div className={css(menuDrawerSettingsStyle)}>
          <div className={css(itemSettingsStyle, adminToolsStyle)} onClick={handleToggleDropdown}>
            <Icon graphic={'tool'} />
            <span className={css(itemSettingsTextStyle)}>Administrator tools</span>
            <Icon
              graphic={'arrowDown'}
              iconStyles={{
                marginLeft: '15px',
                transform: isOpenDropdown ? 'rotate(-0deg)' : 'rotate(-90deg)',
                transition: 'all .2s ease-in-out',
              }}
            />
          </div>
          {isOpenDropdown && (
            <div className={css(menuDropdownStyle)}>
              <CanPerform
                perform={[PEOPLE_TEAM, TALENT_ADMIN, PROCESS_MANAGER, ADMIN]}
                yes={() => (
                  <Link
                    to={buildPath(Page.PERFORMANCE_CYCLE)}
                    className={css(itemSettingsStyle, itemSettingsBorderStyle)}
                  >
                    <Icon graphic={'createCycle'} />
                    <span className={css(itemSettingsTextStyle)}>Create performance cycle</span>
                  </Link>
                )}
              />
              <CanPerform
                perform={[TALENT_ADMIN]}
                yes={() => (
                  <Link
                    to={buildPath(Page.CREATE_STRATEGIC_DRIVERS)}
                    className={css(itemSettingsStyle, itemSettingsBorderStyle)}
                  >
                    <Icon graphic={'strategicDriver'} />
                    <span className={css(itemSettingsTextStyle)}>Strategic drivers</span>
                  </Link>
                )}
              />
              <Link to={'/'} className={css(itemSettingsStyle, itemSettingsBorderStyle)}>
                <Icon graphic={'configuration'} />
                <span className={css(itemSettingsTextStyle)}>Configurations</span>
              </Link>
              <CanPerform
                perform={[COLLEAGUE, LINE_MANAGER, PEOPLE_TEAM, ADMIN]}
                yes={() => (
                  <Link to={buildPath(Page.TIPS)} className={css(itemSettingsStyle, itemSettingsBorderStyle)}>
                    <Icon graphic={'tip'} />
                    <span className={css(itemSettingsTextStyle)}>Tips</span>
                  </Link>
                )}
              />
              <CanPerform
                perform={[TALENT_ADMIN]}
                yes={() => (
                  <Link to={'/'} className={css(itemSettingsStyle, itemSettingsBorderStyle)}>
                    <Icon graphic={'multiLanguage'} />
                    <span className={css(itemSettingsTextStyle)}>Multi-lingual administration</span>
                  </Link>
                )}
              />
            </div>
          )}
          <div className={css(itemSettingsBorderStyle, { marginLeft: '20px' })} />
          <Link to={''} className={css(itemSettingsStyle)}>
            <Icon graphic={'settingsGear'} />
            <span className={css(itemSettingsTextStyle)}>Settings</span>
          </Link>
          <Link to={''} className={css(itemSettingsStyle, itemSettingsBorderStyle)}>
            <Icon graphic={'question'} />
            <span className={css(itemSettingsTextStyle)}>{`Help and FAQs`}</span>
          </Link>
          <a href={LINKS.signOut} className={css(itemSettingsStyle, itemSettingsBorderStyle)} onClick={handleSignOut}>
            <Icon graphic={'signOut'} />
            <span className={css(itemSettingsTextStyle)}>{t('sign_out', 'Sign out')}</span>
          </a>
        </div>
      </div>
      {isOpen && (
        <ConfirmModal
          title={''}
          description={t('are_you_sure_you_want_to_log_out', 'Are you sure you want to log out?')}
          submitBtnTitle={t('confirm', 'Confirm')}
          onSave={handleSignOutConfirm}
          onCancel={() => setIsOpen(false)}
          onOverlayClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const menuDrawerWrapperStyle: Rule = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'rgba(0, 83, 159, 0.7)',
  zIndex: 2,
};

const menuDrawerContentStyle: Rule = {
  position: 'absolute',
  right: 0,
  top: 0,
  maxWidth: '360px',
  background: '#F6F6F6',
  minHeight: '100vh',
};

const menuDrawerTopStyle: Rule = {
  padding: '24px',
};

const menuDrawerTitleStyle: Rule = ({ theme }) => ({
  color: theme.colors.tescoBlue,
  padding: '8px 0 24px',
});

const menuDrawerButtonsStyle: Rule = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
};

const menuDrawerSettingsStyle: Rule = {
  background: '#FFFFFF',
  height: '100%',
  padding: '6px 0 0 0',
};

const itemSettingsTextStyle: Rule = {
  paddingLeft: '16px',
};

const itemSettingsStyle: Rule = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 0',
  margin: '0 0 0 20px',
};

const itemSettingsBorderStyle: Rule = ({ theme }) => ({
  borderTop: `1px solid ${theme.colors.backgroundDarkest}`,
});

const menuDropdownStyle: Rule = {
  backgroundColor: '#F3F9FC',
  transition: 'all .5s esea-in-out',
};

const adminToolsStyle: Rule = {
  cursor: 'pointer',
  userSelect: 'none',
};
