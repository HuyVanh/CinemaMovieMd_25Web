import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Card, Select, ColorPicker, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, TagOutlined, EyeOutlined } from '@ant-design/icons';
import './Genres.css';

const { TextArea } = Input;

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Mock data cho thể loại phim
  const mockGenres = [
    {
      id: 1,
      name: 'Hành động',
      nameEn: 'Action',
      description: 'Phim hành động với những cảnh quay kịch tính, đấu tranh và phiêu lưu',
      color: '#ff4d4f',
      icon: '⚔️',
      status: 'active',
      movieCount: 145,
      popularity: 95,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['action', 'fighting', 'adventure', 'thriller'],
      ageRating: 'T16',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Hài hước',
      nameEn: 'Comedy',
      description: 'Phim hài mang lại tiếng cười và giây phút thư giãn cho khán giả',
      color: '#faad14',
      icon: '😂',
      status: 'active',
      movieCount: 89,
      popularity: 88,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['comedy', 'funny', 'humor', 'laugh'],
      ageRating: 'K',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Kinh dị',
      nameEn: 'Horror',
      description: 'Phim kinh dị tạo cảm giác sợ hãi và căng thẳng cho người xem',
      color: '#722ed1',
      icon: '👻',
      status: 'active',
      movieCount: 67,
      popularity: 72,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['horror', 'scary', 'ghost', 'thriller'],
      ageRating: 'T18',
      createdAt: '2024-02-01'
    },
    {
      id: 4,
      name: 'Lãng mạn',
      nameEn: 'Romance',
      description: 'Phim tình cảm về tình yêu và các mối quan hệ lãng mạn',
      color: '#eb2f96',
      icon: '💕',
      status: 'active',
      movieCount: 123,
      popularity: 85,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['romance', 'love', 'relationship', 'drama'],
      ageRating: 'T13',
      createdAt: '2024-01-20'
    },
    {
      id: 5,
      name: 'Khoa học viễn tưởng',
      nameEn: 'Sci-Fi',
      description: 'Phim khoa học viễn tưởng với công nghệ tương lai và không gian',
      color: '#1890ff',
      icon: '🚀',
      status: 'active',
      movieCount: 98,
      popularity: 82,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['sci-fi', 'space', 'future', 'technology'],
      ageRating: 'T13',
      createdAt: '2024-01-25'
    },
    {
      id: 6,
      name: 'Hoạt hình',
      nameEn: 'Animation',
      description: 'Phim hoạt hình dành cho mọi lứa tuổi với đồ họa sinh động',
      color: '#52c41a',
      icon: '🎨',
      status: 'active',
      movieCount: 156,
      popularity: 92,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['animation', 'cartoon', 'family', 'kids'],
      ageRating: 'K',
      createdAt: '2024-02-05'
    },
    {
      id: 7,
      name: 'Tâm lý',
      nameEn: 'Drama',
      description: 'Phim tâm lý xã hội với nội dung sâu sắc về cuộc sống',
      color: '#fa8c16',
      icon: '🎭',
      status: 'inactive',
      movieCount: 45,
      popularity: 68,
      image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
      keywords: ['drama', 'psychology', 'society', 'life'],
      ageRating: 'T16',
      createdAt: '2024-01-30'
    }
  ];

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenres(mockGenres);
    } catch (error) {
      message.error('Lỗi khi tải danh sách thể loại');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGenre(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingGenre(record);
    form.setFieldsValue({
      ...record,
      keywords: record.keywords || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenres(genres.filter(genre => genre.id !== id));
      message.success('Xóa thể loại thành công');
    } catch (error) {
      message.error('Lỗi khi xóa thể loại');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingGenre) {
        // Update existing genre
        const updatedGenres = genres.map(genre =>
          genre.id === editingGenre.id
            ? { ...genre, ...values }
            : genre
        );
        setGenres(updatedGenres);
        message.success('Cập nhật thể loại thành công');
      } else {
        // Add new genre
        const newGenre = {
          id: Date.now(),
          ...values,
          movieCount: 0,
          popularity: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setGenres([...genres, newGenre]);
        message.success('Thêm thể loại thành công');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu thông tin thể loại');
    } finally {
      setLoading(false);
    }
  };

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchText.toLowerCase()) ||
    genre.nameEn.toLowerCase().includes(searchText.toLowerCase()) ||
    genre.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon, record) => (
        <div style={{ 
          fontSize: '24px', 
          textAlign: 'center',
          backgroundColor: record.color + '20',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          lineHeight: '40px',
          margin: '0 auto'
        }}>
          {icon}
        </div>
      )
    },
    {
      title: 'Thể loại',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            color: record.color,
            fontSize: '16px'
          }}>
            {record.name}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            {record.nameEn}
          </div>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: '200px' }}>
          {text}
        </div>
      )
    },
    {
      title: 'Thống kê',
      key: 'stats',
      render: (_, record) => (
        <div>
          <div>🎬 {record.movieCount} phim</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            📊 {record.popularity}% độ phổ biến
          </div>
        </div>
      )
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'ageRating',
      key: 'ageRating',
      render: (rating) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: rating === 'K' ? '#52c41a' : 
                          rating === 'T13' ? '#faad14' :
                          rating === 'T16' ? '#fa8c16' : '#ff4d4f',
          color: 'white'
        }}>
          {rating}
        </span>
      )
    },
    {
      title: 'Từ khóa',
      dataIndex: 'keywords',
      key: 'keywords',
      render: (keywords) => (
        <div>
          {keywords?.slice(0, 2).map((keyword, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                backgroundColor: '#f0f0f0',
                color: '#666',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '11px',
                marginRight: '4px',
                marginBottom: '2px'
              }}
            >
              #{keyword}
            </span>
          ))}
          {keywords?.length > 2 && (
            <span style={{ fontSize: '11px', color: '#999' }}>
              +{keywords.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: status === 'active' ? '#52c41a' : '#d9d9d9'
          }}
        >
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thể loại này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="genres-container">
      <Card>
        <div className="genres-header">
          <h2>Quản lý thể loại phim</h2>
          <div className="genres-actions">
            <Input
              placeholder="Tìm kiếm thể loại..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginRight: 16 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm thể loại mới
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredGenres}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredGenres.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} thể loại`
          }}
        />
      </Card>

      <Modal
        title={editingGenre ? 'Cập nhật thông tin thể loại' : 'Thêm thể loại mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="name"
              label="Tên thể loại (Tiếng Việt)"
              rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
            >
              <Input placeholder="VD: Hành động" />
            </Form.Item>

            <Form.Item
              name="nameEn"
              label="Tên thể loại (Tiếng Anh)"
              rules={[{ required: true, message: 'Vui lòng nhập tên tiếng Anh' }]}
            >
              <Input placeholder="VD: Action" />
            </Form.Item>

            <Form.Item
              name="icon"
              label="Icon/Emoji"
              rules={[{ required: true, message: 'Vui lòng nhập icon' }]}
            >
              <Input placeholder="VD: ⚔️" />
            </Form.Item>

            <Form.Item
              name="color"
              label="Màu sắc"
              rules={[{ required: true, message: 'Vui lòng chọn màu' }]}
            >
              <Input type="color" />
            </Form.Item>

            <Form.Item
              name="ageRating"
              label="Độ tuổi phù hợp"
              rules={[{ required: true, message: 'Vui lòng chọn độ tuổi' }]}
            >
              <Select placeholder="Chọn độ tuổi">
                <Select.Option value="K">K - Mọi lứa tuổi</Select.Option>
                <Select.Option value="T13">T13 - Trên 13 tuổi</Select.Option>
                <Select.Option value="T16">T16 - Trên 16 tuổi</Select.Option>
                <Select.Option value="T18">T18 - Trên 18 tuổi</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả về thể loại phim" />
          </Form.Item>

          <Form.Item
            name="keywords"
            label="Từ khóa (Tags)"
          >
            <Select
              mode="tags"
              placeholder="Nhập các từ khóa liên quan"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh đại diện"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingGenre ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Genres;
