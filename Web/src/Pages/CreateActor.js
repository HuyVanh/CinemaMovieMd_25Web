import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Typography,
  Space,
  Switch,
  Divider,
  Avatar,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../config/api'; 

const { Title, Text } = Typography;

const CreateActor = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const actorData = {
        name: values.name.trim(),
        image: values.image?.trim() || ''
      };

      const response = await ApiService.createActor(actorData);
      
      if (response.success) {
        message.success('Tạo diễn viên thành công!');
        
        // Reset form
        form.resetFields();
        
        // Navigate back to list or stay for adding more
        if (values.continueAdding) {
          message.info('Bạn có thể tiếp tục thêm diễn viên mới');
        } else {
          navigate('/admin/actors');
        }
      } else {
        message.error(response.message || response.error || 'Lỗi khi tạo diễn viên');
      }
    } catch (error) {
      console.error('Create actor error:', error);
      message.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  // Handle form validation failed
  const handleSubmitFailed = (errorInfo) => {
    message.error('Vui lòng kiểm tra lại thông tin đã nhập');
    console.log('Validation failed:', errorInfo);
  };

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Link to="/admin/actors">
              <Button 
                icon={<ArrowLeftOutlined />}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d9d9d9',
                  color: '#000'
                }}
              >
                Quay lại
              </Button>
            </Link>
            <Title level={2} style={{ margin: 0 }}>
              <UserOutlined /> Thêm diễn viên mới
            </Title>
          </Space>
        </Col>
      </Row>

      {/* Form */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onFinishFailed={handleSubmitFailed}
            >
              {/* Basic Information */}
              <Title level={4}>Thông tin diễn viên</Title>
              <Divider />

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Tên diễn viên"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên diễn viên' },
                      { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
                      { max: 100, message: 'Tên không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Ví dụ: Nguyễn Văn A, Trấn Thành..."
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="image"
                    label="Hình ảnh (URL)"
                    rules={[
                      { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
                    ]}
                  >
                    <Input
                      placeholder="https://example.com/image.jpg"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Continue Adding Option */}
              <Form.Item
                name="continueAdding"
                valuePropName="checked"
                style={{ marginTop: 24 }}
              >
                <Switch
                  checkedChildren="Tiếp tục thêm"
                  unCheckedChildren="Về danh sách"
                />
                <Text style={{ marginLeft: 8 }}>
                  Tiếp tục thêm diễn viên khác sau khi lưu
                </Text>
              </Form.Item>

              {/* Submit Buttons */}
              <Form.Item style={{ textAlign: 'right', marginTop: 32, marginBottom: 0 }}>
                <Space size="middle">
                  <Link to="/admin/actors">
                    <Button 
                      size="large"
                      style={{
                        backgroundColor: '#f5f5f5',
                        borderColor: '#d9d9d9',
                        color: '#000'
                      }}
                    >
                      Hủy
                    </Button>
                  </Link>
                  
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<SaveOutlined />}
                    style={{
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu diễn viên'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Sidebar - Preview */}
        <Col xs={24} lg={8}>
          <Card title="Xem trước" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              {form.getFieldValue('image') ? (
                <Avatar 
                  size={80} 
                  src={form.getFieldValue('image')}
                  style={{ marginBottom: 16 }}
                  onError={() => {
                    // Handle image error
                    return false;
                  }}
                />
              ) : (
                <Avatar 
                  size={80} 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    fontSize: '32px',
                    marginBottom: 16 
                  }} 
                  icon={<UserOutlined />}
                >
                  {form.getFieldValue('name')?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
              )}
              
              <div>
                <Text strong style={{ fontSize: '16px' }}>
                  {form.getFieldValue('name') || 'Tên diễn viên'}
                </Text>
              </div>
              
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {form.getFieldValue('image') ? 'Có hình ảnh' : 'Chưa có hình ảnh'}
                </Text>
              </div>
            </div>
          </Card>

          <Card title="Hướng dẫn">
            <Space direction="vertical" size="small">
              <Text strong>Tên diễn viên:</Text>
              <Text type="secondary">
                • Nhập tên đầy đủ của diễn viên
                <br />
                • Có thể là tên thật hoặc nghệ danh
                <br />
                • Không được trùng với diễn viên đã có
              </Text>

              <Text strong style={{ marginTop: 16, display: 'block' }}>Hình ảnh:</Text>
              <Text type="secondary">
                • Nhập URL của hình ảnh đại diện
                <br />
                • Hình ảnh nên có chất lượng tốt
                <br />
                • Để trống nếu chưa có hình ảnh
              </Text>

              <Text strong style={{ marginTop: 16, display: 'block' }}>Lưu ý:</Text>
              <Text type="secondary">
                • Thông tin sẽ hiển thị trên website
                <br />
                • Có thể chỉnh sửa sau khi tạo
                <br />
                • Kiểm tra kỹ trước khi lưu
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateActor;