import React from "react";
import {
  Card,
  Descriptions,
  Tag,
  Rate,
  Icon,
  Button,
  Row,
  Col,
  Typography,
  Layout,
  Input
} from "antd";
import { BrowserRouter, Link } from "react-router-dom";

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

class SingleGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: {},
      apiScreenshots: {},
      apiDescription: {},
      apiGenre: {},
      coverUrl: ""
    };
  }

  getGame() {
    fetch(`http://localhost:9000/igdb/game?id=11195`)
      .then(res => res.json())
      .then(data =>
        this.setState({
          apiResponse: data,
          apiScreenshots: data.screenshots[0][0],
          apiDescription: data.age_ratings[1][0],
          apiGenre: data.genres[0][0] // find a way to loop over all genres so i can put in tags (use var i or something)
        })
      )
      .catch(err => console.log(`Error is: ${err}`));
  }

  cover() {
    fetch(`http://localhost:9000/igdb/cover?id=11195`)
      //   .then(res => res.json())
      .then(data => this.setState({ coverUrl: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  componentDidMount() {
    this.getGame();
    console.log(this.state.apiResponse.url);
  }

  render() {
    return (
      <BrowserRouter>
        <Content>
          <div>
            <Row>
              <Col span={8} alignItems="center">
                <img src={"http://" + this.state.coverUrl} />
                {/* {this.state.apiResponse.rating} */}
                <br />
                <Rate character={<Icon type="heart" />} count={1} />
                <br />
                <Rate allowHalf disabled defaultValue={4.5} />
                <br />
                <br />
                <br />
                <Card
                  title="Where To Play"
                  //   bordered={false}
                  style={{ width: 300 }}
                >
                  <Link>My Hosts</Link>
                  <br />
                  <Link>More Hosts</Link>
                  {/* link to people page  */}
                </Card>
              </Col>
              <Col span={8}>
                <Title>{this.state.apiResponse.name}</Title>
                <br />
                <Text>
                  {/* description of movie, change the styling plz  */}
                  {this.state.apiDescription.synopsis}
                </Text>
                <br />
                <Tag>{this.state.apiGenre.name}</Tag>
                <Tag>Action</Tag>
                <Tag>Classics</Tag>
              </Col>
              <Col span={8}>
                <div style={{ alignItems: "center" }}>
                  {/* if user is not logged in, show this button and link to the facebook*/}
                  <Button>sign in to log, rate, or review</Button>
                  <Button>share</Button>
                  <Descriptions title="Details">
                    <Descriptions.Item label="platform">
                      {/* render info from idgb or dummy info for now*/}
                    </Descriptions.Item>
                    <Descriptions.Item label="release date">
                      {/* render info from idgb or dummy info for now */}
                    </Descriptions.Item>
                    <Descriptions.Item label="ratings">
                      {/* render info from idgb or dummy info for now*/}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </BrowserRouter>
    );
  }
}

export default SingleGame;
