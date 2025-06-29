import React, { useState } from 'react';
import SoundCard from './SoundCard';

const SoundList = ({ sounds, loading, noSoundsMessage }) => {
  const [displayLimit, setDisplayLimit] = useState(10);

  const handleLoadMore = () => {
    setDisplayLimit(prevLimit => prevLimit + 20);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (sounds.length === 0) {
    return <div className="text-center py-8 text-gray-600">{noSoundsMessage}</div>;
  }

  const soundsToDisplay = sounds.slice(0, displayLimit);

  return (
    <div className="grid grid-cols-1 gap-6">
      {soundsToDisplay.map(sound => (
        <SoundCard key={sound._id} sound={sound} />
      ))}
      {sounds.length > displayLimit && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SoundList;
