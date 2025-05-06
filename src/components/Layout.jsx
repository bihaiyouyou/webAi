import { Box, Flex, Container } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Flex>
      <Sidebar />
      <Box flex="1" p={5}>
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>
    </Flex>
  );
};

export default Layout; 