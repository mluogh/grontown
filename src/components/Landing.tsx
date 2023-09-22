import {
  Box,
  Image,
  VStack,
  Center,
  Text,
  AspectRatio,
  Stack,
  Button,
} from "@chakra-ui/react";
import GoogleButton from "react-google-button";
import GithubButton from "react-github-login-button";
import { BrowserView, MobileView } from "react-device-detect";
import { AuthStatus } from "./util/auth";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface LandingProps {
  authStatus: AuthStatus;
}

export const Landing = (props: LandingProps) => {
  const navigate = useNavigate();

  const handleGitHubLogin = async () => {
    // Define the URI to which you want the server to redirect after successful authentication
    const clientRedirectURI = `${window.location.origin}`;

    // Construct the authorization URL with the client_redirect_uri parameter
    const authorizeURL = `/api/auth/github_authorize?client_redirect_uri=${clientRedirectURI}/game`;

    // Redirect to the constructed URL
    window.location.href = authorizeURL;
  };

  const handleGoogleLogin = () => {
    const clientRedirectURI = `${window.location.origin}`;

    // Construct the authorization URL with the client_redirect_uri parameter
    const authorizeURL = `/api/auth/google_authorize?client_redirect_uri=${clientRedirectURI}/game`;

    // Redirect to the constructed URL
    window.location.href = authorizeURL;
  };

  if (props.authStatus === AuthStatus.Pending) {
    return <></>;
  }

  return (
    <Center height="100vh" width="100vw">
      <Stack
        width="80vw"
        maxWidth={"1700px"}
        alignItems="stretch"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        dropShadow={"2xl"}
        gap={"0"}
        direction={{ base: "column-reverse", xl: "row" }}
      >
        <Box
          bg="blue.800"
          padding={{ base: "3", xl: "4" }}
          boxShadow="xl"
          flex="1"
        >
          <VStack height="100%">
            <VStack
              spacing={{ base: "2", xl: "4" }}
              flex="1"
              justifyContent="center"
            >
              <Image
                src="/assets/sprites/dead_harrington.png"
                height="30%"
                width="30%"
              />
              <Text fontFamily="vt323" fontSize="6xl" align={"center"}>
                nob hill noir
              </Text>
            </VStack>

            <VStack
              spacing={{ base: "1", xl: "3" }}
              flex="1"
              justifyContent="center"
              maxWidth="100%"
            >
              <Box
                padding={{ base: "2", xl: "8" }}
                bgColor="gray.400"
                borderRadius="md"
                boxShadow="md"
                marginBottom={{ base: "1", xl: "3" }}
                maxWidth="100%"
                minWidth={"250px"}
                width="85%"
                flexDirection="column"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Text
                  fontSize="4xl"
                  color={"blue.800"}
                  marginBottom={6}
                  fontFamily="vt323"
                >
                  Play
                </Text>
                <VStack
                  spacing={{ base: "3", xl: "6" }}
                  fontFamily={"vt323"}
                  marginBottom={3}
                >
                  <BrowserView>
                    {props.authStatus === AuthStatus.NotAuthenticated && (
                      <>
                        <GithubButton onClick={handleGitHubLogin}>
                          Sign in with GitHub
                        </GithubButton>
                        <GoogleButton onClick={handleGoogleLogin}>
                          Sign in with Google
                        </GoogleButton>
                      </>
                    )}
                    {props.authStatus === AuthStatus.Authenticated && (
                      <Button
                        width="100%"
                        size="lg"
                        colorScheme="green"
                        rightIcon={<ArrowForwardIcon />}
                        onClick={() => navigate("/game")}
                      >
                        Start
                      </Button>
                    )}
                  </BrowserView>
                  <MobileView>
                    <Text fontSize={"2xl"}>
                      Demo requires keyboard. Use computer to play!
                    </Text>
                  </MobileView>
                </VStack>
              </Box>
            </VStack>
            <Center>
              <Button
                as="a"
                href="https://www.github.com/mluogh/grontown"
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={
                  <Image
                    src="/assets/web/github-mark.png"
                    height={{ base: "20px", xl: "30px" }}
                  />
                }
                size={{ base: "xs", xl: "sm" }}
                bg={"white"}
                textColor={"black"}
              >
                GitHub
              </Button>
            </Center>
          </VStack>
        </Box>
        <AspectRatio flex="4" ratio={1350 / 1150}>
          <video
            autoPlay
            playsInline
            loop
            muted
            style={{ width: "100%", height: "100%" }}
          >
            <source src="/assets/web/gameplay.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
      </Stack>
    </Center>
  );
};

export default Landing;
