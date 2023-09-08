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
  Card
} from "@chakra-ui/react";
import { useState } from "react";
import evidence from "rpg/data/evidence";
import Topics from "rpg/data/topics";

export default function EvidenceModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState("");
  const [photoPath, setPhotoPath] = useState("");

  PubSub.subscribe(Topics.enterEvidenceModal, (channel, message: string) => {
    const evidenceKey = message as keyof typeof evidence;
    console.log(evidence, evidenceKey);
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
      <Card width="100%" height="100%" fontFamily={"ptserif"}>
        <ModalOverlay />
        <ModalContent
          maxW="fit-content"
          maxH={"fit-content"}
          bg="gray.700"
          boxShadow={"none"}
          onClick={close}
        >
          <ModalBody>
            <HStack
              width={"60vw"}
              justifyContent="center"
              alignItems="center"
              gap={8}
            >
              <AspectRatio
                width={{ base: "80%", xl: "50%" }}
                ratio={1}
                maxWidth={"1100px"}
              >
                <Center paddingLeft={3} paddingRight={3}>
                  <Image
                    borderRadius="l"
                    src={photoPath}
                    objectFit={"cover"}
                    boxShadow={"0px 0px 5px 6px #969696"}
                  ></Image>
                </Center>
              </AspectRatio>
              <Text color="white">{text}</Text>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Card>
    </Modal>
  );
}
