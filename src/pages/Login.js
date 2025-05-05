import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Heading,
  useToast, Card, CardBody, CardHeader, Text, InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: '请填写所有字段',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username, 
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast({
          title: '登录成功',
          status: 'success',
          duration: 2000,
        });
        
        // 根据用户角色导航到不同页面
        if (response.data.user.is_admin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error(response.data.message || '登录失败');
      }
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.response?.data?.message || error.message || '请检查用户名和密码',
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
          <Heading size="lg" textAlign="center">用户登录</Heading>
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