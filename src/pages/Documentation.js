import React, { useState } from 'react';
import {
  Box, Heading, Text, Card, CardBody, Tabs, TabList, Tab, TabPanels,
  TabPanel, Code, VStack, UnorderedList, ListItem, Divider, Accordion,
  AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Link,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

function Documentation() {
  const [selectedLang, setSelectedLang] = useState('curl');
  const codeColor = useColorModeValue('gray.800', 'gray.200');
  const codeBg = useColorModeValue('gray.100', 'gray.700');
  
  // 代码示例
  const codeExamples = {
    curl: `curl -X POST "https://api.example.com/v1/analyze" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "这是一段需要分析的文本"}'`,
    
    python: `import requests

api_key = "YOUR_API_KEY"
url = "https://api.example.com/v1/analyze"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "text": "这是一段需要分析的文本"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,
    
    javascript: `// 使用fetch
const apiKey = "YOUR_API_KEY";
const url = "https://api.example.com/v1/analyze";

fetch(url, {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${apiKey}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: "这是一段需要分析的文本"
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("错误:", error));`,
    
    php: `<?php
$apiKey = "YOUR_API_KEY";
$url = "https://api.example.com/v1/analyze";

$data = [
    "text" => "这是一段需要分析的文本"
];

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $apiKey,
    "Content-Type: application/json"
]);

$response = curl_exec($curl);
$result = json_decode($response, true);

curl_close($curl);
print_r($result);
?>`
  };

  return (
    <Box>
      <Heading mb={6}>API 文档</Heading>
      
      <Tabs variant="enclosed" mb={8}>
        <TabList>
          <Tab>API 概述</Tab>
          <Tab>快速开始</Tab>
          <Tab>代码示例</Tab>
          <Tab>常见问题</Tab>
        </TabList>
        
        <TabPanels>
          {/* API 概述 */}
          <TabPanel>
            <Card mb={6}>
              <CardBody>
                <Heading size="md" mb={4}>API 简介</Heading>
                <Text mb={4}>
                  我们的API提供了强大的数据分析和处理能力，您可以通过简单的HTTP请求来访问这些功能。
                  所有的API端点都需要API密钥进行认证，确保您的数据安全和访问控制。
                </Text>
                
                <Heading size="sm" mt={6} mb={2}>主要功能</Heading>
                <UnorderedList spacing={2}>
                  <ListItem>文本分析与处理</ListItem>
                  <ListItem>数据分类与标记</ListItem>
                  <ListItem>实体识别与提取</ListItem>
                  <ListItem>情感分析与预测</ListItem>
                  <ListItem>批量数据处理</ListItem>
                </UnorderedList>
              </CardBody>
            </Card>
            
            <Card mb={6}>
              <CardBody>
                <Heading size="md" mb={4}>API 版本</Heading>
                <Text mb={4}>
                  当前最新的API版本是 <Code>v1</Code>。所有API请求的URL都应包含版本前缀，例如：
                  <Code display="block" p={2} mt={2} bg={codeBg} color={codeColor}>
                    https://api.example.com/v1/analyze
                  </Code>
                </Text>
                
                <Text>
                  我们会确保API的向后兼容性，但建议您定期查看文档以了解最新的功能和改进。
                </Text>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>请求限制</Heading>
                <Text mb={4}>
                  不同的账户计划有不同的API请求限制：
                </Text>
                
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>计划</Th>
                        <Th>请求限制</Th>
                        <Th>并发请求</Th>
                        <Th>最大请求体积</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>免费版</Td>
                        <Td>100次/月</Td>
                        <Td>5</Td>
                        <Td>1MB</Td>
                      </Tr>
                      <Tr>
                        <Td>基础版</Td>
                        <Td>无限制(费率控制)</Td>
                        <Td>20</Td>
                        <Td>5MB</Td>
                      </Tr>
                      <Tr>
                        <Td>专业版</Td>
                        <Td>无限制(费率控制)</Td>
                        <Td>50</Td>
                        <Td>10MB</Td>
                      </Tr>
                      <Tr>
                        <Td>企业版</Td>
                        <Td>无限制</Td>
                        <Td>自定义</Td>
                        <Td>自定义</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* 快速开始 */}
          <TabPanel>
            <Card mb={6}>
              <CardBody>
                <Heading size="md" mb={4}>快速开始</Heading>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="sm" mb={2}>1. 获取API密钥</Heading>
                    <Text>
                      在您的<Link color="blue.500" href="/dashboard">控制面板</Link>中创建一个新的API密钥。
                      请妥善保管您的API密钥，不要在公开场合分享。
                    </Text>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Heading size="sm" mb={2}>2. 构建您的请求</Heading>
                    <Text mb={2}>
                      所有API请求都需要包含您的API密钥作为Authorization头部。例如：
                    </Text>
                    <Code display="block" p={2} bg={codeBg} color={codeColor}>
                      Authorization: Bearer YOUR_API_KEY
                    </Code>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Heading size="sm" mb={2}>3. 发送您的第一个请求</Heading>
                    <Text mb={2}>
                      下面是一个简单的文本分析请求示例：
                    </Text>
                    <Code display="block" p={2} bg={codeBg} color={codeColor} whiteSpace="pre">
{`POST https://api.example.com/v1/analyze
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "text": "这是一段需要分析的文本"
}`}
                    </Code>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Heading size="sm" mb={2}>4. 处理响应</Heading>
                    <Text mb={2}>
                      API将返回JSON格式的响应：
                    </Text>
                    <Code display="block" p={2} bg={codeBg} color={codeColor} whiteSpace="pre">
{`{
  "success": true,
  "result": {
    "sentiment": "positive",
    "score": 0.87,
    "entities": [
      {
        "text": "文本",
        "type": "concept",
        "position": [9, 11]
      }
    ]
  }
}`}
                    </Code>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>错误处理</Heading>
                <Text mb={4}>
                  当API请求出错时，您将收到一个带有错误描述的JSON响应：
                </Text>
                
                <Code display="block" p={2} bg={codeBg} color={codeColor} whiteSpace="pre">
{`{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "请求格式不正确",
    "details": "缺少必要字段'text'"
  }
}`}
                </Code>
                
                <TableContainer mt={4}>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>HTTP状态码</Th>
                        <Th>错误代码</Th>
                        <Th>描述</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>400</Td>
                        <Td>invalid_request</Td>
                        <Td>请求格式不正确</Td>
                      </Tr>
                      <Tr>
                        <Td>401</Td>
                        <Td>unauthorized</Td>
                        <Td>API密钥无效或缺失</Td>
                      </Tr>
                      <Tr>
                        <Td>403</Td>
                        <Td>forbidden</Td>
                        <Td>没有权限访问此资源</Td>
                      </Tr>
                      <Tr>
                        <Td>429</Td>
                        <Td>rate_limit_exceeded</Td>
                        <Td>超过API请求限制</Td>
                      </Tr>
                      <Tr>
                        <Td>500</Td>
                        <Td>server_error</Td>
                        <Td>服务器内部错误</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* 代码示例 */}
          <TabPanel>
            <Card mb={6}>
              <CardBody>
                <Heading size="md" mb={4}>代码示例</Heading>
                <Text mb={4}>
                  以下是不同编程语言的API调用示例：
                </Text>
                
                <Tabs variant="soft-rounded" colorScheme="blue" mb={4} onChange={(index) => {
                  const langs = ['curl', 'python', 'javascript', 'php'];
                  setSelectedLang(langs[index]);
                }}>
                  <TabList>
                    <Tab>cURL</Tab>
                    <Tab>Python</Tab>
                    <Tab>JavaScript</Tab>
                    <Tab>PHP</Tab>
                  </TabList>
                </Tabs>
                
                <Box bg={codeBg} p={4} borderRadius="md" overflow="auto">
                  <Code display="block" whiteSpace="pre" bg="transparent" color={codeColor}>
                    {codeExamples[selectedLang]}
                  </Code>
                </Box>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>API端点参考</Heading>
                
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          /v1/analyze - 文本分析
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text mb={2}>分析文本内容，提取关键信息。</Text>
                      
                      <Heading size="xs" mt={4} mb={2}>请求参数</Heading>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>参数</Th>
                              <Th>类型</Th>
                              <Th>必填</Th>
                              <Th>描述</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>text</Td>
                              <Td>string</Td>
                              <Td>是</Td>
                              <Td>需要分析的文本内容</Td>
                            </Tr>
                            <Tr>
                              <Td>language</Td>
                              <Td>string</Td>
                              <Td>否</Td>
                              <Td>文本语言(默认: 自动检测)</Td>
                            </Tr>
                            <Tr>
                              <Td>features</Td>
                              <Td>array</Td>
                              <Td>否</Td>
                              <Td>要分析的特征(情感、实体、分类等)</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          /v1/classify - 文本分类
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text mb={2}>将文本分类到预定义的类别中。</Text>
                      
                      <Heading size="xs" mt={4} mb={2}>请求参数</Heading>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>参数</Th>
                              <Th>类型</Th>
                              <Th>必填</Th>
                              <Th>描述</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>text</Td>
                              <Td>string</Td>
                              <Td>是</Td>
                              <Td>需要分类的文本内容</Td>
                            </Tr>
                            <Tr>
                              <Td>categories</Td>
                              <Td>array</Td>
                              <Td>否</Td>
                              <Td>分类类别(默认: 所有可用类别)</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          /v1/batch - 批量处理
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text mb={2}>批量处理多个文本。</Text>
                      
                      <Heading size="xs" mt={4} mb={2}>请求参数</Heading>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>参数</Th>
                              <Th>类型</Th>
                              <Th>必填</Th>
                              <Th>描述</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>items</Td>
                              <Td>array</Td>
                              <Td>是</Td>
                              <Td>要处理的文本项数组</Td>
                            </Tr>
                            <Tr>
                              <Td>operation</Td>
                              <Td>string</Td>
                              <Td>是</Td>
                              <Td>要执行的操作(analyze, classify等)</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* 常见问题 */}
          <TabPanel>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>常见问题解答</Heading>
                
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          如何保护我的API密钥?
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text>
                        您应该始终将API密钥保存在服务器端，避免在客户端代码中暴露。对于前端应用，应通过您自己的后端服务转发API请求。
                        您还可以在控制面板中设置IP地址限制，只允许特定IP使用您的API密钥。
                        定期轮换您的API密钥也是一个好习惯，特别是在您怀疑密钥可能泄露时。
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          我如何监控API的使用情况？
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text>
                        您可以在<Link color="blue.500" href="/usage">使用统计</Link>页面查看API的使用情况。
                        我们提供每日、每周和每月的使用量统计，以及按端点划分的详细使用数据。
                        您还可以设置使用量警报，在达到特定阈值时收到通知。
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          API支持哪些语言？
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text mb={2}>
                        我们的API支持以下语言的文本处理：
                      </Text>
                      <UnorderedList spacing={1}>
                        <ListItem>中文(简体和繁体)</ListItem>
                        <ListItem>英语</ListItem>
                        <ListItem>日语</ListItem>
                        <ListItem>韩语</ListItem>
                        <ListItem>法语</ListItem>
                        <ListItem>德语</ListItem>
                        <ListItem>西班牙语</ListItem>
                        <ListItem>葡萄牙语</ListItem>
                        <ListItem>俄语</ListItem>
                        <ListItem>阿拉伯语</ListItem>
                      </UnorderedList>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          我的数据是如何处理的？
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text>
                        所有通过API传输的数据都经过加密保护。我们不会永久存储您的输入数据，只会在处理期间临时保存。
                        处理完成后，输入数据会立即从我们的系统中删除。我们可能会保留分析结果用于改进服务，但这些
                        数据已经过匿名化处理，不包含任何个人识别信息。详细信息请参阅我们的
                        <Link color="blue.500" href="/privacy" ml={1}>隐私政策<ExternalLinkIcon mx="2px" /></Link>。
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          如何处理API请求错误？
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text mb={4}>
                        您应该始终检查API响应的HTTP状态码和响应体中的错误信息。我们的API使用标准HTTP状态码表示请求状态，
                        并在响应体中提供详细的错误描述。
                      </Text>
                      
                      <Text>
                        我们建议实现适当的重试机制，特别是对于429(速率限制)和500(服务器错误)等临时性错误。
                        对于5xx错误，可以使用指数退避策略进行重试。对于429错误，请遵循响应头中提供的"Retry-After"建议。
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                  
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          我需要更多帮助，如何联系支持？
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text>
                        您可以通过<Link color="blue.500" href="/support">支持中心</Link>提交工单，或发送电子邮件至
                        <Link color="blue.500" href="mailto:support@example.com" ml={1}>
                          support@example.com
                        </Link>。
                        专业版和企业版用户可以获得优先支持服务。企业版用户还可以获得专属技术支持经理和24/7紧急支持。
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Documentation; 