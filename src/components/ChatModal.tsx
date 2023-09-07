import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AspectRatio,
  Box,
  Image,
  Center,
  Flex,
  Text,
  Stack,
  Card,
  CardBody,
  useColorMode,
  VStack,
  Heading,
  Input,
  FormControl,
  Textarea,
} from "@chakra-ui/react";
import characters from "rpg/data/characters";
import topics from "rpg/data/topics";
import { EastworldClient, GameDef } from "eastworld-client";
import { useEffect, useRef, useState } from "react";

type ChatModalProps = {
  sessionId: string;
  eastworldClient: EastworldClient;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
};

const ChatModal = (props: ChatModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agentName, setAgentName] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [message, setMessage] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messageHistory]);

  // const inspectorDef = props.eastworldGame.agents?.find(
  //   e => e.uuid === "2fa1bb81-30cd-4844-924b-42d40768c3ee",
  // )!;
  useEffect(() => {
    if (!agentName) return;
    props.eastworldClient.gameSessions.startChat(
      props.sessionId,
      agentName,
      {
        conversation: {},
        history: [],
      },
      // props.agent_uuid!,
      // {
      //   conversation: {
      //     correspondent: inspectorDef,
      //   },
      //   history: [],
      // },
    );
  }, [agentName]);

  const chat = async (message: string) => {
    setMessageHistory(messages => [...messages, `You: ${message}`]);
    setMessage("");
    const response = await props.eastworldClient.gameSessions.chat(
      props.sessionId,
      agentName,
      message,
    );
    setMessageHistory(messages => [
      ...messages,
      `${agentName}: ${response.message.content}`,
    ]);
  };

  PubSub.subscribe(topics.enterChat, (channel, message: string) => {
    setAgentName(message);
    setPhotoPath(characters[message as keyof typeof characters].photo);
    onOpen();
  });

  const close = () => {
    PubSub.publish(topics.giveKeysToGame);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="fit-content"
          maxH={"fit-content"}
          bg="transparent"
          boxShadow={"none"}
        >
          <ModalBody>
            <VStack>
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
                      src={photoPath}
                      objectFit={"cover"}
                      boxShadow={"0px 0px 5px 6px #969696"}
                    ></Image>
                  </Center>
                </AspectRatio>
                <AspectRatio
                  width={{ base: "80%", xl: "50%" }}
                  ratio={1}
                  maxWidth={"1100px"}
                  paddingLeft={3}
                  paddingRight={3}
                  borderRadius="xl"
                  boxShadow={"0px 0px 5px 6px #969696"}
                >
                  <Card
                    width="100%"
                    height="100%"
                    backgroundColor="#FFFFF0"
                    textColor={"#000000"}
                  >
                    <CardBody width="100%" height="100%">
                      <Flex direction="column" h="full">
                        <Box
                          ref={boxRef}
                          flexGrow={1}
                          fontFamily={"ptserif"}
                          overflow={"auto"}
                          fontSize={"xl"}
                        >
                          {messageHistory.map((message, index) => (
                            <Text key={index}>{message}</Text>
                          ))}
                        </Box>
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            chat(message);
                          }}
                        >
                          <Flex width="100%">
                            <FormControl flex="1">
                              <Input
                                borderColor={"black"}
                                placeholder="Your Input"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                              />
                            </FormControl>
                            <Button
                              ml={2}
                              flexShrink={0}
                              colorScheme="orange"
                              type="submit"
                            >
                              Chat
                            </Button>
                          </Flex>
                        </form>
                      </Flex>
                    </CardBody>
                  </Card>
                </AspectRatio>
              </Stack>
              <Card
                width={"80vw"}
                maxW={"2250px"}
                height={"20%"}
                backgroundColor="#FFFFF0"
                textColor={"#000000"}
                // paddingLeft={3}
                // paddingRight={3}
                borderRadius="xl"
                boxShadow={"0px 0px 5px 6px #969696"}
              >
                <CardBody width="100%" height="100%">
                  <Textarea
                    rows={10}
                    placeholder="Write down notes to solve the mystery!"
                    value={props.notes}
                    onChange={e => props.setNotes(e.target.value)}
                  ></Textarea>
                </CardBody>
              </Card>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatModal;
