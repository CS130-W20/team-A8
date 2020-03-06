import React from "react";
import { Typography, Layout, Button, Carousel } from "antd";
import config from "../config.json";
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;

class Home extends React.Component {

  componentDidMount() {
    axios.get(`${config.backend_url}/profile/getCurrentUserInformation`)
      .then((user) => {
        if (!user) {
          this.props.setUser(null);
        }
      })
  }

  render() {
    console.log(this.props.user);
    return (
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Title type="secondary">show off your stats.</Title>
        <br />
        <Title type="secondary">connect and join with hosts.</Title>
        <br /> <Title type="secondary">share what's good.</Title>
        <br />
        <div align="center">
          { this.props.user
            ? <a href={`${config.backend_url}/auth/logout`}>
                <Button>Log Out</Button>
              </a>
            : <a href={`${config.backend_url}/auth/facebook`}>
                <Button>Log in with Facebook</Button>
              </a>
          }
        </div>
      </Content>
    );
  }
}

export default Home;
