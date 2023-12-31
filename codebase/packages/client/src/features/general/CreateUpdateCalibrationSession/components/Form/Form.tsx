import React, { FC, useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ConditionOperandEnum } from '@pma/openapi';
import * as Yup from 'yup';
import get from 'lodash.get';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CreateRule, Rule, useStyle } from '@pma/dex-wrapper';
import { ColleagueFilterAction, getColleagueFilterSelector } from '@pma/store';

import { useFormWithCloseProtection } from 'hooks/useFormWithCloseProtection';
import { SearchOption } from 'config/enum';
import { Input, Textarea, Item as FormItem, Field } from 'components/Form';
import { Trans, useTranslation } from 'components/Translation';
import { IconButton, Position } from 'components/IconButton';
import Datepicker from 'components/Datepicker';
import UnderlayModal from 'components/UnderlayModal';
import FilterForm from 'components/FilterForm';
import Spinner from 'components/Spinner';

import { Buttons } from '../Buttons';
import { ColleaguesRemover } from '../ColleaguesRemover';
import { ColleaguesFinder } from '../ColleaguesFinder';
import { CalibrationSessionUiType, ColleagueSimpleExtended, ActionType } from '../../types';
import { createSchema } from '../../config';
import { prepareColleaguesForUI, getSelectedGroups } from '../../utils';
import useColleagueSimple from '../../hooks/useColleagueSimple';
import { filtersOrder, filterToRequest } from 'utils';

type Props = {
  defaultValues: CalibrationSessionUiType;
  canEdit: boolean;
  onSubmit: (data: CalibrationSessionUiType) => void;
  onSaveAndExit: (data: CalibrationSessionUiType) => void;
};

const Form: FC<Props> = ({ defaultValues, canEdit, onSaveAndExit, onSubmit }) => {
  const { css, matchMedia } = useStyle();
  const { t } = useTranslation();
  const mobileScreen = matchMedia({ xSmall: true, small: true }) || false;
  const { participants: { filters = [] } = {} } = defaultValues;
  const dispatch = useDispatch();
  const { uuid } = useParams<{ uuid: string }>();

  const colleagueFilter = useSelector(getColleagueFilterSelector) || {};
  const [savedFilter, setSavedFilter] = useState<any>(defaultValues.filter || {});

  const [isVisibleFilterModal, setFilterModal] = useState<boolean>(false);

  const {
    colleagues: colleaguesRemover,
    loading: colleaguesRemoverLoading,
    loaded: colleaguesRemoverLoaded,
  } = useColleagueSimple(filterToRequest(savedFilter), !!Object.keys(savedFilter)?.length);

  const {
    colleagues: colleaguesFinder,
    loading: colleaguesFinderLoading,
    loaded: colleaguesFinderLoaded,
  } = useColleagueSimple({});

  const colleaguesAvailableCount = (colleaguesRemover || [])?.filter(({ colleague, sessionUuid }) => {
    const isVisible = (!uuid && !sessionUuid) || (!!sessionUuid && !!uuid && sessionUuid == uuid) || !sessionUuid;
    return colleague?.uuid && isVisible;
  }).length;

  const methods = useFormWithCloseProtection({
    mode: 'onChange',
    resolver: yupResolver<Yup.AnyObjectSchema>(createSchema(t, colleaguesAvailableCount)),
    defaultValues,
  });

  const {
    formState: { errors, isValid },
    getValues,
    setValue,
  } = methods;

  const formValues = getValues();
  const selectedGroupLength = getSelectedGroups(colleagueFilter, formValues.filter)?.length || null;

  const handleAddColleagues = (colleagues) => {
    const add = colleagues?.filter(({ type }) => type === 'add');
    const remove = colleagues?.filter(({ type }) => type === 'remove');
    setValue('colleaguesAdd', add, { shouldDirty: true, shouldValidate: true });

    // todo: temporary quick fix. Might be refactored and combined with next requirements
    const arrayUniqueByKey = [
      ...new Map([...formValues.colleaguesRemoved, ...remove].map((item) => [item['value'], item])).values(),
    ];
    setValue('colleaguesRemoved', arrayUniqueByKey, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveColleague = (colleagues) => {
    setValue('colleaguesRemoved', colleagues, { shouldDirty: true, shouldValidate: true });
  };

  const handleFilter = (filter) => {
    setValue('filter', filter, { shouldDirty: true, shouldValidate: true });
  };

  const handleBlur = (fieldName: string | any) => {
    setValue(fieldName, getValues(fieldName), { shouldValidate: true, shouldTouch: true });
  };

  const handleRemoveCancellation = () => {
    setSavedFilter({});
    setValue('filter', {}, { shouldDirty: true, shouldValidate: true });
    setValue('colleaguesRemoved', [], { shouldDirty: true, shouldValidate: true });
    dispatch(ColleagueFilterAction.getColleagueFilter({}));
  };

  const updateFilter = useCallback((data) => {
    dispatch(ColleagueFilterAction.getColleagueFilter(filterToRequest(data)));
  }, []);

  useEffect(() => {
    setValue('colleaguesRemoved', prepareColleaguesForUI(colleaguesRemover, filters, ConditionOperandEnum.NotIn), {
      shouldTouch: true,
    });
    setValue('colleaguesAdd', prepareColleaguesForUI(colleaguesFinder, filters, ConditionOperandEnum.In), {
      shouldTouch: true,
    });
  }, [colleaguesRemoverLoaded, colleaguesFinderLoaded]);

  const colleaguesRemoverIds = colleaguesRemover.map(({ colleague }) => colleague?.uuid);

  //@ts-ignore
  const allColleagues = colleaguesFinder.map(({ colleague, sessionUuid }) => {
    return {
      ...colleague,
      type:
        sessionUuid !== uuid && !!sessionUuid
          ? ActionType.DISABLED
          : colleague?.uuid && colleaguesRemoverIds.includes(colleague.uuid)
          ? ActionType.REMOVE
          : ActionType.ADD,
    };
  }) as ColleagueSimpleExtended[];

  return (
    <form data-test-id={'CALIBRATION_SESSION_FORM_MODAL'}>
      <div className={css(formContainerStyle)}>
        <Field
          name={'title'}
          Wrapper={FormItem}
          label={`**${t('calibration_session_title', 'Calibration Session Title')}**`}
          Element={Input}
          placeholder={'Add title here'}
          value={formValues.title}
          setValue={setValue}
          error={get(errors, 'title.message')}
          readonly={!canEdit}
        />
        <Field
          name={'startTime'}
          Wrapper={FormItem}
          label={`**${t('day', 'Day')}**`}
          Element={Datepicker}
          placeholder={'DD/MM/YY'}
          value={formValues.startTime}
          setValue={setValue}
          error={get(errors, 'startTime.message')}
          readonly={!canEdit}
        />
        <div className={css(dataLineStyle)} />
        <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
          <div className={css(labelTextStyle)}>Add groups / departments to calibration session</div>
          <IconButton
            onPress={() => setFilterModal(true)}
            customVariantRules={{ default: iconBtnAddStyle }}
            graphic='add'
            iconStyles={{ marginRight: '5px' }}
            iconPosition={Position.LEFT}
            iconProps={{ title: `Filter and add`, fill: '#fff', size: '16px' }}
          >
            <Trans i18nKey='filter_and_add'>Filter and add</Trans>
            {selectedGroupLength ? ` (${selectedGroupLength})` : ''}
          </IconButton>
        </div>
        {colleaguesRemoverLoading ? (
          <Spinner />
        ) : (
          <ColleaguesRemover
            colleaguesRemoved={formValues.colleaguesRemoved || []}
            onRemove={handleRemoveColleague}
            onCancel={handleRemoveCancellation}
            filter={savedFilter}
            colleagues={colleaguesRemover}
            errormessage={get(errors, 'colleaguesRemoved.message')}
          />
        )}
        <div className={css({ padding: '30px 0' })}>
          <div className={css(labelTextStyle)}>Add or remove people</div>
          <div>
            {colleaguesFinderLoading ? (
              <Spinner />
            ) : (
              <ColleaguesFinder
                searchOption={SearchOption.NAME}
                onSelect={handleAddColleagues}
                onBlur={() => handleBlur('colleaguesAdd')}
                selected={formValues.colleaguesAdd || []}
                error={errors['colleaguesAdd']?.message?.replace('colleaguesAdd', t('colleagues', 'Colleagues'))}
                customStyles={{ marginTop: '0px', width: '100%' }}
                inputStyles={{ paddingLeft: '36.7px' }}
                withIcon={false}
                marginBot={false}
                customIcon={true}
                multiple={true}
                colleagues={allColleagues}
              />
            )}
          </div>
        </div>
        <Field
          name={'description'}
          Wrapper={FormItem}
          label={'**Add a comment**'}
          Element={Textarea}
          placeholder={'Add comments here'}
          value={formValues.description}
          setValue={setValue}
          error={get(errors, 'description.message')}
          readonly={!canEdit}
        />
        {isVisibleFilterModal && (
          <UnderlayModal
            onClose={() => setFilterModal(false)}
            styles={{ maxWidth: !mobileScreen ? '500px' : '100%' }}
            overlayClick={false}
            loading={true}
          >
            {({ onClose }) => (
              <FilterForm
                defaultValues={savedFilter}
                onCancel={() => {
                  handleRemoveCancellation();
                  onClose();
                }}
                filters={
                  Object.fromEntries(
                    Object.entries(colleagueFilter).sort(
                      ([a], [b]) => filtersOrder.indexOf(a) - filtersOrder.indexOf(b),
                    ),
                  ) as { [key: string]: Array<{ [key: string]: string }> }
                }
                onSubmit={(data) => {
                  onClose();
                  setTimeout(() => {
                    setSavedFilter(data);
                    handleFilter(data);
                    updateFilter(data);
                  }, 300);
                }}
                onUpdate={(data) => {
                  setSavedFilter(data);
                }}
              >
                {({
                  onCancel: onChildrenCancel,
                  onSubmit: onChildrenSubmit,
                  handleSubmit: handleChildrenSubmit,
                  isValid: isChildrenValid,
                }) => {
                  return (
                    <div className={css(blockStyle, customStyles)}>
                      <div className={css(wrapperButtonStyle)}>
                        <div className={css(buttonsWrapper)}>
                          <Button isDisabled={false} styles={[buttonCancelStyle]} onPress={onChildrenCancel}>
                            Clear filter
                          </Button>
                          <Button
                            //@ts-ignore
                            onPress={handleChildrenSubmit((data) => {
                              updateFilter(data);
                            })}
                            styles={[submitButtonStyle({ isValid: true })]}
                          >
                            {colleaguesAvailableCount ? `Apply filter (${colleaguesAvailableCount})` : 'Apply filter'}
                          </Button>
                          <Button
                            //@ts-ignore
                            onPress={onChildrenSubmit}
                            styles={[submitButtonStyle({ isValid: isChildrenValid })]}
                          >
                            Apply & close
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </FilterForm>
            )}
          </UnderlayModal>
        )}
        {canEdit && (
          <Buttons
            isValid={isValid}
            onSave={() => onSubmit(formValues)}
            onSaveDraft={() => onSaveAndExit(formValues)}
          />
        )}
      </div>
    </form>
  );
};

const formContainerStyle: Rule = {
  padding: '20px 0 20px 0',
};

const dataLineStyle: Rule = ({ theme }) => ({
  margin: '20px 0',
  //@ts-ignore
  borderTop: `2px solid ${theme.colors.lightGray}`,
});

const iconBtnAddStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f14,
  letterSpacing: '0px',
  background: theme.colors.tescoBlue,
  color: theme.colors.white,
  padding: '8px 16px',
  borderRadius: '32px',
  fontWeight: theme.font.weight.bold,
});

const labelTextStyle: Rule = ({ theme }) => ({
  fontSize: theme.font.fixed.f16.fontSize,
  lineHeight: theme.font.fluid.f16.lineHeight,
  fontWeight: theme.font.weight.bold,
  letterSpacing: '0px',
});

const buttonCancelStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  fontWeight: theme.font.weight.bold,
  width: '33%',
  margin: `${theme.spacing.s0} ${theme.spacing.s0_5}`,
  background: theme.colors.white,
  border: `${theme.border.width.b2} solid ${theme.colors.tescoBlue}`,
  color: `${theme.colors.tescoBlue}`,
});

const customStyles: Rule = ({ theme }) => {
  return {
    background: theme.colors.white,
    borderRadius: '0px 0px 10px 10px',
  };
};

const blockStyle: Rule = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
};

const buttonsWrapper: Rule = () => ({
  padding: '30px 15px 30px 15px',
  display: 'flex',
  justifyContent: 'center',
});

const wrapperButtonStyle: Rule = ({ theme }) => ({
  position: 'relative',
  bottom: theme.spacing.s0,
  left: theme.spacing.s0,
  right: theme.spacing.s0,
  // @ts-ignore
  borderTop: `${theme.border.width.b2} solid ${theme.colors.lightGray}`,
});

const submitButtonStyle: CreateRule<{ isValid: any }> =
  ({ isValid }) =>
  ({ theme }) => ({
    height: '40px',
    ...theme.font.fixed.f16,
    fontWeight: theme.font.weight.bold,
    width: '33%',
    margin: `${theme.spacing.s0} ${theme.spacing.s0_5}`,
    background: `${theme.colors.tescoBlue}`,
    color: `${theme.colors.white}`,
    padding: '0px 20px',
    borderRadius: `${theme.spacing.s20}`,
    opacity: isValid ? '1' : '0.4',
    pointerEvents: isValid ? 'all' : 'none',
  });

export default Form;
