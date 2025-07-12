import 'meteor/aldeed:collection2/static';

import '/imports/api/sounds';
import '/imports/api/soundsMethods';
import '/imports/api/soundsPublications';
import '/imports/api/users';
import '/imports/api/usersMethods';
import '/imports/api/usersPublications';
import '/imports/api/comments';
import '/imports/api/commentsMethods';
import '/imports/api/commentsPublications';
import '/imports/api/playlists';
import '/imports/api/playlistsMethods';
import '/imports/api/playlistsPublications';
import '/imports/api/groups';
import '/imports/api/groupsMethods';
import '/imports/api/groupsPublications';
import '/imports/api/notifications';
import '/imports/api/notificationsMethods';
import '/imports/api/notificationsPublications';
import '/imports/api/emails';
import '/imports/api/payouts';
import '/imports/api/payoutsPublications';
import { generateMonthlyPayouts } from '/imports/api/payoutsLogic';

Meteor.startup(() => {
  generateMonthlyPayouts();

  // Run every 12 hours (12 * 60 * 60 * 1000 ms)
  setInterval(() => {
    generateMonthlyPayouts();
  }, 12 * 60 * 60 * 1000);
});

