import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import SoundList from './SoundList';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';

describe('<SoundList />', () => {
  if (Meteor.isClient) {
    const { render, screen, cleanup } = require('@testing-library/react');
    const userEvent = require('@testing-library/user-event').default;
    const chai = require('chai');
    const chaiDom = require('chai-dom');
    chai.use(chaiDom);
    const { expect } = chai;

    afterEach(() => {
      cleanup();
    });

    const sounds = [
      { _id: '1', title: 'Sound 1', userName: 'User 1', userSlug: 'user-1', audioFile: 'sound1.mp3', createdAt: new Date() },
      { _id: '2', title: 'Sound 2', userName: 'User 2', userSlug: 'user-2', audioFile: 'sound2.mp3', createdAt: new Date() },
    ];

    it('renders a loading message when loading', () => {
      render(<SoundList loading={true} />, { wrapper: MemoryRouter });
      expect(screen.getByText('Loading...')).to.exist;
    });

    it('renders a no sounds message when there are no sounds', () => {
      render(<SoundList sounds={[]} noSoundsMessage="No sounds found" />, { wrapper: MemoryRouter });
      expect(screen.getByText('No sounds found')).to.exist;
    });

    it('renders a list of sounds', () => {
      render(
        <AudioPlayerProvider>
          <SoundList sounds={sounds} />
        </AudioPlayerProvider>,
        { wrapper: MemoryRouter }
      );
      expect(screen.getByText('Sound 1')).to.exist;
      expect(screen.getByText('Sound 2')).to.exist;
    });

    it('renders a load more button when there are more sounds to display', () => {
      const manySounds = Array.from({ length: 12 }, (_, i) => ({
        _id: `${i}`,
        title: `Sound ${i}`,
        userName: `User ${i}`,
        userSlug: `user-${i}`,
        audioFile: `sound${i}.mp3`,
        createdAt: new Date(),
      }));
      render(
        <AudioPlayerProvider>
          <SoundList sounds={manySounds} />
        </AudioPlayerProvider>,
        { wrapper: MemoryRouter }
      );
      expect(screen.getByRole('button', { name: /load more/i })).to.exist;
    });

    it('loads more sounds when the load more button is clicked', async () => {
      const manySounds = Array.from({ length: 12 }, (_, i) => ({
        _id: `${i}`,
        title: `Sound ${i}`,
        userName: `User ${i}`,
        userSlug: `user-${i}`,
        audioFile: `sound${i}.mp3`,
        createdAt: new Date(),
      }));
      render(
        <AudioPlayerProvider>
          <SoundList sounds={manySounds} />
        </AudioPlayerProvider>,
        { wrapper: MemoryRouter }
      );
      await userEvent.click(screen.getByRole('button', { name: /load more/i }));
      expect(screen.getByText('Sound 11')).to.exist;
    });
  }
});
