import React, { FC, useState } from 'react';
import { Button, Rule, useBreakpoints, useStyle, Modal } from '@dex-ddl/core';
import { Radio } from 'components/Form';
import { Trans } from 'components/Translation';
import { FilterOption } from 'features/Shared';
import { IconButton } from 'components/IconButton';
import { DraftItem } from './components';
import { Notification } from 'components/Notification';
import { Icon } from 'components/Icon';
import { ModalDownloadFeedback } from './components/ModalParts';
import { ColleaguesActions } from '@pma/store';
import { useDispatch } from 'react-redux';

const ViewFeedbackComp: FC = () => {
  const { css } = useStyle();
  const dispatch = useDispatch();

  const [openMainModal, setOpenMainModal] = useState<boolean>(false);
  const [ModalSuccess, setModalSuccess] = useState<boolean>(false);
  const [checkedRadio, setCheckedRadio] = useState({
    unread: true,
    read: false,
  });

  const draftFeedback = (id) => {
    console.log('id', id);
  };

  const closeHandler = () => {
    setOpenMainModal(() => false);
  };
  return (
    <>
      <div>
        <div className={css(SpaceBeetweenStyled)}>
          <div className={css({ display: 'flex' })}>
            <div className={css({ padding: '0px 10px', cursor: 'pointer' })}>
              <label
                htmlFor='unread'
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                })}
              >
                <Radio
                  type='radio'
                  name='status'
                  value='option1'
                  checked={checkedRadio.unread}
                  id='unread'
                  onChange={() => {
                    setCheckedRadio(() => {
                      return {
                        unread: true,
                        read: false,
                      };
                    });
                  }}
                />
                <span
                  className={css({
                    fontSize: '16px',
                    lineHeight: '20px',
                    padding: '0px 5px',
                  })}
                >
                  <Trans>Unread</Trans>
                </span>
              </label>
            </div>
            <div className={css({ padding: '0px 10px', cursor: 'pointer' })}>
              <label
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                })}
              >
                <Radio
                  type='radio'
                  name='status'
                  value='option2'
                  checked={checkedRadio.read}
                  onChange={() => {
                    setCheckedRadio(() => {
                      return {
                        unread: false,
                        read: true,
                      };
                    });
                  }}
                />
                <span
                  className={css({
                    fontSize: '16px',
                    lineHeight: '20px',
                    padding: '0px 5px',
                  })}
                >
                  <Trans>Read</Trans>
                </span>
              </label>
            </div>
          </div>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
            })}
          >
            <IconButton graphic='information' iconStyles={iconStyle} />
            <FilterOption />
          </div>
        </div>
        <div className={css(Reverse_Items_Styled)}>
          <div className={css(Drafts_style)}>
            <DraftItem draftFeedback={draftFeedback} checkedRadio={checkedRadio} />
          </div>
          <div className={css(Buttons_actions_style)}>
            <div className={css(Button_container_style)}>
              <div className={css({ display: 'inline-flex' })}>
                <Icon
                  graphic='chatSq'
                  iconStyles={{ verticalAlign: 'middle', margin: '2px 10px 0px 0px' }}
                  backgroundRadius={10}
                />
                <span className={css(ShareFeedback_Styled)}>Share feedback</span>
              </div>
              <p className={css(Question_Styled)}>Why not give feedback back to your colleagues?</p>
              <Button
                styles={[iconBtnStyle]}
                onPress={() => {
                  console.log('hello');
                }}
              >
                <Trans i18nKey='share_feedback'>Share feedback</Trans>
              </Button>
            </div>
            <div className={css(Button_container_style)}>
              <div className={css({ display: 'inline-flex' })}>
                <Icon
                  graphic='download'
                  iconStyles={{ verticalAlign: 'middle', margin: '2px 10px 0px 0px' }}
                  backgroundRadius={10}
                />
                <span
                  className={css({
                    fontWeight: 'bold',
                    fontSize: '18px',
                    lineHeight: '22px',
                    color: '#00539F',
                  })}
                >
                  Download feedback
                </span>
              </div>
              <p
                className={css({
                  fontWeight: 'normal',
                  fontSize: '16px',
                  lineHeight: '20px',
                  margin: '4px 0px 0px 0px',
                })}
              >
                Save feedback to your device
              </p>
              <Button
                styles={[iconBtnStyle, { maxWidth: '161px !important' }]}
                onPress={() => {
                  setOpenMainModal(() => true);
                }}
              >
                <Trans>Download feedback</Trans>
              </Button>
            </div>
            <Notification
              graphic='information'
              iconColor='pending'
              text='If you feel feedback is [x.y.z.] – please speak to your line manager or people team.'
              customStyle={{
                background: '#FFDBC2',
                marginBottom: '20px',
                marginTop: '16px',
              }}
            />
          </div>
        </div>
      </div>
      {openMainModal && (
        <Modal
          modalPosition={'middle'}
          overlayColor={'tescoBlue'}
          modalContainerRule={[containerRule]}
          closeOptions={{
            content: <Icon graphic='cancel' invertColors={true} />,
            onClose: () => {
              dispatch(ColleaguesActions.clearGettedCollegues());
              setModalSuccess(() => false);
              setOpenMainModal(() => false);
            },
            styles: [modalCloseOptionStyle],
          }}
          title={{
            content: 'Download feedback',
            styles: [modalTitleOptionStyle],
          }}
          onOverlayClick={() => {
            dispatch(ColleaguesActions.clearGettedCollegues());
            if (ModalSuccess) setModalSuccess(() => false);
            setOpenMainModal(() => false);
          }}
        >
          <ModalDownloadFeedback
            setOpenMainModal={setOpenMainModal}
            ModalSuccess={ModalSuccess}
            setModalSuccess={setModalSuccess}
            closeHandler={closeHandler}
            downloadTitle='Which feedback do you want to download?'
            downloadDescription='Select which colleagues feedback do you want to download, then download it to your device'
          />
        </Modal>
      )}
    </>
  );
};

const SpaceBeetweenStyled: Rule = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '24px',
};

const Question_Styled: Rule = {
  fontWeight: 'normal',
  fontSize: '16px',
  lineHeight: '20px',
  margin: '4px 0px 0px 0px',
};

const ShareFeedback_Styled: Rule = {
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '22px',
  color: '#00539F',
};

const Reverse_Items_Styled: Rule = {
  display: 'flex',
  flexWrap: 'wrap-reverse',
  gridGap: '8px',
  marginTop: '34px',
  alignItems: 'stretch',
};

const iconStyle: Rule = {
  marginRight: '10px',
};

const Buttons_actions_style: Rule = () => {
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  return {
    minWidth: mobileScreen ? '100%' : '400px',
    flex: '1 0 250px',
    '& > div': {
      '&:nth-child(2)': {
        marginTop: '8px',
      },
    },
  };
};

const Drafts_style: Rule = {
  flex: '3 1 676px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const Button_container_style: Rule = {
  background: '#FFFFFF',
  boxShadow: '3px 3px 1px 1px rgba(0, 0, 0, 0.05)',
  borderRadius: '10px',
  padding: '26px',
};

const iconBtnStyle: Rule = ({ theme }) => ({
  padding: '8px 16px',
  display: 'flex',
  height: '34px',
  borderRadius: '32px',
  justifyContent: 'center',
  alignItems: 'center',
  outline: 0,
  background: theme.colors.white,
  color: '#00539F',
  cursor: 'pointer',
  border: '1px solid #00539F',
  maxWidth: '134px',
  marginLeft: 'auto',
  marginTop: '16px',
  whiteSpace: 'nowrap',
  fontSize: '14px',
  fontWeight: 'bold',
});

//
const containerRule: Rule = ({ colors }) => {
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  return {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(mobileScreen
      ? { borderRadius: '24px 24px 0 0 ', padding: '16px 0 84px' }
      : { borderRadius: '32px', padding: `40px 0 102px` }),
    width: '640px',
    height: mobileScreen ? 'calc(100% - 72px)' : 'calc(100% - 102px)',
    marginTop: '72px',
    marginBottom: mobileScreen ? 0 : '30px',
    background: colors.white,
    cursor: 'default',
    overflow: 'auto',
  };
};

const modalCloseOptionStyle: Rule = () => {
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  return {
    display: 'inline-block',
    height: '24px',
    paddingLeft: '0px',
    paddingRight: '0px',
    position: 'fixed',
    top: '22px',
    right: mobileScreen ? '20px' : '40px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  };
};

const modalTitleOptionStyle: Rule = () => {
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;

  return {
    position: 'fixed',
    top: '22px',
    textAlign: 'center',
    left: 0,
    right: 0,
    color: 'white',
    ...(mobileScreen
      ? {
          fontSize: '20px',
          lineHeight: '24px',
        }
      : {
          fontSize: '24px',
          lineHeight: '28px',
        }),
  };
};

export default ViewFeedbackComp;