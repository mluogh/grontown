import { ChakraProvider, Box, theme } from "@chakra-ui/react";

export const App = () => (
  <ChakraProvider theme={theme}>
    <div id="phaser-container"></div>
  </ChakraProvider>
);
