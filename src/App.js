import React, { Component } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import _, { shuffle, orderBy } from "lodash";
import FlipMove from "react-flip-move";
import * as firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCbCpRYv0fJKYg-_ynyczy2MokyAWJG4eo",
  authDomain: "line-hack-2018-f9785.firebaseapp.com",
  databaseURL: "https://line-hack-2018-f9785.firebaseio.com",
  projectId: "line-hack-2018-f9785",
  storageBucket: "line-hack-2018-f9785.appspot.com",
  messagingSenderId: "658110891512"
};
let userId = null;
let userName = null;
firebase.initializeApp(config);
const liff = window.liff;

class App extends Component {
  render() {
    return <Playlist />;
  }
}

class NowPlaying extends Component {
  render() {
    console.log(this.props);
    if (this.props.song){
      return <li className="list now-playing">
        <div className="titleSongNameRow">️🎙{this.props.song.name.substring(0,50)}</div>
        <div className="titleScoreRow">{this.props.song.score}</div>
        <button className="voteButton" onClick={()=>this.props.up(this.props.song.songId)}>👍</button>
        <button className="voteButton" onClick={()=>this.props.down(this.props.song.songId)}>👎</button>
        </li>;
    }
    return <li className="list now-playing">Waiting for song...</li>;
  }
}

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      user:{
        userId: "",
        userName: "Anonymous",
        credit: 0
      },
      now_playing: null,
      credit: 0
    };
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
    this.up_now_playing = this.up_now_playing.bind(this);
    this.down_now_playing = this.down_now_playing.bind(this);
  }

  addTransction(userId, songId, action) {
    console.log("userId", userId);
    console.log("songId", songId);
    console.log("action", action);

    return firebase.database().ref('transactions').push({
      userId,
      action,
      songId,
      timestamp: new Date().getTime()
    });
  }

  componentDidMount(){
    console.log("cdm");
    let that = this;
    liff.init(function (data) {
      userId = data.context.userId;
      // window.alert("userId="+userId);
      // userId = 'U706f2d264bc26d061c24b79742d84cf1';
      // userName = 'Kobkrit';

      liff.getProfile()
      .then(function(profile){
        userName = profile.displayName
        // window.alert("userName="+userName);
        firebase.database().ref('users/'+userId).once('value', function (snapshot) {
          let val = snapshot.val();
          // window.alert("val="+val);
          if (!val){ //For the new (non-existed) users.
            firebase.database().ref('users/'+userId).set({
              userName: userName,
              userId: userId,
              timestamp: new Date().getTime(),
              credit: 10
            });
          }
          firebase.database().ref('users/'+userId).on('value', function (snapshot) {
            console.log("userId");
            that.setState({user: snapshot.val()});
          });
        });
        console.log("Liff username successfully", userName);
      })
      .catch((err) => {
        window.alert('error', err);
        // console.log('error', err);
      });
    });
    firebase.database().ref('chart/playlist').orderByChild('score').on('value', function (snapshot) {
      this.setState({items: orderBy(_.values(snapshot.val()), ["score"], ["desc"])});
    }.bind(this));
    firebase.database().ref('chart/now_playing').on('value', function (snapshot) {
      this.setState({now_playing: snapshot.val()});
    }.bind(this));
  }

  shuffle = event => {
    event.preventDefault();
    this.setState({
      items: shuffle(this.state.items)
    });
  };

  sort = event => {
    event.preventDefault();
    this.setState({
      items: orderBy(this.state.items, ["vote"], ["desc"])
    });
  };

  up(id){
    console.log("Up", id);
    this.addTransction(userId, id, 'upvote');
  }
  down(id){
    console.log("Down", id);
    this.addTransction(userId, id, 'downvote');
  }

  up_now_playing(id){
    console.log("Up Now Playing", id);
    this.addTransction(userId, id, 'upvote-now-playing');
  }

  down_now_playing(id){
    console.log("Down Now Playing", id);
    this.addTransction(userId, id, 'downvote-now-playing');
  }

  renderItems() {
    console.log(this.state.items);
    return this.state.items.map(item => (
      <li className="list" key={item.songId}>
        <div className="songNameRow">{item.name.substring(0,50)}</div>
        <div className="scoreRow">{item.score}</div>
        <div className="voteRow"><button className="voteButton" onClick={()=>this.up(item.songId)}>👍</button><button className="voteButton" onClick={()=>this.down(item.songId)}>👎</button></div>
      </li>
    ));
  }

  // addCat = event => {
  //   console.log("Add cat");
  //   event.preventDefault();
  //   this.setState({
  //     items: [
  //       ...this.state.items,
  //       {
  //         id: Math.random(),
  //         name: "Snoopy",
  //         origin: "China",
  //         breed: "Exotic Shorthair",
  //         img: "https://s3.amazonaws.com/githubdocs/cats_5_snoopy.jpg",
  //         catchphrase: "Not to be Confused with the Dog",
  //         style: "list"
  //       }
  //     ]
  //   });
  // };

  render() {
    return (
      <div className="container">
        <span className="name-header">Hello, {this.state.user.userName}</span>
        <div className="jukebox-padding">
          <FlipMove
            staggerDurationBy="30"
            duration={500}
            typeName="ul"
            className="no-padding"
          >
            <span className="name-header">You have {this.state.user.credit} credits</span>
            <NowPlaying song={this.state.now_playing} up={this.up_now_playing} down={this.down_now_playing} />
            {this.renderItems()}
          </FlipMove>
        </div>
        {/* <button onClick={this.shuffle}>Submit</button>
        <button onClick={this.sort}>Sort</button> */}
      </div>
    );
  }
}

export default Playlist;
