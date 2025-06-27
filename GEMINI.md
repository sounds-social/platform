# Instructions for Gemini

## Overview

Sounds Social is a platform to share your sound with others. Users can upload audio files (mp3, wav etc.) and gain followers by doing so. It's made from a musician for other fellow musicians. The monetization comes from a "pro" plan that takes the money and splits it up between platform costs, further development and a "Support" button on the profile page of the musician.

## Technologies

This platform is implemented with Meteor.js Framework and React. Following things should be considered:

* Routing is made with react-router and react-router-dom, both at v5. Don't update the dependency, keep it at v5.
* Meteor is used with async Meteor.methods, subscribe and useTracker, useSubscribe etc.
* Meteor methods should be async and the *Async methods should be used whenever possible (callAsync, insertAsync etc)
* simpl-schema is used to validate the data structure
* React is the frontend library and it should communicate through Meteor.methods with the backend. 
* Tailwindcss is used for styling the platform
* React-icons is used for displaying svg icons
* recharts is used to display charts (statistics)
* File upload should be done with IPFS or an upload widget like Uploadcare or Bytescale. 

## Design

The design of the platform should be minimalistic and modern. Also don't forget to keep things responsive so users on mobile can also enjoy the sounds. The base color (e.g. for buttons) is purple.

## Features

The next sections describe the features of Sounds Social in detail.

### Sounds

At the center of it all are Sounds. Sounds can be:
* Uploaded / Added - Either mp3 or wav or any other audio/* file
* Played - There's a play count for each sound
* Liked - Will be added to a like playlist
* Edited - There's an edit page that allows the user to change everything but the sound file that was uploaded
* Removed - Simple confirm modal that makes a sound deletable

Each sound has following fields:

* Audio file 
* Title
* Description
* Tags
* Cover image
* Is Private (by default: false)
* Background image (optional)
* Created At (hidden from User)
* Last Updated At (hidden from User)
* Play count (displayed in Detail Page)
* User (user id that uploaded that sound)
* Group (optional id for Group Detail Page)

Following pages exist for Sounds:

* Add and edit form page 
* Sound Detail Page that provides following functionalities:
  * Play the sound (and update play count)
  * Like the sound (add to Likes playlist)
  * Add to playlist (add to custom playlist)
  * Comments (Allow users to leave comments with a timestamp)
* Sound List page which lists sounds based on some given criteria:
  * The homepage (path: /) lists all recent tracks which the user follows
  * A "hot" page (path: /hot) which displays sounds that have lots of plays, likes and comments in the last few days
  * An explore page (path: /explore) which lists random sounds (for now)
  * A playlist page (path: /playlist/{playlistId} or /likes) which lists the likes or playlist items

#### Sound List

The sound list should be a reusable component that is used as described above. When a user only uploads a cover image then it should display it on the left side and the title + link to user profile (display name) right adjacent to the cover image. If the user also provides a background image then it should display it over the whole card / box and the title + link in white with a text-shadow. Also filter out sounds that are private from the list (unless the sound is owned by the currently logged in user)

#### Sound Upload

The sound upload page should be a single page that allows users to upload their sound / music. The Meteor.js backend has to manage the audio / image files somehow. There's the possibility of using IPFS so it's hosted outside of the platform itself. An alternative can be a upload widget like Uploadcare or Bytescale.

### Users

Users are the vital building block of the platform.

The platform has following pages in regards to user management:

* Login page to login (path: /sign-in)
* Register page to create a new user (path: /sign-up)
* Password forgotten page if a user forgot their password and wants to reset it through mail (path: /forgot-password)
* Profile settings page (path: /profile/settings) that makes it possible for users to change their password and "display name" and "slug" for the profile route
* Profile page (path: /profile/{slug} or /profile for current user) that displays:
  * Avatar image
  * Latest sounds from the user
  * Followers / Following count and list
  * Playlists (Likes + Public)
  * Comments created by user
  * Groups the user is in
  * Follow / Unfollow Button
  * Supporters count and list

Each user has following fields:

* E-Mail
* Password
* Display name (A name (with whitespaces allowed) that is displayed when users navigate to a profile)
* Profile Slug
* Avatar image (url)
* Follows (A list of users (userIds) that the user follows)
* Supports (A list of userIds / or groupIds that the user supports)

### Comments

Each sound has multiple comments and every user can create / edit multiple comments. Comments have following fields:

* Content (markdown support?)
* Timestamp (optional, where on the track is the comment related to)
* Sound (which sound is the comment on)
* Created At (hidden from User)
* Last Updated At (hidden from User)

### Playlists

Each user has one playlist by default which is Likes. A user can create a new playlist by providing:

* Playlist name
* Public or Private (if Public, will be displayed in the profile page)

Initially the playlist is empty but the user can: 

* Add new tracks on the Sound Detail Page
* Remove tracks on a playlist form page
* Reorder tracks on the same playlist form page

### Groups

Groups are similiar to users in that they also have a profile page (route: /groups/{slug}) but they consist of multiple members.

Groups have following fields:
* Display name (with whitespaces allowed)
* Member list (reorderable, list of userIds)

Pages for groups are:
* Group Settings Page which allows users to change the display name and members list (reorderable)
* Group Detail Page which lists all sounds for the group (see group field in Sounds section) and also lists its members. Additionally:
  * Followers / Following Count
  * Follow / Unfollow Button
  * Supporters count and list

### Monetization / Support

The platform allows users to support their favorite musicians / audio content creators by paying a fee of 20 USD per month. The money is divided up into:

* 10% for platform hosting costs
* 10% for development of the platform
* 80% to users supporting each other

Whenever the user clicks on a "Support" button on the (group) profile page, they go to a page that shows them how the money is divided so that a split of that 80% goes to the user that is being supported. That means that each month a user automatically "donates" the money to the list of musicians they support. The platform strives to make it as clear as possible what happens to the users money.

In the future people can control how they want the split to happen (e.g. 10% to user1, 15% to user2). For now it's just an even split across the 80%.

Pages for the monetization are:

* An overview page that lists all supported musicians and a chart which shows how the money is being used (as listed above)
* A modal that is displayed after clicking on the "Support" button. Something like: "You are now supporting {user display name}! Have a look at how your money is being used" with a link to the overview page
* A Go PRO Page that displays the two plans (free and pro) and lists the differences between the two:
  * Free can upload as many sounds as they want to
  * PRO users are able to support their favourite musicians
  * More items to come...

### Navigation

When the user is logged in, the app needs a navbar with following items in it:

To the left as a group:

* Latest (as described in Sounds section, path: /)
* Hottest (as described in Sounds section, path: /hot)
* Explore (as described in Sounds section, path: /explore)

To the right as a group:

* Go PRO (as described in the Monetization section, path: /go-pro)
* Profile (as described in the Users section, path: /profile/{slug})
* A burger menu icon with menu items:
  * About (path: /about)
  * Donate (path: https://ko-fi.com/itsmatteodemicheli)
  * Github (path: https://github.com/sounds-social/platform)

When the user is logged out, display another navbar with following items to the left:

* About (path: /about)
* Sign In (path: /sign-in)
* Sign Up (path: /sign-up)

### Marketing page

If the user is not logged in and goes to "/" they will be redirected to "/about" which displays a page with information and features that the platform provides:

* Add a hero section that displays a title, description (both in white) and a pleasant violet gradient background.
* Right underneath three items horizontally with title, short descriptino and icons
  * Sharing (sharing icon)
  * Monetization (money icon)
  * Open Source (open source icon)
