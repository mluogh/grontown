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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import evidence from "rpg/data/evidence";
import Topics from "rpg/data/topics";

function CroppedImage({ imgSrc }: { imgSrc: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgHeight = imgRef.current!.offsetHeight;
    const clipHeight = imgHeight * 0.9;
    imgRef.current!.style.clipPath = `inset(0px 0px ${
      imgHeight - clipHeight
    }px 0px)`;
  }, []);

  return <Image ref={imgRef} src={imgSrc} />;
}

interface FoundEvidenceModalProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

export default function FoundEvidenceModal(props: FoundEvidenceModalProps) {
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
      <Modal isOpen={isOpen} onClose={close} isCentered size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <VStack gap={4}>
              <Accordion allowToggle width={"100%"}>
                {foundEvidence.map((evidenceKey, index) => (
                  <AccordionItem key={index} width={"100%"}>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Heading size={"xl"}>{evidenceKey}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <Box position="relative" overflow="hidden">
                        <Image
                          src={
                            evidence[evidenceKey as keyof typeof evidence].text
                          }
                          position="absolute"
                          bottom="10%"
                        />
                      </Box>
                      <CroppedImage
                        imgSrc={
                          evidence[evidenceKey as keyof typeof evidence].photo
                        }
                      />
                      <Text fontSize={"xl"}>
                        {evidence[evidenceKey as keyof typeof evidence].text}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
              <Textarea
                placeholder="Notice anything in the evidence? Write it down to yourself here."
                value={props.notes}
                rows={10}
                onChange={e => props.setNotes(e.target.value)}
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
