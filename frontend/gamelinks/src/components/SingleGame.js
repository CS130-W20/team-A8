import React, { useDebugValue } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Rate,
  Icon,
  Avatar,
  Button,
  Row,
  Col,
  Typography,
  Layout,
  Input,
  Carousel
} from "antd";
import axios from 'axios';
import { BrowserRouter, Link } from "react-router-dom";
import FacebookLoginButton from "./FacebookLoginButton";
import config from "../config.json";

import "./SingleGame.css";

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
const queryString = require('query-string');

class SingleGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: {},
      apiScreenshots: [],
      apiAges: {},
      apiGenre: [],
      apiPlatforms: {},
      coverUrl: "",

      hosting: false,
      hosts: [],
      liked: false,
      likes: "",

      userInfo: {},
      userHosting: [],
      userFavorites: []
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
    this.gid = queryString.parse(this.props.location.search).id;
  }

  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  convertDate(timestamp) {
    var ts = new Date(timestamp)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" ");
    return ts;
  }

  getGame() {
    var url =
      `http://localhost:9000/igdb/game?id=` +
      this.gid;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          apiResponse: data,
          apiScreenshots: data.screenshots,
          apiGenre: data.genres, 
          apiPlatforms: data.platforms[0][0]
        })
        if (data.has("screenshots")) {
          this.setState({apiScreenshots: data.screenshots});
        }
        if (data.has("age_ratings")) {
          this.setState({apiAges: data.age_ratings[0][0]});
        }
      }
      )
      .catch(err => console.log(`Error is: ${err}`));
  }

  cover() {
    var url =
      `http://localhost:9000/igdb/cover?id=` +
      this.gid;
    fetch(url)
      .then(res => res.text())
      .then(data => this.setState({ coverUrl: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  hostGame = async () => {
    const userId = this.props.user._id;
    const id = this.gid;
    console.log("Adding Host for game " + id + " for user " + userId);
    await axios.post(`${config.backend_url}/games/addHost`, 
      null, 
      { params: {id, userId}})
      .then(res => {
        this.setState( {hosting: true});

        console.log(res);
      })
      .catch(err => console.warn(err));
    const userInfo = {...this.state.userInfo, hosting: { id: id, operation: "add"}};
    axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo)
      .then(res => {
        this.setState({ userInfo })
        console.log(res);
      })
      .catch(err => {
        console.warn(err)
      });
  }

  unhostGame = async () => {
    const userId = this.props.user._id;
    const id = this.gid;
    console.log("Removing Host for game " + id + " for user " + userId);
    await axios.post(`${config.backend_url}/games/removeHost`, 
      null, 
      { params: {id, userId}})
      .then(res => {
        this.setState( {hosting: false})
        console.log(res);
      })
      .catch(err => console.warn(err));
    const userInfo = {...this.state.userInfo, hosting: { id: id, operation: "remove"}};
    axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo)
      .then(res => {
        this.setState({ userInfo })
        console.log(res);
      })
      .catch(err => {
        console.warn(err)
      });
  }

  initialize() {
    var url = `${config.backend_url}/games/getGameInfo?id=${this.gid}`
    fetch(url)
      .then(res => res.json())
      .then(data => {this.checkHost(data.hosts);})
      .catch(err => console.warn(err));
    axios.get(`${config.backend_url}/profile/getCurrentUserInformation`)
      .then((userInfo) => {
        console.log(userInfo);
        this.setState({ userInfo: userInfo.data,
          userHosting: userInfo.data.hosting,
          userFavorites: userInfo.data.favorites});
        this.checkFavorite();
      })
      .catch(err => console.warn(err));
  }

  checkHost(getHosts) {
    this.setState({ hosts: getHosts});
    const userId = this.props.user._id;
    if(getHosts.indexOf(userId) > -1)
      this.state.hosting = true;
    console.log(this.state.hosts);
    console.log("hosting is " + this.state.hosting);
  }
  
  checkFavorite() {
    if(this.state.userFavorites.indexOf(this.gid) > -1){
      this.setState({ liked: true});
      console.log("User has liked this game");
    }
  }

  favorite = () => {
    const id = this.gid;
    if(!this.state.liked){
      const userInfo = {...this.state.userInfo, favorites: { id: id, operation: "add"}};
      axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo)
            .then(res => {
                this.setState({ userInfo })
                console.log(res);
            })
            .catch(err => {
                console.warn(err)
            });
    }
    else{
      const userInfo = {...this.state.userInfo, favorites: { id: id, operation: "remove"}};
      axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo)
            .then(res => {
                this.setState({ userInfo });
                console.log(res);
            })
            .catch(err => {
                console.warn(err)
            });
    }
    this.setState( {liked: !this.state.liked});
  }


  componentDidMount() {
    this.initialize();
    console.log(this.state.userHosting);
    this.getGame();
    this.cover();
  }

  render() {
    const carouselProps = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <Content>
        <Row>
          <Col span={8} alignItems="top">
            <div class="container">
              <img
                height="375"
                width="260"
                src={"http://" + this.state.coverUrl}
              />
              <br />
              <div class="small-container">
                {this.props.user ?
                <Rate character={<Icon type="heart" />} count={1} 
                value={this.state.liked} onChange={this.favorite}/> 
                : <Rate disabled character={<Icon type="heart" />} count={1}/>}
                {/* <Text> {this.state.apiResponse.rating}</Text> */}
              </div>
              <br />
              <Card title="Where To Play" style={{ width: 300 }}>
                <Avatar size="small" icon="user" />
                <Avatar size="small" icon="user" />
                <Avatar size="small" icon="user" />
                <br />
                <Link>My Hosts</Link>
                <br />
                <Link to={`/people`}>More Hosts</Link>
                {/* link to people page  */}
              </Card>
            </div>
          </Col>
          <Col span={8}>
            <div class="container">
              <Title>{this.state.apiResponse.name}</Title>
              <br />
              <Text>{this.state.apiResponse.summary}</Text>
              <br />
              <Title level={2}>Screencap</Title>
            </div>
            <br />
            <Row type="flex" justify="space-around" align="middle">
              <Col span={2}>
                <Avatar
                  className="arrow-left"
                  icon="left-circle"
                  onClick={this.previous}
                />
              </Col>

              <Col span={20}>
                <Carousel
                  class="carousel"
                  ref={node => (this.carousel = node)}
                  {...carouselProps}
                >
                  {this.state.apiScreenshots ?
                  this.state.apiScreenshots.map(elem => {
                    return (
                      <div align="center" className="carousel-container">
                        <img
                          className="image-container"
                          src={
                            "http:" + elem[0].url.replace("t_thumb", "t_720p")
                          }
                        />
                      </div>
                    );
                  }): false}
                </Carousel>
              </Col>
              <Col span={2}>
                <Avatar
                  className="arrow-right"
                  icon="right-circle"
                  onClick={this.next}
                />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <div class="container">
              { this.props.user ? 
                  this.state.hosting ?
                    <Button onClick={this.unhostGame}>Stop Hosting</Button>
                    :<Button onClick={this.hostGame}>Host</Button>
                  :<a href={`${config.backend_url}/auth/facebook`}>
                    <Button>Log in with Facebook</Button>
                  </a>
              }
              <br/>
              <Card title="Details" style={{ width: 350 }}>
                <Descriptions>
                  <Descriptions.Item label="platform">
                    {this.state.apiPlatforms.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="version">
                    {this.state.apiPlatforms.versions}
                  </Descriptions.Item>
                  <Descriptions.Item label="release date">
                    {this.convertDate(
                      this.state.apiResponse.first_release_date * 1000
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="rating">
                    {this.state.apiResponse.rating_count}
                  </Descriptions.Item>
                  <Descriptions.Item label="suitable for">
                    {this.state.apiAges.synopsis}
                  </Descriptions.Item>
                </Descriptions>
                <div class="small-container">
                  {this.state.apiGenre.map(elem => {
                    return (
                      <Tag>{elem[0].name}</Tag>
                    );
                  })}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default SingleGame;