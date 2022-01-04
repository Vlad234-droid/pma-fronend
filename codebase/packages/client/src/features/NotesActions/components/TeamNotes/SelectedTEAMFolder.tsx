import React, { FC, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { Rule, Styles, useStyle, useBreakpoints, colors, CreateRule } from '@dex-ddl/core';
import { IconButton } from 'components/IconButton';
import { NoteData, NotesTypeTEAM } from '../../type';
import { formatToRelativeDate } from '../../../../utils/date';

type SelectedFolderProps = {
  selectedTEAMFolder: NoteData | null;
  setConfirmTEAMModal: Dispatch<SetStateAction<boolean>>;
  selectedTEAMNoteId: MutableRefObject<null | string>;
  selectedTEAMFolderId: MutableRefObject<null | string>;
  noteTEAMFolderUuid: MutableRefObject<null | string>;
  actionTEAMModal: MutableRefObject<null | string>;
  setSelectedTEAMFolder: Dispatch<SetStateAction<NoteData | null>>;
  setSelectedTEAMNoteToEdit: Dispatch<SetStateAction<NotesTypeTEAM | null>>;
  setFoldersWithNotesTEAM: Dispatch<SetStateAction<Array<NoteData>>>;
  foldersWithNotesTEAM: any;
  teamArchivedMode: boolean;
};
const SelectedFolder: FC<SelectedFolderProps> = ({
  selectedTEAMFolder,
  setConfirmTEAMModal,
  selectedTEAMNoteId,
  actionTEAMModal,
  setSelectedTEAMFolder,
  setSelectedTEAMNoteToEdit,
  noteTEAMFolderUuid,
  selectedTEAMFolderId,
  foldersWithNotesTEAM,
  setFoldersWithNotesTEAM,
  teamArchivedMode = false,
}) => {
  const { css } = useStyle();

  const btnsActionsHandle = (itemId: string, itemFolderUuid: string | null) => {
    const btnsActions = [
      {
        ...(!teamArchivedMode && {
          id: '1',
          button: (
            <div
              className={css(Align_flex_style)}
              id='backdrop'
              onClick={() => {
                selectedTEAMNoteId.current = itemId;
                actionTEAMModal.current = 'archive';
                setConfirmTEAMModal(() => true);
              }}
            >
              <IconButton
                iconProps={{ title: 'Archive' }}
                id='backdrop'
                graphic='archive'
                onPress={() => {
                  selectedTEAMNoteId.current = itemId;
                  actionTEAMModal.current = 'archive';
                  setConfirmTEAMModal(() => true);
                }}
              />
              <span className={css({ whiteSpace: 'nowrap', marginLeft: '8px' })} id='backdrop'>
                Archive note
              </span>
            </div>
          ),
        }),
      },
      {
        ...(!teamArchivedMode && {
          id: '2',
          button: (
            <div
              id='backdrop'
              className={css(Align_flex_style)}
              onClick={() => {
                selectedTEAMNoteId.current = itemId;
                noteTEAMFolderUuid.current = itemFolderUuid;
                actionTEAMModal.current = 'move';
                setConfirmTEAMModal(() => true);
              }}
            >
              <IconButton
                iconProps={{ title: 'Move to folder' }}
                graphic='folder'
                id='backdrop'
                onPress={() => {
                  selectedTEAMNoteId.current = itemId;
                  noteTEAMFolderUuid.current = itemFolderUuid;
                  actionTEAMModal.current = 'move';
                  setConfirmTEAMModal(() => true);
                }}
              />
              <span className={css({ whiteSpace: 'nowrap', marginLeft: '8px' })} id='backdrop'>
                Move to folder
              </span>
            </div>
          ),
        }),
      },
      {
        id: '3',
        button: (
          <div
            className={css(Align_flex_styleLast)}
            id='backdrop'
            onClick={() => {
              selectedTEAMNoteId.current = itemId;
              actionTEAMModal.current = 'delete';
              setConfirmTEAMModal(() => true);
            }}
          >
            <IconButton
              iconProps={{ title: 'Delete' }}
              graphic='delete'
              id='backdrop'
              onPress={() => {
                selectedTEAMNoteId.current = itemId;
                actionTEAMModal.current = 'delete';
                setConfirmTEAMModal(() => true);
              }}
            />
            <span className={css({ whiteSpace: 'nowrap', marginLeft: '8px' })} id='backdrop'>
              Delete note
            </span>
          </div>
        ),
      },
    ];

    return (
      <div className={css(Modal_buttons_style({ teamArchivedMode }))}>
        {btnsActions.map((item) => (
          <div key={item.id} className={css({})}>
            {item.button}
          </div>
        ))}
      </div>
    );
  };

  const selectedNoteActionhandler = (noteId) => {
    selectedTEAMFolderId.current = null;
    if (foldersWithNotesTEAM.length) {
      setFoldersWithNotesTEAM((prev) => {
        const arr = [...prev];
        arr.forEach((item) => {
          item.selectedDots = false;
        });
        return arr;
      });
    }

    if (selectedTEAMFolder.notes[selectedTEAMFolder?.notes?.findIndex((item) => item.selected === true)]) {
      setSelectedTEAMFolder((prev) => {
        const arr = { ...prev };
        arr.notes[arr.notes.findIndex((item) => item.id === noteId)].selected = false;
        return arr;
      });
      return;
    }
    setSelectedTEAMFolder((prev) => {
      const arr = { ...prev };
      arr.notes.forEach((item) => (item.selected = false));
      return arr;
    });

    setSelectedTEAMFolder((prev) => {
      const arr = { ...prev };
      arr.notes[arr.notes.findIndex((item) => item.id === noteId)].selected = true;
      return arr;
    });
  };

  const setSelectedNoteHandler = (e, item) => {
    if (e.target.parentElement.id === 'backdrop' || e.target.id === 'backdrop') return;
    if (selectedTEAMFolder.notes[selectedTEAMFolder?.notes?.findIndex((item) => item.selected === true)]) {
      setSelectedTEAMFolder((prev) => {
        const arr = { ...prev };
        arr.notes[arr.notes.findIndex((note) => note.id === item.id)].selected = false;
        return arr;
      });
    }
    setSelectedTEAMNoteToEdit(() => item);
  };

  return (
    <div className={css(Expanded_Note_Style)}>
      <div className={css(Flex_beetween_style)}>
        <span className={css(Folder_Title_styled)}>{selectedTEAMFolder?.title}</span>
      </div>
      <div className={css({ marginTop: '32px', display: 'flex', flexDirection: 'column' })}>
        {selectedTEAMFolder?.notes.map((item) => (
          <div
            className={css(Flex_beetween_style, Note_container_style, { position: 'relative' })}
            key={item.id}
            onClick={(e) => setSelectedNoteHandler(e, item)}
          >
            <span className={css(noteTitle_style)}>{item.title}</span>
            <div className={css(Flex_style)}>
              <span className={css(Time_Styled)}>{formatToRelativeDate(item?.updateTime)}</span>
              <div className={css(dots_style)} onClick={() => selectedNoteActionhandler(item.id)} id='backdrop'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            {item.selected && btnsActionsHandle(item.id, item.folderUuid)}
          </div>
        ))}
      </div>
    </div>
  );
};

const Align_flex_style: Rule = ({ colors }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
  borderBottom: `1px solid ${colors.backgroundDarkest}`,
  padding: '15px 24px',
});
const Align_flex_styleLast: Rule = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',

  padding: '15px 24px',
};

const Modal_buttons_style: CreateRule<{ teamArchivedMode: boolean }> = ({ teamArchivedMode }) =>
  ({
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    right: '-30px',
    bottom: !teamArchivedMode ? '-161px' : '-52px',
    background: colors.white,
    zIndex: 2,
    borderRadius: '8px',
    boxShadow: 'rgba(100, 100, 111, 0.05) 4px 2px 10px 10px',
    ':before': {
      content: "''",
      width: '18px',
      height: '18px',
      position: 'absolute',
      top: '-9px',
      right: '34px',
      background: colors.white,
      boxShadow: 'rgba(100, 100, 111, 0.08) -1px -1px 3px -1px',
      transform: 'rotate(45deg)',
    },
  } as Styles);

const dots_style: Rule = ({ colors }) =>
  ({
    display: 'flex',
    marginLeft: '30px',
    padding: '10px 0px 10px 10px',
    cursor: 'pointer',
    '& span': {
      height: '6px',
      width: '6px',
      background: colors.link,
      marginLeft: '4px',
      borderRadius: '50%',
    },
  } as Styles);

const Flex_style: Rule = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const Expanded_Note_Style: Rule = () => {
  const [, isBreakpoint] = useBreakpoints();
  const mediumScreen = isBreakpoint.small || isBreakpoint.xSmall || isBreakpoint.medium;
  return {
    background: '#FFFFFF',
    boxShadow: '3px 3px 1px 1px rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
    width: '100%',
    height: '100%',
    padding: '24px',
    alignSelf: 'flex-start',
    ...(mediumScreen && { flexGrow: 1 }),
  };
};

const Folder_Title_styled: Rule = {
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '20px',
  lineHeight: '24px',
  color: '#333333',
};

const Flex_beetween_style: Rule = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const noteTitle_style: Rule = {
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '22px',
  color: '#00539F',
};

const Note_container_style: Rule = {
  height: '46px',
  position: 'relative',
  cursor: 'pointer',
  '&:before': {
    content: '""',
    position: 'absolute',
    height: '1px',
    width: '100%',
    background: '#E5E5E5',
    left: '0px',
    bottom: '0px',
  },
} as Styles;

const Time_Styled: Rule = {
  fontWeight: 'normal',
  fontSize: '18px',
  lineHeight: '22px',
  textAlign: 'right',
  color: '#333333',
};

export default SelectedFolder;