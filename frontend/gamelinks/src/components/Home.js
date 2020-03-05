import React from "react";
import { Layout, Button, Carousel } from "antd";
import axios from 'axios';
import config from '../config.json';

const { Content } = Layout;

class Home extends React.Component {
  render() {
    return (
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div align="center">
          <a href={`${config.backend_url}/auth/facebook`}><Button>Login with Facebook</Button></a>
        </div>
      </Content>
    );
  }
};

export default Home;
