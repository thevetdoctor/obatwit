/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Posts from "./components/Posts";
import Twits from './components/Twits';

function App() {
    const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')) || false);
    // console.log(loggedIn, localStorage.getItem('signup'));
    // button.addEventListener('click', () => {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          randomNotification();
        }
      });
    // })
      const games = [
        {
          name: 'Obafemi',
          author: 'Obafemi',
        },
        {
          name: 'Oyetoke',
          author: 'Oyetoke',
        },
        {
          name: 'Demilade',
          author: 'Demilade',
        },
        {
          name: 'Damilola',
          author: 'Damilola',
        },
      ]
    function randomNotification() {
      const randomItem = Math.floor(Math.random() * games.length);
      const notifTitle = games[randomItem].name;
      // const notifBody = `Notified by ${games[randomItem].author}`;
      const notifBody = `Notified`;
      const notifImg = `https://res.cloudinary.com/thevetdoctor/image/upload/v1599332593/g1rozhabxswegvhp59h3.jpg`;
      const options = {
        body: notifBody,
        icon: notifImg,
      };
      console.log(options.body)
      new Notification(notifTitle, options);
      setTimeout(randomNotification, 30000);
    }
  return (
    <Router>
        {/* <div className="h-full w-full m-0 max-w-sm mx-auto bg-blue-200 rounded-xl shadow-md flex"> */}
        <div className="font-Roboto h-full w-full m-0 max-w-xl max-h-xl my-0 mx-auto bg-blue-300 rounded-xl shadow-md -px-3">
              <div className="bg-gray-100 rounded-xl p-4">
      <Switch>
              <Route exact path="/" component={Posts} />
              <Route exact path="/twits" component={Twits} />
      </Switch>
            {/* <Posts /> */}
          </div>
        </div> 
    </Router>
  );
}

export default App;
