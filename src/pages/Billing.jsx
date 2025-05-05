import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Card, CardBody, VStack, HStack, Text, Button, Badge,
  Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid,
  useToast, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Billing() {
  const [billingInfo, setBillingInfo] = useState({
    plan: 'free',
    usage_count: 0,
    usage_limit: 100,
    last_billing_date: null,
    bills: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 获取计费信息
  const fetchBillingInfo = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/billing/info`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setBillingInfo(response.data.billingInfo);
        setSelectedPlan(response.data.billingInfo.plan);
      } else {
        throw new Error(response.data.message || '获取计费信息失败');
      }
    } catch (error) {
      console.error('Billing info error:', error);
      
      toast({
        title: '获取计费信息失败',
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
    fetchBillingInfo();
  }, []);
  
  // 更新计划
  const updatePlan = async () => {
    if (selectedPlan === billingInfo.plan) {
      onClose();
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/billing/update-plan`, {
        plan: selectedPlan
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast({
          title: '计划已更新',
          description: `您的计划已更新为${getPlanName(selectedPlan)}`,
          status: 'success',
          duration: 3000,
        });
        
        fetchBillingInfo();
      } else {
        throw new Error(response.data.message || '更新计划失败');
      }
    } catch (error) {
      console.error('Update plan error:', error);
      
      toast({
        title: '更新计划失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
    }
  };
  
  // 获取计划名称
  const getPlanName = (planCode) => {
    const plans = {
      free: '免费版',
      basic: '基础版',
      pro: '专业版',
      enterprise: '企业版'
    };
    
    return plans[planCode] || planCode;
  };
  
  // 获取计划描述
  const getPlanDescription = (planCode) => {
    const descriptions = {
      free: '每月100次免费API调用',
      basic: '5元/1000次API调用',
      pro: '3元/1000次API调用',
      enterprise: '1元/1000次API调用'
    };
    
    return descriptions[planCode] || '';
  };

  return (
    <Box>
      <Heading mb={6}>计费管理</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>当前计划</Heading>
            <Stat mb={4}>
              <StatLabel>计划类型</StatLabel>
              <StatNumber>{getPlanName(billingInfo.plan)}</StatNumber>
              <StatHelpText>{getPlanDescription(billingInfo.plan)}</StatHelpText>
            </Stat>
            
            <HStack>
              <Button colorScheme="blue" onClick={onOpen}>
                更改计划
              </Button>
            </HStack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>使用情况</Heading>
            <Stat mb={4}>
              <StatLabel>API调用次数</StatLabel>
              <StatNumber>{billingInfo.usage_count}</StatNumber>
              <StatHelpText>
                限制: {billingInfo.plan === 'free' ? billingInfo.usage_limit : '无限制'}
              </StatHelpText>
            </Stat>
            
            {billingInfo.last_billing_date && (
              <Text>上次结算: {new Date(billingInfo.last_billing_date).toLocaleDateString()}</Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Card mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>计划比较</Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <PlanCard 
              name="免费版" 
              description="适合个人开发者" 
              price="0元" 
              features={["每月100次免费调用", "基本API使用统计", "单API密钥"]} 
              isActive={billingInfo.plan === 'free'}
              onSelect={() => { setSelectedPlan('free'); onOpen(); }}
            />
            
            <PlanCard 
              name="基础版" 
              description="适合小型应用" 
              price="5元/1000次" 
              features={["无限API调用", "详细使用统计", "最多3个API密钥"]} 
              isActive={billingInfo.plan === 'basic'}
              onSelect={() => { setSelectedPlan('basic'); onOpen(); }}
            />
            
            <PlanCard 
              name="专业版" 
              description="适合中型企业" 
              price="3元/1000次" 
              features={["无限API调用", "高级分析功能", "无限API密钥", "优先技术支持"]} 
              isActive={billingInfo.plan === 'pro'}
              onSelect={() => { setSelectedPlan('pro'); onOpen(); }}
            />
            
            <PlanCard 
              name="企业版" 
              description="适合大型企业" 
              price="1元/1000次" 
              features={["无限API调用", "企业级分析功能", "无限API密钥", "24/7技术支持", "自定义方案"]} 
              isActive={billingInfo.plan === 'enterprise'}
              onSelect={() => { setSelectedPlan('enterprise'); onOpen(); }}
            />
          </SimpleGrid>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>账单历史</Heading>
          {billingInfo.bills && billingInfo.bills.length > 0 ? (
            <VStack align="stretch" spacing={4}>
              {billingInfo.bills.map((bill) => (
                <Card key={bill.id} variant="outline">
                  <CardBody>
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="bold">
                          {new Date(bill.billing_period).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                        </Text>
                        <Text>调用次数: {bill.call_count}</Text>
                        <Text>计划: {getPlanName(bill.plan)}</Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontWeight="bold">金额: ¥{bill.amount.toFixed(2)}</Text>
                        <Badge colorScheme={bill.paid ? 'green' : 'orange'}>
                          {bill.paid ? '已支付' : '未支付'}
                        </Badge>
                      </Box>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            <Text>暂无账单记录</Text>
          )}
        </CardBody>
      </Card>
      
      {/* 计划更改确认对话框 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>更改计划</ModalHeader>
          <ModalBody>
            <Text mb={4}>您当前的计划是: <strong>{getPlanName(billingInfo.plan)}</strong></Text>
            
            <Text mb={4}>选择新计划:</Text>
            <RadioGroup value={selectedPlan} onChange={setSelectedPlan}>
              <Stack spacing={4}>
                <Radio value="free">免费版 - 0元 (100次/月)</Radio>
                <Radio value="basic">基础版 - 5元/1000次</Radio>
                <Radio value="pro">专业版 - 3元/1000次</Radio>
                <Radio value="enterprise">企业版 - 1元/1000次</Radio>
              </Stack>
            </RadioGroup>
            
            {selectedPlan !== billingInfo.plan ? (
              <Text mt={4} fontWeight="bold">
                您将从{getPlanName(billingInfo.plan)}切换到{getPlanName(selectedPlan)}
              </Text>
            ) : (
              <Text mt={4}>您没有更改计划</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={updatePlan}
              isDisabled={selectedPlan === billingInfo.plan}
            >
              确认更改
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// 计划卡片组件
function PlanCard({ name, description, price, features, isActive, onSelect }) {
  return (
    <Card 
      variant="outline" 
      borderWidth={isActive ? 2 : 1}
      borderColor={isActive ? 'blue.500' : 'gray.200'}
    >
      <CardBody>
        <VStack align="start" spacing={4}>
          <Heading size="md">{name}</Heading>
          <Text color="gray.500">{description}</Text>
          <Text fontSize="2xl" fontWeight="bold">{price}</Text>
          
          <VStack align="start" spacing={2}>
            {features.map((feature, index) => (
              <Text key={index}>✓ {feature}</Text>
            ))}
          </VStack>
          
          <Button 
            colorScheme={isActive ? 'gray' : 'blue'} 
            width="full"
            onClick={onSelect}
          >
            {isActive ? '当前计划' : '选择此计划'}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default Billing;
