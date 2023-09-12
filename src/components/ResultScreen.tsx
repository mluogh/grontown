import {
  AspectRatio,
  Image,
  Center,
  Heading,
  Text,
  HStack,
  Button,
  VStack,
  Box,
  Spacer,
} from "@chakra-ui/react";
import StorageKeys from "rpg/data/persistence";

export enum GameResult {
  WIN,
  LOSS,
}

export interface ResultScreenProps {
  status: GameResult;
  suspect?: string;
  score?: number;
}

const ResultScreen = (props: ResultScreenProps) => {
  let title, text, imgSrc;
  if (props.status === GameResult.WIN) {
    title = "Got 'em!";
    text = `Justice has been served! After the suspect was apprehended, they 
confessed and we were able to see how close you got to the truth! SFPD gave
you a ${props.score!}/5 when the case was reviewed.`;
    imgSrc = "/assets/web/justice.jpeg";
  } else {
    title = "Travesty!";
    text = `${props.suspect} was sent to the electric chair, but maintained
their innocence throughout the entire ordeal. Something is gnawing at you - 
the real killer is still out there.`;
    imgSrc = "/assets/web/electric_chair.jpeg";
  }

  const newGame = () => {
    for (const key of Object.values(StorageKeys)) {
      localStorage.removeItem(key);
    }
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
          <AspectRatio width={"50%"} maxW={"1024px"} ratio={1 / 1}>
            <Image src={imgSrc}></Image>
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
