import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Card, CardBody, VStack, Switch, FormControl, FormLabel,
  Select, Button, useToast, Divider, SimpleGrid, Text, useColorMode,
  Tabs, TabList, TabPanels, Tab, TabPanel, Badge
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email_alerts: false,
      usage_warnings: false,
      security_alerts: true,
      billing_alerts: true
    },
    security: {
      two_factor_auth: false,
      ip_restrictions: false,
      allowed_ips: [],
      session_timeout: 30
    },
    preferences: {
      theme: 'system',
      language: 'zh-CN',
      date_format: 'YYYY-MM-DD'
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 获取用户设置
  const fetchSettings = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/user/settings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSettings(response.data.settings);
      } else {
        throw new Error(response.data.message || '获取设置失败');
      }
    } catch (error) {
      console.error('Settings error:', error);
      
      toast({
        title: '获取设置失败',
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
    fetchSettings();
  }, []);
  
  // 更新设置
  const saveSettings = async () => {
    setSaveLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/user/update-settings`, {
        settings
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast({
          title: '设置已更新',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(response.data.message || '更新设置失败');
      }
    } catch (error) {
      console.error('Update settings error:', error);
      
      toast({
        title: '更新设置失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaveLoading(false);
    }
  };
  
  // 更新通知设置
  const handleNotificationChange = (field) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: !settings.notifications[field]
      }
    });
  };
  
  // 更新安全设置
  const handleSecurityChange = (field, value) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [field]: value === undefined ? !settings.security[field] : value
      }
    });
  };
  
  // 更新偏好设置
  const handlePreferenceChange = (field, value) => {
    // 特殊处理主题
    if (field === 'theme' && value === 'dark' && colorMode === 'light') {
      toggleColorMode();
    } else if (field === 'theme' && value === 'light' && colorMode === 'dark') {
      toggleColorMode();
    }
    
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [field]: value
      }
    });
  };

  return (
    <Box>
      <Heading mb={6}>系统设置</Heading>
      
      <Tabs variant="enclosed" isLazy>
        <TabList>
          <Tab>通知设置</Tab>
          <Tab>安全设置</Tab>
          <Tab>界面偏好</Tab>
        </TabList>
        
        <TabPanels>
          {/* 通知设置 */}
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="bold">电子邮件通知</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0">
                      API调用异常提醒
                    </FormLabel>
                    <Switch 
                      id="email-alerts"
                      isChecked={settings.notifications.email_alerts}
                      onChange={() => handleNotificationChange('email_alerts')}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="usage-warnings" mb="0">
                      使用量警告
                    </FormLabel>
                    <Switch 
                      id="usage-warnings"
                      isChecked={settings.notifications.usage_warnings}
                      onChange={() => handleNotificationChange('usage_warnings')}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="security-alerts" mb="0">
                      安全警报
                    </FormLabel>
                    <Switch 
                      id="security-alerts"
                      isChecked={settings.notifications.security_alerts}
                      onChange={() => handleNotificationChange('security_alerts')}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="billing-alerts" mb="0">
                      账单提醒
                    </FormLabel>
                    <Switch 
                      id="billing-alerts"
                      isChecked={settings.notifications.billing_alerts}
                      onChange={() => handleNotificationChange('billing_alerts')}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* 安全设置 */}
          <TabPanel>
            <Card mb={4}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="bold">账户安全</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="two-factor-auth" mb="0">
                      两步验证
                    </FormLabel>
                    <Switch 
                      id="two-factor-auth"
                      isChecked={settings.security.two_factor_auth}
                      onChange={() => handleSecurityChange('two_factor_auth')}
                    />
                  </FormControl>
                  
                  {settings.security.two_factor_auth && (
                    <Text fontSize="sm" color="green.500">
                      两步验证已启用 <Badge colorScheme="green">已保护</Badge>
                    </Text>
                  )}
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="ip-restrictions" mb="0">
                      IP地址限制
                    </FormLabel>
                    <Switch 
                      id="ip-restrictions"
                      isChecked={settings.security.ip_restrictions}
                      onChange={() => handleSecurityChange('ip_restrictions')}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel htmlFor="session-timeout">会话超时(分钟)</FormLabel>
                    <Select 
                      id="session-timeout"
                      value={settings.security.session_timeout}
                      onChange={(e) => handleSecurityChange('session_timeout', Number(e.target.value))}
                    >
                      <option value={15}>15分钟</option>
                      <option value={30}>30分钟</option>
                      <option value={60}>1小时</option>
                      <option value={120}>2小时</option>
                      <option value={240}>4小时</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="bold">API访问安全</Text>
                  
                  <FormControl>
                    <FormLabel htmlFor="rate-limit">API请求速率限制</FormLabel>
                    <Select 
                      id="rate-limit"
                      value={settings.security.rate_limit}
                      onChange={(e) => handleSecurityChange('rate_limit', Number(e.target.value))}
                    >
                      <option value={100}>100请求/分钟</option>
                      <option value={500}>500请求/分钟</option>
                      <option value={1000}>1000请求/分钟</option>
                      <option value={5000}>5000请求/分钟</option>
                    </Select>
                  </FormControl>
                  
                  <Text fontSize="sm" color="blue.500">
                    注意：API速率限制取决于您的账户计划
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* 界面偏好 */}
          <TabPanel>
            <Card>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel htmlFor="theme">主题</FormLabel>
                    <Select 
                      id="theme"
                      value={settings.preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    >
                      <option value="system">跟随系统</option>
                      <option value="light">浅色模式</option>
                      <option value="dark">深色模式</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel htmlFor="language">语言</FormLabel>
                    <Select 
                      id="language"
                      value={settings.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English (US)</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel htmlFor="date-format">日期格式</FormLabel>
                    <Select 
                      id="date-format"
                      value={settings.preferences.date_format}
                      onChange={(e) => handlePreferenceChange('date_format', e.target.value)}
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel htmlFor="timezone">时区</FormLabel>
                    <Select 
                      id="timezone"
                      value={settings.preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    >
                      <option value="Asia/Shanghai">中国标准时间 (GMT+8)</option>
                      <option value="Asia/Hong_Kong">香港时间 (GMT+8)</option>
                      <option value="America/New_York">美国东部时间 (GMT-5)</option>
                      <option value="Europe/London">英国时间 (GMT+0)</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Box mt={6} textAlign="right">
        <Button 
          colorScheme="blue" 
          onClick={saveSettings}
          isLoading={saveLoading}
        >
          保存设置
        </Button>
      </Box>
    </Box>
  );
}

export default Settings; 