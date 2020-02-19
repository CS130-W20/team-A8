import React, { Component } from "react";
import { withRouter, Route, Switch, BrowserRouter } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Games from "./components/Games";

class App extends Component {
  state = {
    user: "null" // Add more states and change this when linked with backend.
  };
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header user={this.state.user} />
          <Switch>
            <Route exact path="/" component={withRouter(Home)} />
            <Route exact path="/messages" component={withRouter(Messages)} />
            <Route exact path="/games" component={Games} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
