import React, { useState, useEffect } from 'react';
import {
  Box, Flex, HStack, IconButton, Button, Menu, MenuButton, MenuList, MenuItem,
  MenuDivider, useDisclosure, Stack, Image, Text, useColorModeValue, useColorMode,
  Avatar, Container, Divider
} from '@chakra-ui/react';
import { 
  HamburgerIcon, CloseIcon, ChevronDownIcon, MoonIcon, SunIcon
} from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// 导航菜单项配置
const Links = [
  { name: '首页', to: '/' },
  { name: '控制面板', to: '/dashboard', auth: true },
  { name: 'API密钥', to: '/api-keys', auth: true },
  { name: '使用统计', to: '/usage', auth: true },
  { name: '文档', to: '/documentation' },
];

// 菜单项链接组件
const NavLink = ({ children, to, onClick }) => (
  <Box
    as={RouterLink}
    to={to}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    onClick={onClick}
  >
    {children}
  </Box>
);

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  // 检查用户登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        setUserInfo(JSON.parse(user));
      } catch (e) {
        console.error('Failed to parse user info');
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []);
  
  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate('/login');
  };
  
  // 用户是否为管理员
  const isAdmin = userInfo?.role === 'admin';
  
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} px={4} boxShadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          
          <HStack spacing={8} alignItems={'center'}>
            <Box as={RouterLink} to="/" fontWeight="bold" fontSize="xl">
              API密钥管理
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                (!link.auth || (link.auth && isLoggedIn)) && (
                  <NavLink key={link.name} to={link.to}>
                    {link.name}
                  </NavLink>
                )
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Button mr={4} onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            
            {isLoggedIn ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <HStack>
                    <Avatar
                      size={'sm'}
                      name={userInfo?.username || '用户'}
                    />
                    <Text display={{ base: 'none', md: 'flex' }}>
                      {userInfo?.username || '用户'}
                    </Text>
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">个人资料</MenuItem>
                  <MenuItem as={RouterLink} to="/settings">系统设置</MenuItem>
                  <MenuItem as={RouterLink} to="/billing">计费管理</MenuItem>
                  <MenuItem as={RouterLink} to="/support">技术支持</MenuItem>
                  
                  {isAdmin && (
                    <>
                      <MenuDivider />
                      <MenuItem as={RouterLink} to="/admin/dashboard">管理控制台</MenuItem>
                      <MenuItem as={RouterLink} to="/admin/users">用户管理</MenuItem>
                    </>
                  )}
                  
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>退出登录</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={4}>
                <Button as={RouterLink} to="/login" variant="ghost">
                  登录
                </Button>
                <Button 
                  as={RouterLink} 
                  to="/register" 
                  colorScheme="blue" 
                  display={{ base: 'none', md: 'inline-flex' }}
                >
                  注册
                </Button>
              </HStack>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                (!link.auth || (link.auth && isLoggedIn)) && (
                  <NavLink key={link.name} to={link.to} onClick={onClose}>
                    {link.name}
                  </NavLink>
                )
              ))}
              
              {!isLoggedIn && (
                <NavLink to="/register" onClick={onClose}>
                  注册
                </NavLink>
              )}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}

export default Navbar; 