import {
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Modal,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  VStack,
  Image,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import evidence from "rpg/data/evidence";
import Topics from "rpg/data/topics";

export default function FoundEvidenceModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [foundEvidence, setFoundEvidence] = useState<string[]>([]);

  const open = () => {
    PubSub.publish(Topics.giveKeysToDom);
    setFoundEvidence(JSON.parse(localStorage.getItem("evidence")!));
    onOpen();
  };

  const close = () => {
    PubSub.publish(Topics.giveKeysToGame);
    onClose();
  };

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
            src="/assets/web/detective.png"
            alt="button image"
            width={"100%"}
          />
          <Heading size="lg">Evidence</Heading>
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Accordion allowToggle>
              {foundEvidence.map((evidenceKey, index) => (
                <AccordionItem>
                  <Heading>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {evidenceKey}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel pb={4}>
                    <Image
                      src={evidence[evidenceKey as keyof typeof evidence].photo}
                    />
                    {evidence[evidenceKey as keyof typeof evidence].text}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
