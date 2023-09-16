import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Box,
  Image,
  VStack,
  Heading,
  Text,
  AspectRatio,
  Center,
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Topics from "rpg/data/topics";
import { isProduction } from "env";

export default function InstructionsModal() {
  const [isSmallScreen] = useMediaQuery(
    "(max-height: 600px) or (max-width: 80em)",
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const open = () => {
    PubSub.publish(Topics.giveKeysToDom);
    onOpen();
  };

  const close = () => {
    PubSub.publish(Topics.giveKeysToGame);
    onClose();
  };

  // Open this once when game starts; this modal should only be created once.
  useEffect(() => {
    if (isProduction) {
      PubSub.publish(Topics.giveKeysToDom);
      onOpen();
    }
  }, [onOpen]);

  return (
    <>
      <Box
        as="button"
        width={"100%"}
        backgroundColor={"gray.700"}
        padding={4}
        borderRadius={"25px"}
        transition="transform 0.3s ease-in-out"
        _hover={{ transform: "scale(1.1)", cursor: "pointer" }}
        onClick={open}
      >
        <VStack>
          <Image
            src="/assets/web/instructions.png"
            alt="button image"
            width={"100%"}
          />
          {!isSmallScreen && <Heading size="lg">Info</Heading>}
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={close} isCentered size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody padding={4}>
            <HStack width={"100%"}>
              <AspectRatio width={"50%"} ratio={1} maxWidth={"1100px"}>
                <Center paddingLeft={3} paddingRight={3}>
                  <Image
                    borderRadius="xl"
                    src={"/assets/photos/detective.jpeg"}
                    objectFit={"cover"}
                  ></Image>
                  <Image
                    position="absolute"
                    bottom="0"
                    width="100%"
                    height="15%"
                    borderRadius={"xl"}
                    src="/assets/web/wood_plate.png"
                  ></Image>
                  <Center
                    position="absolute"
                    bottom="0"
                    width="100%"
                    height="15%"
                    borderRadius={"xl"}
                    fontFamily={"cursive"}
                    textColor={"gray.800"}
                    fontSize={"5xl"}
                  >
                    Shock in San Francisco!
                  </Center>
                </Center>
              </AspectRatio>
              <Text fontSize={"xl"} width={"50%"} whiteSpace={"pre-wrap"}>
                You are Detective Samuel O'Connor, called to investigate the
                suspicious death of Elias Harrington, one of the wealthiest men
                in San Francisco. Use your wits and your detective skills to
                find evidence, interrogate suspects, and piece together what
                happened.
                <br />
                <br />
                Controls:
                <br />
                Move with WASD or arrow keys.
                <br />
                [Space] to speak to people when the prompt appears.
                <br />
                [Space] to examine evidence. There will be no indication you are
                near an important piece of evidence. Pay attention!
                <br />
                Tip: use the built-in notes to keep track of alibis and
                cross-reference testimony.
              </Text>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
