import React, { FC, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useDispatch from 'hooks/useDispatch';
import {
  colleagueCurrentCycleSelector,
  colleagueUUIDSelector,
  FormType,
  getReviewsByTypeSelector,
  isReviewsNumberInStatuses,
  ReviewsActions,
  reviewsMetaSelector,
  SchemaActions,
  schemaMetaSelector,
} from '@pma/store';
import { ReviewType, Status } from 'config/enum';
import Spinner from 'components/Spinner';
import SuccessModal from 'components/SuccessModal';
import { useTranslation } from 'components/Translation';
import ObjectiveForm from './components/ObjectiveForm';
import useReviewSchema from './hooks/useReviewSchema';
import { ModalComponent } from './components/ModalComponent';

export type Props = {
  onClose: () => void;
  editNumber: number;
  useSingleStep?: boolean;
  create?: boolean;
};

const CreateUpdateObjectives: FC<Props> = ({ onClose, editNumber, useSingleStep, create }) => {
  const [currentNumber, setCurrentNumber] = useState(editNumber);
  const [isSuccess, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const { loaded: schemaLoaded, loading: schemaLoading } = useSelector(schemaMetaSelector);
  const { loaded: reviewLoaded, loading: reviewLoading, saving, saved } = useSelector(reviewsMetaSelector);
  const currentCycle = useSelector(colleagueCurrentCycleSelector(colleagueUuid));

  const pathParams = { colleagueUuid, code: 'OBJECTIVE', cycleUuid: currentCycle };
  const isApproved = useSelector(isReviewsNumberInStatuses(ReviewType.OBJECTIVE)([Status.APPROVED], currentNumber));
  const isDeclined = useSelector(isReviewsNumberInStatuses(ReviewType.OBJECTIVE)([Status.DECLINED], currentNumber));

  const objectives = useSelector(getReviewsByTypeSelector(ReviewType.OBJECTIVE));
  const [schema] = useReviewSchema(ReviewType.OBJECTIVE);

  const { components = [], display: newSchemaVersion, markup } = schema;
  const markupMin = markup?.min;
  const isSingleStep = useSingleStep || markupMin < currentNumber;
  const title = create
    ? t('create_objectives', 'Create objectives')
    : isSingleStep
    ? t('edit_objective', 'Edit objective')
    : t('edit_objectives', 'Edit objectives');

  useEffect(() => {
    if (editNumber !== currentNumber) setCurrentNumber(editNumber);
  }, [editNumber]);

  useEffect(() => {
    if (!isSuccess && saved) {
      onClose();
    }
  }, [saved]);

  const formElements = newSchemaVersion
    ? components
        .flatMap((e) => e?.components || e)
        .filter((e) => [FormType.TEXT_FIELD, FormType.TEXT_AREA, FormType.SELECT].includes(e?.type))
    : components.filter((component) => component.type != 'text');

  const defaultValues = useMemo(() => {
    const defaultProperties = formElements.reduce((acc, current) => {
      acc[current.key] = '';
      return acc;
    }, {});

    if (create && isSingleStep)
      return [
        {
          properties: defaultProperties,
        },
      ];
    if (create) {
      return new Array(markupMin)
        .fill({
          properties: defaultProperties,
        })
        .map((properties, idx) => objectives?.find(({ number }) => number === idx + 1) || properties);
    }
    if (isSingleStep) {
      return [objectives.find(({ number }) => currentNumber === number)];
    }
    return objectives.slice(0, markupMin);
  }, [objectives]);

  const titles = [...Array(markupMin).keys()].map((key) => `Objective ${key + 1}`);

  const handleSuccess = () => {
    if (useSingleStep || markupMin <= currentNumber) {
      setSuccess(true);
    } else {
      setCurrentNumber((current) => ++current);
    }
  };

  const buildData = (data: Array<Record<'properties' | 'number', any>>, status: Status) => {
    return data.map(({ properties, number }, idx) => ({ properties, status, number: number || idx + 1 }));
  };

  const saveDraftData = (data: Array<any>) => {
    dispatch(
      ReviewsActions.updateReviews({
        pathParams,
        data,
      }),
    );
  };

  const saveData = (data: Array<any>) => {
    if (isSingleStep) {
      dispatch(
        ReviewsActions.updateReview({
          pathParams: { ...pathParams, number: currentNumber },
          data,
        }),
      );
      return;
    }

    dispatch(
      ReviewsActions.updateReviews({
        pathParams,
        data,
      }),
    );
  };

  const handleSubmit = ({ data }) => {
    saveData(buildData(data, Status.WAITING_FOR_APPROVAL));
    handleSuccess();
  };

  const handleSaveDraft = (data: Array<any>) => {
    saveDraftData(buildData(data, Status.DRAFT));
  };

  useEffect(() => {
    dispatch(ReviewsActions.getReviews({ pathParams }));
    dispatch(SchemaActions.getSchema({ colleagueUuid, cycleUuid: currentCycle }));

    return () => {
      dispatch(ReviewsActions.updateReviewMeta({ saved: false }));
    };
  }, []);

  const handlePrev = () => setCurrentNumber((current) => Math.max(--current, 1));
  const handleNext = () => setCurrentNumber((current) => Math.min(++current, markupMin));

  if (isSuccess && saved) {
    const description = isSingleStep
      ? t('your_objective_has_been_sent_to_your_line_manager', 'Your objective has been sent to your line manager.')
      : t('your_objectives_has_been_sent_to_your_line_manager', 'Your objectives has been sent to your line manager.');
    return <SuccessModal title={t('objectives_sent', 'Objectives sent')} onClose={onClose} description={description} />;
  }
  if (schemaLoading || reviewLoading || saving) return <Spinner fullHeight />;
  if (!schemaLoaded || !reviewLoaded) return null;

  return (
    <ModalComponent onClose={onClose} title={title}>
      <ObjectiveForm
        formElements={formElements}
        schemaComponents={components}
        currentId={isSingleStep ? 1 : currentNumber}
        editMode={isApproved || isDeclined}
        multiply={!isSingleStep}
        isLastStep={currentNumber === markupMin}
        defaultValues={{ data: defaultValues }}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        titles={titles}
        onCancel={onClose}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </ModalComponent>
  );
};

export default CreateUpdateObjectives;
