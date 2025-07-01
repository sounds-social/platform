import 'meteor/aldeed:collection2/static';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { AppWithAudioPlayerProvider } from '/imports/ui/App';

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(<AppWithAudioPlayerProvider />);
});
