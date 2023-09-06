import { ChakraProvider } from "@chakra-ui/react";
import { GameManager } from "components/GameManager";
import theme from "theme";

export const App = () => (
  <ChakraProvider theme={theme}>
    <GameManager />
  </ChakraProvider>
);
