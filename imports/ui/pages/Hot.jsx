import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';

const Hot = () => {
  const { sounds, loading } = useTracker(() => {
    const noDataAvailable = { sounds: [], loading: true };
    const handle = Meteor.subscribe('sounds.public');
    if (!handle.ready()) return noDataAvailable;

    const sounds = Sounds.find({}, { sort: { playCount: -1 }, limit: 20 }).fetch();
    return { sounds, loading: false };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="my-8">
        <h2 className="text-3xl font-bold mb-4">Hottest Sounds</h2>
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

export default Hot;
