import { AspectRatio, Box, HStack } from "@chakra-ui/react";
import ChatModal from "./ChatModal";
import { EastworldClient } from "eastworld-client";
import { useEffect, useState } from "react";
import Phaser from "phaser";
import scenes from "rpg/scenes";
import { isDevelopment, isProduction } from "rpg/utils";

export const Game = () => {
  console.log("Game rendered");
  useEffect(() => {
    const game = new Phaser.Game({
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

    return () => {
      // Destroy the game instance when the component is unmounted
      game.destroy(true);
    };
  }, []);

  return (
    // <AspectRatio ratio={4 / 3} width={"100%"} maxH={"100%"}>
    <div id="phaser-container" style={{ width: "100%", height: "100%" }}></div>
    // </AspectRatio>
  );
};
