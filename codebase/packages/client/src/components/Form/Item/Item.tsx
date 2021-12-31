import React, { FC, useRef, useState } from 'react';
import { colors, CreateRule, Rule, Styles, useStyle } from '@dex-ddl/core';

import { Icon } from 'components/Icon';
import MarkdownRenderer from 'components/MarkdownRenderer';
import Provider from '../context/input';

export type Props = {
  label?: string;
  withIcon?: boolean;
  styles?: Styles | Rule;
  errormessage?: string;
  marginBot?: boolean;
  customIcon?: boolean;
  customIconInserted?: any;
  onFocus?: () => void;
  focus?: boolean;
};

export const Item: FC<Props> = ({
  children,
  label,
  withIcon = true,
  errormessage = '',
  marginBot = true,
  customIcon = false,
  customIconInserted,
  focus,
  onFocus,
}) => {
  const { css } = useStyle();
  const [recordingState, setRecordingState] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setInputFocus = () => {
    if (focus) {
      onFocus && onFocus();
      return;
    }

    return inputRef.current && inputRef.current?.focus();
  };

  return (
    <div className={css(wrapperItem({ marginBot }))}>
      {label && (
        <div className={css(labelWrapperStyle)}>
          <label className={css(labelStyle)} title={label}>
            <MarkdownRenderer source={label} />
          </label>
        </div>
      )}
      <div className={css(childrenWrapper)}>
        <div>
          <Provider value={inputRef}>{children}</Provider>
          {errormessage && (
            <span
              className={css({
                position: 'absolute',
                left: 0,
                bottom: '-20px',
                fontSize: '14px',
                lineHeight: '18px',
                color: colors.error,
              })}
            >
              {errormessage}
            </span>
          )}
        </div>
        {withIcon && (
          <span
            className={css(IconStyle)}
            onClick={() => {
              setRecordingState(!recordingState);
              setInputFocus();
            }}
          >
            {recordingState ? <Icon graphic='roundStop' /> : <Icon graphic='microphone' fill={colors.dustyGray} />}
          </span>
        )}
        {customIcon && (
          <span
            className={css(IconStyle)}
            onClick={() => {
              setInputFocus();
              onFocus && onFocus();
            }}
          >
            {customIconInserted}
          </span>
        )}
      </div>
    </div>
  );
};

const wrapperItem: CreateRule<{ marginBot: boolean }> = ({ marginBot }) => ({
  boxSizing: 'border-box',
  margin: marginBot ? '0 0 24px' : '0px',
  padding: '0',
  color: colors.black,
});

const labelStyle: Rule = {
  display: 'inline-flex',
  fontSize: '16px',
  lineHeight: '20px',
};
const labelWrapperStyle: Rule = {
  maxWidth: '100%',
  padding: '0 0 8px',
};
const childrenWrapper: Rule = {
  position: 'relative',
  ':focus-within svg path': {
    fill: colors.tescoBlue,
  },
} as Styles;

const IconStyle: Rule = {
  position: 'absolute',
  top: '10px',
  right: '12px',
  cursor: 'pointer',
};
