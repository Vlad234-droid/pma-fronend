import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Rule, useStyle } from '@dex-ddl/core';
import * as Yup from 'yup';
import useDispatch from 'hooks/useDispatch';
import { OrgObjectiveActions, orgObjectivesSelector, Status } from '@pma/store';
import get from 'lodash.get';
import GenericForm from 'components/GenericForm';
import { Input } from 'components/Form';
import { InfoModal } from 'features/Modal';

enum Statuses {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  DRAFT = 'DRAFT',
}

const prepareOrgObjectivesData = (newData, orgObjectivesData) => {
  return orgObjectivesData.map((objective, idx) => ({ ...objective, title: get(newData, idx) }));
};

const StrategicDriversForm: FC = () => {
  const { css } = useStyle();
  const dispatch = useDispatch();
  const orgObjectives = useSelector(orgObjectivesSelector) || [];

  const [status, setStatus] = useState<Statuses>(Statuses.PENDING);

  const save = (newData) => {
    const data = prepareOrgObjectivesData(newData.objectives, orgObjectives);

    dispatch(
      OrgObjectiveActions.createOrgObjective({
        data,
      }),
    );
    setStatus(() => Statuses.DRAFT);
  };

  const publish = (newData) => {
    const data = prepareOrgObjectivesData(newData.objectives, orgObjectives);
    dispatch(
      OrgObjectiveActions.createAndPublishOrgObjective({
        data,
      }),
    );
    setStatus(() => Statuses.SUBMITTED);
  };

  useEffect(() => {
    dispatch(OrgObjectiveActions.getOrgObjectives({}));
  }, []);

  const handleCancel = () => {
    // @ts-ignore
    dispatch(OrgObjectiveActions.changeOrgObjectiveMetaStatus(Status.IDLE));
    setStatus(() => Statuses.PENDING);
  };

  if (!orgObjectives.length) return null;

  const validate = (value) => {
    const stringValidationSchema = Yup.string().required().min(10);
    for (let i = 0; i === 0; i++) {
      if (!stringValidationSchema.isValidSync(value[i])) {
        return false;
      }
    }
    return true;
  };

  return (
    <GenericForm
      formFields={orgObjectives.map((item): any => {
        return {
          Element: Input,
          name: `objectives.${item.number - 1}`,
          id: `objective_${item.number}`,
          label: `Strategic driver ${item.number}`,
        };
      })}
      //@ts-ignore
      schema={Yup.object().shape({
        objectives: Yup.array().of(Yup.string()).test(validate),
      })}
      renderButtons={(isValid, isDirty, handleSubmit) => (
        <div className={css(publishBlock)}>
          <Button
            isDisabled={!isValid || !isDirty}
            onPress={() => handleSubmit(save)()}
            styles={[button, buttonWithMarginRight, !isValid || !isDirty ? disabledButton : activeButton]}
          >
            Save
          </Button>
          <Button
            isDisabled={!isValid || !isDirty}
            onPress={() => {
              handleSubmit(publish)();
            }}
            styles={[button, !isValid || !isDirty ? disabledButton : activeButton]}
          >
            Publish
          </Button>

          {status !== Statuses.PENDING && (
            <InfoModal
              title={`Strategic drivers successfully ${status === Statuses.DRAFT ? 'saved' : 'published'}`}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}
      defaultValues={{
        objectives: orgObjectives.map(({ title }) => title),
      }}
    />
  );
};

const buttonWithMarginRight: Rule = {
  marginRight: '8px',
};

const button: Rule = ({ theme }) => {
  return {
    width: '50%',
    cursor: 'pointer',
    backgroundColor: `${theme.colors.white}`,
    color: `${theme.colors.tescoBlue}`,

    '@media(max-width: 600px)': {
      width: '100%',
      marginBottom: '10px',
    },
  };
};

const activeButton: Rule = ({ theme }) => {
  return {
    border: `2px solid ${theme.colors.tescoBlue}`,
    color: `${theme.colors.tescoBlue}`,
  };
};

const disabledButton: Rule = ({ theme }) => {
  return {
    border: `2px solid ${theme.colors.disabled}`,
    color: `${theme.colors.disabled}`,
    cursor: 'default',
  };
};

const publishBlock: Rule = () => ({
  display: 'flex',
  width: '50%',
  justifyItems: 'flex-end',
  marginLeft: 'auto',

  '@media(max-width: 600px)': {
    width: '100%',
    flexDirection: 'column',
  },
});

export default StrategicDriversForm;
