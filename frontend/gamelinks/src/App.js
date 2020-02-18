import React, { Component } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Profile from "./components/Profile";

class App extends Component {
  state = {
    user: "null" // Add more states and change this when linked with backend.
  };
  render() {
    return (
      <div>
        <Header user={this.state.user} />
        <Router>
          <Switch>
            {/* <Route exact path="/" component={Home} />
            <Route path="/messages" component={Messages} /> */}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
