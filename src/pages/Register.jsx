import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Heading,
  useToast, Card, CardBody, CardHeader, Text, InputGroup, InputRightElement, IconButton, Alert, AlertIcon
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('请填写所有字段');
      toast({
        title: '请填写所有字段',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMsg('密码不匹配');
      toast({
        title: '密码不匹配',
        description: '请确保两次输入的密码相同',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg('密码太短');
      toast({
        title: '密码太短',
        description: '密码长度至少为6个字符',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('提交注册表单...', {name, email});
      
      // 提示测试账号用法
      if (!email.includes('@test.com')) {
        console.log('提示：使用@test.com域名的邮箱可以模拟注册流程');
      }
      
      const result = await register({ name, email, password });
      console.log('注册API返回:', result);
      
      toast({
        title: '注册成功',
        description: '账户已创建，请登录',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // 清空表单
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // 跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('注册过程发生错误:', error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || '未知错误');
      setErrorMsg(errorMessage);
      toast({
        title: '注册失败',
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
          <Heading size="lg" textAlign="center">用户注册</Heading>
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
              <FormLabel>姓名</FormLabel>
              <Input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
            
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
            
            <FormControl mb={4}>
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
            
            <FormControl mb={6}>
              <FormLabel>确认密码</FormLabel>
              <Input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormControl>
            
            <Button 
              colorScheme="blue" 
              type="submit" 
              width="full"
              isLoading={loading}
              mb={4}
            >
              注册
            </Button>
            
            <Text textAlign="center">
              已有账号？<Link to="/login" style={{ color: 'blue' }}>立即登录</Link>
            </Text>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Register;
