import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  message,
  Typography,
  Space,
  Avatar,
  Upload,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  UploadOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      
      console.log('Form values:', values); // Debug log
      
      // Simplified data for API - match exactly what backend expects
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        number_phone: values.number_phone,
        role: 'employee', // Backend expects this
        status: 'active',
      };

      // Add optional fields only if they exist
      if (values.date_of_birth) {
        userData.date_of_birth = values.date_of_birth.format('YYYY-MM-DD');
      }
      
      if (values.gender) {
        userData.gender = values.gender;
      }

      console.log('Sending simplified data to API:', userData); // Debug log

      const response = await ApiService.createUser(userData);
      
      console.log('API Response:', response); // Debug log
      
      if (response && response.success) {
        message.success('Tạo nhân viên mới thành công');
        navigate('/admin/employees');
      } else {
        console.error('API Error:', response);
        
        // Show specific error message from backend
        let errorMsg = 'Không thể tạo nhân viên';
        if (response && response.error) {
          errorMsg = response.error;
        } else if (response && response.message) {
          errorMsg = response.message;
        }
        
        message.error(errorMsg);
      }
    } catch (error) {
      console.error('Network/Parse Error:', error);
      
      // Handle different types of errors
      if (error.message && error.message.includes('400')) {
        message.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else if (error.message && error.message.includes('401')) {
        message.error('Bạn không có quyền thực hiện thao tác này.');
      } else if (error.message && error.message.includes('409')) {
        message.error('Email hoặc số điện thoại đã được sử dụng.');
      } else {
        message.error('Lỗi kết nối hoặc server không phản hồi.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/employees');
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url);
      message.success('Tải avatar thành công');
    }
    if (info.file.status === 'error') {
      message.error('Lỗi khi tải avatar');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <UserAddOutlined style={{ marginRight: 8 }} />
            Thêm nhân viên mới
          </Title>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Left column - Avatar */}
        <Col xs={24} lg={8}>
          <Card title="Ảnh đại diện" style={{ height: 'fit-content' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              >
                N
              </Avatar>
              <div>
                <Upload
                  name="avatar"
                  listType="picture"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false} // Disable auto upload for demo
                  onChange={handleAvatarChange}
                >
                  <Button icon={<UploadOutlined />}>
                    Chọn ảnh đại diện
                  </Button>
                </Upload>
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  Tùy chọn - có thể bỏ trống
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right column - Form */}
        <Col xs={24} lg={16}>
          <Card title="Thông tin nhân viên">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              initialValues={{
                status: 'active',
                gender: 'male'
              }}
            >
              <Title level={4}>Thông tin cơ bản</Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ tên!' },
                      { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="number_phone"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Select placeholder="Chọn giới tính">
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="date_of_birth"
                    label="Ngày sinh"
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                      getPopupContainer={trigger => trigger.parentElement}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="confirm_password"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ 
                padding: 16, 
                backgroundColor: '#f6f8fa', 
                borderRadius: 8, 
                marginBottom: 24 
              }}>
                <Title level={5} style={{ margin: '0 0 8px 0', color: '#666' }}>
                  ℹ️ Thông tin mặc định
                </Title>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#666', fontSize: 14 }}>
                  <li>Vị trí: <strong>Nhân viên</strong></li>
                  <li>Phòng ban: <strong>Vận hành</strong></li>
                  <li>Ngày vào làm: <strong>Hôm nay</strong></li>
                  <li>Trạng thái: <strong>Hoạt động</strong></li>
                  <li>Email: <strong>Đã xác thực</strong></li>
                </ul>
                <div style={{ marginTop: 8, fontSize: 12, fontStyle: 'italic' }}>
                  * Có thể chỉnh sửa sau khi tạo
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Space>
                  <Button onClick={handleBack} size="large">
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={saving}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Tạo nhân viên
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateEmployee;