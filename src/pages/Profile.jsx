import React, { useState, useEffect } from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, Card, CardBody,
  useToast, VStack, HStack, Text, Divider, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    created_at: null
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateEmail, setUpdateEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 获取个人资料
  const fetchProfile = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setProfile(response.data.profile);
        setUpdateEmail(response.data.profile.email);
      } else {
        throw new Error(response.data.message || '获取个人资料失败');
      }
    } catch (error) {
      console.error('Profile error:', error);
      
      toast({
        title: '获取个人资料失败',
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
    fetchProfile();
  }, []);
  
  // 更新个人资料
  const updateProfile = async () => {
    if (!currentPassword) {
      toast({
        title: '请输入当前密码',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: '新密码不匹配',
        description: '请确保两次输入的新密码相同',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (newPassword && newPassword.length < 6) {
      toast({
        title: '新密码太短',
        description: '密码长度至少为6个字符',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setUpdateLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${apiUrl}/user/update-profile`, {
        email: updateEmail,
        current_password: currentPassword,
        new_password: newPassword || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast({
          title: '个人资料已更新',
          status: 'success',
          duration: 3000,
        });
        
        // 清空密码字段
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // 如果密码已更改，退出登录
        if (newPassword) {
          toast({
            title: '密码已更改',
            description: '请使用新密码重新登录',
            status: 'info',
            duration: 3000,
          });
          
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }, 2000);
        } else {
          // 重新获取个人资料
          fetchProfile();
        }
      } else {
        throw new Error(response.data.message || '更新个人资料失败');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      toast({
        title: '更新个人资料失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUpdateLoading(false);
      onClose();
    }
  };
  
  // 退出登录
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box>
      <Heading mb={6}>个人资料</Heading>
      
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack>
              <Text fontWeight="bold" width="150px">用户名:</Text>
              <Text>{profile.username}</Text>
            </HStack>
            
            <HStack>
              <Text fontWeight="bold" width="150px">电子邮箱:</Text>
              <Text>{profile.email}</Text>
            </HStack>
            
            <HStack>
              <Text fontWeight="bold" width="150px">注册时间:</Text>
              <Text>
                {profile.created_at 
                  ? new Date(profile.created_at).toLocaleString() 
                  : '未知'}
              </Text>
            </HStack>
            
            <Divider my={2} />
            
            <Button colorScheme="blue" onClick={onOpen}>
              修改个人资料
            </Button>
            
            <Button colorScheme="red" variant="outline" onClick={logout}>
              退出登录
            </Button>
          </VStack>
        </CardBody>
      </Card>
      
      {/* 修改个人资料对话框 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改个人资料</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>用户名</FormLabel>
                <Input 
                  value={profile.username}
                  isReadOnly
                  bg="gray.100"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>电子邮箱</FormLabel>
                <Input 
                  type="email"
                  value={updateEmail}
                  onChange={(e) => setUpdateEmail(e.target.value)}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>当前密码</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
              
              <Divider />
              
              <Text fontWeight="bold">更改密码 (可选)</Text>
              
              <FormControl>
                <FormLabel>新密码</FormLabel>
                <InputGroup>
                  <Input 
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? '隐藏密码' : '显示密码'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel>确认新密码</FormLabel>
                <Input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={updateProfile}
              isLoading={updateLoading}
            >
              保存更改
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Profile;
