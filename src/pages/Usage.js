import React, { useState, useEffect } from 'react';
import {
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber,
  Card, CardBody, Text, Select, useToast, Table, Thead, Tbody,
  Tr, Th, Td, TabList, TabPanels, TabPanel, Tabs, Tab,
} from '@chakra-ui/react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 注册Chart.js组件
Chart.register(...registerables);

function Usage() {
  const [usageStats, setUsageStats] = useState({
    summary: {
      total_calls: 0,
      avg_response_time: 0,
      active_days: 0
    },
    daily_calls: [],
    endpoint_stats: []
  });
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  const fetchUsageStats = async (selectedPeriod) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/stats/usage?period=${selectedPeriod}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUsageStats(response.data.stats || {
          summary: {
            total_calls: 0,
            avg_response_time: 0,
            active_days: 0
          },
          daily_calls: [],
          endpoint_stats: []
        });
      } else {
        throw new Error(response.data.message || '获取使用统计失败');
      }
    } catch (error) {
      console.error('Usage stats error:', error);
      
      toast({
        title: '获取使用统计失败',
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
    fetchUsageStats(period);
  }, [period]);
  
  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };
  
  // 准备图表数据
  const getLineChartData = () => {
    return {
      labels: usageStats.daily_calls.map(call => call.date),
      datasets: [
        {
          label: 'API调用次数',
          data: usageStats.daily_calls.map(call => call.calls),
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1
        }
      ]
    };
  };
  
  const getPieChartData = () => {
    return {
      labels: usageStats.endpoint_stats.slice(0, 5).map(endpoint => endpoint.endpoint),
      datasets: [
        {
          data: usageStats.endpoint_stats.slice(0, 5).map(endpoint => endpoint.calls),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    };
  };
  
  const getBarChartData = () => {
    // 计算每周使用量
    const weeklyData = {};
    
    usageStats.daily_calls.forEach(call => {
      const date = new Date(call.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0;
      }
      
      weeklyData[weekKey] += call.calls;
    });
    
    const labels = Object.keys(weeklyData).sort();
    const data = labels.map(key => weeklyData[key]);
    
    return {
      labels,
      datasets: [
        {
          label: '每周API调用量',
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <Box>
      <Heading mb={6}>API使用统计</Heading>
      
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="lg">查看API使用情况和趋势分析</Text>
        <Select
          value={period}
          onChange={handlePeriodChange}
          width="200px"
        >
          <option value="day">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="year">全年</option>
        </Select>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>总调用次数</StatLabel>
              <StatNumber>{usageStats.summary.total_calls}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>平均响应时间</StatLabel>
              <StatNumber>{usageStats.summary.avg_response_time.toFixed(2)} ms</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>活跃天数</StatLabel>
              <StatNumber>{usageStats.summary.active_days}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Tabs isLazy colorScheme="blue" mb={8}>
        <TabList>
          <Tab>每日调用</Tab>
          <Tab>每周趋势</Tab>
          <Tab>端点分布</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>每日API调用统计</Heading>
                {usageStats.daily_calls.length > 0 ? (
                  <Box height="400px">
                    <Line 
                      data={getLineChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
                  </Box>
                ) : (
                  <Text>没有数据可用</Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>每周API调用趋势</Heading>
                {usageStats.daily_calls.length > 0 ? (
                  <Box height="400px">
                    <Bar 
                      data={getBarChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
                  </Box>
                ) : (
                  <Text>没有数据可用</Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>API端点分布</Heading>
                {usageStats.endpoint_stats.length > 0 ? (
                  <Box height="400px">
                    <Pie 
                      data={getPieChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
                  </Box>
                ) : (
                  <Text>没有数据可用</Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Usage;
