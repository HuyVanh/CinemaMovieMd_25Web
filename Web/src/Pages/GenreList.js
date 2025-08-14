import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  message,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Typography,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary

const { Search } = Input;
const { Title } = Typography;

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [form] = Form.useForm();

  // Fetch genres
  const fetchGenres = async (page = 1, pageSize = 10, search = '') => {
    console.log('Fetching genres...');
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
      };
      
      if (search) {
        params.search = search;
      }

      console.log('API params:', params);
      const response = await ApiService.getGenres(params);
      console.log('API response:', response);
      
      if (response.success) {
        console.log('Response data:', response.data);
        console.log('Genres array:', response.data.genres);
        
        // Lấy dữ liệu từ response
        const genresArray = response.data.genres || [];
        const totalCount = response.data.total || response.total || 0;
        
        console.log('Final genres array:', genresArray);
        console.log('Total count:', totalCount);
        
        // Cập nhật state
        setGenres(genresArray);
        setPagination({
          current: page,
          pageSize,
          total: totalCount,
        });
      } else {
        console.error('API response not successful:', response);
        message.error(response.message || 'Lỗi khi tải danh sách thể loại');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    fetchGenres(1, pagination.pageSize, value);
  };

  // Handle table change
  const handleTableChange = (newPagination) => {
    fetchGenres(newPagination.current, newPagination.pageSize, searchText);
  };

  // Handle edit
  const handleEdit = (genre) => {
    setEditingGenre(genre);
    form.setFieldsValue({
      name: genre.name,
    });
    setEditModalVisible(true);
  };

  // Handle update
  const handleUpdate = async (values) => {
    setLoading(true); // Thêm loading state
    try {
      const response = await ApiService.updateGenre(editingGenre._id, values);
      if (response.success) {
        message.success('Cập nhật thể loại thành công');
        setEditModalVisible(false);
        setEditingGenre(null);
        form.resetFields();
        fetchGenres(pagination.current, pagination.pageSize, searchText);
      } else {
        message.error(response.message || 'Lỗi khi cập nhật thể loại');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật thể loại');
      console.error('Update genre error:', error);
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // Table columns
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
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <TagsOutlined style={{ color: '#1890ff' }} />
          <strong>{text}</strong>
        </Space>
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
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            <TagsOutlined /> Quản lý thể loại phim
          </Title>
        </Col>
        <Col>
          <Link to="/admin/genres/create">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Thêm thể loại mới
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <TagsOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {genres.length}
              </div>
              <div style={{ color: '#666' }}>Hiện tại</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <TagsOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {pagination.total}
              </div>
              <div style={{ color: '#666' }}>Tổng cộng</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm thể loại..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            {/* Additional filters can be added here */}
          </Col>
          <Col xs={24} sm={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => fetchGenres(1, pagination.pageSize, searchText)}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Data Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={genres}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} thể loại`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 400 }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thể loại"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingGenre(null);
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
            label="Tên thể loại"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thể loại' },
              { min: 2, message: 'Tên thể loại phải có ít nhất 2 ký tự' },
              { max: 100, message: 'Tên thể loại không được quá 100 ký tự' }
            ]}
          >
            <Input placeholder="Ví dụ: Hành động, Tình cảm, Kinh dị..." />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  setEditingGenre(null);
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
                loading={loading}
                style={{
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GenreList;