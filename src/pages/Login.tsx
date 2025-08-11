import React, { useState } from 'react';
import { Button, Card, Form, Input, Alert, Typography, Space, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

interface LoginProps {
  onLogin: (credentials: Omit<LoginFormData, 'remember'>) => void;
  loading?: boolean;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading = false, error }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginFormData) => {
    onLogin({
      username: values.username,
      password: values.password
    });
  };

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
                {/* Estopia Logo */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              
              <Title level={2} className="mb-2 text-gray-800">
                Estopia
              </Title>
              
              <Text className="text-gray-500">
                {t('login.subtitle', 'Property Management System')}
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

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
              className="space-y-1"
            >
              <Form.Item
                name="username"
                label={
                  <span className="text-gray-700 font-medium">
                    {t('login.username', 'Username')}
                  </span>
                }
                rules={[
                  { required: true, message: t('login.usernameRequired', 'Please enter your username') }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder={t('login.usernamePlaceholder', 'Enter your username')}
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-gray-700 font-medium">
                    {t('login.password', 'Password')}
                  </span>
                }
                rules={[
                  { required: true, message: t('login.passwordRequired', 'Please enter your password') }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                  size="large"
                  className="rounded-lg"
                  iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" className="mb-0">
                  {/* Optional: Remember me checkbox - commented out for simplicity */}
                </Form.Item>
                
                <Text className="text-sm text-gray-500">
                  {t('login.forgotPassword', 'Contact admin for password reset')}
                </Text>
              </div>

              <Form.Item className="mb-0">
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