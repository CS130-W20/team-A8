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
import { BrowserRouter, Link } from "react-router-dom";
import FacebookLoginButton from "./FacebookLoginButton";

import "./SingleGame.css";

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

class SingleGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: {},
      apiScreenshots: [],
      apiAges: {},
      apiDescription: {},
      apiGenre: {},
      apiPlatforms: {},
      coverUrl: "",
      descriptionFound: false
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
  }

  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  convertDate(timestamp){
    var ts = new Date(timestamp).toDateString().split(' ').slice(1).join(' ');
    return ts;
  }
  onFacebookLogin(loginStatus, resultObject) {
    // if (loginStatus === true) {
    //   this.setState({
    //     username: resultObject.user.name
    //   });
    // } else {
    //   alert("Facebook login error");
    // }
  }

  getGame() {
    var url =
      `http://localhost:9000/igdb/game?id=` +
      new URLSearchParams(window.location.search).get("id");
    fetch(url)
      .then(res => res.json())
      .then(data =>
        this.setState({
          apiResponse: data,
          apiScreenshots: data.screenshots, // find a way to loop over all screenshots
          apiAges: data.age_ratings[0][0],
          apiGenre: data.genres[0][0], // find a way to loop over all genres so i can put in tags (use var i or something)
          apiPlatforms: data.platforms[0][0],
          
        })
      )
      .catch(err => console.log(`Error is: ${err}`));
  }

  getDescription() {
    var url =
      `http://localhost:9000/igdb/game?id=` +
      new URLSearchParams(window.location.search).get("id");
    fetch(url)
      .then(res => res.json())
      .then(data =>
        this.setState({
          apiDescription: data.age_ratings[1][0],
          descriptionFound: true
        })
      )
      .catch(err => console.log(`Error is: ${err}`));
  }

  cover() {
    var url =
      `http://localhost:9000/igdb/cover?id=` +
      new URLSearchParams(window.location.search).get("id");
    fetch(url)
      .then(res => res.text())
      .then(data => this.setState({ coverUrl: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  componentDidMount() {
    this.getGame();
    this.getDescription();
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
                  <Rate character={<Icon type="heart" />} count={1} />
                  {/* <Text> {this.state.apiResponse.rating}</Text> */}
                  <Rate
                    character={<Icon type="star" />}
                    allowHalf
                    disabled
                    defaultValue={4.5}
                  />
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
                  {(() => {
                    if (this.state.descriptionFound) {
                      return (
                        <Text>
                          {this.state.apiDescription.synopsis}
                        </Text>
                      )
                   } else {
                      return (
                        <Text>
                          No description found.
                        </Text>
                      )
                    }
                    })()}
                <br />
                <Title level={2}>Screencaps</Title>
              </div>
              <br />
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={2}><Avatar className="arrow-left" icon="left-circle" onClick={this.previous} /></Col>
                  
                <Col span={20}><Carousel
                  class="carousel"
                  ref={node => (this.carousel = node)}
                  {...carouselProps}
        >       
                {this.state.apiScreenshots.map(elem => {
                  return (
                  <div align="center" className="carousel-container">
                    <img className="image-container" src={"http:" + elem[0].url.replace("t_thumb", "t_720p")} />
                  </div>
                  );
                })}
                </Carousel></Col>
                <Col span={2}><Avatar className="arrow-right" icon="right-circle" onClick={this.next} /></Col>
                </Row>
            </Col>
            <Col span={8}>
              <div class="container">
                {/* if user is not logged in, show this button and link to the facebook*/}
                <FacebookLoginButton onLogin={this.onFacebookLogin}>
                  <Button>sign in to log, rate, or review</Button>
                </FacebookLoginButton>
                <br />
                <Button>share</Button>
                <br />
                <Card title="Details" style={{ width: 350 }}>
                  <Descriptions>
                    <Descriptions.Item label="platform">
                      {this.state.apiPlatforms.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="version">
                      {this.state.apiPlatforms.versions}
                    </Descriptions.Item>
                    <Descriptions.Item label="release date">
                      {this.convertDate(this.state.apiResponse.first_release_date * 1000)}
                    </Descriptions.Item>
                    <Descriptions.Item label="rating">
                      {this.state.apiResponse.rating_count}
                    </Descriptions.Item>
                    <Descriptions.Item label="suitable for">
                      {this.state.apiAges.synopsis}
                    </Descriptions.Item>
                  </Descriptions>
                  <div class="small-container">
                    <Tag>{this.state.apiGenre.name}</Tag>
                    <Tag>Action</Tag>
                    <Tag>Classics</Tag>
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
