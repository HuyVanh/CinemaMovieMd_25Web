import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Descriptions,
  Tag,
  Button,
  Spin,
  message,
  Typography,
  Divider,
  Space,
  Table,
  Empty
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary
import moment from 'moment';

const { Title, Text } = Typography;

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch employee details
  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserById(id);
      
      if (response.success) {
        setEmployee(response.data);
        // Nếu là nhân viên, có thể lấy lịch sử bán vé
        if (response.data.role === 'employee') {
          fetchTicketHistory();
        }
      } else {
        message.error(response.error || 'Không thể lấy thông tin nhân viên');
        navigate('/admin/employees');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      message.error('Lỗi kết nối API');
      navigate('/admin/employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ticket history (optional - nếu có API tracking nhân viên bán vé)
  const fetchTicketHistory = async () => {
    try {
      setHistoryLoading(true);
      // Giả sử có API lấy lịch sử bán vé của nhân viên
      // const response = await ApiService.getTicketsByEmployee(id);
      // setTicketHistory(response.data || []);
      setTicketHistory([]); // Tạm thời empty
    } catch (error) {
      console.error('Error fetching ticket history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/admin/employees');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      default: return 'default';
    }
  };

  const getWorkStatusColor = (workStatus) => {
    switch (workStatus) {
      case 'active': return 'blue';
      case 'on_leave': return 'orange';
      case 'inactive': return 'red';
      default: return 'default';
    }
  };

  // Columns for ticket history table
  const ticketColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Mã vé',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Phim',
      dataIndex: 'movieName',
      key: 'movieName',
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => record.userInfo?.fullName || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price?.toLocaleString() || 0}đ`,
    },
    {
      title: 'Ngày bán',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'cancelled' ? 'red' : 'orange'}>
          {status === 'completed' ? 'Hoàn thành' : 
           status === 'cancelled' ? 'Đã hủy' : 
           status === 'pending_payment' ? 'Chờ thanh toán' : status}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Empty description="Không tìm thấy thông tin nhân viên" />
        <Button type="primary" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

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
            Chi tiết nhân viên
          </Title>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Basic Info */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={120}
                src={employee.image}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              >
                {employee.name?.charAt(0)}
              </Avatar>
              <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                {employee.name}
              </Title>
              <Text type="secondary">
                ID: {employee._id?.slice(-8)}
              </Text>
              {employee.employee?.employee_id && (
                <div style={{ marginTop: 4 }}>
                  <Text strong>
                    Mã NV: {employee.employee.employee_id}
                  </Text>
                </div>
              )}
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <Text>{employee.email}</Text>
              </div>
              <div>
                <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <Text>{employee.number_phone}</Text>
              </div>
              <div>
                <CalendarOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                <Text>
                  Ngày sinh: {employee.date_of_birth ? moment(employee.date_of_birth).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                </Text>
              </div>
              <div>
                <IdcardOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                <Text>
                  Giới tính: {
                    employee.gender === 'male' ? 'Nam' :
                    employee.gender === 'female' ? 'Nữ' :
                    employee.gender === 'other' ? 'Khác' : 'Chưa cập nhật'
                  }
                </Text>
              </div>
            </Space>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size="large"
              >
                Quay lại danh sách
              </Button>
            </div>
          </Card>
        </Col>

        {/* Right Column - Detailed Info */}
        <Col xs={24} lg={16}>
          {/* Account Status */}
          <Card title="Trạng thái tài khoản" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>Trạng thái tài khoản</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={getStatusColor(employee.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
                      {employee.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>Trạng thái làm việc</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag 
                      color={getWorkStatusColor(employee.employee?.work_status)} 
                      style={{ fontSize: 14, padding: '4px 12px' }}
                    >
                      {employee.employee?.work_status === 'active' ? 'Đang làm việc' :
                       employee.employee?.work_status === 'on_leave' ? 'Nghỉ phép' :
                       employee.employee?.work_status === 'inactive' ? 'Tạm nghỉ' :
                       'Chưa cập nhật'}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Employee Details */}
          <Card title="Thông tin công việc" style={{ marginBottom: 24 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Vị trí">
                <Tag color="blue">Nhân viên</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày vào làm">
                {employee.employee?.hire_date ? 
                  moment(employee.employee.hire_date).format('DD/MM/YYYY') : 
                  'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo tài khoản">
                {moment(employee.createdAt).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Email xác thực">
                <Tag color={employee.email_verify ? 'green' : 'red'}>
                  {employee.email_verify ? 'Đã xác thực' : 'Chưa xác thực'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò hệ thống">
                <Tag color="orange">
                  {employee.role === 'admin' ? 'Quản trị viên' : 
                   employee.role === 'employee' ? 'Nhân viên' : 'Khách hàng'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Work History / Statistics */}
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                <span>Lịch sử hoạt động</span>
              </Space>
            }
          >
            {ticketHistory.length > 0 ? (
              <Spin spinning={historyLoading}>
                <Table
                  columns={ticketColumns}
                  dataSource={ticketHistory}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </Spin>
            ) : (
              <Empty 
                description="Chưa có lịch sử hoạt động"
                style={{ margin: '40px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDetail;