import React from 'react';
import { Box, VStack, Heading, List, ListItem, Flex, Text, Divider, Icon } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../config';
import { 
  FiHome, FiKey, FiBarChart2, FiCreditCard, FiUser, 
  FiSettings, FiBookOpen, FiHelpCircle, FiShield 
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: '仪表盘', path: ROUTES.DASHBOARD, icon: FiHome },
    { name: 'API密钥', path: ROUTES.API_KEYS, icon: FiKey },
    { name: '使用统计', path: ROUTES.USAGE, icon: FiBarChart2 },
    { name: '账单管理', path: ROUTES.BILLING, icon: FiCreditCard },
    { name: '个人资料', path: ROUTES.PROFILE, icon: FiUser },
    { name: '设置', path: ROUTES.SETTINGS, icon: FiSettings },
  ];
  
  const helpItems = [
    { name: '文档', path: ROUTES.DOCUMENTATION, icon: FiBookOpen },
    { name: '支持', path: ROUTES.SUPPORT, icon: FiHelpCircle },
  ];
  
  const isActiveRoute = (path) => {
    return location.pathname === path || 
      (path !== ROUTES.DASHBOARD && location.pathname.startsWith(path));
  };

  return (
    <Box 
      as="nav" 
      width="250px"
      px={4}
      py={6}
      bg="gray.50"
      borderRight="1px"
      borderColor="gray.200"
      height="calc(100vh - 64px)"
      position="sticky"
      top="64px"
    >
      <VStack spacing={6} align="stretch">
        <List spacing={1}>
          {menuItems.map((item) => (
            <ListItem key={item.path}>
              <Box
                as={RouterLink}
                to={item.path}
                display="flex"
                alignItems="center"
                px={3}
                py={2}
                borderRadius="md"
                transition="all 0.2s"
                bg={isActiveRoute(item.path) ? 'blue.100' : 'transparent'}
                color={isActiveRoute(item.path) ? 'blue.700' : 'gray.700'}
                fontWeight={isActiveRoute(item.path) ? 'bold' : 'normal'}
                _hover={{
                  bg: 'blue.50',
                  color: 'blue.700',
                }}
              >
                <Icon as={item.icon} mr={3} boxSize={5} />
                <Text>{item.name}</Text>
              </Box>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <Box>
          <Heading size="xs" textTransform="uppercase" color="gray.500" px={3} mb={2}>
            帮助 & 支持
          </Heading>
          <List spacing={1}>
            {helpItems.map((item) => (
              <ListItem key={item.path}>
                <Box
                  as={RouterLink}
                  to={item.path}
                  display="flex"
                  alignItems="center"
                  px={3}
                  py={2}
                  borderRadius="md"
                  transition="all 0.2s"
                  bg={isActiveRoute(item.path) ? 'blue.100' : 'transparent'}
                  color={isActiveRoute(item.path) ? 'blue.700' : 'gray.700'}
                  fontWeight={isActiveRoute(item.path) ? 'bold' : 'normal'}
                  _hover={{
                    bg: 'blue.50',
                    color: 'blue.700',
                  }}
                >
                  <Icon as={item.icon} mr={3} boxSize={5} />
                  <Text>{item.name}</Text>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider />
        
        <Flex 
          direction="column" 
          mt="auto" 
          bg="blue.50" 
          p={3} 
          borderRadius="md"
          fontSize="sm"
        >
          <Flex align="center" mb={2}>
            <Icon as={FiShield} mr={2} color="blue.500" />
            <Text fontWeight="bold" color="blue.700">API密钥安全提示</Text>
          </Flex>
          <Text color="blue.600" fontSize="xs">
            请妥善保管您的API密钥，不要分享给不信任的第三方。如发现异常使用，请立即禁用并生成新密钥。
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Sidebar; 