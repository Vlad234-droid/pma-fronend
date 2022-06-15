import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Rule, useStyle } from '@pma/dex-wrapper';
import {
  colleagueUUIDSelector,
  teamFolderUuidSelector,
  NotesActions,
  personalNoteByUUIDSelector,
  notesFolderTeamDataSelector,
  getNotesMetaSelector,
} from '@pma/store';

import SuccessModal from './components/SuccessModal';
import TeamNoteForm from './components/TeamNoteForm';
import { Notification } from 'components/Notification';
import { useTranslation } from 'components/Translation';
import { ArrowLeftIcon } from 'components/ArrowLeftIcon';
import WrapperModal from 'features/general/Modal/components/WrapperModal';
import { buildPath } from 'features/general/Routes';
import { Page } from 'pages';
import { AllNotesFolderId } from 'utils';
import { NotesStatus } from './type';

export const MODAL_WRAPPER = 'modal-wrapper';

const PersonalNote: FC = () => {
  const [folder, setFolder] = useState('');
  const { uuid } = useParams<{ uuid: string }>();
  const { css } = useStyle();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const teamFolderUuid = useSelector(teamFolderUuidSelector) || null;
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const folders = useSelector(notesFolderTeamDataSelector(colleagueUuid, false)) || [];
  const defaultValues = useSelector(personalNoteByUUIDSelector(uuid as string));
  const { created } = useSelector(getNotesMetaSelector);

  const setFolderName = (folder) => {
    if (folder === AllNotesFolderId || !folder) {
      setFolder('All notes');
    } else {
      setFolder(folders?.find((item) => item?.id === folder)?.title ?? '');
    }
  };

  const handleCreate = (data) => {
    const { folderTitle, folder, ...rest } = data;
    const note = {
      ownerColleagueUuid: colleagueUuid,
      folder: !folderTitle && folder !== AllNotesFolderId ? folder : undefined,
      ...rest,
    };

    if (folderTitle) {
      const folder = {
        ownerColleagueUuid: colleagueUuid,
        title: folderTitle,
        parentFolderUuid: teamFolderUuid,
      };
      if (uuid === 'new') {
        dispatch(NotesActions.createFolderAndNote({ note: { ...note, status: NotesStatus.CREATED } }));
      } else {
        dispatch(NotesActions.updateNote({ note: { ...note, updateTime: new Date() }, folder }));
      }
    } else {
      if (uuid === 'new') {
        dispatch(NotesActions.createNote({ ...note, status: NotesStatus.CREATED }));
      } else {
        dispatch(NotesActions.updateNote({ ...note, updateTime: new Date() }));
      }
    }
    folderTitle ? setFolder(folderTitle) : setFolderName(folder);
  };

  const handleClose = () => {
    dispatch(NotesActions.changeCreatedMeta(false));
    navigate(buildPath(Page.NOTES));
  };

  if (created) return <SuccessModal folder={folder} onOk={handleClose} />;

  return (
    <WrapperModal onClose={handleClose} title={t('add_a_team_note', 'Add a team note')}>
      <div className={css(WrapperModalGiveFeedbackStyle)} data-test-id={MODAL_WRAPPER}>
        <div>
          <Notification
            graphic='information'
            iconColor='link'
            text={t(
              'notes_description',
              'My Notes can be used to create and store notes about Your Contribution or that of your direct reports. Use this space to record achievements, thoughts on objectives or subjects to raise during your 1:1s. Although these notes are private, if you write something about anyone else they can request to see it so please remain professional.',
            )}
            closable={false}
            customStyle={{
              background: '#F3F9FC',
              marginBottom: '20px',
            }}
          />
          <TeamNoteForm
            onSubmit={handleCreate}
            onClose={handleClose}
            defaultValues={defaultValues}
            folders={folders}
            colleagueUuid={colleagueUuid}
          />
          <ArrowLeftIcon onClick={handleClose} data-test-id='arrowRight' />
        </div>
      </div>
    </WrapperModal>
  );
};

const WrapperModalGiveFeedbackStyle: Rule = {
  paddingLeft: '40px',
  paddingRight: '40px',
  height: '100%',
  overflow: 'auto',
};

export default PersonalNote;