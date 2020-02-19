import React from 'react';
import axios from 'axios';
import Header from './components/Header';
import Home from './components/Home';
import Messages from './components/Messages';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

class App extends React.Component {
  state = {
    user: "null", // Add more states and change this when linked with backend.
  }

  render() {
    return (
      <div>
        <Header user={ this.state.user } test={this.test} />
        <Router>
          <Switch>
            <Route exact path='/' component={ Home } />
            <Route path='/messages' component={ Messages } />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
