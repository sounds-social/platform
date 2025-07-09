import { Meteor } from 'meteor/meteor';
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

Meteor.startup(function () {
  Accounts.emailTemplates.siteName = "Sounds Social";
  Accounts.emailTemplates.from = "Sounds Social <contact@soundssocial.io>";
  Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "Reset your password - Sounds Social";
  };

  Accounts.emailTemplates.resetPassword.html = function(user, url) {
    console.log({ url: url.replace('/#/reset-password', '/reset-password') })

    return `
Hello,

To reset your password, simply click the link below:

<a href="${url.replace('#/', '')}">Reset Password</a>
    `.trim();
  };
});
