import React, { useState } from 'react';
import { Button, Modal, Form, Input, Space, Avatar, Dropdown, Typography, Popover, Card } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, LockOutlined, QuestionCircleOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import HelpModal from './common/HelpModal';

const { Text } = Typography;

interface LoginButtonProps {
  setActiveTab?: (tab: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ setActiveTab }) => {
  const { user, login, logout, loading, isAdmin, isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const [isLoginPopoverVisible, setIsLoginPopoverVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      console.log('Attempting login for:', values.username);
      await login(values.username, values.password);
      console.log('Login successful');
      setIsLoginPopoverVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Login failed in component:', error);
      // Keep popover open so user can try again
    }
  };

  const handleLogout = () => {
    logout();
  };

  // User menu items when logged in
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Space direction="vertical" size={0}>
          <Text strong>{user?.fullName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.role === 'ADMIN' ? t('role.admin', 'Administrator') : t('role.user', 'User')}
          </Text>
        </Space>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    ...(isAdmin() ? [{
      key: 'users',
      icon: <TeamOutlined />,
      label: t('nav.users', 'Users'),
      onClick: () => {
        setActiveTab?.('users');
      },
    }] : []),
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('nav.settings', 'Settings'),
      onClick: () => {
        setActiveTab?.('settings');
      },
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: t('nav.help', 'Help'),
      onClick: () => {
        setHelpVisible(true);
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout', 'Logout'),
      onClick: handleLogout,
    },
  ];

  const loginForm = (
    <Card 
      title={
        <Space align="center" className="justify-center w-full">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="text-sm">{t('auth.loginToEstopia', 'Login to Estopia')}</span>
        </Space>
      }
      className="w-80"
      bodyStyle={{ padding: '16px' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        size="small"
      >
        <Form.Item
          name="username"
          label={t('login.username', 'Username')}
          rules={[
            { required: true, message: t('login.usernameRequired', 'Please enter your username') }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('login.usernamePlaceholder', 'Enter your username')}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('login.password', 'Password')}
          rules={[
            { required: true, message: t('login.passwordRequired', 'Please enter your password') }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('login.passwordPlaceholder', 'Enter your password')}
          />
        </Form.Item>

        <Form.Item className="mb-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
          >
            {t('login.signIn', 'Sign In')}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text type="secondary" className="text-xs">
            {t('login.forgotPassword', 'Contact admin for password reset')}
          </Text>
        </div>
      </Form>
    </Card>
  );

  if (!isLoggedIn()) {
    return (
      <Popover
        content={loginForm}
        trigger="click"
        open={isLoginPopoverVisible}
        onOpenChange={setIsLoginPopoverVisible}
        placement="bottomRight"
        overlayStyle={{ 
          padding: 0,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          icon={<LoginOutlined />}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 w-8 h-8 flex items-center justify-center"
          size="middle"
        />
      </Popover>
    );
  }

  // User is logged in - show profile dropdown
  return (
    <>
      <Dropdown 
        menu={{ items: userMenuItems }} 
        placement="bottomRight"
        arrow
      >
        <Space className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
          <Avatar 
            size={32} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm"
          >
            {user?.role === 'ADMIN' ? 'SA' : 'U'}
          </Avatar>
        </Space>
      </Dropdown>
      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </>
  );
};

export default LoginButton;