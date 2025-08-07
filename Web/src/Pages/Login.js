import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      if (values.email === 'admin@cinema.com' && values.password === 'admin123') {
        message.success('Đăng nhập thành công!');
        localStorage.setItem('adminToken', 'mock-token');
        navigate('/');
      } else {
        message.error('Email hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="movie-poster poster-1"></div>
        <div className="movie-poster poster-2"></div>
        <div className="movie-poster poster-3"></div>
        <div className="movie-poster poster-4"></div>
        <div className="overlay"></div>
      </div>
      
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <VideoCameraOutlined className="logo-icon" />
              <Title level={2} className="brand-title">CinemaAdmin</Title>
            </div>
            <Text className="login-subtitle">Hệ thống quản lý rạp chiếu phim</Text>
          </div>

          <Form
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                className="login-input"
              />
            </Form.Item>

            <Form.Item className="login-options">
              <div className="login-remember">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
              </div>
              <Button type="link" className="forgot-password">
                Quên mật khẩu?
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                block
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text className="demo-info">
              Demo: admin@cinema.com / admin123
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
