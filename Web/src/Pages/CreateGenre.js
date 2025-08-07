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
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../config/api';

const { Title, Text } = Typography;

const CreateGenre = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const genreData = {
        name: values.name.trim()
      };

      const response = await ApiService.createGenre(genreData);
      
      if (response.success) {
        message.success('Tạo thể loại phim thành công!');
        
        // Reset form
        form.resetFields();
        
        // Navigate back to list or stay for adding more
        if (values.continueAdding) {
          // Stay on current page, form is already reset
          message.info('Bạn có thể tiếp tục thêm thể loại mới');
        } else {
          // Navigate back to genre list
          navigate('/admin/genres');
        }
      } else {
        message.error(response.message || 'Lỗi khi tạo thể loại phim');
      }
    } catch (error) {
      console.error('Create genre error:', error);
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
            <Link to="/admin/genres">
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
              <TagsOutlined /> Thêm thể loại phim mới
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
              <Title level={4}>Thông tin cơ bản</Title>
              <Divider />

              <Form.Item
                name="name"
                label="Tên thể loại"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên thể loại' },
                  { min: 2, message: 'Tên thể loại phải có ít nhất 2 ký tự' },
                  { max: 100, message: 'Tên thể loại không được quá 100 ký tự' }
                ]}
              >
                <Input
                  placeholder="Ví dụ: Hành động, Tình cảm, Kinh dị..."
                  size="large"
                />
              </Form.Item>

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
                  Tiếp tục thêm thể loại khác sau khi lưu
                </Text>
              </Form.Item>

              {/* Submit Buttons */}
              <Form.Item style={{ textAlign: 'right', marginTop: 32, marginBottom: 0 }}>
                <Space size="middle">
                  <Link to="/admin/genres">
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
                    {loading ? 'Đang lưu...' : 'Lưu thể loại'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Sidebar - Guidelines */}
        <Col xs={24} lg={8}>
          <Card title="Hướng dẫn" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="small">
              <Text strong>Tên thể loại:</Text>
              <Text type="secondary">
                • Sử dụng tên ngắn gọn, dễ hiểu
                <br />
                • Ví dụ: "Hành động", "Tình cảm", "Kinh dị"
                <br />
                • Không được trùng với thể loại đã có
                <br />
                • Chỉ sử dụng chữ cái và khoảng trắng
              </Text>

              <Text strong style={{ marginTop: 16, display: 'block' }}>Lưu ý:</Text>
              <Text type="secondary">
                • Tên thể loại sẽ hiển thị trên website
                <br />
                • Nên đặt tên dễ hiểu cho người dùng
                <br />
                • Tránh tên quá dài hoặc phức tạp
              </Text>
            </Space>
          </Card>

          {/* Preview */}
          <Card title="Xem trước">
            <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '6px' }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>
                  {form.getFieldValue('name') || 'Tên thể loại sẽ hiển thị ở đây'}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Đây là cách thể loại sẽ hiển thị trên website
                </Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateGenre;