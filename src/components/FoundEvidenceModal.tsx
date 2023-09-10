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
import { useEffect, useState } from "react";
import evidence from "rpg/data/evidence";
import Topics from "rpg/data/topics";

function CroppedImage({ imgSrc }: { imgSrc: string }) {
  const [clipPath, setClipPath] = useState<string>("");

  useEffect(() => {
    const image = new window.Image();
    image.src = imgSrc;

    const onLoad = () => {
      const height = image.height;
      const clipHeight = height * 0.05;
      setClipPath(`inset(0px 0px ${clipHeight}px 0px)`);
    };

    image.addEventListener("load", onLoad);

    return () => {
      image.removeEventListener("load", onLoad);
    };
  }, [imgSrc]);

  return <Image src={imgSrc} objectFit="cover" clipPath={clipPath} />;
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
