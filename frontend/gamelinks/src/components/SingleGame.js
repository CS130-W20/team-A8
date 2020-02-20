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
  Input
} from "antd";
import { BrowserRouter, Link } from "react-router-dom";
import "./SingleGame.css";

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

class SingleGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: {},
      apiScreenshots: {},
      apiAges: {},
      apiDescription: {},
      apiGenre: {},
      apiPlatforms: {},
      coverUrl: ""
    };
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
          apiScreenshots: data.screenshots[0][0], // find a way to loop over all screenshots
          apiAges: data.age_ratings[0][0],
          apiDescription: data.age_ratings[1][0],
          apiGenre: data.genres[0][0], // find a way to loop over all genres so i can put in tags (use var i or something)
          apiPlatforms: data.platforms[0][0]
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
    this.cover();
  }

  render() {
    return (
      <BrowserRouter>
        <Content>
          <Row>
            <Col span={8} alignItems="center">
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
                <br />
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
                <Text>
                  {/* description of movie, change the styling plz  */}
                  {this.state.apiDescription.synopsis}
                </Text>
                <br />
                <Title level={2}>Screencaps</Title>
              </div>
              <br />
              <div class="small-container">
                {/*include screenshots of photos from json, after finding out how to do so with loop*/}
                <img
                  height="125"
                  width="95"
                  src={"http://" + this.state.apiScreenshots}
                />
                <img
                  height="125"
                  width="95"
                  src={"http://" + this.state.apiScreenshots}
                />
                <img
                  height="125"
                  width="95"
                  src={"http://" + this.state.apiScreenshots}
                />
              </div>
            </Col>
            <Col span={8}>
              <div class="container">
                {/* if user is not logged in, show this button and link to the facebook*/}
                <Button>sign in to log, rate, or review</Button>
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
                      {/* format this date its ugly */}
                      {this.state.apiResponse.first_release_date}
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
      </BrowserRouter>
    );
  }
}

export default SingleGame;
