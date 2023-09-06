import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import ChatModal from "./ChatModal";
import { EastworldClient } from "eastworld-client";
import { useEffect, useState } from "react";
import { Game } from "./Game";

// This wrapper mostly exists so the Phaser component in Game.tsx doesn't get re-rendered.
export const GameManager = () => {
  const [sessionId, setSessionId] = useState<string>();
  const eastworldClient = new EastworldClient({
    BASE: "http://localhost:8000",
  });
  useEffect(() => {
    const fetchSession = async () => {
      setSessionId(
        await eastworldClient.gameSessions.createSession(
          "5dcd12ef-7489-4d5e-9ce1-202451fd1c5f",
        ),
      );
    };
    fetchSession();
  }, []);

  return (
    <Box height={"100vh"} width={"100vw"}>
      {!sessionId && (
        <Center>
          <Spinner size={"xl"} />
        </Center>
      )}
      {sessionId && (
        <Box width={"100vw"} height={"100vh"}>
          <HStack width={"100%"} height={"100%"} alignItems={"center"}>
            <Box width={"90%"} maxHeight={"100vh"} height={"100%"}>
              <Center width={"100%"} height={"100vh"}>
                <Game />
              </Center>
            </Box>
            <Flex width={"10%"} height={"100%"} alignItems={"center"}>
              <VStack width={"100%"}>
                <Button width={"100%"}>Notes</Button>
                <Button width={"100%"}>Evidence</Button>
              </VStack>
            </Flex>
          </HStack>
          <ChatModal
            eastworldClient={eastworldClient}
            sessionId={sessionId}
          ></ChatModal>
        </Box>
      )}
    </Box>
  );
};
