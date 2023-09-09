import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  AspectRatio,
  Image,
  Center,
  Text,
  VStack,
  Modal,
} from "@chakra-ui/react";
import { useState } from "react";
import evidence from "rpg/data/evidence";
import Topics from "rpg/data/topics";

export default function EvidenceModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [evidenceName, setEvidenceName] = useState("");
  const [text, setText] = useState("");
  const [photoPath, setPhotoPath] = useState("");

  PubSub.subscribe(Topics.enterEvidenceModal, (channel, message: string) => {
    const evidenceKey = message as keyof typeof evidence;

    const foundEvidence = localStorage.getItem("evidence")
      ? new Set(JSON.parse(localStorage.getItem("evidence")!))
      : new Set();
    foundEvidence.add(evidenceKey);
    localStorage.setItem("evidence", JSON.stringify(Array.from(foundEvidence)));

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
          <VStack
            width={"80vw"}
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
                  {evidenceName}
                </Center>
              </Center>
            </AspectRatio>
            <Text>{text}</Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
