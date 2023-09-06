import { ChakraProvider, theme } from "@chakra-ui/react";
import { GameManager } from "components/GameManager";

export const App = () => (
  <ChakraProvider theme={theme}>
    <GameManager />
  </ChakraProvider>
);
