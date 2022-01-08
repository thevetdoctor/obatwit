/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Posts from "./components/Posts";
import Twits from './components/Twits';
import Profile from './components/Profile';
import People from './components/People';

function App() {
    const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')) || false);
      const username = localStorage.getItem('username');
      // console.log(username)
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          randomNotification();
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
  return (
    <Router>
        {/* <div className="h-full w-full m-0 max-w-sm mx-auto bg-blue-200 rounded-xl shadow-md flex"> */}
        {/* <div className="font-Roboto w-full m-0 max-w-xl max-h-xl my-0 mx-auto rounded-xl shadow-md -px-3"> */}
              {/* <div className="bg-gray-200 rounded-xl p-4"> */}
      <Switch>
              <Route exact path="/" component={Posts} />
              <Route exact path="/twits" component={Twits} />
              <Route exact path="/people" component={People} />
              <Route path="/:user" component={Profile} />
      </Switch>
          {/* </div>ff */}
        {/* </div>  */}
    </Router>
  );
}

export default App;
