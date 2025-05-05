import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Heading, Text, Stack, Flex, Image } from '@chakra-ui/react';

function Home() {
  return (
    <Container maxW="container.xl">
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" py={12}>
        <Box maxW={{ base: '100%', md: '50%' }} mb={{ base: 8, md: 0 }}>
          <Heading as="h1" size="2xl" mb={4}>
            API密钥管理系统
          </Heading>
          <Text fontSize="xl" mb={6} color="gray.600">
            简单、安全、高效地管理您的API密钥和使用量
          </Text>
          <Stack direction="row" spacing={4}>
            <Button as={Link} to="/register" colorScheme="blue" size="lg">
              立即注册
            </Button>
            <Button as={Link} to="/login" colorScheme="gray" size="lg">
              登录
            </Button>
          </Stack>
        </Box>
        <Box maxW={{ base: '100%', md: '45%' }}>
          <Image src="/api-illustration.svg" alt="API Key Management" fallbackSrc="https://via.placeholder.com/500x300?text=API+Key+Management" />
        </Box>
      </Flex>

      <Box py={12}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          主要功能
        </Heading>
        <Flex flexWrap="wrap" justify="space-between">
          <Box width={{ base: '100%', md: '30%' }} mb={8} p={5} boxShadow="md" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>
              API密钥管理
            </Heading>
            <Text>轻松创建、管理和撤销API密钥，确保您的API安全可控。</Text>
          </Box>
          <Box width={{ base: '100%', md: '30%' }} mb={8} p={5} boxShadow="md" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>
              使用量统计
            </Heading>
            <Text>实时监控API使用情况，查看详细的统计数据和趋势分析。</Text>
          </Box>
          <Box width={{ base: '100%', md: '30%' }} mb={8} p={5} boxShadow="md" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>
              按量计费
            </Heading>
            <Text>灵活的计费方案，仅针对您实际使用的API调用次数收费。</Text>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
}

export default Home;
