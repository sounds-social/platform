import React from 'react';
import SoundCard from './SoundCard';

const SoundList = ({ sounds, loading, noSoundsMessage }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (sounds.length === 0) {
    return <div className="text-center py-8 text-gray-600">{noSoundsMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {sounds.map(sound => (
        <SoundCard key={sound._id} sound={sound} />
      ))}
    </div>
  );
};

export default SoundList;
