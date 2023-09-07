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
import { useEffect, useRef, useState } from "react";
import topics from "rpg/data/topics";

interface NotesModalProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const NotesModal = ({ notes, setNotes }: NotesModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // useEffect(() => {}, []);
  const open = () => {
    PubSub.publish(topics.giveKeysToDom);
    onOpen();
  };

  const close = () => {
    PubSub.publish(topics.giveKeysToGame);
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
            src="/assets/web/typewriter.png"
            alt="button image"
            width={"100%"}
          />
          <Heading size="lg">Notes</Heading>
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent maxW="fit-content" maxH={"fit-content"}>
          <ModalBody width={"50vw"} padding={4}>
            <Textarea
              value={notes}
              rows={30}
              placeholder="Notes"
              onChange={e => setNotes(e.target.value)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NotesModal;
