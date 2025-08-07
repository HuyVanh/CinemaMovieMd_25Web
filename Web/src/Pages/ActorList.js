import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Avatar, message, Input, Modal, Form } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const { Link: AntLink } = Typography;

const ActorList = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredActors, setFilteredActors] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch actors from API
  const fetchActors = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getActors();
      
      if (response.success) {
        console.log('Actors data:', response.data);
        setActors(response.data);
        setFilteredActors(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length
        }));
        message.success(`Đã tải ${response.data.length} diễn viên`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách diễn viên');
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'Ngô Thanh Vân',
          image: null
        },
        {
          _id: '2',
          name: 'Trấn Thành',
          image: null
        },
        {
          _id: '3',
          name: 'Ninh Dương Lan Ngọc',
          image: null
        },
      ];
      setActors(fallbackData);
      setFilteredActors(fallbackData);
      setPagination(prev => ({
        ...prev,
        total: fallbackData.length
      }));
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredActors(actors);
      setPagination(prev => ({
        ...prev,
        total: actors.length,
        current: 1
      }));
    } else {
      const filtered = actors.filter(actor => {
        return actor.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredActors(filtered);
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

  // Handle edit actor
  const handleEdit = (actor) => {
    setEditingActor(actor);
    form.setFieldsValue({
      name: actor.name,
      image: actor.image || '',
    });
    setEditModalVisible(true);
  };

  // Handle update actor
  const handleUpdate = async (values) => {
    setEditLoading(true);
    try {
      const response = await ApiService.updateActor(editingActor._id, values);
      if (response.success) {
        message.success('Cập nhật diễn viên thành công');
        setEditModalVisible(false);
        setEditingActor(null);
        form.resetFields();
        fetchActors(); // Refresh data
      } else {
        message.error(response.message || response.error || 'Lỗi khi cập nhật diễn viên');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật diễn viên');
      console.error('Update actor error:', error);
    } finally {
      setEditLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchActors();
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
            style={{ backgroundColor: '#1890ff' }} 
            icon={<UserOutlined />}
            size="large"
          >
            {record.name?.charAt(0).toUpperCase()}
          </Avatar>
        )
      ),
    },
    {
      title: 'Tên diễn viên',
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
        <h2 style={{ margin: 0 }}>Danh sách diễn viên</h2>
        <Space>
          <Button 
            type="default"
            icon={<ReloadOutlined />}
            onClick={fetchActors}
            loading={loading}
            style={{
              backgroundColor: '#f5f5f5',
              borderColor: '#d9d9d9',
              color: '#000'
            }}
          >
            Refresh
          </Button>
          <Link to="/admin/actors/create">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: 'white'
              }}
            >
              Thêm diễn viên
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
          Hiển thị {filteredActors.length} / {actors.length} diễn viên
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredActors}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} diễn viên`,
        }}
        onChange={handleTableChange}
        bordered
        scroll={{ x: 600 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa diễn viên"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingActor(null);
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
            label="Tên diễn viên"
            rules={[
              { required: true, message: 'Vui lòng nhập tên diễn viên' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
              { max: 100, message: 'Tên không được quá 100 ký tự' }
            ]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn A..." />
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
                style={{ backgroundColor: '#1890ff' }} 
                icon={<UserOutlined />}
              >
                {form.getFieldValue('name')?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            )}
            <div style={{ marginTop: 8 }}>
              <span style={{ fontWeight: 'bold' }}>
                {form.getFieldValue('name') || 'Tên diễn viên'}
              </span>
            </div>
          </div>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  setEditingActor(null);
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

export default ActorList;