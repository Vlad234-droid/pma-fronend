import React, { FC, useEffect, useState } from 'react';
import { FilterOptions, MainFolders } from './components';
import AddNoteModal, { AddTeamNoteModal, InfoModal } from './components/Modals';
import { Modal, Rule, useBreakpoints, useStyle, Theme, CreateRule } from '@dex-ddl/core';
import { FoldersWithNotesTypes, FoldersWithNotesTypesTEAM, NoteData, NotesType, NotesTypeTEAM } from './type';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { IconButton } from 'components/IconButton';
import { Icon, Icon as IconComponent } from 'components/Icon';
import { EditSelectedNote } from './components/Modals/EditSelectedNote';
import { schemaFolder, schemaNotes, schemaNoteToEdit, schemaTEAMNotes } from './components/Modals/schema/schema';
import { useDispatch, useSelector } from 'react-redux';

import {
  colleagueUUIDSelector,
  getFoldersSelector,
  getNotesSelector,
  NotesActions as NotesActionsToDispatch,
  notesFolderColleagueDataSelector,
  notesFolderTeamDataSelector,
  personalFolderUuidSelector,
  teamFolderUuidSelector,
  ColleaguesActions,
} from '@pma/store';
import { AllNotesFolderId, AllNotesFolderIdTEAM, filterNotesHandler } from '../../utils/note';
import { PeopleTypes } from './components/TeamNotes/ModalsParts/type';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'components/Translation';
import { ConfirmModalWithSelectOptions } from '../Modal';

export const NOTES_WRAPPER = 'note_wrapper';
export const PLUS_BUTTON = 'plus_button';
export const MODAL_BUTTONS = 'modal_buttons';
export const PLUS_PERSONAL_NOTE = 'plus_personal_note';

enum ModalStatuses {
  ADD_NEW = 'ADD_NEW',
  PENDING = 'PENDING',
  PERSONAL_NOTE = 'PERSONAL_NOTE',
  PERSONAL_FOLDER = 'PERSONAL_FOLDER',
  TEAM_NOTE = 'TEAM_NOTE',
  TEAM_FOLDER = 'TEAM_FOLDER',
  INFO = 'INFO',
}

const NotesActions: FC = () => {
  const { css, theme } = useStyle();
  const navigate = useNavigate();
  const [status, setStatus] = useState(ModalStatuses.PENDING);

  const [, isBreakpoint] = useBreakpoints();
  const mobileScreen = isBreakpoint.small || isBreakpoint.xSmall;
  const dispatch = useDispatch();
  const colleagueUuid = useSelector(colleagueUUIDSelector);
  const [userArchivedMode, setUserArchivedMode] = useState<boolean>(false);
  const [teamArchivedMode, setTeamArchivedMode] = useState<boolean>(false);

  const notesFolderColleagueData = useSelector(notesFolderColleagueDataSelector(colleagueUuid, userArchivedMode)) || [];
  const notesFolderTeamData = useSelector(notesFolderTeamDataSelector(colleagueUuid, teamArchivedMode)) || [];

  useEffect(() => {
    if (colleagueUuid) dispatch(NotesActionsToDispatch.getFoldersNotes({ ownerId: colleagueUuid }));
  }, [colleagueUuid]);
  const folders = useSelector(getFoldersSelector) || null;

  const notesSelect = useSelector(getNotesSelector) || null;
  const personalFolderUuid = useSelector(personalFolderUuidSelector) || null;
  const teamFolderUuid = useSelector(teamFolderUuidSelector) || null;

  const [selectedFolder, setSelectedFolder] = useState<NoteData | null>(null);

  const [foldersWithNotes, setFoldersWithNotes] = useState<Array<FoldersWithNotesTypes> | []>([]);

  const [selectedNoteToEdit, setSelectedNoteToEdit] = useState<NotesType | null>(null);

  const [TEAM] = useState(true);

  //TEAM
  const [selectedTEAMFolder, setSelectedTEAMFolder] = useState<NoteData | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const [foldersWithNotesTEAM, setFoldersWithNotesTEAM] = useState<Array<FoldersWithNotesTypesTEAM> | []>([]);
  const [selectedTEAMNoteToEdit, setSelectedTEAMNoteToEdit] = useState<NotesTypeTEAM | null>(null);

  const [selectedPerson, setSelectedPerson] = useState<PeopleTypes | null>(null);
  // filter
  const [searchValueFilterOption, setSearchValueFilterOption] = useState('');

  useEffect(() => {
    if (folders !== null && notesSelect !== null) {
      setFoldersWithNotes(() => notesFolderColleagueData);
    }
  }, [folders, notesSelect, userArchivedMode]);

  useEffect(() => {
    if (searchValueFilterOption.length > 2) {
      if (userArchivedMode) setUserArchivedMode(() => false);
      if (teamArchivedMode) setTeamArchivedMode(() => false);
      const obj = filterNotesHandler(
        setSelectedTEAMFolder,
        setSelectedFolder,
        foldersWithNotes,
        setFoldersWithNotes,
        foldersWithNotesTEAM,
        setFoldersWithNotesTEAM,
        notesSelect,
        searchValueFilterOption,
      );

      setSelectedFolder(() => obj);
    }
  }, [searchValueFilterOption]);

  useEffect(() => {
    if (TEAM && folders !== null && notesSelect !== null) {
      setFoldersWithNotesTEAM(() => notesFolderTeamData);
    }
  }, [folders, notesSelect, teamArchivedMode]);

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver<Yup.AnyObjectSchema>(status !== ModalStatuses.PERSONAL_FOLDER ? schemaNotes : schemaFolder),
  });

  const teamMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver<Yup.AnyObjectSchema>(status !== ModalStatuses.TEAM_FOLDER ? schemaTEAMNotes : schemaFolder),
  });

  const noteToEditMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver<Yup.AnyObjectSchema>(schemaNoteToEdit),
  });

  const { reset: resetTeam, handleSubmit: handleTEAMSubmit } = teamMethods;
  const { handleSubmit: handleSubmitSelectedEditedNote, reset: resetNoteToEdit } = noteToEditMethods;
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values) => {
    if (status === ModalStatuses.PERSONAL_FOLDER) {
      const { folderTitle } = values;
      dispatch(
        NotesActionsToDispatch.createFolderNotes({
          ownerColleagueUuid: colleagueUuid,
          title: folderTitle,
          parentFolderUuid: personalFolderUuid,
        }),
      );
      return;
    }

    if (values.folder === '' && values.noteTitle !== '' && values.noteText !== '') {
      dispatch(
        NotesActionsToDispatch.createNote({
          ownerColleagueUuid: colleagueUuid,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
        }),
      );
      return;
    }

    if (
      values.folder !== 'id_001' &&
      values.folder !== AllNotesFolderId &&
      folders.some((item) => item.id === values.folder)
    ) {
      const { ownerColleagueUuid, id } = folders[folders.findIndex((item) => item.id === values.folder)];
      dispatch(
        NotesActionsToDispatch.createNote({
          ownerColleagueUuid: ownerColleagueUuid,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
          folderUuid: id,
        }),
      );
      return;
    }

    if (values.folder === AllNotesFolderId && values.noteTitle !== '' && values.noteText !== '') {
      dispatch(
        NotesActionsToDispatch.createNote({
          ownerColleagueUuid: colleagueUuid,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
        }),
      );
      return;
    }

    if (values.folder === 'id_001' && values.folderTitle !== '') {
      const body = {
        folder: {
          ownerColleagueUuid: colleagueUuid,
          title: values.folderTitle,
          parentFolderUuid: personalFolderUuid,
        },
        note: {
          ownerColleagueUuid: colleagueUuid,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
        },
      };
      dispatch(NotesActionsToDispatch.createFolderAndNote(body));
    }
  };

  const onTEAMSubmit = async (values) => {
    if (status === ModalStatuses.TEAM_FOLDER) {
      const { folderTitle } = values;
      dispatch(
        NotesActionsToDispatch.createFolderNotes({
          ownerColleagueUuid: colleagueUuid,
          title: folderTitle,
          parentFolderUuid: teamFolderUuid,
        }),
      );
      return;
    }
    if (values.folder === '' && values.noteTitle !== '' && values.noteText !== '') {
      dispatch(
        NotesActionsToDispatch.createNote({
          ownerColleagueUuid: colleagueUuid,
          referenceColleagueUuid: selectedPerson.colleagueUUID,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
        }),
      );
    }

    if (
      values.folder !== 'id_001' &&
      values.folder !== AllNotesFolderIdTEAM &&
      folders.some((item) => item.id === values.folder)
    ) {
      const { ownerColleagueUuid, id } = folders[folders.findIndex((item) => item.id === values.folder)];

      dispatch(
        NotesActionsToDispatch.createNote({
          ownerColleagueUuid: ownerColleagueUuid,
          referenceColleagueUuid: selectedPerson.colleagueUUID,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
          folderUuid: id,
        }),
      );
    }

    if (values.folder === AllNotesFolderIdTEAM && values.noteTitle !== '' && values.noteText !== '') {
      dispatch(
        NotesActionsToDispatch.createNote({
          ownerColleagueUuid: colleagueUuid,
          title: values.noteTitle,
          referenceColleagueUuid: selectedPerson.colleagueUUID,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
        }),
      );
    }

    if (values.folder === 'id_001' && values.folderTitle !== '') {
      const body = {
        folder: {
          ownerColleagueUuid: colleagueUuid,
          title: values.folderTitle,
          parentFolderUuid: teamFolderUuid,
        },
        note: {
          ownerColleagueUuid: colleagueUuid,
          referenceColleagueUuid: selectedPerson.colleagueUUID,
          title: values.noteTitle,
          content: values.noteText,
          status: 'CREATED',
          updateTime: new Date(),
        },
      };
      dispatch(NotesActionsToDispatch.createFolderAndNote(body));
    }
  };

  const onSubmitSelectedEditedNote = async (data) => {
    const { noteTitle, noteText, folder } = data;
    if (selectedNoteToEdit !== null) {
      const payload = {
        ...selectedNoteToEdit,
        title: noteTitle,
        content: noteText,
        ...(folder !== '' && {
          folderUuid: folder === AllNotesFolderId ? null : folder,
        }),
      };

      dispatch(NotesActionsToDispatch.updateNote(payload));
      setSelectedFolder(() => null);
    }
  };

  const cancelSelectedNoteModal = () => {
    if (selectedNoteToEdit !== null) setSelectedNoteToEdit(() => null);
    if (selectedTEAMNoteToEdit !== null) setSelectedTEAMNoteToEdit(() => null);
    resetNoteToEdit();
  };

  const onSubmitTEAMSelectedEditedNote = async (data) => {
    const { noteTitle, noteText, folder } = data;
    if (selectedTEAMNoteToEdit !== null) {
      const payload = {
        ...selectedTEAMNoteToEdit,
        title: noteTitle,
        content: noteText,
        ...(folder !== '' && {
          folderUuid: folder === AllNotesFolderIdTEAM ? null : folder,
        }),
      };

      dispatch(NotesActionsToDispatch.updateNote(payload));
      setSelectedFolder(() => null);
    }
  };

  const cancelTEAMSelectedNoteModal = () => {
    setSelectedTEAMNoteToEdit(() => null);
  };

  const cancelTEAMModal = () => {
    setSelectedPerson(() => null);
    dispatch(ColleaguesActions.clearColleagueList());
    setStatus(() => ModalStatuses.PENDING);
    resetTeam();
  };

  const cancelModal = () => {
    setStatus(() => ModalStatuses.PENDING);
    reset();
  };

  if (status === ModalStatuses.INFO) {
    return (
      <Modal
        modalPosition={'middle'}
        overlayColor={'tescoBlue'}
        modalContainerRule={[containerRule({ theme, mobileScreen })]}
        closeOptions={{
          content: <Icon graphic='cancel' invertColors={true} />,
          onClose: () => {
            setStatus(() => ModalStatuses.PENDING);
          },
          styles: [modalCloseOptionStyle({ mobileScreen })],
        }}
        title={{
          content: 'Notes',
          styles: [modalTitleOptionStyle({ mobileScreen })],
        }}
      >
        <InfoModal
          closeInfoModal={() => {
            setStatus(() => ModalStatuses.PENDING);
          }}
          TEAM={TEAM}
        />
      </Modal>
    );
  }

  if (status === ModalStatuses.PERSONAL_NOTE || status === ModalStatuses.PERSONAL_FOLDER) {
    return (
      <Modal
        modalPosition={'middle'}
        overlayColor={'tescoBlue'}
        modalContainerRule={[containerRule({ theme, mobileScreen })]}
        closeOptions={{
          content: <Icon graphic='cancel' invertColors={true} />,
          onClose: () => {
            cancelModal();
          },
          styles: [modalCloseOptionStyle({ mobileScreen })],
        }}
        title={{
          content: status === ModalStatuses.PERSONAL_FOLDER ? 'Add a folder' : 'Add a note',
          styles: [modalTitleOptionStyle({ mobileScreen })],
        }}
      >
        <AddNoteModal
          methods={methods}
          cancelModal={cancelModal}
          submitForm={handleSubmit(onSubmit)}
          createFolder={status === ModalStatuses.PERSONAL_FOLDER}
          foldersWithNotes={foldersWithNotes}
        />
      </Modal>
    );
  }
  if (selectedTEAMNoteToEdit) {
    return (
      <Modal
        modalPosition={'middle'}
        overlayColor={'tescoBlue'}
        modalContainerRule={[containerRule({ theme, mobileScreen })]}
        closeOptions={{
          content: <Icon graphic='cancel' invertColors={true} />,
          onClose: () => {
            cancelSelectedNoteModal();
          },
          styles: [modalCloseOptionStyle({ mobileScreen })],
        }}
        title={{
          content: 'My notes',
          styles: [modalTitleOptionStyle({ mobileScreen })],
        }}
      >
        <EditSelectedNote
          methods={noteToEditMethods}
          cancelSelectedNoteModal={cancelTEAMSelectedNoteModal}
          submitForm={handleSubmitSelectedEditedNote(onSubmitTEAMSelectedEditedNote)}
          setSelectedNoteToEdit={setSelectedTEAMNoteToEdit}
          foldersWithNotes={foldersWithNotesTEAM}
          selectedNoteToEdit={selectedTEAMNoteToEdit}
          setSelectedFolder={setSelectedTEAMFolder}
          definePropperEditMode={selectedNoteToEdit}
          setSelectedFolderDynamic={setSelectedFolder}
        />
      </Modal>
    );
  }

  if (status === ModalStatuses.TEAM_NOTE || status === ModalStatuses.TEAM_FOLDER) {
    return (
      <Modal
        modalPosition={'middle'}
        overlayColor={'tescoBlue'}
        modalContainerRule={[containerRule({ theme, mobileScreen })]}
        closeOptions={{
          content: <Icon graphic='cancel' invertColors={true} />,
          onClose: () => {
            cancelTEAMModal();
          },
          styles: [modalCloseOptionStyle({ mobileScreen })],
        }}
        title={{
          content: status === ModalStatuses.TEAM_FOLDER ? 'Add team folder' : 'Add a team note',
          styles: [modalTitleOptionStyle({ mobileScreen })],
        }}
      >
        <AddTeamNoteModal
          teamMethods={teamMethods}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          foldersWithNotesTEAM={foldersWithNotesTEAM}
          cancelTEAMModal={cancelTEAMModal}
          handleTEAMSubmit={handleTEAMSubmit(onTEAMSubmit)}
          createFolder={status === ModalStatuses.TEAM_FOLDER}
        />
      </Modal>
    );
  }

  if (selectedNoteToEdit) {
    return (
      <Modal
        modalPosition={'middle'}
        overlayColor={'tescoBlue'}
        modalContainerRule={[containerRule({ theme, mobileScreen })]}
        closeOptions={{
          content: <Icon graphic='cancel' invertColors={true} />,
          onClose: () => {
            cancelSelectedNoteModal();
          },
          styles: [modalCloseOptionStyle({ mobileScreen })],
        }}
        title={{
          content: 'Edit note',
          styles: [modalTitleOptionStyle({ mobileScreen })],
        }}
      >
        <EditSelectedNote
          methods={noteToEditMethods}
          cancelSelectedNoteModal={cancelSelectedNoteModal}
          submitForm={handleSubmitSelectedEditedNote(onSubmitSelectedEditedNote)}
          setSelectedNoteToEdit={setSelectedNoteToEdit}
          foldersWithNotes={foldersWithNotes}
          selectedNoteToEdit={selectedNoteToEdit}
          setSelectedFolder={setSelectedFolder}
          definePropperEditMode={selectedNoteToEdit}
          setSelectedFolderDynamic={setSelectedFolder}
        />
      </Modal>
    );
  }

  const confirmSelectOptions = [
    { value: 'PersonalNote', label: ModalStatuses.PERSONAL_NOTE },
    { value: 'PersonalFolder', label: ModalStatuses.PERSONAL_FOLDER },
    { value: 'TeamNote', label: ModalStatuses.TEAM_NOTE },
    { value: 'TeamFolder', label: ModalStatuses.TEAM_FOLDER },
  ];

  return (
    <div data-test-id={NOTES_WRAPPER}>
      {status === ModalStatuses.ADD_NEW && (
        <ConfirmModalWithSelectOptions
          options={confirmSelectOptions}
          description='Please choose the one option:'
          onOverlayClick={() => setStatus(() => ModalStatuses.PENDING)}
          title='Add new'
          onSave={([checkedItem]) => {
            setSelectedFolder(() => null);
            setStatus(() => ModalStatuses[checkedItem]);
          }}
          onCancel={() => setStatus(() => ModalStatuses.PENDING)}
        />
      )}

      <div className={css({ paddingRight: '40px', position: 'relative' })}>
        <div className={css(wrapperHeaderStyle)}>
          <IconButton
            customVariantRules={{ default: iconBtnAddStyle }}
            onPress={() => setStatus(() => ModalStatuses.ADD_NEW)}
            graphic='add'
            iconProps={{ invertColors: true }}
            iconStyles={iconAddStyle}
          >
            <Trans>Add new</Trans>
          </IconButton>
          <FilterOptions
            TEAM={TEAM}
            searchValueFilterOption={searchValueFilterOption}
            setSearchValueFilterOption={setSearchValueFilterOption}
            openInfoModal={() => {
              setStatus(() => ModalStatuses.INFO);
            }}
          />
        </div>

        <MainFolders
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          TEAM={TEAM}
          selectedTEAMFolder={selectedTEAMFolder}
          setSelectedTEAMFolder={setSelectedTEAMFolder}
          foldersWithNotes={foldersWithNotes}
          setFoldersWithNotes={setFoldersWithNotes}
          setSelectedNoteToEdit={setSelectedNoteToEdit}
          foldersWithNotesTEAM={foldersWithNotesTEAM}
          setFoldersWithNotesTEAM={setFoldersWithNotesTEAM}
          setSelectedTEAMNoteToEdit={setSelectedTEAMNoteToEdit}
          setUserArchivedMode={setUserArchivedMode}
          userArchivedMode={userArchivedMode}
          teamArchivedMode={teamArchivedMode}
          setTeamArchivedMode={setTeamArchivedMode}
        />
      </div>
      <span
        className={css(arrowLeftStyle({ theme, mobileScreen }))}
        onClick={() => {
          if (userArchivedMode || teamArchivedMode) {
            if (userArchivedMode) setUserArchivedMode(() => false);
            if (teamArchivedMode) setTeamArchivedMode(() => false);
            if (!selectedFolder) setSelectedFolder(() => null);
            if (selectedTEAMFolder) setSelectedTEAMFolder(() => null);
          } else {
            navigate(-1);
          }
        }}
      >
        <IconComponent graphic='arrowLeft' invertColors={false} />
      </span>
    </div>
  );
};

const wrapperHeaderStyle: Rule = {
  marginLeft: '40px',
  marginTop: '17px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const iconBtnAddStyle: Rule = ({ theme }) => ({
  background: theme.colors.tescoBlue,
  color: theme.colors.white,
  padding: `${theme.spacing.s1_5} ${theme.spacing.s5}`,
  borderRadius: theme.spacing.s8,
  fontWeight: theme.font.weight.bold,
});

const iconAddStyle: Rule = {
  marginRight: '10px',
  marginTop: '2px',
};

const arrowLeftStyle: CreateRule<{ theme: Theme; mobileScreen: boolean }> = ({ theme, mobileScreen }) => {
  return {
    position: 'fixed',
    top: theme.spacing.s5,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    left: mobileScreen ? theme.spacing.s5 : theme.spacing.s10,
  };
};

const containerRule: CreateRule<{ theme: Theme; mobileScreen: boolean }> = ({ theme, mobileScreen }) => {
  return {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(mobileScreen
      ? { borderRadius: '24px 24px 0 0 ', padding: '16px 0px 97px' }
      : { borderRadius: '32px', padding: `40px 0px 112px` }),
    height: mobileScreen ? 'calc(100% - 72px)' : 'calc(100% - 102px)',
    marginBottom: mobileScreen ? 0 : '30px',
    width: '640px',
    marginTop: '72px',
    cursor: 'default',
    overflow: 'auto',
    background: 'white',
  };
};

const modalCloseOptionStyle: CreateRule<{ mobileScreen: boolean }> = ({ mobileScreen }) => {
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

const modalTitleOptionStyle: CreateRule<{ mobileScreen: boolean }> = ({ mobileScreen }) => {
  return {
    position: 'fixed',
    top: '22px',
    textAlign: 'center',
    left: 0,
    right: 0,
    color: 'white',
    fontWeight: 'bold',
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

export default NotesActions;
