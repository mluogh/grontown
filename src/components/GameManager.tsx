import { Box, Center, Flex, HStack, Spinner, VStack } from "@chakra-ui/react";
import ChatModal from "./ChatModal";
import EvidenceModal from "./EvidenceModal";
import { EastworldClient } from "eastworld-client";
import { useEffect, useState } from "react";
import { Game } from "./Game";
import NotesModal from "./Notes";
import PoliceModal from "./PoliceModal";
import FoundEvidenceModal from "./FoundEvidenceModal";
import InstructionsModal from "./InstructionsModal";
import ResultScreen, { ResultScreenProps } from "./ResultScreen";
import Topics from "rpg/data/topics";
import { getGameState, saveGameState } from "rpg/data/persistence";
import { initGA, logStartGame } from "analytics";

// This wrapper mostly exists so the Phaser component in Game.tsx doesn't get re-rendered.
export const GameManager = () => {
  const [sessionId, setSessionId] = useState<string>();
  const [notes, setNotes] = useState<string>(getGameState().notes);
  const [endResult, setEndResult] = useState<ResultScreenProps>();
  const eastworldClient = new EastworldClient({
    BASE: "/api",
  });

  useEffect(() => {
    const fetchSession = async () => {
      setSessionId(
        await eastworldClient.gameSessions.createSession(
          "5dcd12ef-7489-4d5e-9ce1-202451fd1c5f",
        ),
      );
    };
    initGA();
    logStartGame();
    fetchSession();
  }, []);

  PubSub.subscribe(Topics.endGame, (_channel, endResult) => {
    setEndResult(endResult as ResultScreenProps);
  });

  let debounceTimer: NodeJS.Timeout;
  const setAndPersistNotes = (notes: string) => {
    setNotes(notes);
    getGameState().notes = notes;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      saveGameState();
    }, 300);
  };

  return (
    <Box height={"100vh"} width={"100vw"}>
      {!sessionId && (
        <Center>
          <Spinner size={"xl"} />
        </Center>
      )}
      {endResult && <ResultScreen {...endResult} />}
      {!endResult && sessionId && (
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
                <FoundEvidenceModal
                  notes={notes}
                  setNotes={setAndPersistNotes}
                />
                <NotesModal notes={notes} setNotes={setAndPersistNotes} />
                <InstructionsModal />
              </VStack>
            </Flex>
          </HStack>
          <ChatModal
            eastworldClient={eastworldClient}
            sessionId={sessionId}
            notes={notes}
            setNotes={setAndPersistNotes}
          ></ChatModal>
          <EvidenceModal></EvidenceModal>
          <PoliceModal eastworldClient={eastworldClient} />
        </Box>
      )}
    </Box>
  );
};
