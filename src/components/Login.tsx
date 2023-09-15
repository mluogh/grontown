import {
  Box,
  Button,
  Image,
  VStack,
  Center,
  Text,
  HStack,
  Flex,
  AspectRatio,
} from "@chakra-ui/react";
import GoogleButton from "react-google-button";
import GithubButton from "react-github-login-button";

export const Login = () => {
  const handleGitHubLogin = async () => {
    // Define the URI to which you want the server to redirect after successful authentication
    const clientRedirectURI = `${window.location.origin}/login`;

    // Construct the authorization URL with the client_redirect_uri parameter
    const authorizeURL = `/api/auth/github_authorize?client_redirect_uri=${clientRedirectURI}`;

    // Redirect to the constructed URL
    window.location.href = authorizeURL;
  };

  const handleGoogleLogin = () => {
    const clientRedirectURI = `${window.location.origin}/login`;

    // Construct the authorization URL with the client_redirect_uri parameter
    const authorizeURL = `/api/auth/google_authorize?client_redirect_uri=${clientRedirectURI}`;

    // Redirect to the constructed URL
    window.location.href = authorizeURL;
  };

  return (
    <Center height="100vh" width="100vw">
      <Box
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        dropShadow={"2xl"}
      >
        <HStack
          spacing={0}
          height="70vh"
          minHeight="300px"
          alignItems="stretch"
        >
          <video autoPlay loop muted style={{ width: "100%", height: "100%" }}>
            <source src="/assets/web/gron_games.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          <Box
            bg="blue.800"
            p={[2, 4, 8]}
            minWidth="400px"
            boxShadow="xl"
            width={["100%", "60%", "15vw"]}
            flex="1"
          >
            <Flex flexDirection="column" height="100%" color="gray.400">
              {/* Top Half */}
              <VStack spacing={6} flex="1" justifyContent="center">
                <Image
                  src="/assets/sprites/dead_harrington.png"
                  height="30%"
                  width="30%"
                />
                <Text fontFamily="vt323" fontSize="6xl">
                  nob hill noir
                </Text>
              </VStack>

              {/* Bottom Half */}
              <VStack
                spacing={6}
                flex="1"
                justifyContent="center"
                maxWidth="100%"
              >
                <Box
                  padding="10"
                  bgColor="gray.400"
                  borderRadius="md"
                  boxShadow="md"
                  marginBottom={6}
                  maxWidth="100%"
                  width="100%"
                  flexDirection="column"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start" // Center vertically at the top
                >
                  <div style={{ marginTop: "auto" }}></div>{" "}
                  {/* Empty div for spacing */}
                  <Text
                    fontSize="4xl"
                    color={"blue.800"}
                    marginBottom={6}
                    fontFamily="vt323"
                  >
                    Play
                  </Text>
                  <VStack spacing={6} fontFamily={"vt323"}>
                    <GithubButton onClick={handleGitHubLogin}>
                      Sign in with GitHub
                    </GithubButton>
                    <GoogleButton onClick={handleGoogleLogin}>
                      Sign in with Google
                    </GoogleButton>
                  </VStack>
                </Box>
              </VStack>
            </Flex>
          </Box>
        </HStack>
      </Box>
    </Center>
  );
};

export default Login;
