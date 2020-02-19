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

function onChange(a, b, c) {
  console.log(a, b, c);
}

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" }; // from games imgb api
  }

  callAPI() {
    fetch("http://localhost:9000/") // change this link
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);
  }

  componentDidMount() {
    this.callAPI();
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

// const Games = () => {
//   return (
//     <BrowserRouter>
//       <Content style={{ padding: "0 50px", marginTop: 64 }}>
//         {/* <div style={{ src: "#000", padding: 24, minHeight: 380 }}></div> */}
//         <Row>
//           <Col span={18}>
//             <div>
//               <Text>Browse By </Text>
//               <Dropdown overlay={year_filter}>
//                 <Button>
//                   year <Icon type="down" />
//                 </Button>
//               </Dropdown>
//               <Dropdown overlay={rating_filter}>
//                 <Button>
//                   rating
//                   <Icon type="down" />
//                 </Button>
//               </Dropdown>
//               <Dropdown overlay={pop_filter}>
//                 <Button>
//                   popular
//                   <Icon type="down" />
//                 </Button>
//               </Dropdown>
//               <Dropdown overlay={genre_filter}>
//                 <Button>
//                   genre <Icon type="down" />
//                 </Button>
//               </Dropdown>
//             </div>
//           </Col>
//           <Col span={6}>
//             <Search
//               placeholder="Search"
//               enterButton="Find By Film"
//               onSearch={value => console.log(value)}
//             />
//           </Col>
//         </Row>
//         <br></br>
//         <Row>
//           <Title>Popular Games This Week</Title>
//           {/* <Col>
//           render games from imgb api db (5 columns for a total of 10 by default), returns json that we can render into components here
//           </Col> */}
//         </Row>
//         <Row>
//           <Carousel>
//             <div>
//               <h3>1</h3>
//             </div>
//             <div>
//               <h3>2</h3>
//             </div>
//             <div>
//               <h3>3</h3>
//             </div>
//             <div>
//               <h3>4</h3>
//             </div>
//           </Carousel>
//           {/* <Col span={6}>col-6</Col>
//             <Col span={6}>col-6</Col>
//             <Col span={6}>col-6</Col>
//             <Col span={6}>col-6</Col> */}
//         </Row>
//       </Content>
//     </BrowserRouter>
//   );
// };

// export default withRouter(Games);