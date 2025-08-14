import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Typography,
  Card,
  Row,
  Col,
  message,
  Spin,
  Modal,
  Descriptions,
  Empty,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary
import moment from 'moment';

const { Title } = Typography;

const Users = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states for ticket history
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerTickets, setCustomerTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(false);

  // Fetch users data
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        role: 'user', // Chỉ lấy khách hàng
        ...params
      };

      if (searchText) {
        queryParams.search = searchText;
      }

      const response = await ApiService.getUsers(queryParams);
      
      if (response.success) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total,
        }));
      } else {
        message.error(response.error || 'Không thể lấy danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Reload data when pagination changes
  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  // Reload data when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.current === 1) {
        fetchUsers();
      } else {
        setPagination(prev => ({ ...prev, current: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleRefresh = () => {
    fetchUsers();
    message.success('Đã làm mới dữ liệu');
  };

  // Handle view customer ticket history
  const handleViewHistory = async (customer) => {
    setSelectedCustomer(customer);
    setIsHistoryModalVisible(true);
    setTicketLoading(true);
    
    try {
      const response = await ApiService.getTicketsByUser(customer._id);
      if (response.success) {
        setCustomerTickets(response.data || []);
      } else {
        message.error(response.error || 'Không thể lấy lịch sử vé');
        setCustomerTickets([]);
      }
    } catch (error) {
      console.error('Error fetching customer tickets:', error);
      message.error('Lỗi khi lấy lịch sử vé');
      setCustomerTickets([]);
    } finally {
      setTicketLoading(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalVisible(false);
    setSelectedCustomer(null);
    setCustomerTickets([]);
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center',
      fixed: 'left',
      render: (_, record, index) => (
        <div style={{ 
          fontWeight: 600, 
          color: '#1890ff',
          fontSize: '14px' 
        }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </div>
      ),
    },
    {
      title: 'Avatar',
      dataIndex: 'image',
      key: 'avatar',
      width: 80,
      render: (image, record) => (
        <Avatar 
          size="large" 
          src={image} 
          style={{ backgroundColor: '#1890ff' }} 
          icon={<UserOutlined />}
        >
          {record.name?.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            ID: {record._id?.slice(-8) || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <MailOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {record.email}
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
            {record.number_phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <div>
          <Tag color={record.status === 'active' ? 'green' : record.status === 'inactive' ? 'orange' : 'red'}>
            {record.status === 'active' ? 'Hoạt động' : 
             record.status === 'inactive' ? 'Tạm khóa' : 'Đã xóa'}
          </Tag>
          <div style={{ marginTop: 4 }}>
            <Tag color={record.email_verify ? 'blue' : 'default'}>
              {record.email_verify ? 'Đã xác thực' : 'Chưa xác thực'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewHistory(record)}
          title="Xem lịch sử mua vé"
        >
          Lịch sử
        </Button>
      ),
    },
  ];

  const handleTableChange = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
      total: pagination.total,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Quản lý khách hàng</Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          type="default"
        >
          Làm mới
        </Button>
      </div>



      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Input.Search
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              allowClear
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
            />
          </Col>
          <Col>
            <Space>

            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </Card>

      {/* Modal for Customer Ticket History */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar 
              src={selectedCustomer?.image} 
              icon={<UserOutlined />}
              size="large"
            >
              {selectedCustomer?.name?.charAt(0)}
            </Avatar>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                Lịch sử mua vé - {selectedCustomer?.name}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {selectedCustomer?.email}
              </div>
            </div>
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={handleCloseHistoryModal}
        footer={[
          <Button key="close" onClick={handleCloseHistoryModal}>
            Đóng
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        <Spin spinning={ticketLoading}>
          {customerTickets.length === 0 ? (
            <Empty 
              description="Khách hàng chưa có lịch sử mua vé nào"
              style={{ margin: '40px 0' }}
            />
          ) : (
            <div>
              {/* Customer Summary */}
              <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <CalendarOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 4 }} />
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {customerTickets.length}
                      </div>
                      <div style={{ color: '#666', fontSize: 12 }}>
                        Tổng số vé
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <DollarOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 4 }} />
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {customerTickets.reduce((sum, ticket) => sum + (ticket.totalPrice || ticket.price || 0), 0).toLocaleString()}đ
                      </div>
                      <div style={{ color: '#666', fontSize: 12 }}>
                        Tổng chi tiêu
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <UserOutlined style={{ fontSize: 24, color: '#fa8c16', marginBottom: 4 }} />
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {selectedCustomer?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </div>
                      <div style={{ color: '#666', fontSize: 12 }}>
                        Trạng thái
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Tickets List */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {customerTickets.map((ticket, index) => (
                  <Card 
                    key={ticket._id || index}
                    size="small" 
                    style={{ marginBottom: 12 }}
                    hoverable
                  >
                    <Row gutter={16} align="middle">
                      <Col span={6}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            {ticket.movie?.title || ticket.movieName || 'N/A'}
                          </div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {ticket.cinema?.name || ticket.cinemaName || 'N/A'} - {ticket.room?.name || ticket.roomName || 'N/A'}
                          </div>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div>
                          <div style={{ fontSize: 12, color: '#666' }}>Ngày chiếu</div>
                          <div style={{ fontWeight: 500 }}>
                            {ticket.showDate ? moment(ticket.showDate).format('DD/MM/YYYY') : 
                             ticket.showtime?.showDate ? moment(ticket.showtime.showDate).format('DD/MM/YYYY') : 'N/A'}
                          </div>
                        </div>
                      </Col>
                      <Col span={3}>
                        <div>
                          <div style={{ fontSize: 12, color: '#666' }}>Giờ chiếu</div>
                          <div style={{ fontWeight: 500 }}>
                            {ticket.showTime || ticket.showtime?.showTime || 'N/A'}
                          </div>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div>
                          <div style={{ fontSize: 12, color: '#666' }}>Ghế</div>
                          <div style={{ fontWeight: 500 }}>
                            {/* Xử lý hiển thị ghế một cách an toàn */}
                            {(() => {
                              // Nếu có mảng seats với thông tin chi tiết
                              if (ticket.seats && Array.isArray(ticket.seats) && ticket.seats.length > 0) {
                                return ticket.seats.map(seat => {
                                  if (typeof seat === 'string') return seat;
                                  return seat?.seatNumber || seat?.name || seat?._id?.slice(-3) || 'N/A';
                                }).join(', ');
                              }
                              
                              // Nếu có seatNumbers dạng string
                              if (ticket.seatNumbers && typeof ticket.seatNumbers === 'string') {
                                return ticket.seatNumbers;
                              }
                              
                              // Nếu có seatNumber (single)
                              if (ticket.seatNumber) {
                                return ticket.seatNumber;
                              }
                              
                              // Fallback
                              return 'N/A';
                            })()}
                          </div>
                        </div>
                      </Col>
                      <Col span={3}>
                        <div>
                          <div style={{ fontSize: 12, color: '#666' }}>Tổng tiền</div>
                          <div style={{ fontWeight: 600, color: '#52c41a' }}>
                            {(ticket.totalPrice || ticket.price || 0).toLocaleString()}đ
                          </div>
                        </div>
                      </Col>
                      <Col span={4}>
                        <div>
                          <Tag 
                            color={
                              ticket.status === 'confirmed' || ticket.status === 'active' ? 'green' : 
                              ticket.status === 'cancelled' || ticket.status === 'canceled' ? 'red' : 
                              ticket.status === 'pending' ? 'orange' : 'default'
                            }
                          >
                            {ticket.status === 'confirmed' || ticket.status === 'active' ? 'Đã xác nhận' :
                             ticket.status === 'cancelled' || ticket.status === 'canceled' ? 'Đã hủy' :
                             ticket.status === 'pending' ? 'Chờ xác nhận' : ticket.status}
                          </Tag>
                          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                            {ticket.createdAt ? moment(ticket.createdAt).format('DD/MM/YY HH:mm') : 
                             ticket.bookingDate ? moment(ticket.bookingDate).format('DD/MM/YY HH:mm') : 'N/A'}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default Users;