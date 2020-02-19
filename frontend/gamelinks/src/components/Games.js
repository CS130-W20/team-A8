import React from "react";
import {
  Menu,
  Icon,
  Input,
  Dropdown,
  Row,
  Col,
  Typography,
  Layout,
  Button
} from "antd";
import { BrowserRouter, withRouter } from "react-router-dom";

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
    <Menu.Item>Action</Menu.Item>
    <Menu.Item>Adventure</Menu.Item>
    <Menu.Item>Horror</Menu.Item>
    <Menu.Item>Racing</Menu.Item>
    <Menu.Item>Role-Playing</Menu.Item>
    <Menu.Item>Sports</Menu.Item>
  </Menu>
);

const Games = () => {
  return (
    <BrowserRouter>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        {/* <div style={{ src: "#000", padding: 24, minHeight: 380 }}></div> */}
        <Row>
          <Col span={18}>
            <div>
              <Text>Browse By </Text>
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
              <Dropdown overlay={pop_filter}>
                <Button>
                  popular
                  <Icon type="down" />
                </Button>
              </Dropdown>
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
              enterButton="Find By Film"
              onSearch={value => console.log(value)}
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Title>Popular Games This Week</Title>
          <Row>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
          </Row>
          {/* <Col>
          render games from imgb api db (5 columns for a total of 10 by default), returns json that we can render into components here
          </Col> */}
        </Row>
      </Content>
    </BrowserRouter>
  );
};

export default withRouter(Games);
