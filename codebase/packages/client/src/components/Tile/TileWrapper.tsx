import React, { FC } from 'react';
import { CreateRule, useStyle } from '@pma/dex-wrapper';
import { Colors } from 'config/types';

export const TILE_WRAPPER = 'tile-wrapper';

export type Props = {
  boarder?: boolean;
  boxShadow?: boolean;
  hover?: boolean;
  background?: Colors;
  children: any;
  customStyle?: React.CSSProperties | {};
};

export const TileWrapper: FC<Props> = ({
  boarder = false,
  boxShadow = true,
  hover = false,
  customStyle = {},
  background = 'white',
  children,
}) => {
  const { css } = useStyle();

  return (
    <div
      data-test-id={TILE_WRAPPER}
      className={css(
        containerStyle({ hover, background }),
        borderStyle({ boarder }),
        borderShadowStyle({ boxShadow }),
        customStyle,
      )}
    >
      {children}
    </div>
  );
};

const containerStyle: CreateRule<{ hover: boolean; background: Colors }> =
  ({ hover, background }) =>
  ({ theme }) => {
    const style = {
      margin: 0,
      padding: 0,
      background: theme.colors[background],
      color: background === 'tescoBlue' ? theme.colors.white : theme.colors.base,
      borderRadius: theme.border.radius.md,
    };
    if (hover) {
      return {
        ...style,
        '&:hover': {
          ...(background === 'white' ? { background: '#F3F9FC', opacity: 0.9 } : { opacity: 0.8 }),
          //cursor: 'pointer',
        },
      };
    }
    return style;
  };
const borderStyle: CreateRule<{ boarder: boolean }> =
  ({ boarder }) =>
  ({ theme }) => {
    if (boarder) {
      return {
        // @ts-ignore
        border: `2px solid ${theme.colors.lightGray}`,
      };
    }
    return {
      border: 0,
    };
  };

const borderShadowStyle: CreateRule<{ boxShadow: boolean }> = ({ boxShadow }) => {
  if (boxShadow) {
    return {
      width: '100%',
      boxShadow: '3px 3px 1px 1px rgba(0, 0, 0, 0.05)',
    };
  }
  return {};
};
