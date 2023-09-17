import {
  AspectRatio,
  Center,
  Heading,
  Text,
  HStack,
  Button,
  VStack,
  Box,
  Spacer,
} from "@chakra-ui/react";
import {
  getGameState,
  resetGameState,
  saveGameState,
} from "rpg/data/persistence";
import CroppedImage from "./util/CroppedImage";

export enum GameResult {
  WIN,
  LOSS,
  DEAD,
}

export interface ResultScreenProps {
  status: GameResult;
  suspect?: string;
  score?: number;
}

const ResultScreen = (props: ResultScreenProps) => {
  let title, text, imgSrc;
  switch (props.status) {
    case GameResult.WIN:
      title = "Got 'em!";
      text = `Justice has been served! After the suspect was apprehended, they 
  confessed and we were able to see how close you got to the truth! SFPD gave
  you a ${props.score!}/5 when the case was reviewed.`;
      imgSrc = "/assets/web/justice.jpeg";
      break;
    case GameResult.DEAD:
      title = "Beaten Senseless!";
      text = `William Harrington, with his gentlemanly sensibilities, was 
deeply offended by your conduct. He gave you the beating of your life. Of
course, he got off scot-free. He will no longer speak to you.`;
      imgSrc = "/assets/web/hospital.jpeg";
      // TODO: fix hardcode string
      getGameState().nonInteractableNpcs.add("William Harrington");
      saveGameState();
      break;
    case GameResult.LOSS:
      title = "Travesty!";
      text = `${props.suspect} was sent to the electric chair, but maintained
  their innocence throughout the entire ordeal. Something is gnawing at you - 
  the real killer is still out there!`;
      imgSrc = "/assets/web/electric_chair.jpeg";
      getGameState().goneNpcs.add(props.suspect!);
      saveGameState();
      break;
  }

  const newGame = () => {
    resetGameState();
    window.location.reload();
  };

  const continueGame = () => {
    window.location.reload();
  };

  return (
    <Box width={"100vw"} height={"100vh"}>
      <Center width={"100%"} height={"100%"}>
        <VStack gap={15}>
          <Heading size={"4xl"}>{title}</Heading>
          <AspectRatio width={"60vh"} maxW={"1024px"} ratio={1 / 1}>
            <CroppedImage imgSrc={imgSrc}></CroppedImage>
          </AspectRatio>
          <Text width={"50%"} fontSize={"xl"}>
            {text}
          </Text>
          {props.status === GameResult.WIN && (
            <HStack>
              <Button colorScheme="green" onClick={newGame}>
                New Game
              </Button>
            </HStack>
          )}
          {props.status === GameResult.DEAD && (
            <HStack>
              <Button colorScheme="red" onClick={newGame}>
                New Game
              </Button>
              <Spacer width={"30%"} />
              <Button colorScheme="teal" onClick={continueGame}>
                Leave the Hospital and Continue
              </Button>
            </HStack>
          )}
          {props.status === GameResult.LOSS && (
            <HStack>
              <Button colorScheme="red" onClick={newGame}>
                New Game
              </Button>
              <Spacer width={"30%"} />
              <Button colorScheme="teal" onClick={continueGame}>
                Continue the Investigation
              </Button>
            </HStack>
          )}
        </VStack>
      </Center>
    </Box>
  );
};

export default ResultScreen;
