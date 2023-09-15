import { StarIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Heading,
  Text,
  Button,
  Center,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";

const RateLimitModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      console.log(error.response);
      if (error.response.status === 429) {
        onOpen();
      }
      return Promise.reject(error);
    },
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size={"4xl"}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody padding={10}>
            <Heading marginBottom={5}>Uh oh! Rate Limiting.</Heading>
            <Text>
              Unfortunately, since this is a free and open source project, we
              don't have the compute or money to allow everyone unlimited
              inference. You can continue playing tomorrow, or go on GitHub and
              run the backend yourself to continue playing.
            </Text>
            <Center margin={5}>
              <Button
                as="a"
                href="https://www.github.com/mluogh/grontown"
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="purple"
                size={"lg"}
                leftIcon={<StarIcon color="yellow" />}
              >
                GitHub
              </Button>
              <Spacer />
              <Button size={"lg"} onClick={onClose}>
                I'll just walk around
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RateLimitModal;
