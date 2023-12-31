import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { renderWithTheme as render } from 'utils/test';
import { Status } from 'config/enum';
import StepIndicator from './StepIndicator';

it('StepIndicator', async () => {
  render(
    <StepIndicator
      currentStatus={Status.PENDING}
      currentStep={0}
      titles={['Set objectives', 'Mid-year review', 'Year-end review']}
      descriptions={['April 2021', 'September 2022', 'March 2022']}
    />,
  );
  const wrapper = screen.queryByText('March 2022');
  expect(wrapper).toBeInTheDocument();
});

it('StepIndicator no props', async () => {
  render(<StepIndicator titles={['Set objectives', 'Mid-year review']} />);
  const wrapper = screen.queryByText('Mid-year review');
  expect(wrapper).toBeInTheDocument();
});
