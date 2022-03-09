import React, { cloneElement, FC, ReactElement } from 'react';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from './mocks/react-i18next';
import i18n from './mocks/i18';

import { render, RenderResult, screen as screenTestingLibrary, Screen } from '@testing-library/react';

import { DDLProvider } from '@dex-ddl/core';
import { Provider } from 'react-redux';

const App: FC = (props) => <DDLProvider {...props} />;

export type RenderResultWithProps<TProps> = RenderResult & {
  rerenderWithProps: (props: Partial<TProps>) => void;
};

export const renderWithTheme = <TProps extends {} = {}>(
  component: ReactElement<TProps>,
  initState?: any,
): RenderResultWithProps<TProps> => {
  const mockStore = configureStore([]);
  const store = mockStore({
    users: {
      current: {
        authenticated: true,
        info: {
          data: {
            colleague: {
              colleagueUUID: 'test-colleagueUuid',
              profile: {
                firstName: 'Test fullName',
              },
            },
          },
        },
      },
      meta: {
        loaded: true,
        loading: false,
      },
    },
    schema: { meta: { loading: false, loaded: false, error: null } },
    reviews: { meta: { loading: false, loaded: false, error: null } },
    objectivesSharing: { meta: { loading: false, loaded: false, error: null }, objectives: [], isShared: false },
    notes: { notes: [], folders: [], meta: { loading: false, loaded: false, error: null } },
    feedback: {
      feedbacks: {
        give: [],
        respond: [],
        view: [],
      },
      feedbacksCount: {
        given: 0,
        requested: 0,
      },
      reviews: [],
      meta: { loading: false, loaded: false, error: null },
    },
    report: { objectiveReports: [], objectiveStatistics: [], meta: { loading: false, loaded: false, error: null } },
    processTemplate: { meta: { loading: false, loaded: false, error: null }, success: true, data: [] },
    timeline: { meta: { loading: false, loaded: false, error: null }, success: true, 'test-colleagueUuid': [] },
    ...initState,
  });

  store.dispatch = jest.fn();
  const wrapper = render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App>{component}</App>
      </I18nextProvider>
    </Provider>,
  );

  const rerenderWithProps = (props: Partial<TProps>) => {
    const updatedComponent = cloneElement(component, {
      ...component.props,
      ...props,
    });
    wrapper.rerender(<App>{updatedComponent}</App>);
  };

  return { ...wrapper, rerenderWithProps };
};

export const screen: Screen = screenTestingLibrary;
