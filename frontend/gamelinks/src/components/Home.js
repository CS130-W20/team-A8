import React from "react";
import { Layout, Button, Carousel } from "antd";
import axios from 'axios';
import FacebookLoginButton from "./FacebookLoginButton";
import config from '../config.json';

const { Content } = Layout;

class Home extends React.Component {

  authenticate() {
    axios.get(`${config.backend_url}/auth/facebook`)
      .then((user) => {
        console.log(user);
      })
  }

  render() {
    return (
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div align="center">
          <Button onClick={ this.authenticate }>Login with Facebook</Button>
        </div>
      </Content>
    );
  }
};

export default Home;
