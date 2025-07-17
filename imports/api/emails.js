import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  const { user, password } = Meteor.settings.packages.email;

  process.env.MAIL_URL = `smtp://${user}:${password}@smtp.sendgrid.net:587`;

  Accounts.emailTemplates.siteName = "Sounds Social";
  Accounts.emailTemplates.from = "Sounds Social Contact <contact@soundssocial.io>";
  Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "Reset your password - Sounds Social";
  };

  Accounts.emailTemplates.resetPassword.html = function(user, url) {
    return `
Hello,

To reset your password, simply click the link below:

<a href="${url
  .replace('#/', '')
  .replace('soundssocial.eu.meteorapp.com', 'soundssocial.io')
}">Reset Password</a>
    `.trim();
  };

  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "Activate your account - Sounds Social";
    },
    html(user, url) {
      return `Hey ${user.profile.displayName}! Verify your e-mail by following this link: <a href="${url.replace('#/', '')
        .replace('soundssocial.eu.meteorapp.com', 'soundssocial.io')}">Verify Email</a>`;
    },
  };
});
