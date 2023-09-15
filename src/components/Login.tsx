import { Box, Button, Image, VStack, Center } from '@chakra-ui/react';

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
      <Box display="flex" flexDirection="row" alignItems="center">
        <Image 
          src="/assets/web/justice.jpeg" 
          alt="Descriptive Alt Text" 
          width="900px"
          height="900px" 
        />

        <VStack marginLeft="12rem" spacing={4}>
          <Button onClick={handleGitHubLogin} size="lg">
            Sign in with GitHub
          </Button>

          <Button onClick={handleGoogleLogin} size="lg">
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;