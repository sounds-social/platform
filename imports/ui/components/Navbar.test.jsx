import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('<Navbar />', () => {
  if (Meteor.isClient) {
    const { render, screen } = require('@testing-library/react');
    const userEvent = require('@testing-library/user-event').default;
    const chai = require('chai');
    const chaiDom = require('chai-dom');
    chai.use(chaiDom);
    const { expect } = chai;

    it('renders a navbar', () => {
      render(<Navbar />, { wrapper: MemoryRouter });
      expect(screen.getByRole('navigation')).to.exist;
    });

    it('shows login and sign up buttons when not logged in', () => {
      render(<Navbar />, { wrapper: MemoryRouter });
      expect(screen.getByText('Sign In')).to.exist;
      expect(screen.getByText('Sign Up')).to.exist;
    });

    it('shows the main navigation links when logged in', () => {
      render(<Navbar user={{}} />, { wrapper: MemoryRouter });
      expect(screen.getByText('Latest')).to.exist;
      expect(screen.getByText('Hot')).to.exist;
      expect(screen.getByText('Battle')).to.exist;
      expect(screen.getByText('Upload')).to.exist;
    });

    it('shows the Go PRO button when the user is not a pro', () => {
      render(<Navbar user={{}} />, { wrapper: MemoryRouter });
      expect(screen.getAllByText('Go PRO')).to.have.lengthOf(2);
    });

    it('does not show the Go PRO button when the user is a pro', () => {
      render(<Navbar user={{ plan: 'pro' }} />, { wrapper: MemoryRouter });
      expect(screen.queryByText('Go PRO')).to.not.exist;
    });

    it('shows the Support Overview link when the user is a pro', async () => {
      render(<Navbar user={{ plan: 'pro' }} />, { wrapper: MemoryRouter });
      await userEvent.click(screen.getByText('Menu'));
      expect(screen.getAllByText('Support Overview')).to.have.lengthOf(2);
    });

    it('does not show the Support Overview link when the user is not a pro', async () => {
      render(<Navbar user={{}} />, { wrapper: MemoryRouter });
      await userEvent.click(screen.getByText('Menu'));
      expect(screen.queryByText('Support Overview')).to.not.exist;
    });
  }
});