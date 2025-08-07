import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Card, 
  message, 
  Input, 
  Select, 
  Badge, 
  Tag, 
  Modal,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  ReloadOutlined, 
  SearchOutlined, 
  BankOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import ApiService from '../services/ApiService';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch rooms from API
  const fetchRooms = async (cinemaId = null) => {
    setLoading(true);
    try {
      const response = await ApiService.getRooms(cinemaId);
      
      if (response.success) {
        console.log('Rooms data:', response.data);
        setRooms(response.data);
        setFilteredRooms(response.data);
        message.success(`Đã tải ${response.data.length} phòng chiếu`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách phòng chiếu');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi - kết hợp từ cả 2 nhánh
      const fallbackData = [
        {
          _id: '1',
          name: 'Phòng 1',
          cinema: { _id: '1', name: 'CGV Vincom Center', address: 'Bà Triệu, Hà Nội' },
          currentMovie: 'Quá Nhanh Quá Nguy Hiểm',
          showtimes: ['2024-08-06 - 07:00', '2024-08-06 - 18:00', '2024-08-06 - 22:30'],
          seatCount: 120,
          status: 'active'
        },
        {
          _id: '2',
          name: 'Phòng 2',
          cinema: { _id: '1', name: 'CGV Vincom Center', address: 'Bà Triệu, Hà Nội' },
          currentMovie: 'Đại Náo Võ Đường',
          showtimes: ['2024-08-06 - 07:00', '2024-08-06 - 18:00'],
          seatCount: 100,
          status: 'active'
        },
        {
          _id: '3',
          name: 'Phòng Platinum',
          cinema: { _id: '2', name: 'Galaxy Cinema', address: 'Nguyễn Du, TP. HCM' },
          currentMovie: 'Cuộc Chiến Không Khoan Nhượng',
          showtimes: ['2024-08-06 - 08:00', '2024-08-06 - 20:00'],
          seatCount: 80,
          status: 'maintenance'
        },
        {
          _id: '4',
          name: 'Phòng 4',
          cinema: { _id: '3', name: 'BHD Star Cineplex', address: 'Trung Hòa, Hà Nội' },
          currentMovie: 'Thám Tử Lừng Danh',
          showtimes: ['2024-08-06 - 10:00', '2024-08-06 - 22:00'],
          seatCount: 150,
          status: 'active'
        },
        {
          _id: '5',
          name: 'Phòng 5',
          cinema: { _id: '1', name: 'CGV Vincom Center', address: 'Bà Triệu, Hà Nội' },
          currentMovie: 'Hành Tinh Khỉ',
          showtimes: ['2024-08-06 - 11:00', '2024-08-06 - 17:30'],
          seatCount: 90,
          status: 'active'
        },
      ];
      setRooms(fallbackData);
      setFilteredRooms(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cinemas for filter
  const fetchCinemas = async () => {
    setLoadingCinemas(true);
    try {
      const response = await ApiService.getCinemas();
      
      if (response.success) {
        setCinemas(response.data);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách rạp phim');
        setCinemas([]);
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data
      setCinemas([
        { _id: '1', name: 'CGV Vincom Center' },
        { _id: '2', name: 'Galaxy Cinema' },
        { _id: '3', name: 'BHD Star Cineplex' }
      ]);
    } finally {
      setLoadingCinemas(false);
    }
  };

  // Fetch room details
  const fetchRoomDetails = async (roomId) => {
    setLoadingDetails(true);
    try {
      const response = await ApiService.getRoomById(roomId);
      
      if (response.success) {
        setRoomDetails(response.data);
      } else {
        message.error(response.message || 'Lỗi khi tải chi tiết phòng chiếu');
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data with seat details
      const mockSeats = Array.from({ length: selectedRoom?.seatCount || 20 }, (_, i) => ({
        _id: `seat_${i + 1}`,
        seatNumber: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
        type: i < 5 ? 'vip' : i < 10 ? 'couple' : 'normal',
        row: String.fromCharCode(65 + Math.floor(i / 10)),
        column: (i % 10) + 1,
        status: Math.random() > 0.8 ? 'occupied' : 'available'
      }));

      setRoomDetails({
        room: selectedRoom,
        seats: mockSeats,
        seatCount: mockSeats.length
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRooms();
    fetchCinemas();
  }, []);

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    filterRooms(value, selectedCinema);
  };

  // Cinema filter change
  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    fetchRooms(value === 'all' ? null : value);
  };

  // Filter rooms based on search text and selected cinema
  const filterRooms = (text, cinemaId) => {
    let filtered = [...rooms];
    
    // Filter by search text
    if (text) {
      filtered = filtered.filter(room => {
        return (
          room.name.toLowerCase().includes(text.toLowerCase()) ||
          (room.cinema && room.cinema.name.toLowerCase().includes(text.toLowerCase())) ||
          (room.currentMovie && room.currentMovie.toLowerCase().includes(text.toLowerCase()))
        );
      });
    }
    
    setFilteredRooms(filtered);
  };

  // Handle room detail view
  const handleViewDetail = (room) => {
    setSelectedRoom(room);
    fetchRoomDetails(room._id);
    setDetailModalVisible(true);
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedRoom(null);
    setRoomDetails(null);
  };

  // Handle edit room
  const handleEdit = (room) => {
    message.info(`Chỉnh sửa phòng: ${room.name}`);
    // Navigate to edit page hoặc mở modal edit
  };

  // Handle delete room
  const handleDelete = (room) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa phòng "${room.name}"?`,
      onOk() {
        message.success(`Đã xóa phòng ${room.name}`);
        // Call API delete
      },
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Text strong style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => handleViewDetail(record)}>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          {text}
        </Text>
      ),
    },
    {
      title: 'Rạp',
      dataIndex: 'cinema',
      key: 'cinema',
      render: (cinema) => cinema ? (
        <div>
          <Tag color="blue" icon={<BankOutlined />}>{cinema.name}</Tag>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            <EnvironmentOutlined /> {cinema.address || 'Chưa cập nhật địa chỉ'}
          </div>
        </div>
      ) : 'Không có thông tin',
    },
    {
      title: 'Phim đang chiếu',
      dataIndex: 'currentMovie',
      key: 'currentMovie',
      render: (movie) => movie ? (
        <Tag color="green" icon={<VideoCameraOutlined />}>
          {movie}
        </Tag>
      ) : (
        <Tag color="default">Chưa có phim</Tag>
      ),
    },
    {
      title: 'Thời gian chiếu',
      dataIndex: 'showtimes',
      key: 'showtimes',
      render: (times) => times && times.length > 0 ? (
        <div>
          {times.slice(0, 2).map((time, index) => (
            <Tag key={index} color="orange" icon={<ClockCircleOutlined />} style={{ marginBottom: 4 }}>
              {time}
            </Tag>
          ))}
          {times.length > 2 && (
            <Tag color="default">+{times.length - 2} khung giờ khác</Tag>
          )}
        </div>
      ) : (
        <Text type="secondary">Chưa có lịch chiếu</Text>
      ),
    },
    {
      title: 'Số ghế',
      dataIndex: 'seatCount',
      key: 'seatCount',
      width: 100,
      render: (count) => (
        <Badge 
          count={count || 0} 
          style={{ backgroundColor: '#52c41a' }} 
          overflowCount={999}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusConfig = {
          active: { color: 'green', text: 'Hoạt động' },
          maintenance: { color: 'orange', text: 'Bảo trì' },
          inactive: { color: 'red', text: 'Ngưng hoạt động' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Button 
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <Title level={2} style={{ margin: 0 }}>
          🏢 Danh sách phòng chiếu
        </Title>
        <Space>
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={() => fetchRooms(selectedCinema === 'all' ? null : selectedCinema)}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => message.info('Chức năng thêm phòng chiếu')}
          >
            Thêm phòng
          </Button>
        </Space>
      </div>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Tìm kiếm</Text>
            </div>
            <Search
              placeholder="Tìm kiếm theo tên phòng, rạp, phim..." 
              allowClear 
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Lọc theo rạp</Text>
            </div>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn rạp"
              loading={loadingCinemas}
              value={selectedCinema}
              onChange={handleCinemaChange}
            >
              <Option value="all">Tất cả các rạp</Option>
              {cinemas.map(cinema => (
                <Option key={cinema._id} value={cinema._id}>{cinema.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Thống kê</Text>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Badge count={filteredRooms.length} style={{ backgroundColor: '#1890ff' }} />
              <Text>Tổng số phòng</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <Text>
          Hiển thị <Text strong>{filteredRooms.length}</Text> / <Text strong>{rooms.length}</Text> phòng chiếu
        </Text>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} phòng chiếu`,
        }}
        bordered
        scroll={{ x: 1200 }}
      />

      {/* Room Detail Modal */}
      <Modal
        title={
          <div>
            <BankOutlined style={{ marginRight: 8 }} />
            Chi tiết phòng chiếu
          </div>
        }
        visible={detailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={[
          <Button key="close" onClick={handleCloseDetailModal}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div>Đang tải thông tin...</div>
          </div>
        ) : roomDetails ? (
          <div>
            <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <Text strong>Tên phòng:</Text> {roomDetails.room.name}
                    </div>
                    <div>
                      <Text strong>Rạp:</Text> {roomDetails.room.cinema?.name || 'Không có thông tin'}
                    </div>
                    <div>
                      <Text strong>Địa chỉ rạp:</Text> {roomDetails.room.cinema?.address || 'Chưa cập nhật'}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <Text strong>Phim đang chiếu:</Text> {roomDetails.room.currentMovie || 'Chưa có phim'}
                    </div>
                    <div>
                      <Text strong>Trạng thái:</Text> 
                      <Tag color="green" style={{ marginLeft: 8 }}>
                        {roomDetails.room.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            
            {roomDetails.room.showtimes && roomDetails.room.showtimes.length > 0 && (
              <Card title="Lịch chiếu hôm nay" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {roomDetails.room.showtimes.map((time, index) => (
                    <Tag key={index} color="orange" icon={<ClockCircleOutlined />}>
                      {time}
                    </Tag>
                  ))}
                </div>
              </Card>
            )}

            <Card title="Thông tin ghế ngồi">
              <div style={{ marginBottom: 16 }}>
                <Badge 
                  count={roomDetails.seatCount} 
                  style={{ backgroundColor: '#52c41a' }} 
                  overflowCount={9999}
                />
                <Text style={{ marginLeft: 8 }}>Tổng số ghế trong phòng</Text>
              </div>
              
              {roomDetails.seatCount > 0 ? (
                <div style={{ marginTop: 16 }}>
                  <Divider>Sơ đồ ghế (mẫu)</Divider>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(10, 1fr)', 
                    gap: 4, 
                    maxHeight: 200, 
                    overflow: 'auto',
                    padding: 8,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 4
                  }}>
                    {roomDetails.seats.slice(0, 50).map((seat) => {
                      let color = '#52c41a'; // available
                      if (seat.status === 'occupied') color = '#ff4d4f'; // occupied
                      if (seat.type === 'vip') color = '#faad14'; // vip
                      if (seat.type === 'couple') color = '#eb2f96'; // couple
                      
                      return (
                        <div
                          key={seat._id}
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                          title={`${seat.seatNumber} - ${seat.type}`}
                        >
                          {seat.seatNumber}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: '#52c41a', borderRadius: 2 }}></div>
                      <Text>Ghế trống</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: '#ff4d4f', borderRadius: 2 }}></div>
                      <Text>Đã đặt</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: '#faad14', borderRadius: 2 }}></div>
                      <Text>Ghế VIP</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: '#eb2f96', borderRadius: 2 }}></div>
                      <Text>Ghế đôi</Text>
                    </div>
                  </div>
                </div>
              ) : (
                <Text type="secondary">Chưa có thông tin ghế ngồi</Text>
              )}
            </Card>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            Không có thông tin chi tiết
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomList;