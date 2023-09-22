import { useEffect, useRef } from "react";
import Phaser from "phaser";
import scenes from "rpg/scenes";
import { isDevelopment, isProduction } from "env";
import { Box } from "@chakra-ui/react";

export const Game = () => {
  const phaserContainer = useRef<HTMLDivElement>(null);
  const calculateWidth = (): number => {
    const containerHeight = phaserContainer.current!.clientHeight;
    const containerWidth = phaserContainer.current!.clientWidth;
    // Scale the game such that the aspect ratio is the same as the container,
    // and then depend on Phaser.Scale.FIT to scale the game to fit the container.
    return containerWidth / (containerHeight / 768);
  };

  useEffect(() => {
    const game = new Phaser.Game({
      width: calculateWidth(),
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

    const handleResize = () => {
      game.scale.setGameSize(calculateWidth(), 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Destroy the game instance when the component is unmounted
      game.destroy(true);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      ref={phaserContainer}
      id="phaser-container"
      style={{ width: "100%", height: "100%" }}
    ></Box>
  );
};
