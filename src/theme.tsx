import { extendTheme } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/styled-system";
// const breakpoints = {
//   sm: "360px",
//   md: "768px",
//   lg: "1200px",
//   // xl: "1200px",
// };

const theme = extendTheme({
  fonts: {
    // pacifico: "Pacifico, handwriting", // Your custom font
    ptserif: "PT Serif, serif",
  },
  // styles: {
  //   global: (props: StyleFunctionProps) => ({
  //     body: {
  //       backgroundImage:
  //         props.colorMode === "light" ? "url('/test/oldpaper2.jpg')" : "none",
  //       backgroundHeight: "100%",
  //       backgroundRepeat: "repeat",
  //       backgroundPosition: "center",
  //     },
  //   }),
  // },

  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
