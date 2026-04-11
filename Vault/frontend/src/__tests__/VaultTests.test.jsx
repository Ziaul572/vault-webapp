import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardPage from '../pages/DashboardPage';
import AccountsPage from '../pages/AccountsPage';
import LoansPage from '../pages/LoansPage';
import ProfilePage from '../pages/ProfilePage';
import { describe, it, expect } from 'vitest';
import React from 'react';

// Wrapper for components that need Router
const RouterWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Component Level Tests (Q4)', () => {
  it('Navbar should display the username', () => {
    const user = { username: 'VaultAdmin' };
    render(<Navbar user={user} />);
    expect(screen.getByText('VaultAdmin')).toBeInTheDocument();
  });

  it('Sidebar should contain a link to Dashboard', () => {
    render(<RouterWrapper><Sidebar /></RouterWrapper>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('Sidebar should contain a link to Accounts', () => {
    render(<RouterWrapper><Sidebar /></RouterWrapper>);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('Sidebar should contains a link to Transfer', () => {
    render(<RouterWrapper><Sidebar /></RouterWrapper>);
    expect(screen.getByText('Transfer')).toBeInTheDocument();
  });
});

describe('Page Level Tests with MSW (Q4)', () => {
  it('DashboardPage should render accounts fetched from API', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Standard Account')).toBeInTheDocument();
      expect(screen.getByText('€1,000')).toBeInTheDocument();
    });
  });

  it('AccountsPage should render list of accounts from API', async () => {
    render(<AccountsPage />);
    await waitFor(() => {
      expect(screen.getByText('Standard Account')).toBeInTheDocument();
      expect(screen.getByText('•••• 7890')).toBeInTheDocument();
    });
  });

  it('LoansPage should render loan history from API', async () => {
    render(<LoansPage />);
    await waitFor(() => {
      expect(screen.getByText('Personal Loan')).toBeInTheDocument();
      expect(screen.getByText('€5,000')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('ProfilePage should render user details from API', async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('TESTUSER')).toBeInTheDocument();
      expect(screen.getByText('Test Lane')).toBeInTheDocument();
    });
  });
});
