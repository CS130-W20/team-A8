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
  Typography
} from "antd";
import { BrowserRouter, withRouter } from "react-router-dom";

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

search(value) {
    fetch(`http://localhost:9000/igdb/game?id=${value}`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

class Game extends Component {
  render() {
    return (
      <BrowserRouter>
        <Content>
          <div>
            <Row>
              <Col span={8} alignContent="center">
              {this.state.apiResponse.data[coverUrl]}
                <br />
                <Rate character={<Icon type="heart" />} count={1} />
                <Rate allowHalf disabled defaultValue={4.5} />
                <Card
                  title="Where To Play"
                  //   bordered={false}
                  style={{ width: 300 }}
                >
                  <Link>My Hosts</Link>
                  <Link>More Hosts</Link>
                  {/* link to people page  */}
                </Card>
              </Col>
              <Col span={8}>
                <Title>
                  movie title
                  <br />
                  <Text>change styling here, description of movie</Text>
                  <Tag>different tags and stuff</Tag>
                  <Tag>movie genre</Tag> <Tag>tags</Tag>
                </Title>
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

export default Game;
