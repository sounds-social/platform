import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

// Import pages
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import GoPro from './pages/GoPro';
import SupportOverview from './pages/SupportOverview';
import Sound from './pages/Sound';
import SoundAdd from './pages/SoundAdd';
import SoundEdit from './pages/SoundEdit';
import Playlist from './pages/Playlist';
import Group from './pages/Group';
import GroupSettings from './pages/GroupSettings';
import Home from './pages/Home';
import Hot from './pages/Hot';
import Explore from './pages/Explore';
import NotFound from './pages/NotFound';

// Import components
import Navbar from './components/Navbar';

export const App = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Switch>
            <Route exact path="/" component={user ? Home : About} />
        <Route path="/about" component={About} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/profile/settings" component={ProfileSettings} />
        <Route path="/profile/:slug?" component={Profile} />
        <Route path="/go-pro" component={GoPro} />
        <Route path="/support-overview" component={SupportOverview} />
        <Route path="/sound/add" component={SoundAdd} />
        <Route path="/sound/edit/:soundId" component={SoundEdit} />
        <Route path="/sound/:soundId" component={Sound} />
        <Route path="/playlist/:playlistId" component={Playlist} />
        <Route path="/likes" component={Playlist} />
        <Route path="/group/settings/:groupId" component={GroupSettings} />
        <Route path="/group/:slug" component={Group} />
        <Route path="/hot" component={Hot} />
        <Route path="/explore" component={Explore} />
        <Route component={NotFound} />
      </Switch>
        </main>
      </div>
    </Router>
  );
};