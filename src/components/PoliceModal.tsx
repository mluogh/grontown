import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Input,
  FormControl,
  Textarea,
  FormLabel,
  FormErrorMessage,
  Button,
  Stack,
  AspectRatio,
  Center,
  Image,
  Card,
  CardBody,
  Heading,
  Flex,
  Box,
} from "@chakra-ui/react";
import characters from "rpg/data/characters";
import Topics from "rpg/data/topics";
import { EastworldClient } from "eastworld-client";
import { useEffect, useState } from "react";
import story from "rpg/data/story";

type PoliceModalProps = {
  eastworldClient: EastworldClient;
};

const PoliceModal = ({ eastworldClient }: PoliceModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [suspect, setSuspect] = useState("");
  const [suspectValid, setSuspectValid] = useState(false);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    let sanitizedName = suspect.trim();
    sanitizedName = sanitizedName.replace(
      /\w\S*/g,
      word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase(),
    );

    setSuspectValid(sanitizedName in characters);
  }, [suspect]);

  PubSub.subscribe(Topics.enterArrestModal, () => {
    onOpen();
  });

  const close = () => {
    PubSub.publish(Topics.giveKeysToGame);
    onClose();
  };

  const scoreExplanation = async () => {
    const score = await eastworldClient.llm.rate(
      `A player is playing a murder mystery game as a detective.
The actual plot they should discover is as follows:
"${story.explanation}"

This is the player's explanation of what happened:
"${explanation}"

How close is this to the actual plot?
`,
    );
    console.log(score);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="fit-content"
          maxH={"fit-content"}
          boxShadow={"none"}
          bg="transparent"
        >
          <ModalBody>
            <Stack
              direction={{ base: "column", xl: "row" }}
              width={"80vw"}
              maxW={"2250px"}
              justifyContent="center"
              alignItems="center"
              gap={6}
            >
              <AspectRatio
                width={{ base: "80%", xl: "50%" }}
                ratio={1}
                maxWidth={"1100px"}
              >
                <Center paddingLeft={3} paddingRight={3}>
                  <Image
                    borderRadius="xl"
                    src={"/assets/photos/police_chief.jpeg"}
                    objectFit={"cover"}
                    boxShadow={"0px 0px 5px 6px #969696"}
                  ></Image>
                </Center>
              </AspectRatio>
              <AspectRatio
                width={{ base: "80%", xl: "50%" }}
                ratio={1}
                maxWidth={"1100px"}
                boxShadow={"0px 0px 5px 6px #969696"}
                paddingLeft={3}
                paddingRight={3}
                borderRadius={"xl"}
              >
                <Card width={"100%"} height={"100%"}>
                  <CardBody width={"100%"} height={"100%"}>
                    <Flex direction="column" height="100%">
                      <FormControl isInvalid={!suspectValid} marginBottom={6}>
                        <Heading size={"lg"}>Who should we arrest?</Heading>
                        <Input
                          size={"lg"}
                          value={suspect}
                          autoComplete="off"
                          placeholder="Full name of the suspect"
                          onChange={e => setSuspect(e.target.value)}
                        />
                        <FormErrorMessage>Invalid suspect!</FormErrorMessage>
                      </FormControl>
                      <Flex flex="1">
                        <FormControl height="100%">
                          <Heading size={"lg"}>
                            How did it happen and why?
                          </Heading>
                          <Textarea
                            size={"lg"}
                            resize={"none"}
                            height={"80%"}
                            value={explanation}
                            onChange={e => setExplanation(e.target.value)}
                          />
                        </FormControl>
                      </Flex>
                      <Box width="100%">
                        <Button
                          width="100%"
                          colorScheme="red"
                          flexShrink={0}
                          onClick={() => scoreExplanation()}
                          isDisabled={!suspectValid}
                        >
                          Arrest
                        </Button>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
              </AspectRatio>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PoliceModal;
