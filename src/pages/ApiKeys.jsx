import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Button, Card, CardBody, Text, Flex,
  Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton,
  useToast, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Input, Tooltip, Spinner
} from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, RepeatIcon, CheckIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 使用config.js中的配置
  const apiUrl = API_BASE_URL;
  
  const fetchApiKeys = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      // 尝试两种可能的API路径
      const endpoints = [
        `${apiUrl}/api/keys`,
        `${apiUrl}/api/key/list`
      ];
      
      let response;
      let succeeded = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`尝试从 ${endpoint} 获取API密钥`);
          response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data && (response.data.success || response.data.length > 0)) {
            succeeded = true;
            break;
          }
        } catch (err) {
          console.log(`尝试 ${endpoint} 失败:`, err.message);
          continue;
        }
      }
      
      if (succeeded) {
        // 根据响应格式处理数据
        const keys = response.data.keys || response.data || [];
        setApiKeys(Array.isArray(keys) ? keys : []);
        console.log('成功获取API密钥:', keys);
      } else {
        throw new Error('无法从任何端点获取API密钥');
      }
    } catch (error) {
      console.error('API keys error:', error);
      
      toast({
        title: '获取API密钥失败',
        description: error.message || '请稍后再试',
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
      
      // 尝试多个可能的端点
      const endpoints = [
        `${apiUrl}/api/keys`,
        `${apiUrl}/api/key/generate`
      ];
      
      let response;
      let succeeded = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`尝试调用 ${endpoint} 生成API密钥`);
          response = await axios.post(endpoint, 
            { name: `API密钥 ${new Date().toLocaleDateString()}` },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          
          if (response.data && (response.data.success || response.data.key || response.data.api_key)) {
            succeeded = true;
            break;
          }
        } catch (err) {
          console.log(`尝试 ${endpoint} 失败:`, err.message);
          continue;
        }
      }
      
      if (succeeded) {
        // 提取API密钥（处理不同响应格式）
        const apiKey = response.data.api_key || response.data.key || (response.data.prefix && response.data.key ? `${response.data.prefix}.${response.data.key}` : null);
        
        if (apiKey) {
          setNewKey(apiKey);
          onOpen();
          fetchApiKeys();
        } else {
          throw new Error('API响应中没有密钥');
        }
      } else {
        throw new Error('无法生成API密钥');
      }
    } catch (error) {
      console.error('Generate API key error:', error);
      
      toast({
        title: '生成API密钥失败',
        description: error.message || '请稍后再试',
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
      
      // 尝试两个可能的端点
      const endpoints = [
        `${apiUrl}/api/keys/${keyId}`,
        `${apiUrl}/api/key/toggle-status`
      ];
      
      let response;
      let succeeded = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`尝试调用 ${endpoint} 更新密钥状态`);
          
          // 根据端点调整请求方法和数据
          if (endpoint.includes('/toggle-status')) {
            response = await axios.post(endpoint, {
              key_id: keyId,
              status: newStatus
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } else {
            response = await axios.patch(endpoint, {
              active: newStatus === 'active'
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
          
          if (response.data && (response.data.success || response.data.message)) {
            succeeded = true;
            break;
          }
        } catch (err) {
          console.log(`尝试 ${endpoint} 失败:`, err.message);
          continue;
        }
      }
      
      if (succeeded) {
        fetchApiKeys();
        
        toast({
          title: 'API密钥状态已更新',
          status: 'success',
          duration: 2000,
        });
      } else {
        throw new Error('无法更新API密钥状态');
      }
    } catch (error) {
      console.error('Toggle API key status error:', error);
      
      toast({
        title: '更新API密钥状态失败',
        description: error.message || '请稍后再试',
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
            <Flex justify="center" py={10}>
              <Spinner size="xl" />
            </Flex>
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
                        : '从未使用'
                      }
                    </Td>
                    <Td>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => toggleKeyStatus(key.id, key.status)}
                        aria-label={key.status === 'active' ? '禁用' : '启用'}
                        title={key.status === 'active' ? '禁用' : '启用'}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
      
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