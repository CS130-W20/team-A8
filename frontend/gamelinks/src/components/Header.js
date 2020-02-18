import React from "react";
import { Menu, Input, Typography, Icon } from "antd";
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;

const header = () => {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["0"]}
      style={{ lineHeight: "64px" }}
      align="right"
    >
      <Icon style={{ float: "left" }} type="usergroup-add" />
      <Title style={{ float: "left", color: "white" }} level={4}>
        GAMELINKS
      </Title>
      <Menu.Item key="test">
        <Link to="/messages">
          Messages (Test)
        </Link>
      </Menu.Item>
      <Menu.Item key="0">
        <Link to="/">
          <Icon type="home" />
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/people">
          people
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/games">
          games
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/lists">
          lists
        </Link>
      </Menu.Item>
      <Search placeholder='search' onSearch={value => console.log(value)} style={{ width: 200 }} />
    </Menu>
  );
};

export default header;
