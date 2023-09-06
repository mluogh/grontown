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
} from "@chakra-ui/react";
import characters from "rpg/data/characters";
import topics from "rpg/data/topics";
import { EastworldClient, GameDef } from "eastworld-client";
import { useEffect, useRef, useState } from "react";

type ChatModalProps = {
  sessionId: string;
  eastworldClient: EastworldClient;
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
    PubSub.publish(topics.leaveChat);
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent maxW="fit-content" maxH={"fit-content"} bg="transparent">
          <ModalBody>
            <Stack
              direction={{ base: "column", xl: "row" }}
              width={"80vw"}
              maxW={"2250px"}
              justifyContent="center"
              alignItems="center"
              gap="50px"
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
                <Card width="100%" height="100%" backgroundColor="#FFFFF0">
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
                              placeholder="Your Input"
                              value={message}
                              onChange={e => setMessage(e.target.value)}
                            />
                          </FormControl>
                          <Button ml={2} flexShrink={0} type="submit">
                            Chat
                          </Button>
                        </Flex>
                      </form>
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

export default ChatModal;
