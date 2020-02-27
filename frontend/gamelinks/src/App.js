import React, { Component } from "react";
import { withRouter, Route, Switch, BrowserRouter } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Games from "./components/Games";
import SingleGame from "./components/SingleGame";
import axios from 'axios';

import config from './config.json';

class App extends Component {
  state = {
    user: "test" // Add more states and change this when linked with backend.
  };

  /**
  componentDidMount() {
    axios.get(`${config.backend_url}/profile/getCurrentUserInformation`)
      .then((user) => {
        this.setState({ user })
        console.log(user);
      })
  }
  */

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header user={this.state.user} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/messages" component={Messages} />
            <Route path="/games" component={Games} />
            <Route path="/singlegame" component={SingleGame} />
            <Route path='/profile' render={(props) => <Profile user={this.state.user} { ...props } /> } />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
