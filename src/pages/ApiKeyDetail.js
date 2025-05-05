import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Card, CardBody, VStack, HStack, Text, Button, Badge,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid,
  useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, FormControl, FormLabel, Input, Switch,
  Alert, AlertIcon, Divider, Tabs, TabList, Tab, TabPanels, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Skeleton, 
  useClipboard, Tooltip, IconButton, Select, Flex
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon, DeleteIcon, RepeatIcon, InfoIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

function ApiKeyDetail() {
  const { id } = useParams();
  const [apiKey, setApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentCalls, setRecentCalls] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [updatingPermissions, setUpdatingPermissions] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const { hasCopied, onCopy } = useClipboard('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const regenerateDisclosure = useDisclosure();
  const permissionsDisclosure = useDisclosure();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 获取API密钥详情
  const fetchApiKeyDetails = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/api-keys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setApiKey(response.data.apiKey);
        
        // 设置复制函数
        onCopy.value = response.data.apiKey.key;
      } else {
        throw new Error(response.data.message || '获取API密钥详情失败');
      }
    } catch (error) {
      console.error('API key detail error:', error);
      
      toast({
        title: '获取API密钥详情失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
      
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 404) {
        navigate('/api-keys');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取最近调用记录
  const fetchRecentCalls = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/api-keys/${id}/recent-calls`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setRecentCalls(response.data.calls);
      } else {
        throw new Error(response.data.message || '获取最近调用记录失败');
      }
    } catch (error) {
      console.error('Recent calls error:', error);
      
      toast({
        title: '获取最近调用记录失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  // 获取使用统计
  const fetchUsageStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/api-keys/${id}/usage-stats?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUsageStats(response.data.stats);
      } else {
        throw new Error(response.data.message || '获取使用统计失败');
      }
    } catch (error) {
      console.error('Usage stats error:', error);
      
      toast({
        title: '获取使用统计失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  useEffect(() => {
    fetchApiKeyDetails();
    fetchRecentCalls();
    fetchUsageStats();
  }, [id]);
  
  useEffect(() => {
    fetchUsageStats();
  }, [timeRange]);
  
  // 删除API密钥
  const deleteApiKey = async () => {
    if (deleteConfirmText !== apiKey.name) {
      toast({
        title: '确认文本不匹配',
        description: `请输入 "${apiKey.name}" 以确认删除`,
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.delete(`${apiUrl}/api-keys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast({
          title: 'API密钥已删除',
          status: 'success',
          duration: 3000,
        });
        
        navigate('/api-keys');
      } else {
        throw new Error(response.data.message || '删除API密钥失败');
      }
    } catch (error) {
      console.error('Delete API key error:', error);
      
      toast({
        title: '删除API密钥失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
      setDeleteConfirmText('');
    }
  };
  
  // 重新生成API密钥
  const regenerateApiKey = async () => {
    setIsRegenerating(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/api-keys/${id}/regenerate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setApiKey({
          ...apiKey,
          key: response.data.newKey,
          updated_at: new Date().toISOString()
        });
        
        // 设置复制函数
        onCopy.value = response.data.newKey;
        
        toast({
          title: 'API密钥已重新生成',
          description: '请保存新的密钥，旧密钥将不再有效',
          status: 'success',
          duration: 5000,
        });
      } else {
        throw new Error(response.data.message || '重新生成API密钥失败');
      }
    } catch (error) {
      console.error('Regenerate API key error:', error);
      
      toast({
        title: '重新生成API密钥失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsRegenerating(false);
      regenerateDisclosure.onClose();
    }
  };
  
  // 更新API密钥权限
  const updatePermissions = async () => {
    setUpdatingPermissions(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/api-keys/${id}/update-permissions`, {
        permissions: apiKey.permissions
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast({
          title: 'API密钥权限已更新',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(response.data.message || '更新API密钥权限失败');
      }
    } catch (error) {
      console.error('Update permissions error:', error);
      
      toast({
        title: '更新API密钥权限失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUpdatingPermissions(false);
      permissionsDisclosure.onClose();
    }
  };
  
  // 更新权限状态
  const handlePermissionChange = (feature, value) => {
    if (!apiKey) return;
    
    setApiKey({
      ...apiKey,
      permissions: {
        ...apiKey.permissions,
        [feature]: value
      }
    });
  };
  
  // 状态徽章颜色
  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      revoked: 'red',
      expired: 'orange'
    };
    
    return colors[status] || 'gray';
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };
  
  // 格式化时间范围选项
  const getTimeRangeLabel = (range) => {
    const labels = {
      '1d': '最近24小时',
      '7d': '最近7天',
      '30d': '最近30天',
      '90d': '最近90天'
    };
    
    return labels[range] || range;
  };

  return (
    <Box>
      <HStack mb={6} justify="space-between">
        <Heading>API密钥详情</Heading>
        <Button 
          colorScheme="red" 
          leftIcon={<DeleteIcon />}
          onClick={onOpen}
        >
          删除密钥
        </Button>
      </HStack>
      
      {isLoading ? (
        <Card mb={6}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </VStack>
          </CardBody>
        </Card>
      ) : apiKey ? (
        <>
          <Card mb={6}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">密钥名称:</Text>
                  <Text>{apiKey.name}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontWeight="bold">状态:</Text>
                  <Badge colorScheme={getStatusColor(apiKey.status)}>
                    {apiKey.status === 'active' ? '激活' : 
                     apiKey.status === 'inactive' ? '未激活' :
                     apiKey.status === 'revoked' ? '已撤销' :
                     apiKey.status === 'expired' ? '已过期' : apiKey.status}
                  </Badge>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontWeight="bold">创建时间:</Text>
                  <Text>{formatDate(apiKey.created_at)}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontWeight="bold">最后更新:</Text>
                  <Text>{formatDate(apiKey.updated_at)}</Text>
                </HStack>
                
                {apiKey.expires_at && (
                  <HStack justify="space-between">
                    <Text fontWeight="bold">过期时间:</Text>
                    <Text>{formatDate(apiKey.expires_at)}</Text>
                  </HStack>
                )}
                
                <Divider />
                
                <HStack>
                  <Text fontWeight="bold">API密钥:</Text>
                  <Input 
                    value={apiKey.key.substring(0, 8) + '•'.repeat(24)}
                    isReadOnly
                    maxW="300px"
                  />
                  <Tooltip label={hasCopied ? "已复制!" : "复制密钥"}>
                    <IconButton
                      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                      onClick={() => onCopy(apiKey.key)}
                      aria-label="复制API密钥"
                    />
                  </Tooltip>
                  <Tooltip label="重新生成密钥">
                    <IconButton
                      icon={<RepeatIcon />}
                      onClick={regenerateDisclosure.onOpen}
                      aria-label="重新生成API密钥"
                    />
                  </Tooltip>
                </HStack>
                
                <Alert status="warning">
                  <AlertIcon />
                  请妥善保管您的API密钥，不要在公开场合或客户端代码中分享。
                </Alert>
              </VStack>
            </CardBody>
          </Card>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>使用情况</Heading>
                <Stat mb={2}>
                  <StatLabel>本月API调用次数</StatLabel>
                  <StatNumber>{apiKey.usage_count || 0}</StatNumber>
                  {apiKey.usage_trend && (
                    <StatHelpText>
                      <StatArrow type={apiKey.usage_trend > 0 ? 'increase' : 'decrease'} />
                      {Math.abs(apiKey.usage_trend)}% 相比上月
                    </StatHelpText>
                  )}
                </Stat>
                
                <Divider my={4} />
                
                <VStack align="start" spacing={2}>
                  <HStack>
                    <InfoIcon />
                    <Text fontSize="sm">
                      创建于 {formatDate(apiKey.created_at)}
                    </Text>
                  </HStack>
                  
                  <HStack>
                    <InfoIcon />
                    <Text fontSize="sm">
                      上次使用 {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : '从未使用'}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>权限</Heading>
                <VStack align="start" spacing={3}>
                  {apiKey.permissions && Object.entries(apiKey.permissions).map(([feature, enabled]) => (
                    <HStack key={feature} w="full" justify="space-between">
                      <Text>{getPermissionLabel(feature)}</Text>
                      <Badge colorScheme={enabled ? 'green' : 'gray'}>
                        {enabled ? '允许' : '禁止'}
                      </Badge>
                    </HStack>
                  ))}
                  
                  <Button 
                    colorScheme="blue" 
                    size="sm" 
                    mt={2}
                    onClick={permissionsDisclosure.onOpen}
                  >
                    管理权限
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
          
          <Tabs variant="enclosed" mb={6}>
            <TabList>
              <Tab>使用统计</Tab>
              <Tab>最近调用</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify="flex-end" mb={4}>
                  <Select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    width="200px"
                  >
                    <option value="1d">最近24小时</option>
                    <option value="7d">最近7天</option>
                    <option value="30d">最近30天</option>
                    <option value="90d">最近90天</option>
                  </Select>
                </Flex>
                
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>API调用统计 - {getTimeRangeLabel(timeRange)}</Heading>
                    <Box height="300px">
                      {usageStats && usageStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={usageStats}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                              }} 
                            />
                            <YAxis />
                            <ChartTooltip 
                              formatter={(value, name) => [value, '调用次数']}
                              labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#3182ce" 
                              activeDot={{ r: 8 }} 
                              name="调用次数"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                          <Text color="gray.500">暂无使用数据</Text>
                        </Box>
                      )}
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>最近API调用</Heading>
                    {recentCalls && recentCalls.length > 0 ? (
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>时间</Th>
                              <Th>端点</Th>
                              <Th>IP地址</Th>
                              <Th>状态</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {recentCalls.map((call) => (
                              <Tr key={call.id}>
                                <Td>{formatDate(call.timestamp)}</Td>
                                <Td>{call.endpoint}</Td>
                                <Td>{call.ip_address}</Td>
                                <Td>
                                  <Badge colorScheme={call.status === 'success' ? 'green' : 'red'}>
                                    {call.status === 'success' ? '成功' : '失败'}
                                  </Badge>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Text color="gray.500">暂无调用记录</Text>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          {/* 删除密钥确认对话框 */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>删除API密钥</ModalHeader>
              <ModalBody>
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  此操作无法撤销！删除后使用此密钥的所有服务将立即停止工作。
                </Alert>
                
                <Text mb={4}>
                  请输入密钥名称 <strong>{apiKey.name}</strong> 以确认删除:
                </Text>
                
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={`输入 "${apiKey.name}" 确认删除`}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  取消
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={deleteApiKey}
                  isDisabled={deleteConfirmText !== apiKey.name}
                >
                  确认删除
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          
          {/* 重新生成密钥确认对话框 */}
          <Modal isOpen={regenerateDisclosure.isOpen} onClose={regenerateDisclosure.onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>重新生成API密钥</ModalHeader>
              <ModalBody>
                <Alert status="warning" mb={4}>
                  <AlertIcon />
                  生成新密钥后，旧密钥将立即失效。使用旧密钥的所有服务将停止工作。
                </Alert>
                
                <Text>
                  确定要重新生成密钥 <strong>{apiKey.name}</strong> 吗？
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={regenerateDisclosure.onClose}>
                  取消
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={regenerateApiKey}
                  isLoading={isRegenerating}
                >
                  确认重新生成
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          
          {/* 权限管理对话框 */}
          <Modal isOpen={permissionsDisclosure.isOpen} onClose={permissionsDisclosure.onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>管理API密钥权限</ModalHeader>
              <ModalBody>
                <Text mb={4}>
                  设置此API密钥可访问的功能和端点:
                </Text>
                
                <VStack align="stretch" spacing={4}>
                  {apiKey.permissions && Object.entries(apiKey.permissions).map(([feature, enabled]) => (
                    <FormControl key={feature} display="flex" alignItems="center">
                      <FormLabel htmlFor={`permission-${feature}`} mb="0">
                        {getPermissionLabel(feature)}
                      </FormLabel>
                      <Switch 
                        id={`permission-${feature}`}
                        isChecked={enabled}
                        onChange={(e) => handlePermissionChange(feature, e.target.checked)}
                      />
                    </FormControl>
                  ))}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={permissionsDisclosure.onClose}>
                  取消
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={updatePermissions}
                  isLoading={updatingPermissions}
                >
                  保存权限
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Alert status="error">
          <AlertIcon />
          未找到API密钥信息
        </Alert>
      )}
    </Box>
  );
}

// 获取权限标签
function getPermissionLabel(permission) {
  const labels = {
    'analyze': '文本分析',
    'classify': '文本分类',
    'batch': '批量处理',
    'sentiment': '情感分析',
    'entities': '实体提取',
    'summarize': '文本摘要',
    'keywords': '关键词提取',
    'translate': '文本翻译'
  };
  
  return labels[permission] || permission;
}

export default ApiKeyDetail; 