import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td, 
  TableContainer, Button, Badge, useToast, HStack, IconButton,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, FormControl, FormLabel, Input, Select,
  Switch, Text, Alert, AlertIcon, Tooltip, Spinner, Flex, InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { 
  AddIcon, DeleteIcon, EditIcon, SearchIcon, CheckIcon, CloseIcon
} from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true
  });
  
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteDisclosure = useDisclosure();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } else {
        throw new Error(response.data.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('Users error:', error);
      
      toast({
        title: '获取用户列表失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // 搜索过滤
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // 打开添加用户模态框
  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      is_active: true
    });
    onOpen();
  };
  
  // 打开编辑用户模态框
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // 不显示现有密码
      role: user.role,
      is_active: user.is_active
    });
    onOpen();
  };
  
  // 打开删除用户确认模态框
  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    deleteDisclosure.onOpen();
  };
  
  // 保存用户（添加或更新）
  const saveUser = async () => {
    // 表单验证
    if (!formData.username || !formData.email || (!currentUser && !formData.password)) {
      toast({
        title: '请填写所有必填字段',
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
      
      let response;
      
      if (currentUser) {
        // 更新用户
        response = await axios.put(`${apiUrl}/admin/users/${currentUser.id}`, {
          ...formData,
          // 如果密码为空，则不更新密码
          password: formData.password || undefined
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // 添加用户
        response = await axios.post(`${apiUrl}/admin/users`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      if (response.data.success) {
        toast({
          title: currentUser ? '用户已更新' : '用户已添加',
          status: 'success',
          duration: 3000,
        });
        
        fetchUsers();
        onClose();
      } else {
        throw new Error(response.data.message || (currentUser ? '更新用户失败' : '添加用户失败'));
      }
    } catch (error) {
      console.error('Save user error:', error);
      
      toast({
        title: currentUser ? '更新用户失败' : '添加用户失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  // 删除用户
  const deleteUser = async () => {
    if (!currentUser) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.delete(`${apiUrl}/admin/users/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast({
          title: '用户已删除',
          status: 'success',
          duration: 3000,
        });
        
        fetchUsers();
        deleteDisclosure.onClose();
      } else {
        throw new Error(response.data.message || '删除用户失败');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      
      toast({
        title: '删除用户失败',
        description: error.response?.data?.message || error.message || '请稍后再试',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  // 获取角色徽章颜色
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'red',
      moderator: 'purple',
      user: 'blue'
    };
    
    return colors[role] || 'gray';
  };

  return (
    <Box>
      <Heading mb={6}>用户管理</Heading>
      
      <Card mb={6}>
        <CardBody>
          <Flex justify="space-between" mb={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="搜索用户..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="blue"
              onClick={handleAddUser}
            >
              添加用户
            </Button>
          </Flex>
          
          {loading ? (
            <Flex justify="center" my={10}>
              <Spinner size="xl" />
            </Flex>
          ) : filteredUsers.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              没有找到符合条件的用户
            </Alert>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>用户名</Th>
                    <Th>电子邮箱</Th>
                    <Th>角色</Th>
                    <Th>状态</Th>
                    <Th>注册时间</Th>
                    <Th width="120px">操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.username}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge colorScheme={getRoleBadgeColor(user.role)}>
                          {user.role === 'admin' ? '管理员' : 
                           user.role === 'moderator' ? '协管员' : '普通用户'}
                        </Badge>
                      </Td>
                      <Td>
                        <Flex align="center">
                          {user.is_active ? (
                            <>
                              <CheckIcon color="green.500" mr={2} />
                              <Text color="green.500">活跃</Text>
                            </>
                          ) : (
                            <>
                              <CloseIcon color="red.500" mr={2} />
                              <Text color="red.500">禁用</Text>
                            </>
                          )}
                        </Flex>
                      </Td>
                      <Td>{new Date(user.created_at).toLocaleString('zh-CN')}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="编辑用户">
                            <IconButton
                              size="sm"
                              icon={<EditIcon />}
                              onClick={() => handleEditUser(user)}
                              aria-label="编辑用户"
                            />
                          </Tooltip>
                          <Tooltip label="删除用户">
                            <IconButton
                              size="sm"
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(user)}
                              aria-label="删除用户"
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
      
      {/* 添加/编辑用户模态框 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentUser ? '编辑用户' : '添加用户'}
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>用户名</FormLabel>
              <Input 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </FormControl>
            
            <FormControl mb={4} isRequired>
              <FormLabel>电子邮箱</FormLabel>
              <Input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            
            <FormControl mb={4} isRequired={!currentUser}>
              <FormLabel>{currentUser ? '新密码 (留空不更改)' : '密码'}</FormLabel>
              <Input 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>角色</FormLabel>
              <Select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">普通用户</option>
                <option value="moderator">协管员</option>
                <option value="admin">管理员</option>
              </Select>
            </FormControl>
            
            <FormControl display="flex" alignItems="center" mb={4}>
              <FormLabel htmlFor="is-active" mb="0">
                账户状态
              </FormLabel>
              <Switch 
                id="is-active"
                name="is_active"
                isChecked={formData.is_active}
                onChange={handleInputChange}
              />
              <Text ml={2}>{formData.is_active ? '活跃' : '禁用'}</Text>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button colorScheme="blue" onClick={saveUser}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* 删除用户确认模态框 */}
      <Modal isOpen={deleteDisclosure.isOpen} onClose={deleteDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>确认删除</ModalHeader>
          <ModalBody>
            <Alert status="error" mb={4}>
              <AlertIcon />
              此操作无法撤销！删除用户将同时删除与该用户关联的所有数据。
            </Alert>
            
            {currentUser && (
              <Text>
                确定要删除用户 <strong>{currentUser.username}</strong> 吗？
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={deleteDisclosure.onClose}>
              取消
            </Button>
            <Button colorScheme="red" onClick={deleteUser}>
              确认删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Users; 