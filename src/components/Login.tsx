import {
  Box,
  Image,
  VStack,
  Center,
  Text,
  AspectRatio,
  Stack,
} from "@chakra-ui/react";
import GoogleButton from "react-google-button";
import GithubButton from "react-github-login-button";
import { BrowserView, MobileView } from "react-device-detect";

export const Login = () => {
  const handleGitHubLogin = async () => {
    // Define the URI to which you want the server to redirect after successful authentication
    const clientRedirectURI = `${window.location.origin}`;

    // Construct the authorization URL with the client_redirect_uri parameter
    const authorizeURL = `/api/auth/github_authorize?client_redirect_uri=${clientRedirectURI}`;

    // Redirect to the constructed URL
    window.location.href = authorizeURL;
  };

  const handleGoogleLogin = () => {
    const clientRedirectURI = `${window.location.origin}`;

    // Construct the authorization URL with the client_redirect_uri parameter
    const authorizeURL = `/api/auth/google_authorize?client_redirect_uri=${clientRedirectURI}`;

    // Redirect to the constructed URL
    window.location.href = authorizeURL;
  };

  return (
    <Center height="100vh" width="100vw">
      <Stack
        width="85vw"
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
          <Stack height="100%" direction={{ base: "row", xl: "column" }}>
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
                    <GithubButton onClick={handleGitHubLogin}>
                      Sign in with GitHub
                    </GithubButton>
                    <GoogleButton onClick={handleGoogleLogin}>
                      Sign in with Google
                    </GoogleButton>
                  </BrowserView>
                  <MobileView>
                    <Text fontSize={"2xl"}>
                      Demo requires keyboard. Use computer to play!
                    </Text>
                  </MobileView>
                </VStack>
              </Box>
            </VStack>
          </Stack>
        </Box>
        <AspectRatio flex="4" ratio={3 / 2}>
          <video autoPlay loop muted style={{ width: "100%", height: "100%" }}>
            <source src="/assets/web/gron_games.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
      </Stack>
    </Center>
  );
};

export default Login;
