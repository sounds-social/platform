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
import '/imports/api/messages';
import '/imports/api/messagesMethods';
import '/imports/api/messagesPublications';
import '/imports/api/emails';
import '/imports/api/payouts';
import '/imports/api/payoutsPublications';
import '/imports/api/matches';
import '/imports/api/matchesMethods';
import '/imports/api/matchesPublications';
import '/imports/api/feedback';
import { generateMonthlyPayouts } from '/imports/api/payoutsLogic';
import { checkProUsersSubscriptionStatus } from '/imports/api/stripeScheduler';
import { setupOgPreview } from './ogPreview';

Meteor.startup(() => {
  checkProUsersSubscriptionStatus();
  setTimeout(() => generateMonthlyPayouts(), 15 * 60 * 1000);

  // Run every 12 hours (12 * 60 * 60 * 1000 ms)
  setInterval(() => {
    checkProUsersSubscriptionStatus();
    setTimeout(() => generateMonthlyPayouts(), 15 * 60 * 1000);
  }, 12 * 60 * 60 * 1000);

  setupOgPreview();
});
