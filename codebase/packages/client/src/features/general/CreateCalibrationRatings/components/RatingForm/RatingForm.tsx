import React, { FC, useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'components/Translation';
import { ButtonsWrapper } from 'components/ButtonsWrapper';
import { useFormWithCloseProtection } from 'hooks/useFormWithCloseProtection';
import DynamicForm from 'components/DynamicForm';
import useOverallRating from 'hooks/useOverallRating';
import { Mode, Status } from 'config/types';

import { createYupSchema, createYupSchemaForDraft } from 'utils/yup';
import debounce from 'lodash.debounce';

const overallRatingListeners: string[] = ['what_rating', 'how_rating'];
const LONG_TERM_ANSENCE = 'long_term_ansence';
const REASON_COLLEAGUE_ABSENCE = 'reason_colleague_absence';

type Props = {
  components: Array<any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultValues: any;
  mode: Omit<Mode, Mode.SAVE>;
  readOnly: boolean;
};

const RatingForm: FC<Props> = ({ onSubmit, onCancel, components, defaultValues, mode, readOnly }) => {
  const { t } = useTranslation();

  const schema = Yup.object().shape(components.reduce(createYupSchema(t), {}));

  const draftSchema = Yup.object().shape(components.reduce(createYupSchemaForDraft(t), {}));
  const methods = useFormWithCloseProtection({
    mode: 'onChange',
    resolver: yupResolver<Yup.AnyObjectSchema>(schema),
    defaultValues,
  });
  const {
    getValues,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = methods;
  const values = getValues();

  const [what_rating, how_rating] = watch(overallRatingListeners);
  const longTermAnsence = watch(LONG_TERM_ANSENCE);

  const params = useMemo(
    () => (what_rating && how_rating ? { what_rating, how_rating } : null),
    [what_rating, how_rating],
  );

  const { overall_rating } = useOverallRating(params);

  useEffect(() => {
    if (overall_rating && overall_rating !== values.overall_rating) {
      setValue('overall_rating', overall_rating, { shouldValidate: true, shouldTouch: true });
    }
  }, [overall_rating]);

  useEffect(() => {
    if (longTermAnsence === 'false') {
      setValue(REASON_COLLEAGUE_ABSENCE, undefined);
    }
  }, [longTermAnsence]);

  const hasValue = useMemo(() => {
    return Object.values(values).filter((val) => !!val).length;
  }, [JSON.stringify(values)]);

  const handleSave = useCallback(
    debounce((data: any) => onSubmit({ ...data, status: Status.WAITING_FOR_APPROVAL }), 300),
    [onSubmit],
  );

  const handleSaveDraft = useCallback(
    debounce((data) => onSubmit({ ...data, status: Status.DRAFT }), 300),
    [onSubmit],
  );

  return (
    <div>
      <DynamicForm
        components={components}
        formValues={values}
        errors={errors}
        setValue={setValue}
        onlyView={readOnly}
      />
      <ButtonsWrapper
        isValid={isValid}
        isLeftDisabled={!hasValue || !draftSchema.isValidSync(values)}
        onLeftPress={mode === Mode.CREATE ? () => handleSaveDraft(values) : onCancel}
        leftText={mode === Mode.CREATE ? 'save_as_draft' : 'cancel'}
        rightIcon={false}
        rightTextNotIcon={readOnly ? 'okay' : 'submit'}
        onRightPress={readOnly ? onCancel : handleSubmit(handleSave)}
        single={readOnly}
      />
    </div>
  );
};

export default RatingForm;
