import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DelayTable from '../../src/components/DelayTable';

import { BrowserRouter as Router } from 'react-router-dom';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] }),
  })
);

describe('DelayTable Component', () => {
  it('renders DelayTable component', async () => {
    render(
      <Router>
        <DelayTable onTrainClick={() => {}} />
      </Router>
    );
    
    // Mock API call
    await screen.findByText('Försenade tåg');
    console.log(screen.findByText('Försenade tåg'));
    
    // // Assert that the component renders as expected
    // expect(screen.getByText('Försenade tåg')).toBeInTheDocument();
    // expect(screen.getByTestId('delayed-trains')).toBeInTheDocument();
  });
});
