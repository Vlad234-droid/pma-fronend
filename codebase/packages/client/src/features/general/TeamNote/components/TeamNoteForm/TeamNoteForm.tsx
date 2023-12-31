import React, { FC, useMemo } from 'react';
import { theme, useStyle } from '@pma/dex-wrapper';
import {
  colleagueUUIDSelector,
  getColleagueByUuidSelector,
  getNotesMetaSelector,
  notesFolderTeamDataSelector,
} from '@pma/store';
import { useSelector } from 'react-redux';
import get from 'lodash.get';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { GenericItemField } from 'components/GenericForm';
import { Input, Item, Select, Textarea } from 'components/Form';
import { useTranslation } from 'components/Translation';
import { ButtonsWrapper } from 'components/ButtonsWrapper';
import { ColleaguesFinder } from 'components/ColleaguesFinder';
import { schemaTEAMNotes } from '../../config';
import { NEW_FOLDER_ID } from 'utils';
import { useFormWithCloseProtection } from 'hooks/useFormWithCloseProtection';

export const MODAL_WRAPPER = 'modal-wrapper';

type Props = {
  onSubmit: (data: any) => void;
  onClose: () => void;
  defaultValues: any;
};

const AddNoteModal: FC<Props> = ({ onSubmit, onClose, defaultValues }) => {
  const { css } = useStyle();
  const { t } = useTranslation();
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const folders = useSelector(notesFolderTeamDataSelector(colleagueUuid, false)) || [];
  const { loading } = useSelector(getNotesMetaSelector);

  const methods = useFormWithCloseProtection({
    mode: 'onChange',
    resolver: yupResolver<Yup.AnyObjectSchema>(schemaTEAMNotes),
    defaultValues,
  });

  const {
    formState: { isValid },
    getValues,
    handleSubmit,
    setValue,
  } = methods;

  const values = getValues();

  const selectedColleague = useSelector(getColleagueByUuidSelector(values.referenceColleagueUuid));

  const options = useMemo(() => folders.map(({ id, title }) => ({ value: id, label: title })), [folders]);

  return (
    <form className={css({ marginTop: '40px', fontWeight: theme.font.weight.bold })} data-test-id={MODAL_WRAPPER}>
      <ColleaguesFinder
        onSelect={(value) => setValue('referenceColleagueUuid', value, { shouldValidate: true })}
        options={{ 'manager-uuid_eq': colleagueUuid, includePermissionCheck: false }}
        value={
          !Object.keys(defaultValues).length
            ? values.referenceColleagueUuid
              ? `${selectedColleague?.colleague?.profile?.firstName} ${selectedColleague?.colleague?.profile?.lastName}`
              : ''
            : `${values?.referenceColleagueProfile?.colleague?.profile?.firstName || ''} ${
                values?.referenceColleagueProfile?.colleague?.profile?.lastName || ''
              }`
        }
      />
      {values.referenceColleagueUuid && (
        <>
          <GenericItemField
            name={'title'}
            methods={methods}
            Wrapper={Item}
            Element={Input}
            placeholder={t('enter_a_title_for_your_note', 'Enter a title for your note')}
            value={values?.title}
            label={t('title', 'Title')}
          />
          <GenericItemField
            name={'content'}
            methods={methods}
            Wrapper={Item}
            Element={Textarea}
            placeholder={t('write_your_note_here', 'Write your note here')}
            value={values?.content}
            label={t('note', 'Note')}
          />
          <GenericItemField
            name={'folder'}
            methods={methods}
            Wrapper={Item}
            Element={Select}
            placeholder={t('select_a_folder', 'Select a folder')}
            options={[...options, { value: NEW_FOLDER_ID, label: t('add_new_folder', '+ Add new folder') as string }]}
            value={values?.folder}
            label={t('optional_folder', 'Folder (optional)')}
          />
          {get(values, 'folder') === NEW_FOLDER_ID && (
            <GenericItemField
              name={'folderTitle'}
              methods={methods}
              Wrapper={Item}
              Element={Input}
              placeholder={t('enter_a_name_for_your_new_folder', 'Enter a name for your new folder')}
              value={values?.folderTitle}
              label={t('folder_name', 'Folder name')}
            />
          )}
        </>
      )}
      <ButtonsWrapper isValid={isValid && !loading} onLeftPress={onClose} onRightPress={handleSubmit(onSubmit)} />
    </form>
  );
};

export default AddNoteModal;
