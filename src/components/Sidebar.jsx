import React from 'react';
import { Box, VStack, Heading, List, ListItem, Link, Divider, Icon } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../config';
import { FiHome, FiKey, FiBarChart, FiCreditCard, FiUser, FiSettings, FiBookOpen, FiHelpCircle } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: '仪表盘', path: ROUTES.DASHBOARD, icon: FiHome },
    { name: 'API密钥', path: ROUTES.API_KEYS, icon: FiKey },
    { name: '使用统计', path: ROUTES.USAGE, icon: FiBarChart },
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
      pos="sticky"
      top="4rem"
      left="0"
      h="calc(100vh - 4rem)"
      w="250px"
      bg="white"
      p={5}
      borderRightWidth="1px"
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="sm" color="gray.500" mb={2}>
            菜单
          </Heading>
          <List spacing={1}>
            {menuItems.map((item) => (
              <ListItem key={item.path}>
                <Link
                  as={RouterLink}
                  to={item.path}
                  display="flex"
                  alignItems="center"
                  py={2}
                  px={3}
                  borderRadius="md"
                  fontWeight="medium"
                  color={isActiveRoute(item.path) ? "blue.600" : "gray.700"}
                  bg={isActiveRoute(item.path) ? "blue.50" : "transparent"}
                  _hover={{ bg: "gray.100" }}
                >
                  <Icon as={item.icon} mr={3} />
                  {item.name}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading size="sm" color="gray.500" mb={2}>
            帮助
          </Heading>
          <List spacing={1}>
            {helpItems.map((item) => (
              <ListItem key={item.path}>
                <Link
                  as={RouterLink}
                  to={item.path}
                  display="flex"
                  alignItems="center"
                  py={2}
                  px={3}
                  borderRadius="md"
                  fontWeight="medium"
                  color={isActiveRoute(item.path) ? "blue.600" : "gray.700"}
                  bg={isActiveRoute(item.path) ? "blue.50" : "transparent"}
                  _hover={{ bg: "gray.100" }}
                >
                  <Icon as={item.icon} mr={3} />
                  {item.name}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar; 