import React, { useState } from 'react';
import { Button, Modal, Form, Input, Space, Avatar, Dropdown, Typography, Popover, Card, message } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, LockOutlined, QuestionCircleOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useTerminal } from '../context/useTerminal';
import { useTranslation } from 'react-i18next';
import HelpModal from './common/HelpModal';
import Login from '../pages/Login';

const { Text } = Typography;

interface LoginButtonProps {
  setActiveTab?: (tab: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ setActiveTab }) => {
  const { user, login, logout, loading, isAdmin, isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const terminal = useTerminal();
  const [isLoginPopoverVisible, setIsLoginPopoverVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [mustResetPassword, setMustResetPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'check' | 'password'>('check');
  const [form] = Form.useForm();

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      console.log('Attempting login for:', values.username);
      await login(values.username, values.password);
      console.log('Login successful');
      setIsLoginPopoverVisible(false);
    } catch (error) {
      console.error('Login failed in component:', error);
      // Keep modal open so user can try again
    }
  };

  const handleResetCheck = async (values: { username: string }) => {
    try {
      const response = await fetch(`/api/auth/check-reset/${values.username}`);
      if (response.ok) {
        const data = await response.json();
        setResetUsername(values.username);
        setMustResetPassword(data.mustResetPassword);
        
        if (data.mustResetPassword) {
          terminal.info('✅ Password reset required - you can set a new password directly.');
          setResetStep('password');
        } else {
          terminal.info('⚠️ Contact admin for password reset assistance.');
        }
      } else {
        const errorData = await response.json();
        terminal.error(`❌ ${errorData.error || 'User not found'}`);
      }
    } catch (error) {
      console.error('Reset check error:', error);
      terminal.error('❌ Check failed - please try again');
    }
  };

  const handleResetPassword = async (values: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': resetUsername,
        },
        body: JSON.stringify({
          currentPassword: mustResetPassword ? undefined : values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });

      if (response.ok) {
        terminal.success('🎉 Password reset successfully! You can now login with your new password.');
        setIsLoginPopoverVisible(false);
        setResetMode(false);
        setResetStep('check');
      } else {
        const errorData = await response.json();
        terminal.error(`❌ ${errorData.error || 'Password reset failed'}`);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      terminal.error('❌ Password reset failed');
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

  if (!isLoggedIn()) {
    return (
      <Popover
        content={
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
            styles={{ body: { padding: '16px' } }}
          >
            {!resetMode ? (
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
                  <Button 
                    type="link" 
                    size="small" 
                    className="text-xs p-0"
                    onClick={() => setResetMode(true)}
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
            ) : (
              <div>
                <div className="mb-3">
                  <Button 
                    type="text" 
                    size="small" 
                    className="p-0 text-xs"
                    onClick={() => {
                      setResetMode(false);
                      setResetStep('check');
                    }}
                  >
                    ← Back to Login
                  </Button>
                </div>
                
                {resetStep === 'check' ? (
                  <Form
                    layout="vertical"
                    onFinish={handleResetCheck}
                    size="small"
                  >
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[{ required: true, message: 'Please enter your username' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your username"
                      />
                    </Form.Item>
                    <Form.Item className="mb-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 border-0"
                      >
                        Check Reset Status
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Form
                    layout="vertical"
                    onFinish={handleResetPassword}
                    size="small"
                  >
                    <div className="mb-3 text-xs text-gray-600">
                      User: <strong>{resetUsername}</strong>
                      {mustResetPassword ? " (No current password needed)" : ""}
                    </div>
                    
                    {!mustResetPassword && (
                      <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[{ required: true, message: 'Please enter your current password' }]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="Current password"
                        />
                      </Form.Item>
                    )}
                    
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        { required: true, message: 'Please enter new password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="New password"
                      />
                    </Form.Item>
                    
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      rules={[
                        { required: true, message: 'Please confirm password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm new password"
                      />
                    </Form.Item>
                    
                    <Form.Item className="mb-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 border-0"
                      >
                        Reset Password
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
            )}
          </Card>
        }
        trigger="click"
        open={isLoginPopoverVisible}
        onOpenChange={(visible) => {
          setIsLoginPopoverVisible(visible);
          if (!visible) {
            setResetMode(false);
            setResetStep('check');
            setResetUsername('');
            setMustResetPassword(false);
            form.resetFields();
          }
        }}
        placement="bottomRight"
        overlayStyle={{ padding: 0, width: '320px' }}
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