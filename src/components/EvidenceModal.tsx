import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  AspectRatio,
  Image,
  Center,
  Text,
  Modal,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import evidence from "rpg/data/evidence";
import { getGameState, saveGameState } from "rpg/data/persistence";
import Topics from "rpg/data/topics";

const EvidenceModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [evidenceName, setEvidenceName] = useState("");
  const [text, setText] = useState("");
  const [photoPath, setPhotoPath] = useState("");

  PubSub.subscribe(Topics.enterEvidenceModal, (channel, message: string) => {
    const evidenceKey = message as keyof typeof evidence;

    getGameState().foundEvidence.add(evidenceKey);
    saveGameState();

    setEvidenceName(evidenceKey);
    setText(evidence[evidenceKey].text);
    setPhotoPath(evidence[evidenceKey].photo);
    onOpen();
  });

  const close = () => {
    PubSub.publish(Topics.giveKeysToGame);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="fit-content"
          maxH={"fit-content"}
          onClick={close}
          boxShadow={"none"}
          border={"none"}
          outline={"none"}
        >
          <ModalBody>
            <HStack
              width={"80vw"}
              justifyContent="center"
              alignItems="center"
              gap={8}
              maxWidth={"1100px"}
            >
              <AspectRatio width={"50%"} ratio={1}>
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
                    fontSize={"4xl"}
                  >
                    {evidenceName}
                  </Center>
                </Center>
              </AspectRatio>
              <Text
                color="white"
                whiteSpace="pre-wrap"
                fontSize={"xl"}
                width={"50%"}
              >
                {text}
              </Text>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EvidenceModal;
