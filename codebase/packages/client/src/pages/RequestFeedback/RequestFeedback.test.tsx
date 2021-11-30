import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import RequestFeedback from './RequestFeedback';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { renderWithTheme } from '../../utils/test';

import '@testing-library/jest-dom';

it('FeedBack', async () => {
  const history = createMemoryHistory();
  history.push('/request-feedback');
  const { getByTestId } = renderWithTheme(
    <Router history={history}>
      <RequestFeedback />
    </Router>,
  );
  const timeline = getByTestId('request-feedback');

  expect(timeline).toBeInTheDocument();
});