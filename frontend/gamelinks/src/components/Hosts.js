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
  Button
} from "antd";
import "antd/dist/antd.css";
import { Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./Hosts.css";
import config from "../config.json";

const { Title, Text } = Typography;
const { Content } = Layout;

class Hosts extends React.Component {
  constructor(props) {
    super(props);
    this.nextHosting = this.nextHosting.bind(this);
    this.prevHosting = this.prevHosting.bind(this);
    this.nextFavorites = this.nextFavorites.bind(this);
    this.prevFavorites = this.prevFavorites.bind(this);
    const values = queryString.parse(props.location.search);
    this.state.userId = values.id;
    this.carouselHosting = React.createRef();
  }
  state = {};

  componentDidMount() {
    // get host infos
    axios
      .get(`${config.backend_url}/profile/getCurrentUserInformation`)
      .then(user => {
        console.log(user);
        this.props.setUser(user.data);
      })
      .then(() => {
        return axios({
          url: `${config.backend_url}/profile/getProfileUserInformation?id=${this.state.userId}`,
          method: "GET"
        });
      })
      .then(userInfo => {
        console.log(userInfo.data._id);
        this.setState({ userInfo: userInfo.data });
        console.log(this.props.user);
        console.log(userInfo.data._id === this.props.user._id);
        if (this.props.user) {
          this.setState({
            isProfileOwner: userInfo.data._id === this.props.user._id
          }); // check if the profile belongs to the current user.
        }
      })
      .then(() => {
        this.getHostList(userInfo.data.city);
      })
      // .then(() => {
      //   this.getGameList("hosting");
      // })
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

  getHostList = async loc => {
    // once google maps api is set up we can post people near user location
    if (!this.state.userInfo || !this.state.userInfo[type]) {
      // TEST:  if (!this.state.userInfo || !this.state.userInfo[type])
      return <Empty />;
    }
    const idList = this.state.userInfo[loc];
    const HostPromises = [];
    for (let i = 0; i < idList.length; i += 1) {
      const hostReq = axios.get(
        `${config.backend_url}/profile/getProfileUserInformation?id=${idList[i]}`
      );
      HostPromises.push(hostReq);
    }
    const hostInfo = await Promise.all(HostPromises);
    this.setState({ hosts: hostInfo });
  };

  getGameList = async type => {
    if (!this.state.userInfo || !this.state.userInfo[type]) {
      // TEST:  if (!this.state.userInfo || !this.state.userInfo[type])
      return <Empty />;
    }
    const idList = this.state.userInfo[type];
    const InfoPromises = [];
    for (let i = 0; i < idList.length; i += 1) {
      const gameReq = axios.get(
        `${config.backend_url}/igdb/game?id=${idList[i]}`
      );
      const coverReq = axios.get(
        `${config.backend_url}/igdb/cover?id=${idList[i]}`
      );
      InfoPromises.push(gameReq, coverReq);
    }
    const gameInfo = await Promise.all(InfoPromises);
    type === "hosting"
      ? this.setState({ hosting: gameInfo })
      : this.setState({ favorites: gameInfo });
  };

  render() {
    let createGameCards = type => {
      console.log("creatingGameCards");
      const gameInfo = this.state[type];
      if (!gameInfo) return;
      const cards = [];
      for (let i = 0; i < gameInfo.length; i += 2) {
        cards.push(
          <div className="card">
            <Link to={`/singlegame/?id=${gameInfo[i].data.id}`}>
              <img src={"http://" + gameInfo[i + 1].data} />
            </Link>
            <div className="name-text-box">
              <a className="name-text">{gameInfo[i].data.name}</a>
              <br />
              {this.state.isProfileOwner && (
                <Text
                  className="name-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.removeCard(type, gameInfo[i].data.id);
                  }}
                >
                  Remove
                </Text>
              )}
            </div>
          </div>
        );
      }
      return cards;
    };
    let createHostCards = loc => {
      console.log("creatingHostCards");
      const hostInfo = this.state[loc];
      if (!hostInfo) return;
      const cards = [];
      for (let i = 0; i < hostInfo.length; i += 2) {
        cards.push(
          <div className="card">
            <Link to={`/profile/?id=${hostInfo[i].data.id}`}>
              <img src={`/profile/?id=${hostInfo[i].data.profilePicture}`} />
            </Link>
          </div>
        );
      }
      return cards;
    };
    const hostCards = createHostCards("hosts") || [];
    const gameCards = createGameCards("hosting") || []; // NOT TEST
    const props = {
      dots: true,
      speed: 500,
      circular: false,
      slidesToScroll: 4
    };
    return (
      // clicking on a card links to profile.js
      <div>
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
