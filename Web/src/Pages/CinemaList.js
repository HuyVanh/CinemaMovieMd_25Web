import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Avatar, Tag, message, Input, Modal, Switch } from 'antd';
import { ReloadOutlined, EditOutlined, EnvironmentOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const { Link: AntLink } = Typography;
const { Search } = Input;

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredCinemas, setFilteredCinemas] = useState([]);

  // Fetch cinemas from API
  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getCinemas();
      
      if (response.success) {
        console.log('Cinemas data:', response.data);
        
        // Thêm trường status tạm thời cho frontend (vì backend không có)
        const cinemasWithStatus = response.data.map(cinema => ({
          ...cinema,
          status: cinema.status || 'active' // Mặc định đặt là 'active' nếu không có
        }));
        
        setCinemas(cinemasWithStatus);
        setFilteredCinemas(cinemasWithStatus);
        message.success(`Đã tải ${cinemasWithStatus.length} rạp phim`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách rạp phim');
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'CGV Vincom Center Bà Triệu',
          address: 'Tầng 6, Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
          hotline: '1900 6017',
          status: 'active'
        },
        {
          _id: '2',
          name: 'Galaxy Cinema Nguyễn Du',
          address: '116 Nguyễn Du, Quận 1, TP. Hồ Chí Minh',
          hotline: '1900 2224',
          status: 'active'
        },
        {
          _id: '3',
          name: 'BHD Star Cineplex Vincom Thảo Điền',
          address: 'Tầng 5, TTTM Vincom Center, 159 Xa lộ Hà Nội, Quận 2, TP. Hồ Chí Minh',
          hotline: '1900 2099',
          status: 'inactive'
        },
      ];
      setCinemas(fallbackData);
      setFilteredCinemas(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredCinemas(cinemas);
    } else {
      const filtered = cinemas.filter(cinema => {
        return (
          cinema.name.toLowerCase().includes(value.toLowerCase()) ||
          cinema.address.toLowerCase().includes(value.toLowerCase())
        );
      });
      setFilteredCinemas(filtered);
    }
  };

  // Handle cinema detail view
  const handleViewDetail = (cinema) => {
    Modal.info({
      title: 'Thông tin rạp phim',
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <h3 style={{ marginBottom: 16 }}>
            <BankOutlined style={{ marginRight: 8 }} />
            {cinema.name}
          </h3>
          <div style={{ lineHeight: '2' }}>
            <p>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              <strong>Địa chỉ:</strong> {cinema.address}
            </p>
            <p>
              <PhoneOutlined style={{ marginRight: 8 }} />
              <strong>Hotline:</strong> {cinema.hotline || 'Chưa cập nhật'}
            </p>
            <p><strong>Trạng thái:</strong> 
              <Tag 
                color={cinema.status === 'active' ? 'green' : 'red'} 
                style={{ marginLeft: 8 }}
              >
                {cinema.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
              </Tag>
            </p>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  // Handle status change
  const handleStatusChange = async (id, checked) => {
    const newStatus = checked ? 'active' : 'inactive';
    
    setStatusLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      // Lưu ý: Trong thực tế, backend cần hỗ trợ trường status
      // Hiện tại chỉ mô phỏng ở frontend
      // const response = await ApiService.updateCinema(id, { status: newStatus });
      
      // Giả lập API thành công
      const response = { success: true };
      
      if (response.success) {
        message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} rạp phim`);
        
        // Update local state
        const updatedCinemas = cinemas.map(cinema => 
          cinema._id === id ? { ...cinema, status: newStatus } : cinema
        );
        setCinemas(updatedCinemas);
        
        // Update filtered cinemas
        const updatedFilteredCinemas = filteredCinemas.map(cinema => 
          cinema._id === id ? { ...cinema, status: newStatus } : cinema
        );
        setFilteredCinemas(updatedFilteredCinemas);
      } else {
        message.error(response.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating cinema status:', error);
      message.error('Lỗi kết nối API: ' + error.message);
    } finally {
      setStatusLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCinemas();
  }, []);

  const columns = [
    {
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <AntLink 
          onClick={() => handleViewDetail(record)}
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          {text}
        </AntLink>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <div style={{ 
          maxWidth: 350, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          <EnvironmentOutlined style={{ marginRight: 5, color: '#1890ff' }} />
          {address}
        </div>
      ),
    },
    {
      title: 'Hotline',
      dataIndex: 'hotline',
      key: 'hotline',
      width: 150,
      render: (hotline) => hotline || 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status, record) => (
        <Switch
          checked={status === 'active'}
          loading={statusLoading[record._id]}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm ngưng"
        />
      ),
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Tạm ngưng', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Link to={`/admin/cinema/edit/${record._id}`}>
          <Button 
            type="primary" 
            size="middle"
            icon={<EditOutlined />}
            style={{ 
              backgroundColor: '#1890ff', 
              borderColor: '#1890ff',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(24, 144, 255, 0.3)'
            }}
          >
            Sửa
          </Button>
        </Link>
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
        <h2 style={{ margin: 0 }}>Danh sách rạp phim</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchCinemas}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên rạp hoặc địa chỉ..." 
          allowClear 
          style={{ maxWidth: 400 }} 
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <span style={{ marginLeft: 16, color: '#666' }}>
          Hiển thị {filteredCinemas.length} / {cinemas.length} rạp phim
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredCinemas}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} rạp phim`,
        }}
        bordered
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CinemaList;