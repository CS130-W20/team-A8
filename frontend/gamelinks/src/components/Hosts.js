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
    this.changeProfilePic = this.changeProfilePic.bind(this);
    const values = queryString.parse(props.location.search);
    this.state.userId = values.id;
    this.carouselHosting = React.createRef();
  }
  state = {};

  componentDidMount() {}
  render() {
    let createCards = type => {
      console.log("creatingCards");
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
    const hostingCards = createCards("hosting") || []; // NOT TEST
    const props = {
      dots: true,
      speed: 500,
      circular: false,
      slidesToScroll: 4
    };
    return (
      <div class="main">
        <Title>Hosts For You</Title>
        <Carousel
          class="carousel"
          ref={node => (this.carousel = node)}
          {...props}
        >
          {/* render host cards */}
        </Carousel>
        <Avatar
          className="arrow-left"
          size="large"
          icon="left-circle"
          onClick={this.previous}
        />
        <Avatar
          className="arrow-right"
          size="large"
          icon="right-circle"
          onClick={this.next}
        />
      </div>
    );
  }
}

export default Hosts;
