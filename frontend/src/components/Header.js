import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Typography, Menu, Input, Icon, Dropdown } from 'antd';

import 'antd/dist/antd.css'

const { Search } = Input;

const pmenu = (
    <Menu>
      <Menu.Item>
        <Link to="/hosts">hosts</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/people">friends</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/profile">profile</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/messages">inbox</Link>
      </Menu.Item>
    </Menu>
  );

class Header extends React.Component {
    state = {
        selected: 'people',
    }

    handleClick = async event => {
        console.log('clicked ', event);
        this.setState({
            selected: event.key,
        });
    };

    render() {
        const profileImage = this.props.user ? <Icon type='user' /> : <Icon type="user" /> // When we add backend, this should have the profile picture instead.
        return (
            <Router>
                <Menu 
                    align='right' 
                    theme='dark'
                    style={{ lineHeight: '64px' }}
                    onClick={this.handleClick} 
                    selectedKeys={ [this.state.selected] } 
                    mode='horizontal'>
                    <Typography style={{ float: 'left', color: 'white' }} level={1}>
                        GAMELINKS
                    </Typography>
                    <Menu.Item key='home'>
                        <Link to='/'>
                            <Icon type='home' />
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='people'>
                        <Dropdown overlay={pmenu}>
                            <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                people
                                <Icon type='down' />
                            </a>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item key='games'>
                        <Link to='/games'>
                            games
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='lists'>
                        <Link to='/lists'>
                            lists
                        </Link>
                    </Menu.Item>
                    { profileImage }
                    <Search placeholder='search' onSearch={value => console.log(value)} style={{ width: 200 }} />
                </Menu>
            </Router>
        );
    }
}

export default Header;