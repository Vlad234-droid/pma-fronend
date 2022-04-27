import React, { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useStyle, Rule, Styles } from '@pma/dex-wrapper';
import { ExpressionValueType, FormType } from '@pma/store';
import MarkdownRenderer from 'components/MarkdownRenderer';
import { GenericItemField } from 'components/GenericForm';
import { Input, Item, ItemProps, Select, Text, Textarea } from 'components/Form';
import { formTagComponents } from '../../../utils';
import { BorderedComponent } from '../../../types';

type ReviewComponentsProps = {
  components: any[];
  review: Record<string, string>;
  methods: UseFormReturn;
  readonly: boolean;
};

const ReviewComponents: FC<ReviewComponentsProps> = ({ components, review, methods, readonly }) => {
  const { css, theme } = useStyle();
  const borderedComponents: BorderedComponent[] = formTagComponents(components, theme);

  return (
    <>
      {borderedComponents.map((component) => {
        const {
          id,
          key = '',
          text = '',
          label = '',
          description = '',
          type,
          validate = {},
          values = [],
          expression = {},
          borderStyle = {},
        } = component;
        const value = key && review[key] ? review[key] : '';

        const componentReadonly = expression?.auth?.permission?.read?.length ? true : readonly;

        // todo temporary solution. Do not have full permission requirements. might be wrapper around field
        // hide component if value empty for specific field which might be filled by manager
        const keyVisibleOnEmptyValue = ExpressionValueType.OVERALL_RATING;
        if (expression?.auth?.permission?.read?.length && !value && key !== keyVisibleOnEmptyValue) {
          return null;
        }
        // todo end temporary solution

        if (type === FormType.TEXT) {
          const CustomPTag = ({ children }) => {
            return <p className={css(defaultTagStyle)}>{children}</p>;
          };

          return (
            <div className={css({ padding: 0, margin: 0 }, borderStyle)} key={id}>
              <div className={css(markdownCustomStyle)}>
                <MarkdownRenderer components={{ p: CustomPTag }} source={text} />
              </div>
            </div>
          );
        }
        if (type === FormType.TEXT_FIELD) {
          return (
            <div key={id} className={css(borderStyle)}>
              <GenericItemField
                name={key}
                methods={methods}
                label={label}
                Wrapper={Item}
                wrapperProps={
                  (readonly
                    ? { marginBot: false, labelCustomStyle: { padding: 0 } }
                    : { marginBot: false, labelCustomStyle: { padding: '10px 0px 8px' } }) as ItemProps
                }
                //@ts-ignore
                Element={readonly ? Text : validate?.maxLength > 100 ? Textarea : Input}
                placeholder={description}
                value={value}
                readonly={componentReadonly}
              />
            </div>
          );
        }
        if (type === FormType.SELECT) {
          return (
            <div key={id} className={css(borderStyle)}>
              <GenericItemField
                name={key}
                methods={methods}
                label={label}
                Wrapper={Item}
                wrapperProps={
                  (readonly
                    ? { marginBot: false, labelCustomStyle: { padding: 0 } }
                    : { marginBot: false, labelCustomStyle: { padding: '10px 0px 8px' } }) as ItemProps
                }
                //@ts-ignore
                Element={readonly ? Text : Select}
                options={values}
                placeholder={description}
                value={value}
                readonly={componentReadonly}
              />
            </div>
          );
        }
      })}
    </>
  );
};

const defaultTagStyle: Rule = ({ theme }) => ({
  margin: '0px',
  padding: '0px',
  color: theme.colors.base,
  fontSize: '18px',
  lineHeight: '22px',
});

const markdownCustomStyle: Rule = {
  padding: 0,
  '& > p': {
    padding: '16px 0 8px 0',
    margin: 0,
    fontSize: '16px',
    lineHeight: '20px',
  },
  '& > h2': {
    padding: '14px 0 8px 0',
    margin: 0,
    fontSize: '18px',
    lineHeight: '22px',
  },
} as Styles;

export default ReviewComponents;
