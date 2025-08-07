import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Card, Select, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import './Cinemas.css';

const { TextArea } = Input;
const { Option } = Select;

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const mockCinemas = [
        {
          id: 1,
          name: 'CGV Vincom Center',
          address: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
          phone: '024-3936-3636',
          email: 'info@cgv.vn',
          city: 'Hà Nội',
          district: 'Hai Bà Trưng',
          totalScreens: 8,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
          description: 'Rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tiên tiến',
          facilities: ['Parking', '3D Screen', 'IMAX', 'Food Court', 'VIP Room'],
          manager: 'Nguyễn Văn A',
          openTime: '08:00',
          closeTime: '23:00'
        },
        {
          id: 2,
          name: 'Lotte Cinema Landmark',
          address: '72 Láng Trung, Đống Đa, Hà Nội',
          phone: '024-3734-6666',
          email: 'contact@lottecinema.vn',
          city: 'Hà Nội',
          district: 'Đống Đa',
          totalScreens: 12,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
          description: 'Chuỗi rạp chiếu phim cao cấp với dịch vụ 5 sao',
          facilities: ['Parking', '4DX', 'VIP Room', 'Food Court'],
          manager: 'Trần Thị B',
          openTime: '09:00',
          closeTime: '22:30'
        },
        {
          id: 3,
          name: 'Galaxy Cinema Nguyễn Du',
          address: '116 Nguyễn Du, Hai Bà Trưng, Hà Nội',
          phone: '024-3939-3939',
          email: 'info@galaxycinema.vn',
          city: 'Hà Nội',
          district: 'Hai Bà Trưng',
          totalScreens: 6,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
          description: 'Rạp chiếu phim thân thiện với giá cả phải chăng',
          facilities: ['Parking', '3D Screen', 'Food Court'],
          manager: 'Lê Văn C',
          openTime: '08:30',
          closeTime: '23:30'
        },
        {
          id: 4,
          name: 'Beta Cinema Thành Phố Giao Lưu',
          address: 'Tầng 3, TTTM Savico Megamall, Hà Nội',
          phone: '024-6674-9999',
          email: 'contact@betacinemas.vn',
          city: 'Hà Nội',
          district: 'Nam Từ Liêm',
          totalScreens: 5,
          status: 'maintenance',
          image: 'https://images.unsplash.com/photo-1489599735733-50ba6dc4d5b2?w=400',
          description: 'Rạp chiếu phim hiện đại trong khu vực thương mại sầm uất',
          facilities: ['Parking', '3D Screen', 'Food Court', 'Game Zone'],
          manager: 'Phạm Thị D',
          openTime: '10:00',
          closeTime: '22:00'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setCinemas(mockCinemas);
    } catch (error) {
      message.error('Lỗi khi tải danh sách rạp');
    } finally {
      setLoading(false);
    }
  };

  fetchCinemas();
}, []);



  const handleAdd = () => {
    setEditingCinema(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCinema(record);
    form.setFieldsValue({
      ...record,
      facilities: record.facilities || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCinemas(cinemas.filter(cinema => cinema.id !== id));
      message.success('Xóa rạp thành công');
    } catch (error) {
      message.error('Lỗi khi xóa rạp');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingCinema) {
        // Update existing cinema
        const updatedCinemas = cinemas.map(cinema =>
          cinema.id === editingCinema.id
            ? { ...cinema, ...values }
            : cinema
        );
        setCinemas(updatedCinemas);
        message.success('Cập nhật rạp thành công');
      } else {
        // Add new cinema
        const newCinema = {
          id: Date.now(),
          ...values,
          status: 'active'
        };
        setCinemas([...cinemas, newCinema]);
        message.success('Thêm rạp thành công');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu thông tin rạp');
    } finally {
      setLoading(false);
    }
  };

  const filteredCinemas = cinemas.filter(cinema =>
    cinema.name.toLowerCase().includes(searchText.toLowerCase()) ||
    cinema.address.toLowerCase().includes(searchText.toLowerCase()) ||
    cinema.city.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <Image
          width={60}
          height={40}
          src={image}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYnNMHhvFgOJTCYkMpmQyCyyM5nMZjKZzWS2mQ3sbCazwexm9jbzr0bqGXpGep+uqGn68"
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    },
    {
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.totalScreens} phòng chiếu
          </div>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.district}, {record.city}
          </div>
        </div>
      )
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>📞 {record.phone}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ✉️ {record.email}
          </div>
        </div>
      )
    },
    {
      title: 'Quản lý',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: 'Giờ hoạt động',
      key: 'hours',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{record.openTime} - {record.closeTime}</div>
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
            backgroundColor: status === 'active' ? '#52c41a' : '#faad14'
          }}
        >
          {status === 'active' ? 'Hoạt động' : 'Bảo trì'}
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
            title="Bạn có chắc chắn muốn xóa rạp này?"
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
    <div className="cinemas-container">
      <Card>
        <div className="cinemas-header">
          <h2>Quản lý rạp chiếu phim</h2>
          <div className="cinemas-actions">
            <Input
              placeholder="Tìm kiếm rạp..."
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
              Thêm rạp mới
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCinemas}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredCinemas.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} rạp`
          }}
        />
      </Card>

      <Modal
        title={editingCinema ? 'Cập nhật thông tin rạp' : 'Thêm rạp mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="name"
              label="Tên rạp"
              rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
            >
              <Input placeholder="Nhập tên rạp" />
            </Form.Item>

            <Form.Item
              name="manager"
              label="Quản lý"
              rules={[{ required: true, message: 'Vui lòng nhập tên quản lý' }]}
            >
              <Input placeholder="Nhập tên quản lý" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
            >
              <Select placeholder="Chọn thành phố">
                <Option value="Hà Nội">Hà Nội</Option>
                <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
                <Option value="Đà Nẵng">Đà Nẵng</Option>
                <Option value="Cần Thơ">Cần Thơ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
            >
              <Input placeholder="Nhập quận/huyện" />
            </Form.Item>

            <Form.Item
              name="openTime"
              label="Giờ mở cửa"
              rules={[{ required: true, message: 'Vui lòng nhập giờ mở cửa' }]}
            >
              <Input placeholder="VD: 08:00" />
            </Form.Item>

            <Form.Item
              name="closeTime"
              label="Giờ đóng cửa"
              rules={[{ required: true, message: 'Vui lòng nhập giờ đóng cửa' }]}
            >
              <Input placeholder="VD: 23:00" />
            </Form.Item>

            <Form.Item
              name="totalScreens"
              label="Số phòng chiếu"
              rules={[{ required: true, message: 'Vui lòng nhập số phòng chiếu' }]}
            >
              <Input type="number" placeholder="Nhập số phòng chiếu" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="maintenance">Bảo trì</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="Nhập địa chỉ chi tiết" />
          </Form.Item>

          <Form.Item
            name="facilities"
            label="Tiện ích"
          >
            <Select
              mode="multiple"
              placeholder="Chọn các tiện ích"
              options={[
                { label: 'Bãi đỗ xe', value: 'Parking' },
                { label: 'Màn hình 3D', value: '3D Screen' },
                { label: 'IMAX', value: 'IMAX' },
                { label: '4DX', value: '4DX' },
                { label: 'Phòng VIP', value: 'VIP Room' },
                { label: 'Khu ẩm thực', value: 'Food Court' },
                { label: 'Khu vui chơi', value: 'Game Zone' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả về rạp" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCinema ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cinemas;
