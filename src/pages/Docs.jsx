 import React from 'react';
import { Box, Heading, Text, Container } from '@chakra-ui/react';

const Docs = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" mb={4}>API密钥管理系统文档</Heading>
        <Text fontSize="xl" color="gray.600">
          完整的API密钥管理解决方案，简单易用
        </Text>
      </Box>
      
      <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md">
        <Heading as="h2" size="lg" mb={4}>API密钥管理</Heading>
        <Text mb={4}>
          创建、查看、更新和删除您的API密钥。每个密钥有唯一标识和前缀，便于识别和管理。
        </Text>
      </Box>
    </Container>
  );
};

export default Docs;