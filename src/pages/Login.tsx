import React, { useState } from 'react';
import { Button, Card, Form, Input, Alert, Typography, Space, Row, Col, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

interface ResetPasswordData {
  username: string;
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

interface LoginProps {
  onLogin: (credentials: Omit<LoginFormData, 'remember'>) => void;
  onResetPassword: (data: ResetPasswordData) => void;
  loading?: boolean;
  error?: string;
  isModal?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onResetPassword, loading = false, error, isModal = false }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [mode, setMode] = useState<'login' | 'reset' | 'reset-form'>('login');
  const [resetUsername, setResetUsername] = useState('');
  const [mustResetPassword, setMustResetPassword] = useState(false);

  const handleLogin = (values: LoginFormData) => {
    onLogin({
      username: values.username,
      password: values.password
    });
  };

  const handleResetStart = async (values: { username: string }) => {
    try {
      const response = await fetch(`/api/auth/check-reset/${values.username}`);
      if (response.ok) {
        const data = await response.json();
        setResetUsername(values.username);
        setMustResetPassword(data.mustResetPassword);
        setMode('reset-form');
      } else {
        // Handle error - user not found
      }
    } catch (error) {
      console.error('Error checking reset status:', error);
    }
  };

  const handleResetPassword = (values: any) => {
    onResetPassword({
      username: resetUsername,
      currentPassword: mustResetPassword ? undefined : values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    });
  };

  const renderLoginMode = () => (
    <>
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        requiredMark={false}
        className="space-y-1"
      >
        <Form.Item
          name="username"
          label={<span className="text-gray-700 font-medium">{t('login.username')}</span>}
          rules={[{ required: true, message: t('login.usernameRequired') }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder={t('login.usernamePlaceholder')}
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="text-gray-700 font-medium">{t('login.password')}</span>}
          rules={[{ required: true, message: t('login.passwordRequired') }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('login.passwordPlaceholder')}
            size="large"
            className="rounded-lg"
            iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          />
        </Form.Item>

        <Form.Item className="mb-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            style={{ height: '48px' }}
          >
            {loading ? t('login.signingIn', 'Signing in...') : t('login.signIn', 'Sign In')}
          </Button>
        </Form.Item>
      </Form>

      <Divider>or</Divider>

      <Button
        type="default"
        size="large"
        className="w-full rounded-lg"
        onClick={() => setMode('reset')}
      >
        Reset Password
      </Button>
    </>
  );

  const renderResetUsernameMode = () => (
    <>
      <div className="flex items-center mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => setMode('login')}
          className="p-0"
        >
          Back to Login
        </Button>
      </div>

      <Form
        form={resetForm}
        onFinish={handleResetStart}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="username"
          label={<span className="text-gray-700 font-medium">Username</span>}
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your username"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 border-0"
            style={{ height: '48px' }}
          >
            Check Reset Status
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  const renderResetPasswordMode = () => (
    <>
      <div className="flex items-center mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => setMode('reset')}
          className="p-0"
        >
          Back
        </Button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <Text strong>User: {resetUsername}</Text>
        <br />
        <Text type="secondary">
          {mustResetPassword 
            ? "Password reset required - no current password needed" 
            : "Enter your current password to reset"}
        </Text>
      </div>

      <Form
        form={resetForm}
        onFinish={handleResetPassword}
        layout="vertical"
        requiredMark={false}
      >
        {!mustResetPassword && (
          <Form.Item
            name="currentPassword"
            label={<span className="text-gray-700 font-medium">Current Password</span>}
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your current password"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>
        )}

        <Form.Item
          name="newPassword"
          label={<span className="text-gray-700 font-medium">New Password</span>}
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your new password"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="text-gray-700 font-medium">Confirm New Password</span>}
          rules={[
            { required: true, message: 'Please confirm your new password' },
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
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Confirm your new password"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 border-0"
            style={{ height: '48px' }}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  if (isModal) {
    return (
      <div className="p-6">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          
          <Title level={3} className="mb-2 text-gray-800">
            Estopia
          </Title>
          
          <Text className="text-gray-500">
            {mode === 'login' 
              ? 'Property Management System'
              : mode === 'reset' 
              ? 'Password Reset'
              : 'Set New Password'
            }
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4 rounded-lg"
            closable
          />
        )}

        {/* Dynamic Content */}
        {mode === 'login' && renderLoginMode()}
        {mode === 'reset' && renderResetUsernameMode()}
        {mode === 'reset-form' && renderResetPasswordMode()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Row justify="center" align="middle" className="w-full max-w-md">
        <Col span={24}>
          <Card
            className="shadow-xl border-0 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              
              <Title level={2} className="mb-2 text-gray-800">
                Estopia
              </Title>
              
              <Text className="text-gray-500">
                {mode === 'login' 
                  ? t('login.subtitle', 'Property Management System')
                  : mode === 'reset' 
                  ? 'Password Reset'
                  : 'Set New Password'
                }
              </Text>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className="mb-6 rounded-lg"
                closable
              />
            )}

            {/* Dynamic Content */}
            {mode === 'login' && renderLoginMode()}
            {mode === 'reset' && renderResetUsernameMode()}
            {mode === 'reset-form' && renderResetPasswordMode()}

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <Text className="text-xs text-gray-400">
                © 2025 Estopia Property Management
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;