import React, { FC } from 'react';
import { Colors, CreateRule, Rule, useStyle } from '@pma/dex-wrapper';

import { TileWrapper as Tile } from '../Tile/TileWrapper';
import { StatusIcon } from './StatusIcon';
import { Graphics } from 'components/Icon';
import { Status, TimelineType } from 'config/enum';
import { TFunction, useTranslation } from 'components/Translation';

export type StepIndicatorProps = {
  mainTitle?: string;
  currentStep?: number;
  currentStatus?: Status;
  titles?: string[];
  descriptions?: string[];
  statuses?: Status[];
  types?: TimelineType[];
  isValid?: boolean;
  customStyle?: React.CSSProperties | {};
};

const getStatus = (i: number, currentStep?: number, currentStatus?: Status, isValid?: boolean) => {
  if ((isValid && i === currentStep) || (currentStep && currentStep > i)) return Status.APPROVED;
  if (currentStep === i && currentStatus) return Status[currentStatus];
};

const isActive = (statuses: Status[] | undefined, i) => {
  const currentStatus = statuses?.[i];
  if (!currentStatus) return false;
  return currentStatus !== Status.NOT_STARTED;
};

export const getIcon = (
  status: Status | undefined,
  type: TimelineType = TimelineType.REVIEW,
  t: TFunction,
): [Graphics, Colors, string] => {
  const contents: { [key: string]: { [key: string]: [Graphics, Colors, string] } } = {
    [TimelineType.REVIEW]: {
      [Status.NOT_AVAILABLE]: ['calender', 'tescoBlue', t('not_available', 'Not available')],
      [Status.AVAILABLE]: ['roundAlert', 'pending', t('available', 'Available')],
      [Status.OVERDUE]: ['roundAlert', 'error', t('overdue', 'Overdue')],
      [Status.DRAFT]: ['roundPencil', 'base', t('draft', 'Draft')],
      [Status.APPROVED]: ['roundTick', 'green', t('completed', 'Completed')],
      [Status.PENDING]: ['roundClock', 'pending', t('pending', 'Pending')],
      [Status.WAITING_FOR_APPROVAL]: ['roundClock', 'pending', t('waiting_for_approval', 'Waiting for approval')],
      [Status.DECLINED]: ['roundAlert', 'pending', t('declined', 'Declined')],
    },
    [TimelineType.TIMELINE_POINT]: {
      [Status.STARTED]: ['roundTick', 'green', t('available', 'Available')],
    },
  };

  return contents[type!][status!] || ['roundCircle', 'pending', t('not_completed', 'Not completed')];
};

export const StepIndicatorBasic: FC<StepIndicatorProps> = ({
  currentStep,
  currentStatus,
  titles = [],
  descriptions = [],
  statuses = [],
  types = [],
  isValid,
}) => {
  const { css, theme } = useStyle();
  const { t } = useTranslation();

  const Line: FC<{ active?: boolean }> = ({ active }) => (
    <div
      className={css({
        width: '100%',
        height: '3px',
        background: active ? theme.colors.tescoBlue : theme.colors.backgroundDarkest,
        flex: 1,
      })}
    />
  );

  const Step: FC<{ CurrentStep?: any; alignItems }> = ({ CurrentStep, alignItems }) => {
    return (
      <div
        className={css({
          display: 'flex',
          alignItems: alignItems,
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          paddingBottom: '12px',
        })}
      >
        <StatusIcon graphics='roundCircle' color='base' />
        {CurrentStep}
      </div>
    );
  };

  let array: JSX.Element[];
  if (statuses && statuses.length > 0) {
    array = statuses.reduce((arr: JSX.Element[], status, i) => {
      const [graphics, color, title] = getIcon(status, types[i], t);
      const alignItems = getTextAlign(statuses?.length, i);
      arr.push(
        <div key={`wrapper${i}`}>
          <Line key={`line${i}`} active={!!currentStep && currentStep >= i} />
          <Step
            key={`step${i}`}
            alignItems={alignItems}
            CurrentStep={<StatusIcon graphics={graphics} color={color} title={title} />}
          />
        </div>,
      );
      return arr;
    }, []);
  } else {
    array = titles.reduce((arr: JSX.Element[], _, i) => {
      const status = getStatus(i, currentStep, currentStatus, isValid);
      const [graphics, color, title] = getIcon(status, types[i], t);
      const alignItems = getTextAlign(titles?.length, i);
      arr.push(
        <div key={`wrapper${i}`}>
          <Line key={`line${i}`} active={!!currentStep && currentStep >= i} />
          <Step
            key={`step${i}`}
            alignItems={alignItems}
            CurrentStep={graphics && <StatusIcon graphics={graphics} color={color} title={title} />}
          />
        </div>,
      );
      return arr;
    }, []);
  }

  function getTextAlign(length, i) {
    if (i === length - 1) return 'end';
    if (i === 0) return 'start';
    return 'center';
  }

  const titlesArray = titles.map((title, i) => {
    const textAlign = getTextAlign(titles?.length, i);
    let active;
    /**
     * For timeline we show black style if status !== Status.NOT_STARTED
     * For Step indicator we show black if status === Status.APPROVED || status === Status.DRAFT
     * for current and all previous steps
     */
    if (statuses && statuses.length > 0) {
      active = isActive(statuses, i);
    } else {
      const status = getStatus(i, currentStep, currentStatus, isValid);
      active = status === Status.APPROVED || status === Status.DRAFT;
    }
    return (
      <div key={`title${i}`}>
        <div className={css(title2Style({ textAlign, active }))} key={`title${i}`}>
          {title}
        </div>
        <div className={css(descriptionStyle({ textAlign, active }))}>{descriptions[i]}</div>
      </div>
    );
  });

  return (
    <div
      className={css({
        paddingTop: '12px',
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: ` 1fr repeat(${array.length - 2}, 2fr) 1fr`,
      })}
    >
      {array}
      {titlesArray}
    </div>
  );
};

export const StepIndicator: FC<StepIndicatorProps> = ({
  mainTitle = 'Your Contribution timeline',
  currentStep,
  currentStatus,
  titles = [],
  descriptions = [],
  statuses = [],
  types = [],
  customStyle = {},
}) => {
  const { css } = useStyle();
  return (
    <Tile customStyle={customStyle}>
      <div className={css(wrapperStyle)} data-test-id='timeline'>
        <span className={css(titleStyle)}>{mainTitle}</span>
        <StepIndicatorBasic
          currentStep={currentStep}
          currentStatus={currentStatus}
          titles={titles}
          descriptions={descriptions}
          statuses={statuses}
          types={types}
        />
      </div>
    </Tile>
  );
};

const titleStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  letterSpacing: '0px',
  fontStyle: 'normal',
  fontWeight: 'bold',
  marginBottom: '30px',
});

const title2Style: CreateRule<{ textAlign: any; active: boolean }> =
  ({ textAlign, active }) =>
  ({ theme }) => ({
    fontStyle: 'normal',
    fontWeight: 'bold',
    ...theme.font.fixed.f14,
    letterSpacing: '0px',
    paddingTop: '8px',
    flex: '0 1 0',
    textAlign: textAlign,
    color: active ? theme.colors.base : theme.colors.backgroundDarkest,
  });

const descriptionStyle: CreateRule<{ textAlign: any; active: boolean }> =
  ({ textAlign, active }) =>
  ({ theme }) => ({
    fontStyle: 'normal',
    ...theme.font.fixed.f14,
    letterSpacing: '0px',
    flex: '0 1 0',
    textAlign: textAlign,
    color: active ? theme.colors.base : theme.colors.backgroundDarkest,
  });

const wrapperStyle = {
  padding: '20px',
};
