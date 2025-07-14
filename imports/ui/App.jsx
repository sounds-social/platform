import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { FiLoader } from 'react-icons/fi';

import AllComments from './pages/AllComments';
import AllLikes from './pages/AllLikes';
import AllPlaylists from './pages/AllPlaylists';
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
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import PlaylistFormPage from './pages/PlaylistFormPage';
import Likes from './pages/Likes';
import Group from './pages/Group';
import GroupSettings from './pages/GroupSettings';
import Home from './pages/Home';
import Hot from './pages/Hot';
import Explore from './pages/Explore';
import Battle from './pages/Battle';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';
import ResetPassword from './pages/ResetPassword';
import { NotificationsPage } from './pages/NotificationsPage';
import StripeSuccess from './pages/StripeSuccess';
import Payouts from './pages/Payouts';
import MessagesPage from './pages/Messages';
import ConversationPage from './pages/Conversation';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Import AudioPlayerContext
import { AudioPlayerProvider, useAudioPlayer } from './contexts/AudioPlayerContext';

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useTracker(() => {
    Meteor.subscribe('users.me');

    return Meteor.user();
  });
  const { currentSound } = useAudioPlayer();

  setTimeout(() => {
    setIsLoading(false);
  }, 500);


  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin"><FiLoader size={30} /></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Switch>
            <Route exact path="/">
              {user ? <Home /> : <About />}
            </Route>
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/profile/settings" component={ProfileSettings} />
        <Route path="/profile/:slug?/likes">
          <AllLikes />
        </Route>
        <Route path="/profile/:slug?/comments" component={AllComments} />
        <Route path="/profile/:slug?/playlists" component={AllPlaylists} />
        <Route path="/profile/:slug?">
          <Profile />
        </Route>
        <Route path="/go-pro" component={GoPro} />
        <Route path="/support-overview" component={SupportOverview} />
        <Route path="/sound/add" component={SoundAdd} />
        <Route path="/sounds/:soundId/edit" component={SoundEdit} />
        <Route path="/sound/:soundId">
          <Sound />
        </Route>
        <Route path="/playlist/:playlistId/edit" component={PlaylistFormPage} />
        <Route path="/playlist/:playlistId">
          <PlaylistDetailPage />
        </Route>
        <Route path="/likes">
          <Likes />
        </Route>
        <Route path="/group/settings/:groupId" component={GroupSettings} />
        <Route path="/group/:slug" component={Group} />
        <Route path="/hot">
          <Hot />
        </Route>
        <Route path="/explore">
          <Explore />
        </Route>
        <Route path="/battle">
          <Battle />
        </Route>
        <Route path="/search">
          <SearchResults />
        </Route>
        <Route path="/notifications">
          <NotificationsPage />
        </Route>
        <Route path="/stripe-success" component={StripeSuccess} />
        <Route path="/payouts" component={Payouts} />
        <Route exact path="/messages" component={MessagesPage} />
        <Route path="/messages/:userId" component={ConversationPage} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/logout" component={() => {
          Meteor.logout();
          window.location.href = '/';
          return null;
        }} />
        <Route component={NotFound} />
      </Switch>
        </main>
        {currentSound && (
          <AudioPlayer />
        )}
        <Footer />
      </div>
    </Router>
  );
};

export const AppWithAudioPlayerProvider = () => (
  <AudioPlayerProvider>
    <App />
  </AudioPlayerProvider>
);
