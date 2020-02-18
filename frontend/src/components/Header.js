import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Menu, Input, Icon } from 'antd';

import 'antd/dist/antd.css'

const { Search } = Input;


class Header extends React.Component {
    state = {
        selected: 'people',
    }

    handleClick = event => {
        console.log('clicked ', event);
        this.setState({
            selected: event.key,
        });
    };

    render() {
        const profileImage = this.props.user ? <Icon type='user' /> : <Icon type="user" /> // When we add backend, this should have the profile picture instead.
        return (
            <Router>
                <Menu onClick={this.handleClick} selectedKeys={ [this.state.selected] } mode='horizontal'>
                    <Menu.Item key='people'>
                        <Link to='/people'>
                            people
                        </Link>
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
                    <Search placeholder='search' style={{ width: 200 }} />
                </Menu>
            </Router>
        );
    }
}

export default Header;