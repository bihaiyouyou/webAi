import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Container, Box } from '@chakra-ui/react';
import { ROUTES } from './config';
import { useAuth } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApiKeys from './pages/ApiKeys';
import ApiKeyDetail from './pages/ApiKeyDetail';
import Usage from './pages/Usage';
import Billing from './pages/Billing';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import Support from './pages/Support';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import Docs from './pages/Docs';
import Layout from './components/Layout';

// 受保护的路由
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>加载中...</div>;
  
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};

// 公共路由（已登录用户会被重定向到仪表盘）
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>加载中...</div>;
  
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return children;
};

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        <Box as="main" py={8}>
          <Container maxW="container.xl">
            <Routes>
              {/* 公共页面 */}
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.DOCS} element={<Docs />} />
              
              {/* 认证页面 */}
              <Route path={ROUTES.LOGIN} element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path={ROUTES.REGISTER} element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* 受保护页面 */}
              <Route path={ROUTES.DASHBOARD} element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.API_KEYS} element={
                <ProtectedRoute>
                  <Layout>
                    <ApiKeys />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.API_KEY_DETAIL.replace(':id', ':id')} element={
                <ProtectedRoute>
                  <Layout>
                    <ApiKeyDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.USAGE} element={
                <ProtectedRoute>
                  <Layout>
                    <Usage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.BILLING} element={
                <ProtectedRoute>
                  <Layout>
                    <Billing />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.SETTINGS} element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.DOCUMENTATION} element={
                <ProtectedRoute>
                  <Layout>
                    <Documentation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.SUPPORT} element={
                <ProtectedRoute>
                  <Layout>
                    <Support />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN_DASHBOARD} element={
                <ProtectedRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN_USERS} element={
                <ProtectedRoute>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* 默认重定向到首页 */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
