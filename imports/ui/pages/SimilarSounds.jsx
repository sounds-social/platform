import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';

const SimilarSounds = () => {
  const location = useLocation();
  const { sounds, originalSoundId } = location.state || { sounds: [], originalSoundId: null };

  const { sound } = useTracker(() => {
    if (!originalSoundId) {
      return { sound: null };
    }
    const handle = Meteor.subscribe('sounds.singleSound', originalSoundId);
    const ready = handle.ready();
    const sound = Sounds.findOne(originalSoundId);
    return { sound, loading: !ready };
  }, [originalSoundId]);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">
        Similar Sounds for <Link to={`/sound/${originalSoundId}`} className="text-blue-500 hover:underline">{sound?.title}</Link>
      </h1>
      <SoundList sounds={sounds} />
    </div>
  );
};

export default SimilarSounds;
