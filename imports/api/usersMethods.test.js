import 'meteor/aldeed:collection2/static';
import { Meteor } from 'meteor/meteor';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import './usersMethods';

describe('usersMethods', () => {
  if (Meteor.isServer) {
    let currentUser, otherUser;
    beforeEach(async () => {
      // Clear users collection (if necessary, be careful in real apps)
      await Meteor.users.removeAsync({});

      // Create test users
      await Meteor.users.insertAsync({
        username: 'testuser',
        emails: [{ address: 'test@example.com', verified: true }],
        profile: { displayName: 'Test User', follows: [], supporters: [] },
      });

      await Meteor.users.insertAsync({
        username: 'otheruser',
        emails: [{ address: 'other@example.com', verified: true }],
        profile: { displayName: 'Other User', follows: [], supporters: [] },
      });

      currentUser = await Meteor.users.findOneAsync({ username: 'testuser' });
      otherUser = await Meteor.users.findOneAsync({ username: 'otheruser' });
    });

    describe('users.follow', () => {
      it('should allow a user to follow another user', async () => {
        await mockMethodCall('users.follow', otherUser._id, { context: { userId: currentUser._id } });

        const updatedCurrentUser = await Meteor.users.findOneAsync(currentUser._id);
        assert.include(updatedCurrentUser.profile.follows, otherUser._id);
      });

      it('should not allow a user to follow themselves', async () => {
        try {
          await mockMethodCall('users.follow', currentUser._id, { context: { userId: currentUser._id } });
          assert.fail('Should have thrown an error');
        } catch (error) {
          assert.equal(error.error, 'cannot-follow-self');
        }
      });

      it('should not allow a user to follow someone they already follow', async () => {
        await mockMethodCall('users.follow', otherUser._id, { context: { userId: currentUser._id } });
        try {
          await mockMethodCall('users.follow', otherUser._id, { context: { userId: currentUser._id } });
          assert.fail('Should have thrown an error');
        } catch (error) {
          assert.equal(error.error, 'already-following');
        }
      });

      it('should not allow an unauthenticated user to follow', async () => {
        try {
          await mockMethodCall('users.follow', otherUser._id);
          assert.fail('Should have thrown an error');
        } catch (error) {
          assert.equal(error.error, 'not-authorized');
        }
      });
    });

    describe('users.unfollow', () => {
      beforeEach(async () => {
        // Ensure current user follows other user before unfollow tests
        await Meteor.users.updateAsync(currentUser, { $addToSet: { 'profile.follows': otherUser._id } });
      });

      it('should allow a user to unfollow another user', async () => {
        await mockMethodCall('users.unfollow', otherUser._id, { context: { userId: currentUser._id } });

        const updatedCurrentUser = await Meteor.users.findOneAsync(currentUser._id);
        assert.notInclude(updatedCurrentUser.profile.follows, otherUser._id);
      });

      it('should not allow an unauthenticated user to unfollow', async () => {
        try {
          await mockMethodCall('users.unfollow', otherUser._id);
          assert.fail('Should have thrown an error');
        } catch (error) {
          assert.equal(error.error, 'not-authorized');
        }
      });

      it('should not allow a user to unfollow someone they do not follow', async () => {
        // Remove follow before this specific test
        await Meteor.users.updateAsync(currentUser._id, { $pull: { 'profile.follows': otherUser._id } });

        try {
          await mockMethodCall('users.unfollow', otherUser._id, { context: { userId: currentUser._id } });
          assert.fail('Should have thrown an error');
        } catch (error) {
          assert.equal(error.error, 'not-following');
        }
      });
    });
  }
});
