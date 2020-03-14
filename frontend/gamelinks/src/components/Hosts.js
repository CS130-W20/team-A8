import React from "react";
import {
  Menu,
  Icon,
  Layout,
  Typography,
  Card,
  Carousel,
  Empty,
  Modal,
  Avatar,
  Form,
  Upload,
  Button,
  message
} from "antd";
import "antd/dist/antd.css";
import AddInfoForm from "./addInfoForm";

import { Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./Hosts.css";
import config from "../config.json";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

class Hosts extends React.Component {
  constructor(props) {
    super(props);
    this.nextHosting = this.nextHosting.bind(this);
    this.prevHosting = this.prevHosting.bind(this);
    const values = queryString.parse(props.location.search);
    this.state.userId = values.id;
    this.carouselHosting = React.createRef();
    console.log(props);
  }
  state = { userId: null };

  componentDidMount() {
    // get host infos
    axios
      .get(`${config.backend_url}/profile/getAllUsers`)
      // .get(`${config.backend_url}/profile/getCurrentUserInformation`)
      // .then(user => {
      //   console.log(user);
      //   this.props.setUser(user.data);
      // })
      // .then(() => {
      //   return axios({
      //     url: `${config.backend_url}/profile/getAllUsers`,
      //     method: "GET"
      //   });
      // })
      .then(results => {
        console.log(results.data);
        this.setState({ results: results.data });
        this.getHostList(results);
      })
      .catch(err => {
        console.log(err);
      });
  }
  nextHosting() {
    this.carouselHosting.next();
  }

  prevHosting() {
    this.carouselHosting.prev();
  }

  getHostList = async results => {
    if (!this.state.results) {
      return <Empty />;
    }
    const hostList = this.state.results;
    console.log(hostList);
    const HostPromises = [];
    for (let i = 0; i < hostList.length; i += 1) {
      var currentUser = hostList[i];
      console.log(currentUser);
      const hostReq = axios.get(
        `${config.backend_url}/profile/getProfileUserInformation?id=${currentUser._id}`
      );
      if (currentUser.hosting != []) {
        HostPromises.push(hostReq);
      }
      // HostPromises.push(hostReq);
    }
    const hostInfo = await Promise.all(HostPromises);
    this.setState({ hosts: hostInfo });
  };

  render() {
    let createHostCards = () => {
      console.log("creatingHostCards");
      const hostInfo = this.state.hosts;
      console.log(hostInfo);
      if (!hostInfo) return;
      const cards = [];
      for (let i = 0; i < hostInfo.length; i += 1) {
        cards.push(
          <div className="card">
            <Link to={`/profile/?id=${hostInfo[i].data._id}`}>
              <img src={hostInfo[i].data.profilePicture} />
              <div className="card-text-box">
                <Text className="card-text">{hostInfo[i].data.username}</Text>
              </div>
            </Link>
          </div>
        );
      }
      return cards;
    };
    const hostCards = createHostCards() || [];
    // const gameCards = createGameCards("hosting") || []; // NOT TEST
    const props = {
      dots: true,
      speed: 500,
      circular: false,
      slidesToScroll: 4
    };
    return (
      // clicking on a card links to profile.js
      <div>
        <hr />
        <Title level={2}>Hosts for You</Title>
        <hr />
        <div>
          <div>
            {hostCards.length ? (
              <>
                <div>
                  <Carousel
                    ref={node => (this.carouselHosting = node)}
                    {...props}
                    slidesToShow={Math.min(4, hostCards.length)}
                  >
                    {hostCards}
                  </Carousel>
                </div>
                <br />
                <div className="scroll-group">
                  <Icon
                    type="left-circle"
                    className="scroll"
                    onClick={this.prevHosting}
                  />
                  <Icon
                    type="right-circle"
                    className="scroll"
                    onClick={this.nextHosting}
                  />
                </div>
              </>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Hosts;
