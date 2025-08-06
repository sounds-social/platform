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

The design of the platform should be minimalistic and modern. Also don't forget to keep things responsive so users on mobile can also enjoy the sounds. The base color (e.g. for buttons) is blue.

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
* Profile Slug (optional)
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

A user can create a new playlist by providing:

* Playlist name
* Public or Private (if Public, will be displayed in the profile page to others)
* Cover image with UploadcareWidget
* List of sounds that is reorderable

Initially the playlist is empty but the user can: 

* Add new tracks on the Sound Detail Page (Add to playlist button)
  * When the user clicks on the button it opens up a modal with a dropdown 
  * The dropdown is implemented with "react-select" and the Creatable component
  * There's a Save button that adds the sound to the playlist
  * After pressing save the user is redirected to a detail playlist page that displays all tracks for the playlist.
* Remove tracks on a playlist form page
* Reorder tracks on the same playlist form page

#### Pages & Modals

The playlist feature creates following pages and modals:

* Modal when clicking on the "Add to playlist" button that shows a form as described above
* Playlist form / edit page that displays the following fields:
  * Name
  * Public or private
  * Cover image with UploadcareWidget
  * List of sounds that is reorderable
    * Use "react-reorder" for that
* A detail playlist page which lists all the sounds (sorted by the order defined in the playlist edit page)
  * An edit button is displayed that opens the playlist edit page
  * A remove button is displayed that allows the user that owns the playlist to delete it
* The profile page displays the 4 latest playlists (list the name of the playlist)

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

### Monetization

The platform allows users to support their favorite musicians / audio content creators by paying a fee of 20 USD per month. The money is divided up into:

* 15% for platform hosting costs
* 15% for development of the platform
* 70% to users supporting each other

Whenever the user clicks on a "Support" button on the (group) profile page, they go to a page that shows them how the money is divided so that a split of that 70% goes to the user that is being supported. That means that each month a user automatically "donates" the money to the list of musicians they support. The platform strives to make it as clear as possible what happens to the users money.

In the future people can control how they want the split to happen (e.g. 10% to user1, 15% to user2). For now it's just an even split across the 70%.

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
* Upload (as described in Sound Upload section, path: /upload)

To the right as a group:

* Go PRO (as described in the Monetization section, path: /go-pro)
* Profile (as described in the Users section, path: /profile/{slug})
* A burger menu icon with menu items:
  * About (path: /about)
  * Donate (path: https://ko-fi.com/itsmatteodemicheli)
  * Github (path: https://github.com/sounds-social/platform)
  * Logout

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

### Likes

Users can like and unlike sounds (Sound.jsx). The likes are displayed on the profile page (Profile.jsx) from newest like to oldest. By default it's 4 sounds that are displayed in a square forma on the profile page. There's a load more button that displays all the likes with the SoundList component on a separate page.


### Search

Users should be able to search the platform for sounds if they want to.

* Add a search bar to the Navbar.jsx. Put it to the right of the "Upload" menu item.
* If the user presses enter in the input it should load a new page called "Search Results":
  * The page filters (fuzzy search) through following fields:
    * Title
    * Description
    * Tags
  * The page uses the SoundList.jsx component to render each sound
  * By default it searches through sounds but there's a button on the page that switches to search for users:
    * Users are filtered (fuzzy search) by their "Display name"
    * Users list is a list with the "display name" as the title and a square format of their avatar image
* Display the tags (only if not empty) inside the Sound.jsx page.
  * When a single tag is clicked on it should load the Search Results page with the content of that tag

### Social Links

Each user can add social links to their profile. The links are editable in the Profile settings. The link fields are:

* YouTube
* X (formerly Twitter)
* Spotify
* Instagram
* Website (their own website)

The links are displayed with icons in their profile. 

### Profile Slug

Add a slug (called "Profile URL") to the ProfileSettings.jsx which is used to route the "/profile/:slug" page. The slug has to be unique and in the form there's a checkmark / "X" icon which shows if the currently provided slug is available (create a Meteor.method that checks the slug for its uniqueness).

Also if the current user is vieweing their own profile, add a button called "Share" which copies the "/profile/:slug" route to the clipboard.

### Audio Player

Users can play sounds in the list and it displays all the sounds within the audio player. E.g. if I'm on the Hot.jsx page and click on play to the first sound it plays through all the sounds within that list. Use a state management library (like redux or something more modern?) to make the code more readable.

* Add a functional play button to the SoundCard.jsx 
* After clicking on the button:
  * The audio player now displays the list of sounds in a dropdown (audio playlist)
    * The dropdown is toggable with a playlist icon button
  * The currently playing sound is highlighted within that list
  * The list has also a play button where users can choose what sound to play
  * The playlist icon button scrolls to the currently playing sound within the list
  * The user can click on a backwards / next button (icons) to play the next or previous sound (within the list)

### Notifications

Users have the ability to get and read notifications. 

* Add a new notifications collection with following fields:
  * userId (the id for which user the notification is for)
  * isRead (true or false, by default its false)
  * createdAt (timestamp for the notification)
  * link (the link which the notification links to)
* Add a notification icon button and list to the Navbar.jsx
  * If the button is clicked it opens up a list with 5 recent notifications, where isRead is false
  * At the end of the list there's a "Show all" button that opens up a new page with all notifications for that user
    * The route is "/notifications" which loads all notifications (read and unread) for the currently logged in user
  * There's a number on the button which displays the count of all notifications for the user which are not read (isRead = false)
  * If the notification is clicked the isRead property changes to true and the count updates too
  * If the list is empty it displays: "No unread notifications"

Create a notification if:
  * The currently logged in user gets a comment on one of their sounds
  * The currently logged in user gets a new follower

### Battle

Users can participate in a "Sounds Battle" where two tracks are shown and the user selects which sound slaps harder.

* Move the "Explore" menu item into the menu dropdown. Same for mobile
* Create a new "Battle" menu item that replaces the "Explore" menu item
* That "Battle" link routes to a new "Battle.jsx" page which shows following:
  * On first view the page shows a page where it explains how the battle works:
    * The title is "Sounds Battle"
    * The description is: "Which sound slaps harder? You decide. Press the thumbs up button to choose the winner". Or something along the lines.
  * After pressing "Continue" the page loads two random sounds with "versus" label in the middle of them.
    * The sounds only display the cover image, so it doesn't spoil information about the sounds.
    * Each sound has a thumbs up button beneath them. 
  * After the thumbs up button is pressed it reveals the title and sound owner
    * Now there's a button called "Next" which loads two more random sounds and repeats the process indefinitely
  * Don't forget to increment the play count when a sound is being played (single sound)
* Add a "battlesWonCount" field to Sounds collection which counts the amount of battles that the sound has won.
  * By default it's value is 0
  * Display the battles won count on the Sound detail page with label: "Battles Won: {x}" (x = battlesWonCount)
  * When pressing the thumbs up button it should increase the battlesWonCount by 1 for the sound that has been upvoted

### Monetization v2

To elaborate on the monetization feature following things are needed to make it work:

* Add a "plan" field to users collection which is either empty = free plan or "pro" for pro plan
  * Only display "Go PRO" in the navbar if the plan field is empty for the user
  * Only display the Support button (Profile.jsx) and Support Overview in the navbar dropdown if the field is = "pro"
* On the GoPro.jsx page if the user clicks on the "Go PRO" button it should set the plan field to "pro" (for now) and redirect to the homepage (path: /)
* Add a "Manage plan" section to the ProfileSettings.jsx page which displays the current "plan" value with a label and a "Change plan" button that does nothing for now.

### Discover Page

Users can go to "/" to discover new sounds that they haven't heard before.

* Rename "Latest" to "Home" and create two tabs which are "Discover" and "Following" (instead of "Latest")
  * Following page is the same content as "Latest"
  * The new title is "Following", description stays the same
* The Discover page display following sounds in blocks:
  * For tags: #trap beat, only show 3 and add a load more button
  * Newest sounds from the platform: only show 3 again with load more button
  * Hottest sounds, also only 3 and link to the "Hot" page instead of a load more button.
  * The load more button loads 5 new sounds instead of what it is now
  * For each block add a description + title
  * Main title for page is "Discover"

### Collab Finder

The user can use a collab finder to find their next collaboration (producer, musicians, vocalists) etc. It's like a tinder for musicians.

* Use "react-tinder-card" for the frontend
* On the swipe card display the avatar image of the user and following new user profile fields:
  * firstName: required, The first name of the user
  * mood: required, The mood the user is in (e.g. happy, sad, dreamy, epic, relaxing, and scary)
  * matchDescription: not required, description of what the musician is looking for
  * tags: not required, Genres or other tags (e.g. vocalist, trap producer, etc.)
* On first visit display a page with description similar to the "Battle Pit"
  * Title is "Collab Finder", description is: "Swipe left or right on potential music collaborators", Button is "Setup Profile"
  * The introduction page is only displayed when the profile is incomplete
  * Create a modal form that displays the fields mentioned above in a form after clicking on "Setup Profile"
  * After saving display the musicians on the platform in random order
  * On the main page, show a settings icon that allows the user to change their info
* Create a new collection "Matches" that is updated everytime someone swipes left or right (remember the decision (like or dislike) in the collection so that it remembers where you left off)
* Add a new NavLink called "Match" to the right of "Hot" and the left of Search which displays the collab finder
* Style it similarly to the "Battle Pit"

### Feedback for Feedback

Give 2 pieces of feedback for tracks, get "one feedback coin" to request feedbacks from others.

* Adjust data structure:
  * Add "feedbackCoins" (number) to user. By default it's 0 (imports/api/users.js)
  * Add "feedbackRequests" (number) to sound. By default it's 0 (imports/api/sounds.js)
  * Create new "feedback" collection with following fields:
    * soundId: Sound that feedback is given for
    * giverId: User that gives the feedback
    * content: The content of the feedback (minimum 50 characters, max 1000) 
    * rating: 1 to 5 (number, optional) the rating 
    * createdAt: Created at timestamp
* Add buttons to sound detail page (imports/ui/pages/Sound.jsx):
  * If the user is viewing a sound that is their own show a "Request Feedback" button
    * When clicked, open a modal with a whole number input that is min. 1 and max 10
    * Display a button "Request" that calls a Meteor.method that updates the feedbackCoins and feedbackRequests fields 
    * Display a button "Close" that closes the modal and does nothing
  * If the user is viewing someone elses sound display a "Give Feedback" button
    * When clicked it opens a modal with a textarea ("content", minimum 50 characters, max 1000) and a star rating (1 to 5) 
      * Use the "@smastrom/react-rating" package
    * Display a button called "Submit" which creates a new "feedback" document and opens up a detail page (more info below). Also it adds 0.5 feedbackCoins to the current user. 
      * The user can have a maximum of 10 feedbackCoins, check for that in the Meteor.method
    * Display a button "Close" that closes the modal and does nothing
* Create a new page ("/feedback") which display following:
  * On top it shows the amount of "feedbackCoins" for the current user
  * First a list of "Feedbacks requested" title and a description. The list displays sounds that have sounds with "feedbackRequests" >= 1 and is sorted by most requests to lowest.
    * hidePlayButton = true for the sound list
  * Second a list of feedbacks for the current user. Title is "Feedbacks Received" and a description.
    * Only show 5 by default and if there's more feedbacks display a "Show All" button that links to a page ("/feedback/received") where all the feedbacks for the current user are displayed (sorted )
  * Create a FeedbackList.jsx component to display all the feedbacks
    * Sort the feedbacks by createdAt
    * Display the createdAt timestamp with date-fns: formatDistanceToNow
    * Each feedback is linked to the detail feedback page (more info below)

### Audio Sample Market

Provide a free (for now) sample market that is used by the users to share their sounds with each other.

* Add "isSample" field (default: false, optional: true), bpm (optional, number) to sound collection
* Add isSample doesn't equal true to the sound publications, so that samples aren't listed in the existing sound lists (hot, explore, discover, following)
* Add "Is Sample" checkbox to both Sound Add and Edit form (update the Meteor.methods too)
* If "isSample" is true, display BPM and Key Fields in a section called "Sample Data" in the edit and add form (reuse code if possible)
* Create new page called "Samples"
* On the "Samples" page, only show sounds where isSample = true
* By default sort the samples by "hottest" (most plays in the last 30 days) and display a select dropdown that allows the user to sort by "newest" and "random"
* Add a filter for BPM
