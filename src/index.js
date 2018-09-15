import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Laboratory from "./Laboratory";
import registerServiceWorker from "./registerServiceWorker";
import Playlist from "./App";
// import './scss/main.scss';

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
