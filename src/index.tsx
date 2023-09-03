import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import Phaser from "phaser";
import scenes from "rpg/scenes";
import { isDevelopment, isProduction } from "rpg/utils";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

new Phaser.Game({
  width: 1024, // 1024
  height: 768, // 768
  parent: "phaser-container",
  title: "Phaser RPG",
  url: process.env.URL,
  version: process.env.VERSION,
  scene: scenes,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  disableContextMenu: isProduction,
  backgroundColor: "#000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
