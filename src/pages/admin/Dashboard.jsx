import React, { useState, useEffect } from 'react';
import {
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, 
  StatHelpText, StatArrow, Card, CardBody, Text, Icon,
  useToast, Flex, Spinner, Grid, GridItem, Table, Thead,
  Tbody, Tr, Th, Td, TableContainer, HStack, Badge
} from '@chakra-ui/react';
import { 
  FiUsers, FiKey, FiActivity, FiDollarSign, FiClock,
  FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
         Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
      newToday: 0,
      growth: 0
    },
    apiKeys: {
      total: 0,
      active: 0,
      newToday: 0,
      growth: 0
    },
    apiCalls: {
      total: 0,
      today: 0,
      growth: 0
    },
    revenue: {
      total: 0,
      thisMonth: 0,
      growth: 0
    }
  });
  const [usageData, setUsageData] = useState([]);
  const [userTrend, setUserTrend] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  // 获取统计数据
  const fetchStats = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
        setUsageData(response.data.usageData);
        setUserTrend(response.data.userTrend);
        setPlanDistribution(response.data.planDistribution);
        setRecentSignups(response.data.recentSignups);
        setTopUsers(response.data.topUsers);
      } else {
        throw new Error(response.data.message || '获取统计数据失败');
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      
      toast({
        title: '获取统计数据失败',
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
    fetchStats();
  }, []);
  
  // 颜色设置
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // 获取计划徽章颜色
  const getPlanBadgeColor = (plan) => {
    const colors = {
      free: 'gray',
      basic: 'blue',
      pro: 'purple',
      enterprise: 'red'
    };
    
    return colors[plan] || 'gray';
  };
  
  // 获取计划名称
  const getPlanName = (plan) => {
    const names = {
      free: '免费版',
      basic: '基础版',
      pro: '专业版',
      enterprise: '企业版'
    };
    
    return names[plan] || plan;
  };

  return (
    <Box>
      <Heading mb={6}>管理控制台</Heading>
      
      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {/* 主要统计数据 */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
            <StatCard 
              title="总用户数"
              value={stats.users.total}
              growth={stats.users.growth}
              icon={FiUsers}
              detail={`今日新增: ${stats.users.newToday}`}
              color="blue.500"
            />
            
            <StatCard 
              title="API密钥总数"
              value={stats.apiKeys.total}
              growth={stats.apiKeys.growth}
              icon={FiKey}
              detail={`活跃密钥: ${stats.apiKeys.active}`}
              color="green.500"
            />
            
            <StatCard 
              title="API调用总数"
              value={stats.apiCalls.total}
              growth={stats.apiCalls.growth}
              icon={FiActivity}
              detail={`今日调用: ${stats.apiCalls.today}`}
              color="purple.500"
            />
            
            <StatCard 
              title="总收入"
              value={`¥${stats.revenue.total.toFixed(2)}`}
              growth={stats.revenue.growth}
              icon={FiDollarSign}
              detail={`本月: ¥${stats.revenue.thisMonth.toFixed(2)}`}
              color="red.500"
            />
          </SimpleGrid>
          
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={6}>
            {/* API调用趋势图 */}
            <GridItem>
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>API调用趋势 (最近30天)</Text>
                  <Box height="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={usageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }} 
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="calls" 
                          stroke="#8884d8" 
                          name="API调用次数"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
            
            {/* 计划分布图 */}
            <GridItem>
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>用户计划分布</Text>
                  <Box height="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={planDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {planDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={6}>
            {/* 新用户趋势 */}
            <GridItem>
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>用户增长趋势 (最近30天)</Text>
                  <Box height="250px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userTrend}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }} 
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#82ca9d" 
                          name="新用户数"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
            
            {/* 最近注册用户 */}
            <GridItem>
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>最近注册用户</Text>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>用户名</Th>
                          <Th>注册时间</Th>
                          <Th>计划</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {recentSignups.map((user) => (
                          <Tr key={user.id}>
                            <Td>{user.username}</Td>
                            <Td>{new Date(user.created_at).toLocaleString('zh-CN')}</Td>
                            <Td>
                              <Badge colorScheme={getPlanBadgeColor(user.plan)}>
                                {getPlanName(user.plan)}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
          
          {/* API使用量最高的用户 */}
          <Card>
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={4}>API调用量最高的用户</Text>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>用户名</Th>
                      <Th>总调用次数</Th>
                      <Th>本月使用量</Th>
                      <Th>计划</Th>
                      <Th>上次活动时间</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {topUsers.map((user) => (
                      <Tr key={user.id}>
                        <Td>{user.username}</Td>
                        <Td>{user.total_calls}</Td>
                        <Td>{user.monthly_calls}</Td>
                        <Td>
                          <Badge colorScheme={getPlanBadgeColor(user.plan)}>
                            {getPlanName(user.plan)}
                          </Badge>
                        </Td>
                        <Td>{new Date(user.last_activity).toLocaleString('zh-CN')}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </>
      )}
    </Box>
  );
}

// 统计卡片组件
function StatCard({ title, value, growth, icon, detail, color }) {
  return (
    <Card>
      <CardBody>
        <Flex justify="space-between">
          <Box>
            <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
            {growth !== null && (
              <StatHelpText>
                <HStack>
                  <StatArrow type={growth >= 0 ? 'increase' : 'decrease'} />
                  <Text>{Math.abs(growth)}% 相比上月</Text>
                </HStack>
              </StatHelpText>
            )}
            <Text fontSize="sm" color="gray.500">{detail}</Text>
          </Box>
          <Flex 
            w="12" 
            h="12" 
            align="center" 
            justify="center" 
            borderRadius="full" 
            bg={color}
            color="white"
          >
            <Icon as={icon} boxSize="6" />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}

export default Dashboard; 