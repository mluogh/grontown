import { ChakraProvider, Box, theme } from "@chakra-ui/react";

import Phaser from "phaser";
import scenes from "rpg/scenes";
import { isDevelopment, isProduction } from "rpg/utils";

const game = new Phaser.Game({
  width: 800, // 1024
  height: 600, // 768
  parent: "phaser-container",
  title: "Phaser RPG",
  url: process.env.URL,
  version: process.env.VERSION,
  scene: scenes,
  physics: {
    default: "arcade",
    arcade: {
      debug: isDevelopment,
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

export const App = () => (
  <ChakraProvider theme={theme}>
    <div id="phaser-container"></div>
  </ChakraProvider>
);
