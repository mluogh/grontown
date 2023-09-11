import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Image,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import ChatModal from "./ChatModal";
import EvidenceModal from "./EvidenceModal";
import { EastworldClient } from "eastworld-client";
import { useEffect, useState } from "react";
import { Game } from "./Game";
import NotesModal from "./Notes";
import PoliceModal from "./PoliceModal";
import FoundEvidenceModal from "./FoundEvidenceModal";
import InstructionsModal from "./InstructionsModal";

// This wrapper mostly exists so the Phaser component in Game.tsx doesn't get re-rendered.
export const GameManager = () => {
  const [sessionId, setSessionId] = useState<string>();
  const [notes, setNotes] = useState<string>("");
  const eastworldClient = new EastworldClient({
    BASE:
      process.env.EASTWORLD_API_URL ||
      `${window.location.protocol}//${window.location.hostname}:8000`,
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
          <HStack width={"100%"} height={"100%"} alignItems={"center"} gap={0}>
            <Box width={"90%"} maxHeight={"100vh"} height={"100%"}>
              <Center width={"100%"} height={"100vh"}>
                <Game />
              </Center>
            </Box>
            <Flex
              width={"10%"}
              height={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <VStack width={"90%"} gap={5}>
                <FoundEvidenceModal notes={notes} setNotes={setNotes} />
                <NotesModal notes={notes} setNotes={setNotes} />
                <InstructionsModal />
              </VStack>
            </Flex>
          </HStack>
          <ChatModal
            eastworldClient={eastworldClient}
            sessionId={sessionId}
            notes={notes}
            setNotes={setNotes}
          ></ChatModal>
          <EvidenceModal></EvidenceModal>
          <PoliceModal eastworldClient={eastworldClient} />
        </Box>
      )}
    </Box>
  );
};
