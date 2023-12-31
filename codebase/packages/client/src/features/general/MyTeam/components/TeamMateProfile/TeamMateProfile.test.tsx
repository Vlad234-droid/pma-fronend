// @ts-ignore
import React from 'react';

// @ts-ignore
import { renderWithTheme as render, generateEmployeeReview } from 'utils/test';
import { BrowserRouter } from 'react-router-dom';
// @ts-ignore
import { Status } from 'config/enum';

import TeamMateProfile from './TeamMateProfile';
import { TILE_WRAPPER } from 'components/Tile';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => ({
    navigate: jest.fn().mockImplementation(() => ({})),
  }),
}));

describe('<TeamMateProfile />', () => {
  const props = {
    uuid: 'mocked_uuid',
    employee: generateEmployeeReview(),
    defaultExpanded: true,
    status: Status.PENDING,
  };

  describe('#render', () => {
    it('should render <TileWrapper />', () => {
      const { getByTestId } = render(
        <BrowserRouter>
          <TeamMateProfile {...props} />
        </BrowserRouter>,
      );

      expect(getByTestId(TILE_WRAPPER)).toBeInTheDocument();
    });

    it('should render <Accordion />', () => {
      const { getByTestId } = render(
        <BrowserRouter>
          <TeamMateProfile {...props} />
        </BrowserRouter>,
      );

      expect(getByTestId('accordion')).toBeInTheDocument();
    });

    it('should render <TimelinePreview />', () => {
      const { getByTestId } = render(
        <BrowserRouter>
          <TeamMateProfile {...props} />
        </BrowserRouter>,
      );

      expect(getByTestId('timeline-preview')).toBeInTheDocument();
    });

    it('should render <TimeLines />', () => {
      const { getByTestId } = render(
        <BrowserRouter>
          <TeamMateProfile {...props} />
        </BrowserRouter>,
      );

      expect(getByTestId('timelines')).toBeInTheDocument();
    });
  });
});
