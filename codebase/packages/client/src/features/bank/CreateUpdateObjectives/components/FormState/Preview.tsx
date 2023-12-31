import React, { FC } from 'react';

import { Rule, useStyle } from '@pma/dex-wrapper';

import { Trans } from 'components/Translation';
import { TileWrapper } from 'components/Tile';
import MarkdownRenderer from 'components/MarkdownRenderer';

type Props = {
  components: any[];
  formValues: any;
};

const Preview: FC<Props> = ({ components, formValues }) => {
  const { css, theme } = useStyle();
  const priorities: any = Object.values(formValues.data);
  return (
    <>
      <div className={css({ padding: `0 0 ${theme.spacing.s5}` })}>
        <div className={css(headerStyle)}>
          <Trans i18nKey={'please_review_your_priorities'}>Please review your priorities</Trans>
        </div>
        {priorities.map((objective) => {
          return (
            <TileWrapper
              key={`${objective?.number}-${objective?.uuid}`}
              boarder={true}
              customStyle={{ marginTop: '12px' }}
            >
              <div className={css({ padding: '20px' })}>
                <div className={css(headerTileStyle)}>Priority {objective?.number}</div>
                {components.map((component) => {
                  if (component.key === 'title') {
                    return (
                      <div key={`${objective?.number}-${component.key}`} className={css(titleTileStyle)}>
                        {objective.properties.title}
                      </div>
                    );
                  }
                  if (component.key === 'description') {
                    return (
                      <div key={`${objective?.number}-${component.key}`} className={css(descriptionTileStyle)}>
                        {objective.properties.description}
                      </div>
                    );
                  }
                  return (
                    <div key={`${objective?.number}-${component.key}`}>
                      <MarkdownRenderer source={component.label} />
                      <div>{objective?.properties[component.key]}</div>
                    </div>
                  );
                })}
              </div>
            </TileWrapper>
          );
        })}
      </div>
    </>
  );
};

const headerStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f20,
  fontWeight: theme.font.weight.bold,
});
const headerTileStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f18,
  fontWeight: theme.font.weight.bold,
  color: theme.colors.tescoBlue,
});
const titleTileStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
  fontWeight: theme.font.weight.bold,
});
const descriptionTileStyle: Rule = ({ theme }) => ({
  ...theme.font.fixed.f16,
});

export default Preview;
