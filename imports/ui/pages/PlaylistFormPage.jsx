import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PlaylistsCollection } from '../../api/playlists';
import { Sounds } from '../../api/sounds';
import UploadcareWidget from '../components/UploadcareWidget';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const PlaylistFormPage = () => {
  const { playlistId } = useParams();
  const history = useHistory();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [soundIds, setSoundIds] = useState([]);
  const { soundsData, areSoundsLoading } = useTracker(() => {
    if (soundIds.length === 0) {
      return { soundsData: [], areSoundsLoading: false };
    }
    const handle = Meteor.subscribe('sounds.byIds', soundIds);
    const loading = !handle.ready();
    const fetchedSounds = Sounds.find({ _id: { $in: soundIds } }).fetch();
    const orderedSounds = soundIds.map(id => fetchedSounds.find(sound => sound._id === id)).filter(Boolean);
    return { soundsData: orderedSounds, areSoundsLoading: loading };
  }, [soundIds]);

  const { playlist, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('playlists.singlePlaylist', playlistId);
    const loading = !handle.ready();
    const playlistData = PlaylistsCollection.findOne({ _id: playlistId });
    return { playlist: playlistData, isLoading: loading };
  }, [playlistId]);

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setIsPublic(playlist.isPublic);
      setCoverImageUrl(playlist.coverImageUrl || '');
      setSoundIds(playlist.soundIds || []);
    }
  }, [playlist]);

  const handleRemoveSound = (idToRemove) => {
    console.log("Removing sound with ID:", idToRemove);
    setSoundIds(soundIds.filter(id => id !== idToRemove));
  };

  const scrollRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const onDragEnd = (event) => {
    try {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        const { scrollY } = window;

        setSoundIds((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });

        setTimeout(() => {
          window.scrollTo(0, scrollY)
        }, 500);
      }
    } catch (error) {
      console.error("Error during drag end:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (playlistId) {
      Meteor.call('playlists.update', playlistId, name, isPublic, coverImageUrl, soundIds, (err) => {
        if (err) {
          alert(err.reason);
        } else {
          history.push(`/playlist/${playlistId}`);
        }
      });
    } else {
      Meteor.call('playlists.insert', name, isPublic, coverImageUrl, (err, newPlaylistId) => {
        if (err) {
          alert(err.reason);
        } else {
          history.push(`/playlist/${newPlaylistId}`);
        }
      });
    }
  };

  const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </li>
    );
  };

  if (isLoading || areSoundsLoading) {
    return <div className="text-center py-8 text-gray-600">Loading playlist form...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{playlistId ? 'Edit Playlist' : 'Create New Playlist'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-5">
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
            Playlist Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-5 flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="isPublic" className="text-gray-700 text-sm font-semibold">
            Public Playlist
          </label>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Cover Image:
          </label>
          <UploadcareWidget onUpload={setCoverImageUrl} />  
          {coverImageUrl && (
            <img src={coverImageUrl} alt="Cover" className="mt-3 w-48 h-48 object-cover rounded-lg shadow-md" />
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Sounds in Playlist:</h2>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} autoScroll={false} sensors={sensors}>
            <SortableContext items={soundIds} strategy={verticalListSortingStrategy} key={soundIds.length}>
              <ul
                className="bg-gray-100 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto list-none p-0 m-0"
                ref={scrollRef}
                key="playlist-sounds-list"
              >
                {soundsData.length === 0 && <p className="text-gray-600 text-center py-4">No sounds added yet.</p>}
                {soundsData.map((sound, index) => (
                  <SortableItem key={sound._id} id={sound._id}>
                    <div className="flex items-center justify-between bg-white p-3 mb-2 rounded-md shadow-sm border border-gray-200 cursor-grab">
                      <span className="text-gray-800 font-medium">{sound.title}</span>
                      <button
                        type="button"
                        onMouseDown={() => handleRemoveSound(sound._id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          {playlistId ? 'Update Playlist' : 'Create Playlist'}
        </button>
      </form>
    </div>
  );
};

export default PlaylistFormPage;
