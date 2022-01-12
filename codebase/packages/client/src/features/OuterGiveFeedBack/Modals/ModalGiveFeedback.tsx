import React, { FC } from 'react';
import { useBreakpoints, useStyle, Rule } from '@dex-ddl/core';
import { ModalGiveFeedbackProps, GiveFeedbackType } from '../type';
import { InfoModal, SearchPart, SubmitPart, SuccessModal, GreatFeedbackModal } from './index';
import { IconButton } from 'components/IconButton';
import { getFindedColleaguesSelector, ColleaguesActions, colleagueUUIDSelector, FeedbackActions } from '@pma/store';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal } from '../../../pages/Feedback';

const ModalGiveFeedback: FC<ModalGiveFeedbackProps> = ({
  setIsOpen,
  setSelectedPerson,
  selectedPerson,
  infoModal,
  setInfoModal,
  modalSuccess,
  setModalSuccess,
  searchValue,
  setSearchValue,
  feedbackItemsS,
  methods,
  setFeedbackItems,
  setConfirmModal,
  confirmModal,
  modalGreatFeedback,
  setModalGreatFeedback,
}) => {
  const dispatch = useDispatch();
  const findedColleagues = useSelector(getFindedColleaguesSelector) || [];
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const { css, theme } = useStyle();
  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;

  const { handleSubmit, reset, getValues, trigger } = methods;

  const switchClose = (): void => {
    reset({ feedback: [{ field: '' }, { field: '' }, { field: '' }] });
    setFeedbackItems(() => []);
    if (confirmModal) {
      setConfirmModal(() => false);
      return;
    }
    if (findedColleagues.length) {
      dispatch(ColleaguesActions.clearGettedColleagues());
    }
    if (selectedPerson !== null) {
      setSelectedPerson(() => null);
    } else {
      setIsOpen(() => false);
    }
  };

  const giveFeedback: GiveFeedbackType[] = [
    {
      giveFeedback_id: '0',
      giveFeedbacka_main_title: 'Question 1',
      giveFeedback_title:
        "Looking back at what you've seen recently, what would you like to say to this colleague about what they`ve delivered or how they've gone about it?",
      giveFeedback_description: "Share specific examples of what you've seen.",
      giveFeedback_field: {
        field_id: '1',
        field_type: 'textarea',
      },
    },
    {
      giveFeedback_id: '1',
      giveFeedbacka_main_title: 'Question 2',
      giveFeedback_title:
        'Looking forward, what should this colleague do more (or less) of in order to be at their best?',
      giveFeedback_description: 'Share your suggestions',
      giveFeedback_field: {
        field_id: '2',
        field_type: 'textarea',
      },
    },
    {
      giveFeedback_id: '2',
      giveFeedbacka_main_title: 'Anything else?',
      giveFeedback_title: 'Add any other comments you would like to share with your colleague.',
      giveFeedback_field: {
        field_id: '3',
        field_type: 'textarea',
      },
    },
  ];

  const onSubmit = async (data) => {
    setConfirmModal(() => false);
    if (!colleagueUuid) return;
    const values = data.feedback;
    const getIfNeedUuid = (selectedPerson) => {
      if (!selectedPerson.uuid) return;
      return {
        uuid: selectedPerson.uuid,
      };
    };

    const getFeedbackUuidItems = (i) => {
      if (!feedbackItemsS!.length) return;
      return {
        uuid: feedbackItemsS![feedbackItemsS!.findIndex((y) => y.code === giveFeedback[i].giveFeedbacka_main_title)]
          .uuid,
      };
    };
    const formData = {
      ...getIfNeedUuid(selectedPerson),
      colleagueUuid: colleagueUuid,
      targetColleagueUuid: selectedPerson.colleagueUUID,
      status: 'SUBMITTED',
      feedbackItems: values.map((item, i) => {
        return {
          ...getFeedbackUuidItems(i),
          code: giveFeedback[i].giveFeedbacka_main_title,
          content: item.field,
        };
      }),
    };

    if (!feedbackItemsS!.length) {
      dispatch(FeedbackActions.createNewFeedback([formData]));
    } else {
      dispatch(FeedbackActions.updatedFeedback(formData));
    }

    setModalSuccess(() => true);
  };

  const onDraft = () => {
    if (!colleagueUuid) return;
    trigger();
    const valuess = getValues();

    const data = valuess?.feedback;
    const getIfNeedUuid = (selectedPerson) => {
      if (!selectedPerson.uuid) return;
      return {
        uuid: selectedPerson.uuid,
      };
    };

    const getFeedbackUuidItems = (i) => {
      if (!selectedPerson.uuid) return;
      return {
        uuid: feedbackItemsS![feedbackItemsS!.findIndex((y) => y.code === giveFeedback[i].giveFeedbacka_main_title)]
          .uuid,
      };
    };

    const formData = {
      ...getIfNeedUuid(selectedPerson),
      colleagueUuid: colleagueUuid,
      targetColleagueUuid: selectedPerson.colleagueUUID,
      status: 'DRAFT',
      feedbackItems: data.map((item, i) => {
        return {
          ...getFeedbackUuidItems(i),
          code: giveFeedback[i].giveFeedbacka_main_title,
          content: item.field,
        };
      }),
    };

    if (selectedPerson.uuid) {
      dispatch(FeedbackActions.updatedFeedback(formData));
    } else {
      dispatch(FeedbackActions.createNewFeedback([formData]));
    }

    setIsOpen(() => false);
    setSelectedPerson(() => null);
    reset({ feedback: [{ field: '' }, { field: '' }, { field: '' }] });
  };

  if (infoModal) return <InfoModal setInfoModal={setInfoModal} />;
  if (confirmModal) {
    return <ConfirmModal setConfirmModal={setConfirmModal} onSubmit={handleSubmit(onSubmit)} />;
  }
  if (modalGreatFeedback) return <GreatFeedbackModal setModalGreatFeedback={setModalGreatFeedback} />;
  if (modalSuccess)
    return (
      <SuccessModal
        setModalSuccess={setModalSuccess}
        selectedPerson={selectedPerson}
        setIsOpen={setIsOpen}
        setSelectedPerson={setSelectedPerson}
        setFeedbackItems={setFeedbackItems}
        methods={methods}
      />
    );

  return (
    <>
      <div className={css(WrapperModalGiveFeedbackStyle)}>
        <div
          className={css({
            fontWeight: 'bold',
            fontSize: '24px',
            lineHeight: '28px',
            ...(mobileScreen && { textAlign: 'center' }),
          })}
        >
          Let a colleague know how they are doing
        </div>
        <div
          className={css({
            marginTop: '8px',
            fontSize: '18px',
            lineHeight: '22px',
            ...(mobileScreen && { textAlign: 'center' }),
          })}
        >
          Select who you&apos;d like to give feedback to
        </div>
        <SearchPart
          setSelectedPerson={setSelectedPerson}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          selectedPerson={selectedPerson}
        />
        {selectedPerson && (
          <SubmitPart
            selectedPerson={selectedPerson}
            setInfoModal={setInfoModal}
            methods={methods}
            feedbackItemsS={feedbackItemsS}
            giveFeedback={giveFeedback}
            setConfirmModal={setConfirmModal}
            onDraft={onDraft}
            setModalGreatFeedback={setModalGreatFeedback}
          />
        )}
        <span
          className={css({
            position: 'fixed',
            top: theme.spacing.s5,
            left: mobileScreen ? theme.spacing.s5 : theme.spacing.s10,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
          })}
        >
          <IconButton graphic='arrowLeft' onPress={() => switchClose()} iconProps={{ invertColors: true }} />
        </span>
      </div>
    </>
  );
};
const WrapperModalGiveFeedbackStyle: Rule = {
  paddingLeft: '40px',
  paddingRight: '40px',
  height: '100%',
  overflow: 'auto',
};

export default ModalGiveFeedback;
