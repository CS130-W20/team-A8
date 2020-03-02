import React from "react";
import { Avatar, Menu, Input, Typography, Icon, Dropdown } from "antd";
import { Link } from "react-router-dom";

const { Search } = Input;
const { Title } = Typography;

const pmenu = (
  <Menu>
    <Menu.Item>
      <Link to="/people">hosts</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/profile">profile</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/inbox">inbox</Link>
    </Menu.Item>
  </Menu>
);

const header = () => {
  return (
    <>
      <Icon style={{ size: "large", float: "left" }} type="usergroup-add" />
      <Title style={{ float: "left", color: "white" }} level={4}>
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
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
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
    <Search
      placeholder="search"
      onSearch={value => console.log(value)}
      style={{ width: 200 }}
    />
    </>
  );
};

export default header;
