import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Playlists } from '../../api/playlists';
import { Sounds } from '../../api/sounds';

const Playlist = () => {
  const { playlistId } = useParams();
  const { playlist, sounds, loading } = useTracker(() => {
    const noDataAvailable = { playlist: null, sounds: [], loading: true };
    const playlistHandle = Meteor.subscribe('playlists.own');
    const soundsHandle = Meteor.subscribe('sounds.public');
    const ready = playlistHandle.ready() && soundsHandle.ready();
    const playlist = Playlists.findOne(playlistId);
    const sounds = playlist ? Sounds.find({ _id: { $in: playlist.sounds } }).fetch() : [];
    return { playlist, sounds, loading: !ready };
  }, [playlistId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="my-8">
        <h2 className="text-3xl font-bold mb-4">{playlist.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sounds.map(sound => (
            <div key={sound._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{sound.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
