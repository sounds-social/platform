import { Meteor } from 'meteor/meteor';
import { Playlists } from './playlists';

// Publish a user's public playlists
Meteor.publish('playlists.public', function (userId) {
    if (!userId) {
        return this.ready();
    }
    return Playlists.find({ userId: userId, isPublic: true });
});

// Publish the current user's playlists (public and private)
Meteor.publish('playlists.own', function () {
    if (!this.userId) {
        return this.ready();
    }
    return Playlists.find({ userId: this.userId });
});
