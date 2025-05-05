import React, { useState } from 'react';
import {
  Box, Heading, Card, CardBody, VStack, FormControl, FormLabel,
  Input, Textarea, Button, Select, useToast, Alert, AlertIcon,
  SimpleGrid, Text, Link, Icon, Divider, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { EmailIcon, PhoneIcon, ChatIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Support() {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 表单输入处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // 提交支持请求
  const submitSupportRequest = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.category || !formData.description) {
      toast({
        title: '表单不完整',
        description: '请填写所有必填字段',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/support/create-ticket`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setShowSuccess(true);
        setFormData({
          subject: '',
          category: '',
          description: '',
          priority: 'medium'
        });
        
        window.scrollTo(0, 0);
      } else {
        throw new Error(response.data.message || '提交支持请求失败');
      }
    } catch (error) {
      console.error('Support request error:', error);
      
      toast({
        title: '提交支持请求失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Heading mb={6}>技术支持</Heading>
      
      {showSuccess && (
        <Alert 
          status="success" 
          mb={6} 
          borderRadius="md"
          alignItems="flex-start"
          flexDirection="column"
        >
          <AlertIcon mb={2} />
          <Box>
            <Text fontWeight="bold" mb={2}>
              您的支持请求已成功提交！
            </Text>
            <Text>
              我们已收到您的请求，支持团队将在24小时内与您联系。您也可以通过电子邮件、电话或在线聊天获取即时帮助。
            </Text>
          </Box>
        </Alert>
      )}
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <VStack spacing={6} align="stretch">
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>提交支持请求</Heading>
              
              <form onSubmit={submitSupportRequest}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>主题</FormLabel>
                    <Input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="简要描述您的问题"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>问题类别</FormLabel>
                    <Select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="选择问题类别"
                    >
                      <option value="api_error">API错误</option>
                      <option value="billing">账单问题</option>
                      <option value="account">账户管理</option>
                      <option value="feature_request">功能请求</option>
                      <option value="integration">集成问题</option>
                      <option value="other">其他问题</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>详细描述</FormLabel>
                    <Textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="请详细描述您遇到的问题，包括任何错误信息和重现步骤"
                      rows={5}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>优先级</FormLabel>
                    <Select 
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">低 - 功能请求或一般咨询</option>
                      <option value="medium">中 - 影响工作但有替代方案</option>
                      <option value="high">高 - 严重影响业务运营</option>
                      <option value="critical">紧急 - 系统完全无法使用</option>
                    </Select>
                  </FormControl>
                  
                  <Button 
                    type="submit" 
                    colorScheme="blue" 
                    isLoading={isSubmitting}
                    mt={2}
                  >
                    提交请求
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>常见问题解答</Heading>
              
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        如何重置我的API密钥？
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      您可以在API密钥详情页面中找到"重新生成"选项。请注意，重新生成密钥后，
                      旧密钥将立即失效，使用旧密钥的所有服务都需要更新为新密钥。
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        如何升级我的计划？
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      您可以在<Link color="blue.500" href="/billing">计费管理</Link>页面中
                      查看可用的计划并进行升级。升级立即生效，费用将按比例计算到您的下一个结算周期。
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        我的API调用返回错误，该怎么办？
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      首先，检查您使用的API密钥是否正确，并确保您遵循了API文档中的请求格式。
                      查看<Link color="blue.500" href="/documentation">文档中的错误处理部分</Link>，
                      了解常见错误代码和解决方法。如问题继续存在，请提交支持请求并附上完整的错误信息。
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        如何查看我的API使用情况？
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      您可以在<Link color="blue.500" href="/usage">使用统计</Link>页面查看详细的
                      API使用情况，包括按时间、端点和API密钥的使用分析。
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        我可以限制我的API密钥的使用范围吗？
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      是的，您可以在创建或编辑API密钥时设置权限，限制密钥可以访问的特定API端点。
                      此外，您还可以在<Link color="blue.500" href="/settings">设置</Link>页面中
                      配置IP地址限制，只允许特定IP使用您的API密钥。
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        </VStack>
        
        <VStack spacing={6} align="stretch">
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>联系我们</Heading>
              
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>电子邮件支持</Text>
                  <Link 
                    href="mailto:support@example.com" 
                    display="flex" 
                    alignItems="center"
                    color="blue.500"
                  >
                    <EmailIcon mr={2} />
                    support@example.com
                  </Link>
                  <Text fontSize="sm" mt={1} color="gray.500">
                    24小时内回复
                  </Text>
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontWeight="bold" mb={2}>电话支持</Text>
                  <Link 
                    href="tel:+8610123456789" 
                    display="flex" 
                    alignItems="center"
                    color="blue.500"
                  >
                    <PhoneIcon mr={2} />
                    +86 (10) 1234-5678
                  </Link>
                  <Text fontSize="sm" mt={1} color="gray.500">
                    工作日 9:00 - 18:00 (北京时间)
                  </Text>
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontWeight="bold" mb={2}>在线聊天</Text>
                  <Link 
                    href="#" 
                    display="flex" 
                    alignItems="center"
                    color="blue.500"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "聊天功能即将推出",
                        description: "我们正在开发在线聊天功能，敬请期待！",
                        status: "info",
                        duration: 3000,
                      });
                    }}
                  >
                    <ChatIcon mr={2} />
                    启动在线聊天
                  </Link>
                  <Text fontSize="sm" mt={1} color="gray.500">
                    专业版和企业版用户专享
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>支持资源</Heading>
              
              <VStack spacing={4} align="stretch">
                <Link 
                  href="/documentation" 
                  display="flex" 
                  alignItems="center"
                  color="blue.500"
                >
                  <ExternalLinkIcon mr={2} />
                  API文档
                </Link>
                
                <Link 
                  href="#" 
                  display="flex" 
                  alignItems="center"
                  color="blue.500"
                  isExternal
                >
                  <ExternalLinkIcon mr={2} />
                  开发者博客
                </Link>
                
                <Link 
                  href="#" 
                  display="flex" 
                  alignItems="center"
                  color="blue.500"
                  isExternal
                >
                  <ExternalLinkIcon mr={2} />
                  GitHub 示例代码
                </Link>
                
                <Link 
                  href="#" 
                  display="flex" 
                  alignItems="center"
                  color="blue.500"
                  isExternal
                >
                  <ExternalLinkIcon mr={2} />
                  社区论坛
                </Link>
                
                <Link 
                  href="#" 
                  display="flex" 
                  alignItems="center"
                  color="blue.500"
                  isExternal
                >
                  <ExternalLinkIcon mr={2} />
                  视频教程
                </Link>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>支持计划</Heading>
              
              <VStack spacing={3} align="stretch">
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">免费版支持</Text>
                  <Text fontSize="sm">电子邮件支持 (48小时响应)</Text>
                </Box>
                
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">基础版支持</Text>
                  <Text fontSize="sm">电子邮件支持 (24小时响应)</Text>
                </Box>
                
                <Box p={3} borderWidth="1px" borderRadius="md" bg="blue.50" borderColor="blue.200">
                  <Text fontWeight="bold">专业版支持</Text>
                  <Text fontSize="sm">优先电子邮件支持 (12小时响应)</Text>
                  <Text fontSize="sm">工作时间电话支持</Text>
                </Box>
                
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">企业版支持</Text>
                  <Text fontSize="sm">优先电子邮件支持 (4小时响应)</Text>
                  <Text fontSize="sm">24/7紧急电话支持</Text>
                  <Text fontSize="sm">专属技术支持经理</Text>
                  <Text fontSize="sm">月度技术审查</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}

export default Support; 