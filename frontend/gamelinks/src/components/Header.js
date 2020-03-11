import React from "react";
import { Avatar, Menu, Input, Typography, Icon, Dropdown } from "antd";
import { Link, Redirect, BrowserRouter } from "react-router-dom";
import axios from "axios";
import config from "../config.json";
const { Search } = Input;
const { Title } = Typography;

const header = props => {
  console.log(props.user);
  const pmenu = (
    <Menu>
      <Menu.Item>
        <Link to="/people">hosts</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/profile?id=${props.user ? props.user._id : undefined}`}>
          profile
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/inbox">inbox</Link>
      </Menu.Item>
    </Menu>
  );

  const search = name => {
    // this.state.title = `Search by user: "${name}"`;
    fetch(`${config.backend_url}/profile/searchByUser?nickname=${name}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        window.location.pathname = `/profile?id=${data}`;
        // return data;
        // return <Link to={`/profile?id=${data}`}>search by name</Link>;
      })
      .catch(err => console.log(`Error: ${err}`));
  };

  return (
    <div style={{ width: "100%", backgroundColor: "#041527" }}>
      <div style={{ width: "calc(100% - 250px)" }}>
        <Title
          style={{
            float: "left",
            color: "white",
            position: "absolute",
            left: "10px",
            top: "16px"
          }}
          level={4}
        >
          GAMELINKS
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          //   defaultSelectedKeys={["0"]}
          style={{ lineHeight: "64px" }}
          align="right"
        >
          {/* <Menu.Item key="test">
          <Link to="/messages">
            Messages (Test)
          </Link>
        </Menu.Item> */}
          <Menu.Item key="0">
            <Link to="/">
              <Icon type="home" />
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Dropdown overlay={pmenu}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                people
                <Icon type="down" />
              </a>
            </Dropdown>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/games">games</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/lists">lists</Link>
          </Menu.Item>
        </Menu>
      </div>
      <Search
        placeholder="Search" // search by user only for now bc no page in between
        onSearch={
          value => search(value)
          // <Route render={`/profile?id=${search(value)}`}></Route>
        }
        style={{ width: 200, right: "10px", top: "16px", position: "absolute" }}
      ></Search>
    </div>
  );
};

export default header;
