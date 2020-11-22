import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import History from './History';

const history = [
  {
    employer: 'employer',
    position: 'position',
    dates: 'dates',
    description: 'description',
    summary: ['summary 1', 'summary 2', 'summary 3'],
    keyAchievements: ['achievement foo', 'achievement bar'],
  },
];

describe('<History>', () => {
  beforeEach(() => render(<History history={history} />));

  it('should have an employer', () => {
    const employer = screen.getByText('employer');

    expect(employer.innerHTML).toBe('employer');
  });

  it('should have a position', () => {
    const position = screen.getByText('position');

    expect(position.innerHTML).toBe('position');
  });

  it('should have dates', () => {
    const dates = screen.getByText('dates');

    expect(dates.innerHTML).toBe('dates');
  });

  it('should have a description', () => {
    const description = screen.getByText('description');

    expect(description.innerHTML).toBe('description');
  });

  it('should have summaries', () => {
    const summary1 = screen.getByText('summary 1');
    const summary2 = screen.getByText('summary 2');
    const summary3 = screen.getByText('summary 3');

    expect(summary1.innerHTML).toMatch(/summary 1/);
    expect(summary2.innerHTML).toMatch(/summary 2/);
    expect(summary3.innerHTML).toMatch(/summary 3/);
  });

    it('should have a list of key achievements', () => {
      const achievement1 = screen.getByText('achievement foo');
      const achievement2 = screen.getByText('achievement bar');

      expect(achievement1.innerHTML).toMatch(/achievement foo/);
      expect(achievement2.innerHTML).toMatch(/achievement bar/);
    });
});
