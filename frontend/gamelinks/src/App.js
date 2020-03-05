import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Games from "./components/Games";
import SingleGame from "./components/SingleGame";

class App extends Component {
  state = {
    user: "test" // Add more states and change this when linked with backend.
  };

  setUser = (user) => {
    this.setState({ user });
  }

  render() {
    console.log(this.state.user);
    return (
      <HashRouter>
        <div>
          <Header user={this.state.user} />
          <Switch>
            <Route exact path="/" render={(props) => <Home { ...props } /> }  />
            <Route path="/inbox" render={(props) => <Messages user={this.state.user} { ...props } /> } />
            <Route path="/games" render={(props) => <Games user={this.state.user} { ...props } /> } />
            <Route path="/singlegame" render={(props) => <SingleGame user={this.state.user} { ...props } /> } />
            <Route path='/profile' render={(props) => <Profile setUser={this.setUser} user={this.state.user} { ...props } /> } />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
