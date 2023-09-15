import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    // pacifico: "Pacifico, handwriting", // Your custom font
    ptserif: "PT Serif, serif",
    cursive: "Pinyon Script, handwriting",
    vt323: "VT323, monospace",
  },

  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
