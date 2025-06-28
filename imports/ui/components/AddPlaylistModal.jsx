import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PlaylistsCollection } from '../../api/playlists';
import { useHistory } from 'react-router-dom';

Modal.setAppElement('#react-target'); // Set the app element for accessibility

const AddPlaylistModal = ({ isOpen, onRequestClose, soundId }) => {
  const history = useHistory();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const { playlists, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('playlists.myPlaylists');
    return { playlists: PlaylistsCollection.find({ ownerId: Meteor.userId() }).fetch(), isLoading: !handle.ready() };
  }, []);

  const playlistOptions = playlists.map(playlist => ({
    value: playlist._id,
    label: playlist.name,
  }));

  const handleSave = () => {
    if (selectedPlaylist && soundId) {
      Meteor.call('playlists.addSound', selectedPlaylist.value, soundId, (err) => {
        if (err) {
          alert(err.reason);
        } else {
          onRequestClose();
          history.push(`/playlist/${selectedPlaylist.value}`);
        }
      });
    } else if (newPlaylistName.trim() !== '') {
      Meteor.call('playlists.insert', newPlaylistName, false, '', (err, playlistId) => {
        if (err) {
          alert(err.reason);
        } else if (soundId) {
          Meteor.call('playlists.addSound', playlistId, soundId, (err) => {
            if (err) {
              alert(err.reason);
            } else {
              onRequestClose();
              history.push(`/playlist/${playlistId}`);
            }
          });
        } else {
          onRequestClose();
          history.push(`/playlist/${playlistId}`);
        }
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add to Playlist"
      className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto my-20 relative"
      overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4">Add to Playlist</h2>
      <div className="mb-4">
        <Select
          options={playlistOptions}
          onChange={setSelectedPlaylist}
          placeholder="Select an existing playlist"
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Or create a new one"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Save
        </button>
        <button
          onClick={onRequestClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default AddPlaylistModal;
