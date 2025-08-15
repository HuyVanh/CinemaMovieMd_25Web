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
  Form,
  Row,
  Col
} from 'antd';
import { 
  ReloadOutlined, 
  SearchOutlined, 
  BankOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  EditOutlined,
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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    cinema: '',
    status: 'active'
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    cinema: '',
    status: 'active'
  });
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: 'info' 
  });

  // Fetch rooms from API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getRooms();
      
      if (response.success) {
        console.log('Rooms data:', response.data);
        
        // Sort rooms by cinema first, then by room name
        const sortedRooms = response.data.sort((a, b) => {
          const cinemaA = a.cinema?.name || '';
          const cinemaB = b.cinema?.name || '';
          
          // First sort by cinema name
          if (cinemaA !== cinemaB) {
            return cinemaA.localeCompare(cinemaB, 'vi', { numeric: true });
          }
          
          // Then sort by room name within same cinema
          const roomA = a.name || '';
          const roomB = b.name || '';
          return roomA.localeCompare(roomB, 'vi', { numeric: true });
        });
        
        setRooms(sortedRooms);
        showNotification(`Đã tải ${sortedRooms.length} phòng chiếu`, 'success');
      } else {
        showNotification(response.message || 'Lỗi khi tải danh sách phòng chiếu', 'error');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      showNotification('Lỗi kết nối API: ' + error.message, 'error');
      
      // Fallback data nếu API lỗi
      const fallbackData = [];
      setRooms(fallbackData);
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
        showNotification(response.message || 'Lỗi khi tải danh sách rạp phim', 'error');
        setCinemas([]);
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      showNotification('Lỗi kết nối API: ' + error.message, 'error');
      
      // Fallback data
      setCinemas([]);
    } finally {
      setLoadingCinemas(false);
    }
  };



  // Load data on component mount
  useEffect(() => {
    fetchRooms();
    fetchCinemas();
  }, []);

  // Re-sort and filter when rooms data changes
  useEffect(() => {
    if (rooms.length > 0) {
      filterRooms(searchText, selectedCinema);
    }
  }, [rooms]);

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    filterRooms(value, selectedCinema);
  };

  // Cinema filter change
  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    // Don't call fetchRooms again, just filter current data
    filterRooms(searchText, value);
  };

  // Filter rooms based on search text and selected cinema
  const filterRooms = (text, cinemaId) => {
    let filtered = [...rooms];
    
    // Filter by cinema first if selected
    if (cinemaId && cinemaId !== 'all') {
      filtered = filtered.filter(room => room.cinema?._id === cinemaId);
    }
    
    // Filter by search text
    if (text) {
      filtered = filtered.filter(room => {
        return (
          room.name.toLowerCase().includes(text.toLowerCase()) ||
          (room.cinema && room.cinema.name.toLowerCase().includes(text.toLowerCase()))
        );
      });
    }
    
    // Always sort by cinema name first, then by room name
    filtered.sort((a, b) => {
      const cinemaA = a.cinema?.name || '';
      const cinemaB = b.cinema?.name || '';
      
      // First sort by cinema name
      if (cinemaA !== cinemaB) {
        return cinemaA.localeCompare(cinemaB, 'vi', { numeric: true });
      }
      
      // Then sort by room name within same cinema
      const roomA = a.name || '';
      const roomB = b.name || '';
      return roomA.localeCompare(roomB, 'vi', { numeric: true });
    });
    
    setFilteredRooms(filtered);
  };



  // Handle edit room
  const handleEdit = (room) => {
    setEditingRoom(room);
    setEditForm({
      name: room.name || '',
      cinema: room.cinema?._id || '',
      status: room.status || 'active'
    });
    setEditModalVisible(true);
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingRoom(null);
    setEditForm({
      name: '',
      cinema: '',
      status: 'active'
    });
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  // Get existing rooms in selected cinema
  const getExistingRoomsInCinema = (cinemaId, excludeRoomId = null) => {
    return rooms.filter(room => {
      const isSameCinema = room.cinema?._id === cinemaId;
      const isDifferentRoom = excludeRoomId ? room._id !== excludeRoomId : true;
      return isSameCinema && isDifferentRoom;
    }).map(room => room.name).sort();
  };
  const validateRoomName = (name, cinemaId, excludeRoomId = null) => {
    const trimmedName = name.trim().toLowerCase();
    
    // Check if room name already exists in the same cinema
    const duplicateRoom = rooms.find(room => {
      const isSameCinema = room.cinema?._id === cinemaId;
      const isSameName = room.name.toLowerCase() === trimmedName;
      const isDifferentRoom = excludeRoomId ? room._id !== excludeRoomId : true;
      
      return isSameCinema && isSameName && isDifferentRoom;
    });
    
    return duplicateRoom;
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      // Validate form
      if (!editForm.name.trim()) {
        showNotification('Vui lòng nhập tên phòng', 'error');
        return;
      }
      if (!editForm.cinema) {
        showNotification('Vui lòng chọn rạp', 'error');
        return;
      }

      // Check for duplicate room name in the same cinema
      const duplicateRoom = validateRoomName(editForm.name, editForm.cinema, editingRoom._id);
      if (duplicateRoom) {
        const cinemaName = cinemas.find(c => c._id === editForm.cinema)?.name || 'rạp này';
        showNotification(`Phòng "${editForm.name.trim()}" đã tồn tại trong ${cinemaName}. Vui lòng chọn tên khác.`, 'error');
        return;
      }

      // Call API to update room
      const response = await ApiService.updateRoom(editingRoom._id, editForm);
      
      if (response.success) {
        showNotification(`Đã cập nhật phòng "${editForm.name}" thành công`, 'success');
        
        // Update local data
        const updatedRooms = rooms.map(room => {
          if (room._id === editingRoom._id) {
            const selectedCinemaData = cinemas.find(c => c._id === editForm.cinema);
            return {
              ...room,
              name: editForm.name,
              cinema: selectedCinemaData || room.cinema,
              status: editForm.status
            };
          }
          return room;
        });
        
        setRooms(updatedRooms);
        handleCloseEditModal();
      } else {
        showNotification(response.message || 'Lỗi khi cập nhật phòng', 'error');
      }
      
    } catch (error) {
      console.error('Error updating room:', error);
      showNotification('Lỗi khi cập nhật phòng: ' + error.message, 'error');
    }
  };

  // Handle add room
  const handleAddRoom = () => {
    console.log('Opening add modal...'); // Debug log
    setAddForm({
      name: '',
      cinema: '',
      status: 'active'
    });
    setAddModalVisible(true);
  };

  // Handle close add modal
  const handleCloseAddModal = () => {
    setAddModalVisible(false);
    setAddForm({
      name: '',
      cinema: '',
      status: 'active'
    });
  };

  // Handle save add
  const handleSaveAdd = async () => {
    try {
      // Validate form
      if (!addForm.name.trim()) {
        showNotification('Vui lòng nhập tên phòng', 'error');
        return;
      }
      if (!addForm.cinema) {
        showNotification('Vui lòng chọn rạp', 'error');
        return;
      }

      // Check for duplicate room name in the same cinema
      const duplicateRoom = validateRoomName(addForm.name, addForm.cinema);
      if (duplicateRoom) {
        const cinemaName = cinemas.find(c => c._id === addForm.cinema)?.name || 'rạp này';
        showNotification(`Phòng "${addForm.name.trim()}" đã tồn tại trong ${cinemaName}. Vui lòng chọn tên khác.`, 'error');
        return;
      }

      // Prepare data for API
      const roomData = {
        name: addForm.name.trim(),
        cinema: addForm.cinema,
        status: addForm.status
      };

      // Call API to create room
      const response = await ApiService.createRoom(roomData);
      
      if (response.success) {
        showNotification(`Đã thêm phòng "${addForm.name}" thành công`, 'success');
        
        // Add new room to local data
        const selectedCinemaData = cinemas.find(c => c._id === addForm.cinema);
        const newRoom = {
          _id: response.data._id || Date.now().toString(),
          name: addForm.name,
          cinema: selectedCinemaData,
          status: addForm.status,
          ...response.data
        };
        
        const updatedRooms = [...rooms, newRoom];
        setRooms(updatedRooms);
        handleCloseAddModal();
      } else {
        showNotification(response.message || 'Lỗi khi thêm phòng', 'error');
      }
      
    } catch (error) {
      console.error('Error creating room:', error);
      showNotification('Lỗi khi thêm phòng: ' + error.message, 'error');
    }
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
        <Text strong>
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
          {/* Debug info */}
          <div style={{ marginBottom: 16, fontSize: 12, color: '#666' }}>
          </div>
          <Tag color="blue" icon={<BankOutlined />}>{cinema.name}</Tag>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            <EnvironmentOutlined /> {cinema.address || 'Chưa cập nhật địa chỉ'}
          </div>
        </div>
      ) : 'Không có thông tin',
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
      width: 80,
      render: (_, record) => (
        <Space>
          <Button 
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
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
            onClick={() => fetchRooms()}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddRoom}
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
              placeholder="Tìm kiếm theo tên phòng, rạp..." 
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
        scroll={{ x: 800 }}
      />

      {/* Edit Room Modal */}
      <Modal
        title={
          <div>
            <EditOutlined style={{ marginRight: 8 }} />
            Chỉnh sửa phòng chiếu
          </div>
        }
        open={editModalVisible}
        onCancel={handleCloseEditModal}
        onOk={handleSaveEdit}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={600}
        destroyOnClose={true}
      >
        {editingRoom && (
          <div>
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Tên phòng *</Text>
                  <Input
                    style={{ marginTop: 8 }}
                    placeholder="Nhập tên phòng chiếu"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Rạp chiếu *</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Chọn rạp chiếu"
                    value={editForm.cinema}
                    onChange={(value) => setEditForm({ ...editForm, cinema: value })}
                  >
                    {cinemas.map(cinema => (
                      <Option key={cinema._id} value={cinema._id}>
                        <BankOutlined style={{ marginRight: 8 }} />
                        {cinema.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Trạng thái</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={editForm.status}
                    onChange={(value) => setEditForm({ ...editForm, status: value })}
                  >
                    <Option value="active">
                      <Tag color="green">Hoạt động</Tag>
                    </Option>
                    <Option value="maintenance">
                      <Tag color="orange">Bảo trì</Tag>
                    </Option>
                    <Option value="inactive">
                      <Tag color="red">Ngưng hoạt động</Tag>
                    </Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: 12, 
              borderRadius: 4, 
              marginTop: 16 
            }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <strong>ID phòng:</strong> {editingRoom._id}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Room Modal */}
      <Modal
        title={
          <div>
            <PlusOutlined style={{ marginRight: 8 }} />
            Thêm phòng chiếu mới
          </div>
        }
        open={addModalVisible}
        onCancel={handleCloseAddModal}
        onOk={handleSaveAdd}
        okText="Thêm phòng"
        cancelText="Hủy"
        width={600}
        destroyOnClose={true}
      >
        <div>
          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Tên phòng *</Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="Nhập tên phòng chiếu (vd: Phòng 1, Phòng VIP, ...)"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>
            </Col>
          </Row>

          {/* Show existing rooms in selected cinema */}
          {editForm.cinema && (
            <div style={{ 
              backgroundColor: '#f6ffed', 
              padding: 12, 
              borderRadius: 4, 
              marginBottom: 16,
              border: '1px solid #b7eb8f'
            }}>
              <Text strong style={{ fontSize: 13, color: '#52c41a' }}>
                📋 Phòng hiện có trong rạp này:
              </Text>
              <div style={{ marginTop: 8 }}>
                {(() => {
                  const existingRooms = getExistingRoomsInCinema(editForm.cinema, editingRoom._id);
                  const selectedCinemaName = cinemas.find(c => c._id === editForm.cinema)?.name;
                  
                  if (existingRooms.length === 0) {
                    return (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Chưa có phòng nào khác trong {selectedCinemaName}
                      </Text>
                    );
                  }
                  
                  return (
                    <div>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        {selectedCinemaName}: 
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        {existingRooms.map((roomName, index) => (
                          <Tag key={index} color="green" style={{ marginBottom: 4 }}>
                            {roomName}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Rạp chiếu *</Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn rạp chiếu"
                  value={addForm.cinema}
                  onChange={(value) => setAddForm({ ...addForm, cinema: value })}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {cinemas.map(cinema => (
                    <Option key={cinema._id} value={cinema._id}>
                      <BankOutlined style={{ marginRight: 8 }} />
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          {/* Show existing rooms in selected cinema */}
          {addForm.cinema && (
            <div style={{ 
              backgroundColor: '#f6ffed', 
              padding: 12, 
              borderRadius: 4, 
              marginBottom: 16,
              border: '1px solid #b7eb8f'
            }}>
              <Text strong style={{ fontSize: 13, color: '#52c41a' }}>
                📋 Phòng hiện có trong rạp này:
              </Text>
              <div style={{ marginTop: 8 }}>
                {(() => {
                  const existingRooms = getExistingRoomsInCinema(addForm.cinema);
                  const selectedCinemaName = cinemas.find(c => c._id === addForm.cinema)?.name;
                  
                  if (existingRooms.length === 0) {
                    return (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Chưa có phòng nào trong {selectedCinemaName}
                      </Text>
                    );
                  }
                  
                  return (
                    <div>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        {selectedCinemaName}: 
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        {existingRooms.map((roomName, index) => (
                          <Tag key={index} color="green" style={{ marginBottom: 4 }}>
                            {roomName}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Trạng thái</Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  value={addForm.status}
                  onChange={(value) => setAddForm({ ...addForm, status: value })}
                >
                  <Option value="active">
                    <Tag color="green">Hoạt động</Tag>
                  </Option>
                  <Option value="maintenance">
                    <Tag color="orange">Bảo trì</Tag>
                  </Option>
                  <Option value="inactive">
                    <Tag color="red">Ngưng hoạt động</Tag>
                  </Option>
                </Select>
              </div>
            </Col>
          </Row>

          <div style={{ 
            backgroundColor: '#fff2e8', 
            padding: 12, 
            borderRadius: 4, 
            marginTop: 16,
            border: '1px solid #ffbb96'
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ⚠️ <strong>Lưu ý:</strong> Tên phòng phải là duy nhất trong cùng một rạp. Ví dụ: không thể có 2 "Phòng 1" trong cùng một rạp.
            </Text>
          </div>

          <div style={{ 
            backgroundColor: '#e6f7ff', 
            padding: 12, 
            borderRadius: 4, 
            marginTop: 8,
            border: '1px solid #91d5ff'
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 <strong>Gợi ý:</strong> Sau khi thêm phòng thành công, bạn có thể vào phần "Quản lý ghế" để thiết lập sơ đồ ghế ngồi cho phòng này.
            </Text>
          </div>
        </div>
      </Modal>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-sm ${
          notification.type === 'success' ? 'bg-green-600' : 
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`}>
          <div className="flex items-center">
            <span className="flex-1">{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: 'info' })}
              className="ml-2 text-white hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;