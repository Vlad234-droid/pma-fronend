import React, { FC } from 'react';
import filesize from 'filesize';
import { Rule, useStyle } from '@dex-ddl/core';
import Download from 'components/DropZone/Download.svg';
import Trash from 'components/DropZone/Trash.svg';
import { BASE_URL_API } from 'config/constants';

export type File = {
  fileName: string;
  fileLength: number;
  uuid: string;
};

export type Props = {
  file: File;
  onDelete: (uuid: string) => void;
};

export const File: FC<Props> = ({ file, onDelete }) => {
  const { css } = useStyle();
  const { fileName, fileLength, uuid } = file;
  const getDownloadHref = (uuid) => `${BASE_URL_API}/files/${uuid}/download`;
  return (
    <div className={css(listItemStyles)}>
      <div className={css({ margin: '24px 0' })}>
        <div className={css(fileNameStyles)}>{fileName}</div>
        <div className={css(filesizeStyles)}>{filesize(fileLength)}</div>
      </div>
      <div className={css(buttonsWrapperStyles)}>
        <a href={getDownloadHref(uuid)} download>
          <img src={Download} alt='Download' />
        </a>
        <button className={css(buttonStyles)} onClick={() => onDelete(uuid)}>
          <img src={Trash} alt='Trash' />
        </button>
      </div>
    </div>
  );
};

const buttonStyles = {
  backgroundColor: 'inherit',
  border: 'none',
};

const filesizeStyles: Rule = ({ theme }) => ({
  fontSize: '14px',
  color: theme.colors.tescoBlue,
});

const fileNameStyles: Rule = ({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: theme.colors.tescoBlue,
});

const listItemStyles: Rule = ({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.colors.backgroundDarkest}`,
});

const buttonsWrapperStyles = { display: 'flex', alignItems: 'center' };