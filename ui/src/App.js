/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Posts from "./components/Posts";
import Twits from './components/Twits';
import Profile from './components/Profile';
import People from './components/People';
import Follower from './components/Followers';
import Following from './components/Following';
import UserTwits from './components/UserTwits';
import store from './redux/store';
import { useSelector } from 'react-redux';
import Reset from './components/Reset';
import Chats from './components/Chats';
import Verified from './components/Verified';

function App() {
    const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')) || false);
    
    const {getState, dispatch} = store;
    const state = getState();
    const { searchQuery, networkStatus } = useSelector(state => state);
    // console.log(state);

    useEffect(() => {
      if(navigator.onLine) {
        dispatch({
          type: 'SET_NETWORK_STATUS',
          data: true
        });
      } else {
        dispatch({
          type: 'SET_NETWORK_STATUS',
          data: false
        });
      } 
    }, []);

      const username = localStorage.getItem('username');
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          // randomNotification();
        }
      });

    function randomNotification() {
      const notifTitle = username ? `Hello, ${username}` : 'Hello !';
      const notifBody = `Have you checked Twitee today?`;
      const notifImg = `https://res.cloudinary.com/thevetdoctor/image/upload/v1599332593/g1rozhabxswegvhp59h3.jpg`;
      const options = {
        body: notifBody,
        icon: notifImg,
      };
      new Notification(notifTitle, options);
      setTimeout(randomNotification, 3 * 60 * 60 * 1000);
    }
// console.log(window.document.body.scrollHeight)

  return (
    <Router>
        {/* <div className="h-full w-full m-0 max-w-sm mx-auto bg-blue-200 rounded-xl shadow-md flex"> */}
        {/* <div className="font-Roboto w-full m-0 max-w-xl max-h-xl my-0 mx-auto rounded-xl shadow-md -px-3"> */}
              {/* <div className="bg-gray-200 rounded-xl p-4"> */}
      <Switch>
              <Route exact path="/" component={Posts} />
              <Route exact path="/twits" component={Twits} />
              <Route exact path="/people" component={People} />
              <Route exact path="/reset" component={Reset} />
              <Route exact path="/verify/:user" component={Verified} />
              <Route path="/twits/:user" component={UserTwits} />
              <Route path="/chats/:user" component={Chats} />
              <Route path="/following/:user" component={Following} />
              <Route path="/follower/:user" component={Follower} />
              <Route path="/:user" component={Profile} />
      </Switch>
          {/* </div>ff */}
        {/* </div>  */}
    </Router>
  );
}

export default App;
