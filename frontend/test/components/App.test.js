import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from '../../src/contexts/usercontext';
import App from '../../src/App';
import Homepage from '../../src/pages/Homepage';
import Loginpage from '../../src/pages/Loginpage';
import PrivateRoutepage from '../../src/pages/PrivateRoutepage';
import Signuppage from '../../src/pages/Signuppage';

// Mocking usercontext and pages
jest.mock('../../src/contexts/usercontext', () => ({
  UserProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../src/pages/Homepage', () => () => <div>Home Page</div>);
jest.mock('../../src/pages/Loginpage', () => () => <div>Login Page</div>);
jest.mock('../../src/pages/PrivateRoutepage', () => () => <div>Private Route Page</div>);
jest.mock('../../src/pages/Signuppage', () => () => <div>Signup Page</div>);

describe('App Component', () => {
  it('renders the App component', async () => {
    render(
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Loginpage />} />
            <Route path="/signup" element={<Signuppage />} />
            <Route element={<PrivateRoutepage />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
            </Route>
          </Routes>
        </UserProvider>
      </Router>
    );

    // // Log the entire document body for debugging
    // console.log(document.body.innerHTML);

    // // Wait for rendering to complete
    // await waitFor(() => {});

    // // Assert that the appropriate content is rendered for each route
    // expect(screen.getByText(/Signup Page/)).toBeInTheDocument();
    // expect(screen.getByText(/Home Page/)).toBeInTheDocument();
    // expect(screen.getByText(/Private Route Page/)).toBeInTheDocument();
  });
});
