import React from "react";
import { Typography, Layout, Button, Carousel } from "antd";
import axios from "axios";
import config from "../config.json";

const { Content } = Layout;
const { Title, Text } = Typography;

class Home extends React.Component {
  render() {
    return (
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Title type="secondary">show off your stats.</Title>
        <br />
        <Title type="secondary">connect and join with hosts.</Title>
        <br /> <Title type="secondary">share what's good.</Title>
        <br />
        <div align="center">
          <a href={`${config.backend_url}/auth/facebook`}>
            <Button>Login with Facebook</Button>
          </a>
        </div>
      </Content>
    );
  }
}

export default Home;
