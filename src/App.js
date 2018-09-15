import React, { Component } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { shuffle, orderBy } from "lodash";
import FlipMove from "react-flip-move";

const songs = [
  {
    id: "a",
    name: "ถังน้ำแข็ง",
    vote: 1
  },
  {
    id: "b",
    name: "พ่อกูเป็นสุลต่าน",
    vote: 3
  },
  {
    id: "c",
    name: "วิชาตัวเบา",
    vote: 2
  },
  {
    id: "d",
    name: "KODOMO",
    vote: 1
  },
  {
    id: "e",
    name: "เกรงใจ",
    vote: 2
  }
];

class App extends Component {
  render() {
    return <Playlist />;
  }
}

class NowPlaying extends Component {
  render() {
    return <li className="list now-playing">{this.props.songName}</li>;
  }
}

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: songs
    };
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

  renderItems() {
    return this.state.items.map(item => (
      <li className="list" key={item.id}>
        <div>{item.name}</div>
        <div>{item.vote}</div>
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
            <NowPlaying songName="joke" />
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
