import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import Playlist from "./App";
// import './scss/main.scss';

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
