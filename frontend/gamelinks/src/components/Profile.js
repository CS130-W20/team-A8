import React from 'react';
import {
    Menu,
    Icon,
    Layout,
    Typography,
    Card,
    Carousel,
    Empty,
    Avatar
} from 'antd';
import { Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import queryString from 'query-string';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import './Profile.css';
import config from '../config.json';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.nextHosting = this.nextHosting.bind(this);
        this.prevHosting = this.prevHosting.bind(this);
        this.nextFavorites = this.nextFavorites.bind(this);
        this.prevFavorites = this.prevFavorites.bind(this);
        this.onDrop = this.onDrop.bind(this);
        const values = queryString.parse(props.location.search);
        this.state.userId = values.id;
        this.carouselHosting = React.createRef();
        this.carouselFavorites = React.createRef();
    }

    state = {
        userId: null,
        currMenu: 'profile',
    };

    componentDidMount() {
        this.getUserInfo()
            .then((userInfo) => {
                this.setState({ userInfo: userInfo.data });
            })
            .then(() => {
                //this.getGameList('hosting');  // TEST CHANGE
                this.getGameList('testing');    // TEST CHANGE
            })
            .then(() => {
                //this.getGameList('favorites');// TEST CHANGE
            })
            .catch((err) => {
                console.log(err)
            });
    }

    async onDrop(picture) {
        await axios({
            url: `${config.backend_url}/profile/getProfileUserInformation?id=${this.state.userId}&private=false`
        })
    }

    nextHosting() {
        this.carouselHosting.next();
    }

    prevHosting() {
        this.carouselHosting.prev();
    }

    nextFavorites() {
        this.carouselFavorites.next();
    }

    prevFavorites() {
        this.carouselFavorites.prev();
    }

    getUserInfo() {
        return axios({ 
                url: `${config.backend_url}/profile/getProfileUserInformation?id=${this.state.userId}&private=false`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
    }

    handleMenuClick = event => {
        this.setState({ currMenu: event.key });
    }

    onUsernameEdit = async (username) => {
        const userInfo = { ...this.state.userInfo, username }
        this.setState({ userInfo });
        await axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo);
    }

    onBioEdit = async (bio) => {
        const userInfo = { ...this.state.userInfo, bio }
        this.setState({ userInfo });
        await axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo);
    }

    getGameList = async (type) => {
        if (!this.state.userInfo) {   // TEST:  if (!this.state.userInfo || !this.state.userInfo[type])
            return <Empty />;
        }
        // BEGIN TEST
        if (type == 'testing') {
            const games_list = [
                { data: { id: 123, name: 'dog dog dog dog dog dog dog dog' } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 123 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 123 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 123 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 123 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 123 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
            ]
            this.setState({ 'testing' : games_list })
            return;
        }
        // END TEST
        const idList = this.state.userInfo[type];
        console.log(idList);
        const InfoPromises = [];
        for (let i = 0; i < idList.length; i += 1) {
            const gameReq = axios.get(`${config.backend_url}/igdb/game?id=${idList[i]}`);
            const coverReq = axios.get(`${config.backend_url}/igdb/cover?id=${idList[i]}`);
            InfoPromises.push(gameReq, coverReq);
        }
        const gameInfo = await Promise.all(InfoPromises);
        console.log(gameInfo);
        type === 'hosting' ? this.setState({ 'hosting': gameInfo }) : this.setState({ 'favorites': gameInfo });
    }

    render() {
        let createCards = (gameInfo) => {
            console.log('creatingCards')
            console.log(gameInfo)
            if (!gameInfo) return;
            const cards = [];
            for (let i = 0; i < gameInfo.length; i += 2) {
                cards.push(
                    <div className="card">
                        <Link to={`/singlegame/?id=${gameInfo[i].data.id}`}>
                            <img src={"http://" + gameInfo[i+1].data} />
                        </Link>
                        <div className="name-text-box">
                            <Paragraph ellipsis={{ rows: 1, expandable: false }} className="name-text">{gameInfo[i].data.name}</Paragraph>
                        </div>
                    </div>
                )
            }
            return cards;
        }
        const hostingCards = createCards(this.state.testing) || [];      // TEST
        const favoritesCards = createCards(this.state.testing) || [];    // TEST
        // TEST: const hostingCards = createCards(this.state.hosting) || [];
        // TEST: const favoritesCards = createCards(this.state.favorites) || [];
        const props = {
            dots: true,
            speed: 500,
            circular: false,
            slidesToScroll: 4
        };
        return (
            <div id='main'>
                <div className='user_info'>
                    { this.state.userInfo && this.state.userInfo.profilePicture && 
                        <div>
                            <img className='profile_image' src={ this.state.userInfo.profilePicture } />
                        </div>
                        }
                    { !this.state.userInfo && <Icon style={{ fontSize: '150px' }} type="user" />}
                    <div id='name_and_loc'>
                        <div id='name'>
                            { this.state.userInfo && this.state.userInfo.username && 
                                <Title editable={{ onChange: this.onUsernameEdit }}>{ this.state.userInfo.username }</Title>
                            }
                        </div>
                        <div id='loc'>
                            
                        </div>
                    </div>
                </div>
                <hr />
                <div id='hosting'>
                    <Title level={2}>Games Hosting</Title>
                    <hr />
                    <div className='games_list'>
                        <div className='games_list_children'>
                            <Icon type='left-circle' onClick={ this.prevHosting } />
                            <div className='games_list_carousel'>
                                <Carousel ref={ node => (this.carouselHosting = node) } { ...props } slidesToShow={ Math.min(4, hostingCards.length) } >
                                    { hostingCards }
                                </Carousel>
                            </div>
                            <Icon type='right-circle' onClick={ this.nextHosting } /> 
                        </div>
                    </div>
                    <Title level={2}>Favorites</Title>
                    <hr />
                    <div className='games_list'>
                        <div className='games_list_children'>
                            <Icon type='left-circle' onClick={ this.prevFavorites } />
                            <div className='games_list_carousel'>
                                <Carousel ref={ node => (this.carouselFavorites = node) } { ...props } slidesToShow={ Math.min(4, favoritesCards.length) } >
                                    { favoritesCards }
                                </Carousel>
                            </div>
                            <Icon type='right-circle' onClick={ this.nextFavorites } /> 
                        </div>
                    </div>
                </div>
                <div id='bio'>
                    <div id='bio_title'>
                        <Title level={3}>bio</Title>
                    </div>
                    <div id='bio_info'>
                        { this.state.userInfo && this.state.userInfo.bio && 
                            <Paragraph ellipsis={{ rows: 5, expandable: true }} editable={{ onChange: this.onBioEdit }}>{ this.state.userInfo.bio }</Paragraph>
                        }
                    </div>
                    <Link to={ `/messages?id=${ this.state.userId }` }><Title level={3}><Icon type="mail" /> Message this host</Title></Link>
                </div>
            </div>
        );
    }
}

export default Profile;

