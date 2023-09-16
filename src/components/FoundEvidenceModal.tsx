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
  Text,
  Textarea,
  Center,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState } from "react";
import evidence from "rpg/data/evidence";
import { getGameState } from "rpg/data/persistence";
import Topics from "rpg/data/topics";
import CroppedImage from "./util/CroppedImage";

interface FoundEvidenceModalProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export default function FoundEvidenceModal(props: FoundEvidenceModalProps) {
  const [isSmallScreen] = useMediaQuery(
    "(max-height: 600px) or (max-width: 80em)",
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [foundEvidence, setFoundEvidence] = useState<string[]>([]);

  const open = () => {
    PubSub.publish(Topics.giveKeysToDom);
    setFoundEvidence(Array.from(getGameState().foundEvidence));
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
          {!isSmallScreen && <Heading size="lg">Clues</Heading>}
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={close} isCentered size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <VStack gap={4}>
              <Accordion allowToggle width={"100%"}>
                {foundEvidence.length === 0 && (
                  <Center>
                    <Heading size={"xl"}>No evidence found yet.</Heading>
                  </Center>
                )}
                {foundEvidence.map((evidenceKey, index) => (
                  <AccordionItem key={index} width={"100%"}>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Heading size={"xl"}>{evidenceKey}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <CroppedImage
                        imgSrc={
                          evidence[evidenceKey as keyof typeof evidence].photo
                        }
                      />
                      <Text fontSize={"xl"} whiteSpace="pre-wrap">
                        {evidence[evidenceKey as keyof typeof evidence].text}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
              {foundEvidence.length > 0 && (
                <Textarea
                  placeholder="Notice anything in the evidence? Write it down to yourself here."
                  value={props.notes}
                  rows={10}
                  onChange={e => props.setNotes(e.target.value)}
                />
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
