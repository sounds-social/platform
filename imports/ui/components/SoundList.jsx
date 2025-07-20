import React, { useState } from 'react';
import SoundCard from './SoundCard';

const SoundList = ({ sounds, loading, noSoundsMessage, smallCover = false, hideStats = false, hidePlayButton = false, defaultDisplayLimit = 10, loadMoreAmount = 20 }) => {
  const [displayLimit, setDisplayLimit] = useState(defaultDisplayLimit);

  const handleLoadMore = () => {
    setDisplayLimit(prevLimit => prevLimit + loadMoreAmount);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (sounds.length === 0) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{noSoundsMessage}</span>
      </div>
    );
  }

  const soundsToDisplay = sounds.slice(0, displayLimit);

  return (
    <div className="grid grid-cols-1 gap-6">
      {soundsToDisplay.map((sound, index) => (
        <SoundCard key={sound._id} sound={sound} sounds={sounds} index={index} smallCover={smallCover} hideStats={hideStats} hidePlayButton={hidePlayButton} />
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
