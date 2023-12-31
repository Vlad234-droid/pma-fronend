import React, { FC, ReactNode } from 'react';
import { Status } from 'config/enum';
import { Button, CreateRule, Rule, useStyle, colors } from '@pma/dex-wrapper';
import { Colors } from 'config/types';
import { TileWrapper } from 'components/Tile';
import { Icon } from 'components/Icon';

export const TEST_ID = 'main-widget';

export type Props = {
  status: Status;
  title?: string;
  subTitle: string | ReactNode;
  buttonText?: string;
  backgroundColor: Colors;
  onClick: () => void;
  description?: string;
  customStyle?: React.CSSProperties | {};
  disabled?: boolean;
  isClickable: boolean;
  mode?: 'default' | 'inverse';
  showIcon?: boolean;
};

const DISABLED_COLOR = '#B3CDE6';

const MainWidgetBase: FC<Props> = ({
  customStyle,
  title,
  subTitle,
  description,
  buttonText,
  backgroundColor,
  disabled,
  onClick,
  isClickable,
  mode,
  showIcon = true,
}) => {
  const { css } = useStyle();

  return (
    <>
      <TileWrapper customStyle={customStyle} hover={!disabled} background={backgroundColor}>
        <div
          className={css(wrapperStyle({ clickable: isClickable, disabled }))}
          onMouseDown={onClick}
          data-test-id={TEST_ID}
        >
          <div className={css(headStyle)}>
            {showIcon && (
              <div>
                <Icon
                  graphic='document'
                  invertColors={isClickable}
                  iconStyles={iconStyles}
                  //@ts-ignore
                  color={disabled ? colors.darkBlue : undefined}
                />
              </div>
            )}
            <div className={css(headerBlockStyle({ marginLeft: showIcon }))}>
              <span className={css(titleStyle)}>{title}</span>
              <span className={css(descriptionStyle)}>{subTitle}</span>
            </div>
          </div>
          <div className={css(bodyStyle)}>
            {description && <div className={css(subDescription)}>{description}</div>}
            <div className={css(bodyBlockStyle)}>
              {!disabled && buttonText && (
                <Button mode={mode} styles={[viewButtonStyle({ inverse: isClickable })]} onPress={onClick}>
                  {buttonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </TileWrapper>
    </>
  );
};

const viewButtonStyle: CreateRule<{ inverse: boolean }> =
  ({ inverse }) =>
  ({ theme }) => ({
    ...theme.font.fixed.f14,
    letterSpacing: '0px',
    fontWeight: theme.font.weight.bold,
    padding: '0 16px',
    border: `2px solid ${inverse ? theme.colors.white : theme.colors.tescoBlue}`,
  });

const wrapperStyle: CreateRule<{ clickable: boolean; disabled?: boolean }> =
  ({ clickable, disabled }) =>
  ({ theme }) => ({
    padding: '24px 30px',
    color: disabled ? DISABLED_COLOR : clickable ? theme.colors.white : theme.colors.tescoBlue,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    display: 'flex',
  });

const headerBlockStyle: CreateRule<{ marginLeft: boolean }> = ({ marginLeft }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginLeft: marginLeft ? '30px' : '0px',
});

const iconStyles: Rule = {
  width: '52px',
  height: '70px',
  fontStyle: 'normal',
  lineHeight: 0,
  textAlign: 'center',
  textTransform: 'none',
};

const headStyle: Rule = {
  display: 'flex',
};

const bodyBlockStyle: Rule = {
  display: 'grid',
  paddingTop: '14px',
};

const titleStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f18,
  letterSpacing: '0px',
  fontStyle: 'normal',
  fontWeight: 'bold',
  marginBottom: '12px',
});

const descriptionStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  letterSpacing: '0px',
  position: 'relative',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

const bodyStyle: Rule = {
  flexWrap: 'wrap',
  gap: '16px 8px',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'flex-end',
};
const subDescription: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  letterSpacing: '0px',
  marginTop: '14px',
  marginLeft: '9px',
});

export default MainWidgetBase;
