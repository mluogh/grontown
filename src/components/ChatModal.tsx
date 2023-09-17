import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
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
  VStack,
  Input,
  FormControl,
  Textarea,
} from "@chakra-ui/react";
import characters from "rpg/data/characters";
import Topics from "rpg/data/topics";
import { EastworldClient, Message } from "eastworld-client";
import { useEffect, useRef, useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

type ChatModalProps = {
  sessionId: string;
  eastworldClient: EastworldClient;
  notes: string;
  setNotes: (notes: string) => void;
};

const ChatModal = (props: ChatModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agentName, setAgentName] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [message, setMessage] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messageHistory]);

  useEffect(() => {
    if (!agentName) return;
    setMessageHistory([]);
    props.eastworldClient.gameSessions.startChat(
      props.sessionId,
      agentName,
      characters.detective.eastworldId!,
      { history: [], conversation: {} },
    );
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentName]);

  const chat = async (message: string) => {
    setMessageHistory(messages => [
      ...messages,
      { role: Message.role.USER, content: message },
    ]);
    setMessage("");
    let interact;
    try {
      interact = await props.eastworldClient.gameSessions.interact(
        props.sessionId,
        agentName,
        message,
      );
    } catch (e) {
      return;
    }
    const response = interact.response;
    if ("content" in response) {
      setMessageHistory(messages => [...messages, response]);
    } else {
      close();
      PubSub.publish(Topics.action, {
        character: agentName,
        action: response.action,
      });
    }
  };

  PubSub.subscribe(Topics.enterChat, (_channel, message: string) => {
    setAgentName(message);
    setPhotoPath(characters[message as keyof typeof characters].photo);
    onOpen();
  });

  const close = () => {
    PubSub.publish(Topics.giveKeysToGame);
    onClose();
  };
  // We want the transparent part of the modal to close on click
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
          onClick={close}
        >
          <ModalBody>
            <VStack>
              <Stack
                direction={{ base: "column", xl: "row" }}
                width={"80vw"}
                maxW={"1500px"}
                justifyContent="center"
                alignItems="center"
                gap={6}
              >
                <AspectRatio
                  width={{ base: "80%", xl: "50%" }}
                  ratio={1}
                  maxWidth={"1100px"}
                  onClick={handleCardClick}
                >
                  <Center paddingLeft={3} paddingRight={3}>
                    <Image
                      borderRadius="xl"
                      src={photoPath}
                      objectFit={"cover"}
                      boxShadow={"0px 0px 5px 6px #969696"}
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
                      {agentName}
                    </Center>
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
                  onClick={handleCardClick}
                >
                  <Card width="100%" height="100%" fontFamily={"ptserif"}>
                    <CardBody width="100%" height="100%">
                      <Flex direction="column" h="full">
                        <Box
                          ref={boxRef}
                          flexGrow={1}
                          overflow={"auto"}
                          fontSize={"xl"}
                          marginBottom={2}
                        >
                          {messageHistory.map((message, index) => (
                            <Box
                              key={index}
                              borderRadius={"xl"}
                              paddingTop={1}
                              paddingBottom={1}
                              paddingLeft={3}
                              paddingRight={3}
                              marginBottom={3}
                              width={"fit-content"}
                              backgroundColor={
                                message.role === Message.role.USER
                                  ? "gray.500"
                                  : "blue.700"
                              }
                              marginLeft={
                                message.role === Message.role.USER
                                  ? "auto"
                                  : "0"
                              }
                              marginRight={
                                message.role !== Message.role.USER
                                  ? "auto"
                                  : "0"
                              }
                            >
                              <Text key={index}>{message.content}</Text>
                            </Box>
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
                                size={"lg"}
                                autoComplete="off"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                              />
                            </FormControl>
                            <IconButton
                              ml={2}
                              flexShrink={0}
                              colorScheme="orange"
                              size={"lg"}
                              type="submit"
                              aria-label="Submit"
                              icon={<ArrowForwardIcon />}
                            ></IconButton>
                          </Flex>
                        </form>
                      </Flex>
                    </CardBody>
                  </Card>
                </AspectRatio>
              </Stack>
              <Card
                width={"50vw"}
                maxW={"2250px"}
                height={"20%"}
                borderRadius="xl"
                boxShadow={"0px 0px 5px 6px #969696"}
                onClick={handleCardClick}
              >
                <CardBody width="100%" height="100%">
                  <Textarea
                    size={"lg"}
                    resize={"none"}
                    rows={5}
                    placeholder="Jot down some notes here..."
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
