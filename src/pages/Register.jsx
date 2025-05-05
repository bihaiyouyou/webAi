import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Heading,
  useToast, Card, CardBody, CardHeader, Text, InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: '请填写所有字段',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: '密码不匹配',
        description: '请确保两次输入的密码相同',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (password.length < 6) {
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
      const response = await axios.post(`${apiUrl}/auth/register`, {
        username,
        email,
        password
      });
      
      if (response.data.success) {
        toast({
          title: '注册成功',
          description: `您的API密钥: ${response.data.api_key}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // 清空表单
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // 跳转到登录页面
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(response.data.message || '注册失败');
      }
    } catch (error) {
      toast({
        title: '注册失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
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
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>用户名</FormLabel>
              <Input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>电子邮箱</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
