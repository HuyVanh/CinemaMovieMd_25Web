import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Avatar, message, Input, Modal, Form } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary

const DirectorList = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDirector, setEditingDirector] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch directors from API
// Thay thế function fetchDirectors trong DirectorList component:

const fetchDirectors = async () => {
  console.log('=== DEBUG: Starting fetchDirectors ===');
  setLoading(true);
  try {
    console.log('=== DEBUG: Calling ApiService.getDirectors ===');
    const response = await ApiService.getDirectors();
    
    console.log('=== DEBUG: API Response ===', response);
    console.log('Response success:', response.success);
    console.log('Response data:', response.data);
    console.log('Data type:', typeof response.data);
    console.log('Data length:', response.data?.length);
    
    if (response.success) {
      console.log('=== DEBUG: Setting directors data ===');
      setDirectors(response.data);
      setFilteredDirectors(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.length
      }));
      console.log('=== DEBUG: Directors set successfully ===');
      message.success(`Đã tải ${response.data.length} đạo diễn`);
    } else {
      console.log('=== DEBUG: API Response not successful ===');
      console.log('Error message:', response.message || response.error);
      message.error(response.message || response.error || 'Lỗi khi tải danh sách đạo diễn');
      setDirectors([]);
      setFilteredDirectors([]);
    }
  } catch (error) {
    console.log('=== DEBUG: Fetch error ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    message.error('Lỗi kết nối API: ' + error.message);
    setDirectors([]);
    setFilteredDirectors([]);
  } finally {
    console.log('=== DEBUG: fetchDirectors completed ===');
    setLoading(false);
  }
};

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredDirectors(directors);
      setPagination(prev => ({
        ...prev,
        total: directors.length,
        current: 1
      }));
    } else {
      const filtered = directors.filter(director => {
        return director.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredDirectors(filtered);
      setPagination(prev => ({
        ...prev,
        total: filtered.length,
        current: 1
      }));
    }
  };

  // Handle table change
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Handle edit director
  const handleEdit = (director) => {
    setEditingDirector(director);
    form.setFieldsValue({
      name: director.name,
      image: director.image || '',
    });
    setEditModalVisible(true);
  };

  // Handle update director
  const handleUpdate = async (values) => {
    setEditLoading(true);
    try {
      const response = await ApiService.updateDirector(editingDirector._id, values);
      if (response.success) {
        message.success('Cập nhật đạo diễn thành công');
        setEditModalVisible(false);
        setEditingDirector(null);
        form.resetFields();
        fetchDirectors(); // Refresh data
      } else {
        message.error(response.message || response.error || 'Lỗi khi cập nhật đạo diễn');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật đạo diễn');
      console.error('Update director error:', error);
    } finally {
      setEditLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDirectors();
  }, []);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, record, index) => {
        // Tính số thứ tự dựa trên trang hiện tại
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'Avatar',
      dataIndex: 'image',
      key: 'avatar',
      width: 80,
      render: (image, record) => (
        image ? (
          <Avatar 
            src={image}
            size="large"
          />
        ) : (
          <Avatar 
            style={{ backgroundColor: '#87d068' }} 
            icon={<UserOutlined />}
            size="large"
          >
            {record.name?.charAt(0).toUpperCase()}
          </Avatar>
        )
      ),
    },
    {
      title: 'Tên đạo diễn',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            color: 'white'
          }}
        >
          Sửa
        </Button>
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
        <h2 style={{ margin: 0 }}>Danh sách đạo diễn</h2>
        <Space>
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={fetchDirectors}
            loading={loading}
            style={{
              backgroundColor: '#f5f5f5',
              borderColor: '#d9d9d9',
              color: '#000'
            }}
          >
            Refresh
          </Button>
          <Link to="/admin/directors/create">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: 'white'
              }}
            >
              Thêm đạo diễn
            </Button>
          </Link>
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search 
          placeholder="Tìm kiếm theo tên..." 
          allowClear 
          style={{ maxWidth: 400 }} 
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <span style={{ marginLeft: 16, color: '#666' }}>
          Hiển thị {filteredDirectors.length} / {directors.length} đạo diễn
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredDirectors}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} đạo diễn`,
        }}
        onChange={handleTableChange}
        bordered
        scroll={{ x: 600 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa đạo diễn"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingDirector(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Tên đạo diễn"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đạo diễn' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
              { max: 100, message: 'Tên không được quá 100 ký tự' }
            ]}
          >
            <Input placeholder="Ví dụ: Victor Vũ, Charlie Nguyễn..." />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh (URL)"
            rules={[
              { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          {/* Preview */}
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Xem trước:</p>
            {form.getFieldValue('image') ? (
              <Avatar 
                size={64} 
                src={form.getFieldValue('image')}
                onError={() => false}
              />
            ) : (
              <Avatar 
                size={64} 
                style={{ backgroundColor: '#87d068' }} 
                icon={<UserOutlined />}
              >
                {form.getFieldValue('name')?.charAt(0).toUpperCase() || 'D'}
              </Avatar>
            )}
            <div style={{ marginTop: 8 }}>
              <span style={{ fontWeight: 'bold' }}>
                {form.getFieldValue('name') || 'Tên đạo diễn'}
              </span>
            </div>
          </div>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  setEditingDirector(null);
                  form.resetFields();
                }}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d9d9d9',
                  color: '#000'
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={editLoading}
                style={{
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {editLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DirectorList;