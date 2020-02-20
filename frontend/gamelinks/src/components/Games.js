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
import { BrowserRouter, withRouter } from "react-router-dom";
import "./Games.css";

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
// implement filter categories later but rn they are dummies :)
const year_filter = (
  <Menu>
    <Menu.Item>All</Menu.Item>
    <Menu.Item>2020s</Menu.Item>
    <Menu.Item>2010s</Menu.Item>
    <Menu.Item>2000s</Menu.Item>
  </Menu>
);

const rating_filter = (
  <Menu>
    <Menu.Item>Highest First</Menu.Item>
    <Menu.Item>Lowest First</Menu.Item>
    <Menu.Item>Top 100s</Menu.Item>
  </Menu>
);

const pop_filter = (
  <Menu>
    <Menu.Item>All Time</Menu.Item>
    <Menu.Item>This Year</Menu.Item>
    <Menu.Item>This Month</Menu.Item>
    <Menu.Item>This Week</Menu.Item>
  </Menu>
);

const genre_filter = (
  <Menu>
    <Menu.Item key="action">Action</Menu.Item>
    <Menu.Item key="adventure">Adventure</Menu.Item>
    <Menu.Item key="horror">Horror</Menu.Item>
    <Menu.Item key="racing">Racing</Menu.Item>
    <Menu.Item key="role-playing">Role-Playing</Menu.Item>
    <Menu.Item key="sports">Sports</Menu.Item>
  </Menu>
);

function onChange(a, b, c) {
  console.log(a, b, c);
}

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: []
    };
  }

  search(value) {
    fetch(`http://localhost:9000/igdb/search?title=${value}`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  popular() {
    fetch(`http://localhost:9000/igdb/popular?limit=50`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  genre(value) {
    fetch(`http://localhost:9000/igdb/searchbyGenre?genre=${value}&limit=50`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }
  render() {
    return (
      <BrowserRouter>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          {/* <div style={{ src: "#000", padding: 24, minHeight: 380 }}></div> */}
          <Row>
            <Col span={18}>
              <div>
                <Text>Browse By </Text>
                {/* <Dropdown overlay={pop_filter}> */}
                <Button onClick={() => this.popular()}>
                  popular
                  {/* <Icon type="down" /> */}
                </Button>
                <Dropdown overlay={year_filter}>
                  <Button>
                    year <Icon type="down" />
                  </Button>
                </Dropdown>
                <Dropdown overlay={rating_filter}>
                  <Button>
                    rating
                    <Icon type="down" />
                  </Button>
                </Dropdown>
                {/* </Dropdown> */}
                <Dropdown overlay={genre_filter}>
                  <Button>
                    genre <Icon type="down" />
                  </Button>
                </Dropdown>
              </div>
            </Col>
            <Col span={6}>
              <Search
                placeholder="Search"
                onSearch={value => this.search(value)}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Title>Popular Games This Week</Title>
            <div>
              {this.state.apiResponse.map(elem => {
                return (
                  <div class="image-container">
                    <p align="center" class="name-text">
                      {elem.name}
                    </p>
                    <img class="elem-image" src={"http://" + elem.coverUrl} />
                  </div>
                );
              })}
            </div>
            {/* <Col>
          render games from imgb api db (5 columns for a total of 10 by default), returns json that we can render into components here
          </Col> */}
          </Row>
          <Row>
            <Carousel>
              <div>
                <h3>1</h3>
              </div>
              <div>
                <h3>2</h3>
              </div>
              <div>
                <h3>3</h3>
              </div>
              <div>
                <h3>4</h3>
              </div>
            </Carousel>
            {/* <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col> */}
          </Row>
        </Content>
      </BrowserRouter>
    );
  }
}

export default Games;
