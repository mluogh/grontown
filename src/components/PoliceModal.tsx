import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Input,
  FormControl,
  Textarea,
  FormLabel,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import characters from "rpg/data/characters";
import topics from "rpg/data/topics";
import { EastworldClient } from "eastworld-client";
import { useEffect, useState } from "react";
import story from "rpg/data/story";

type PoliceModalProps = {
  eastworldClient: EastworldClient;
};

const ChatModal = ({ eastworldClient }: PoliceModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [suspect, setSuspect] = useState("");
  const [suspectValid, setSuspectValid] = useState(false);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    let sanitizedName = suspect.trim();
    sanitizedName = sanitizedName.replace(
      /\w\S*/g,
      word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase(),
    );

    setSuspectValid(sanitizedName in characters);
  }, [suspect]);

  PubSub.subscribe(topics.enterArrestModal, () => {
    onOpen();
  });

  const close = () => {
    PubSub.publish(topics.giveKeysToGame);
    onClose();
  };

  const scoreExplanation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const score = await eastworldClient.llm.rate(
      `A player is playing a murder mystery game as a detective.
The actual plot they should discover is as follows:
"${story.explanation}"

This is the player's explanation of what happened:
"${explanation}"

How close is this to the actual plot?
`,
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay />
        <ModalContent maxW="fit-content" maxH={"fit-content"}>
          <ModalBody>
            <form onSubmit={scoreExplanation}>
              <FormControl isInvalid={!suspectValid}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={suspect}
                  placeholder="Full name of the suspect"
                  onChange={e => setSuspect(e.target.value)}
                />
                <FormErrorMessage>Invalid suspect!</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Explanation</FormLabel>
                <Textarea
                  rows={10}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                />
              </FormControl>
              <Button type="submit">Arrest</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatModal;
