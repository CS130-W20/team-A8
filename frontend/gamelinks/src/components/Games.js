import React, { Component } from "react";
import {
  Menu,
  Icon,
  Input,
  Dropdown,
  Row,
  Col,
  Typography,
  Layout,
  Button,
  Carousel
} from "antd";
import { Link, BrowserRouter } from "react-router-dom";
import "./Games.css";

const { SubMenu } = Menu;
const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

class Games extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
    this.state = {
      apiResponse: [],
      title: ""
    };
  }
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  genre_filter = (
    <Menu>
      <SubMenu title="A-I">
        <Menu.Item onClick={() => this.genre(`adventure`)}>Adventure</Menu.Item>
        <Menu.Item onClick={() => this.genre(`arcade`)}>Arcade</Menu.Item>
        <Menu.Item onClick={() => this.genre(`fighting`)}>Fighting</Menu.Item>
        <Menu.Item onClick={() => this.genre(`hack-and-slash-beat-em-up`)}>
          Hack-and-Slash / Beat-Em-Up
        </Menu.Item>
        <Menu.Item onClick={() => this.genre(`indie`)}>Indie</Menu.Item>
      </SubMenu>
      <SubMenu title="M-P">
        <Menu.Item onClick={() => this.genre(`music`)}>Music</Menu.Item>
        <Menu.Item onClick={() => this.genre(`pinball`)}>Pinball</Menu.Item>
        <Menu.Item onClick={() => this.genre(`platform`)}>Platform</Menu.Item>
        <Menu.Item onClick={() => this.genre(`point-and-click`)}>
          Point-and-Click
        </Menu.Item>
        <Menu.Item onClick={() => this.genre(`puzzle`)}>Puzzle</Menu.Item>
      </SubMenu>
      <SubMenu title="Q-R">
        <Menu.Item onClick={() => this.genre(`quiz-trivia`)}>
          Quiz / Trivia
        </Menu.Item>
        <Menu.Item onClick={() => this.genre(`racing`)}>Racing</Menu.Item>
        <Menu.Item onClick={() => this.genre(`real-time-strategy-rts`)}>
          RTS
        </Menu.Item>
        <Menu.Item onClick={() => this.genre(`role-playing-rpg`)}>
          RPG
        </Menu.Item>
      </SubMenu>
      <SubMenu title="S">
        <Menu.Item onClick={() => this.genre(`shooter`)}>Shooter</Menu.Item>
        <Menu.Item onClick={() => this.genre(`simulator`)}>Simulator</Menu.Item>
        <Menu.Item onClick={() => this.genre(`sport`)}>Sport</Menu.Item>
        <Menu.Item onClick={() => this.genre(`strategy`)}>Strategy</Menu.Item>
      </SubMenu>
      <SubMenu title="T-V">
        <Menu.Item onClick={() => this.genre(`tactical`)}>Tactical</Menu.Item>
        <Menu.Item onClick={() => this.genre(`turn-based-strategy-tbs`)}>
          Turn-Based
        </Menu.Item>
        <Menu.Item onClick={() => this.genre(`visual-novel`)}>
          Visual-Novel
        </Menu.Item>
      </SubMenu>
    </Menu>
  );

  search(value) {
    this.state.title = `Search for: "${value}"`;
    fetch(`http://localhost:9000/igdb/search?title=${value}`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  popular() {
    this.state.title = `Most Popular`;
    fetch(`http://localhost:9000/igdb/popular?limit=50`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  genre(value) {
    this.state.title = `Genre: "${value}"`;
    fetch(`http://localhost:9000/igdb/searchbyGenre?genre=${value}&limit=50`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  componentDidMount() {
    this.popular();
  }

  render() {
    const props = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 6
    };
    return (
      <BrowserRouter>
        <br></br>
        <Row>
          <Col span={18}>
            <div>
              <Text>Browse By </Text>
              <Button onClick={() => this.popular()}>popular</Button>
              <Dropdown overlay={this.genre_filter}>
                <Button>
                  genre <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search by Name"
              onSearch={value => this.search(value)}
            />
          </Col>
        </Row>
        <br></br>
        <Title>{this.state.title}</Title>
        <div>
          <Icon type="left-circle" onClick={this.previous} />
          <Carousel
            class="carousel"
            ref={node => (this.carousel = node)}
            {...props}
          >
            {this.state.apiResponse.map(elem => {
              return (
                <div class="image-container">
                  <Link to={`/single-game/${elem.id}`}>
                    <img class="elem-image" src={"http://" + elem.coverUrl} />
                  </Link>
                  <div class="name-text-box">
                    <p class="name-text">{elem.name}</p>
                  </div>
                </div>
              );
            })}
          </Carousel>
          <Icon type="right-circle" onClick={this.next} />
        </div>
      </BrowserRouter>
    );
  }
}

export default Games;
