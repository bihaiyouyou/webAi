import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Button, Card, CardBody, Text, Flex,
  Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton,
  useToast, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Input, useClipboard, Tooltip
} from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, RepeatIcon, CheckIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  const fetchApiKeys = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/key/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setApiKeys(response.data.keys || []);
      } else {
        throw new Error(response.data.message || '获取API密钥失败');
      }
    } catch (error) {
      console.error('API keys error:', error);
      
      toast({
        title: '获取API密钥失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApiKeys();
  }, []);
  
  const generateNewKey = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/key/generate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setNewKey(response.data.api_key);
        onOpen();
        fetchApiKeys();
      } else {
        throw new Error(response.data.message || '生成API密钥失败');
      }
    } catch (error) {
      console.error('Generate API key error:', error);
      
      toast({
        title: '生成API密钥失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  const toggleKeyStatus = async (keyId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      
      const response = await axios.post(`${apiUrl}/key/toggle-status`, {
        key_id: keyId,
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        fetchApiKeys();
        
        toast({
          title: 'API密钥状态已更新',
          status: 'success',
          duration: 2000,
        });
      } else {
        throw new Error(response.data.message || '更新API密钥状态失败');
      }
    } catch (error) {
      console.error('Toggle API key status error:', error);
      
      toast({
        title: '更新API密钥状态失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  // 复制功能
  const [copiedKey, setCopiedKey] = useState(null);
  
  const copyApiKey = (key) => {
    navigator.clipboard.writeText(key).then(
      () => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
        
        toast({
          title: 'API密钥已复制',
          status: 'success',
          duration: 2000,
        });
      },
      () => {
        toast({
          title: '复制失败',
          description: '请手动复制API密钥',
          status: 'error',
          duration: 3000,
        });
      }
    );
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>API密钥管理</Heading>
        <Button 
          colorScheme="blue" 
          leftIcon={<RepeatIcon />}
          onClick={generateNewKey}
          isLoading={loading}
        >
          生成新密钥
        </Button>
      </Flex>
      
      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>使用说明</Heading>
          <Text mb={3}>
            API密钥用于授权访问API。请妥善保管您的API密钥，不要分享给他人。
          </Text>
          <Text mb={3}>
            在API请求中使用以下方式之一包含您的API密钥:
          </Text>
          <Box bg="gray.50" p={3} borderRadius="md" mb={3}>
            <Text fontFamily="monospace">
              1. HTTP头部: <code>Authorization: Bearer YOUR_API_KEY</code>
            </Text>
            <Text fontFamily="monospace">
              2. 查询参数: <code>?api_key=YOUR_API_KEY</code>
            </Text>
          </Box>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>我的API密钥</Heading>
          
          {loading ? (
            <Text>加载中...</Text>
          ) : apiKeys.length === 0 ? (
            <Text>您还没有API密钥。点击"生成新密钥"按钮创建一个。</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>API密钥</Th>
                  <Th>状态</Th>
                  <Th>创建时间</Th>
                  <Th>最后使用</Th>
                  <Th>操作</Th>
                </Tr>
              </Thead>
              <Tbody>
                {apiKeys.map((key) => (
                  <Tr key={key.id}>
                    <Td>
                      <Flex align="center">
                        <Text fontFamily="monospace" isTruncated maxW="200px">
                          {key.api_key}
                        </Text>
                        <Tooltip label="复制API密钥">
                          <IconButton
                            icon={copiedKey === key.api_key ? <CheckIcon /> : <CopyIcon />}
                            size="sm"
                            variant="ghost"
                            ml={2}
                            colorScheme={copiedKey === key.api_key ? 'green' : 'blue'}
                            onClick={() => copyApiKey(key.api_key)}
                            aria-label="复制"
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td>
                      <Badge colorScheme={key.status === 'active' ? 'green' : 'red'}>
                        {key.status === 'active' ? '启用' : '禁用'}
                      </Badge>
                    </Td>
                    <Td>{new Date(key.created_at).toLocaleString()}</Td>
                    <Td>
                      {key.last_used_at 
                        ? new Date(key.last_used_at).toLocaleString() 
                        : '从未使用'}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme={key.status === 'active' ? 'red' : 'green'}
                        onClick={() => toggleKeyStatus(key.id, key.status)}
                      >
                        {key.status === 'active' ? '禁用' : '启用'}
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
      
      {/* 新API密钥弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新API密钥已生成</ModalHeader>
          <ModalBody>
            <Text mb={3} fontWeight="bold">
              请保存您的API密钥，它只会显示一次:
            </Text>
            <Flex mb={4}>
              <Input
                readOnly
                value={newKey}
                fontFamily="monospace"
                bg="gray.50"
              />
              <Button
                ml={2}
                onClick={() => copyApiKey(newKey)}
                colorScheme={copiedKey === newKey ? 'green' : 'blue'}
              >
                {copiedKey === newKey ? '已复制' : '复制'}
              </Button>
            </Flex>
            <Text color="red.500" fontWeight="semibold">
              注意: 出于安全原因，我们不会再次显示此密钥。请立即复制并安全保存。
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              我已保存密钥
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ApiKeys;