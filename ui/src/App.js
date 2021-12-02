/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Posts from "./components/Posts";
import Twits from './components/Twits';
import { CgCopyright } from 'react-icons/cg';

function App() {
    const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')) || false);
    // console.log(loggedIn, localStorage.getItem('signup'));
    
  return (
    <Router>
        <div className="h-full w-full m-7 max-w-sm mx-auto bg-blue-200 rounded-xl shadow-md flex">
              <div className="bg-white-300 rounded-xl p-4">
      <Switch>
              <Route exact path="/" component={Posts} />
              <Route exact path="/twits" component={Twits} />
      </Switch>
            {/* <Posts /> */}
            <p className="text-white-400 bold flex text-center"><CgCopyright /> Twitee</p>         
          </div>
        </div> 
    </Router>
  );
}

export default App;
