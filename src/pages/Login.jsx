import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Heading,
  useToast, Card, CardBody, CardHeader, Text, InputGroup, InputRightElement, IconButton, Alert, AlertIcon
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('请填写所有字段');
      toast({
        title: '请填写所有字段',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('提交登录表单...', {email});
      
      // 提示测试账号用法
      if (!email.includes('@test.com')) {
        console.log('提示：使用@test.com域名的邮箱可以模拟登录流程');
      }
      
      const result = await login({ email, password });
      console.log('登录成功:', result?.user?.email);
      
      toast({
        title: '登录成功',
        status: 'success',
        duration: 2000,
      });
      
      // 登录成功后导航到仪表板
      navigate('/dashboard');
    } catch (error) {
      console.error('登录过程发生错误:', error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || '账号或密码错误');
      setErrorMsg(errorMessage);
      toast({
        title: '登录失败',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto">
      <Card>
        <CardHeader>
          <Heading size="lg" textAlign="center">用户登录</Heading>
        </CardHeader>
        <CardBody>
          {errorMsg && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {errorMsg}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>电子邮箱</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@test.com可用于测试"
                required
              />
            </FormControl>
            
            <FormControl mb={6}>
              <FormLabel>密码</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            
            <Button 
              colorScheme="blue" 
              type="submit" 
              width="full"
              isLoading={loading}
              mb={4}
            >
              登录
            </Button>
            
            <Text textAlign="center">
              还没有账号？<Link to="/register" style={{ color: 'blue' }}>立即注册</Link>
            </Text>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Login;