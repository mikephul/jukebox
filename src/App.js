import React, { Component } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import _, { shuffle, orderBy } from "lodash";
import FlipMove from "react-flip-move";
import * as firebase from "firebase";
import jQuery from 'jquery'

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

jQuery(window).on('load', function(){
  console.log("Windows onLoad");
  liff.init(function (data) {
    userId = data.context.userId;
    console.log("Liff init successfully", userId);
    liff.getProfile()
      .then(profile => {
        userName = profile.displayName
        console.log("Liff username successfully", userName);
      })
      .catch((err) => {
        console.log('error', err);
    });
  });
});


class App extends Component {
  render() {
    return <Playlist />;
  }
}

class NowPlaying extends Component {
  render() {
    console.log(this.props);
    if (this.props.song){
      return <li className="list now-playing">{this.props.song.name}</li>;
    }
    return <li className="list now-playing">Waiting for song...</li>;
  }
}

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      now_playing: null
    };
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
    firebase.database().ref('chart2/playlist').orderByChild('score').on('value', function (snapshot) {
      this.setState({items: _.values(snapshot.val())});
    }.bind(this));
    firebase.database().ref('chart2/now_playing').on('value', function (snapshot) {
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
    this.addTransction('mike', id, 'upvote');
  }

  down(id){
    console.log("Down", id);
    this.addTransction('mike', id, 'downvote');
  }

  renderItems() {
    console.log(this.state.items);
    return this.state.items.map(item => (
      <li className="list" key={item.songId}>
        <div>[{item.score}]</div>
        <div>{item.name}</div>
        <div><button onClick={()=>this.up(item.songId)}>^</button></div>
        <div><button onClick={()=>this.down(item.songId)}>v</button></div>
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
        <div className="jukebox-padding">
          <FlipMove
            staggerDurationBy="30"
            duration={500}
            typeName="ul"
            className="no-padding"
          >
            <NowPlaying song={this.state.now_playing} />
            {this.renderItems()}
          </FlipMove>
        </div>
        <button onClick={this.shuffle}>Submit</button>
        <button onClick={this.sort}>Sort</button>
      </div>
    );
  }
}

export default Playlist;
