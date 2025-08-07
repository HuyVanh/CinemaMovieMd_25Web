import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Avatar, 
  Tag, 
  message, 
  Input, 
  Modal, 
  Switch,
  Form,
  InputNumber,
  Select,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  CoffeeOutlined,
  UploadOutlined,
  SaveOutlined 
} from '@ant-design/icons';
import ApiService from '../config/api';

const { Link: AntLink } = Typography;
const { Search } = Input;
const { Option } = Select;

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch foods from API
  const fetchFoods = async () => {
    setLoading(true);
    try {
      // For admin, we need all foods (both available and unavailable)
      // Since backend getFoods only returns available ones, we might need to call with admin params
      const response = await ApiService.getAllFoods(); // Try this first
      
      if (response.success) {
        console.log('Foods data:', response.data);
        setFoods(response.data);
        setFilteredFoods(response.data);
        message.success(`Đã tải ${response.data.length} món ăn/đồ uống`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách món ăn/đồ uống');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      
      // Fallback: try regular getFoods if getAllFoods doesn't exist
      try {
        const fallbackResponse = await ApiService.getFoods();
        if (fallbackResponse.success) {
          setFoods(fallbackResponse.data);
          setFilteredFoods(fallbackResponse.data);
          message.warning('Chỉ hiển thị các món đang bán. Cần cập nhật API để xem tất cả món.');
        }
      } catch (fallbackError) {
        message.error('Lỗi kết nối API: ' + error.message);
        
        // Final fallback data
        const fallbackData = [
          {
            _id: '1',
            name: 'Bắp rang bơ (Lớn)',
            price: 65000,
            image: null,
            status: 'available'
          },
          {
            _id: '2',
            name: 'Coca Cola (Lớn)',
            price: 35000,
            image: null,
            status: 'available'
          },
          {
            _id: '3',
            name: 'Combo 2 người',
            price: 125000,
            image: null,
            status: 'unavailable'
          },
        ];
        setFoods(fallbackData);
        setFilteredFoods(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredFoods(foods);
    } else {
      const filtered = foods.filter(food => {
        return food.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredFoods(filtered);
    }
  };

  // Handle food detail view
  const handleViewDetail = (food) => {
    Modal.info({
      title: 'Thông tin món ăn/đồ uống',
      width: 400,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            {food.image ? (
              <Avatar 
                size={80} 
                src={food.image}
                shape="square"
              />
            ) : (
              <Avatar 
                size={80} 
                style={{ backgroundColor: '#ffa940', fontSize: '32px' }} 
                icon={<CoffeeOutlined />}
                shape="square"
              />
            )}
          </div>
          <div style={{ lineHeight: '2' }}>
            <p><strong>Tên sản phẩm:</strong> {food.name}</p>
            <p><strong>Giá:</strong> {formatCurrency(food.price)}</p>
            <p><strong>Trạng thái:</strong> 
              <Tag 
                color={food.status === 'available' ? 'green' : 'red'} 
                style={{ marginLeft: 8 }}
              >
                {food.status === 'available' ? 'Đang bán' : 'Ngừng bán'}
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
    const newStatus = checked ? 'available' : 'unavailable';
    
    setStatusLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await ApiService.updateFood(id, { status: newStatus });
      
      if (response.success) {
        message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} món ăn/đồ uống`);
        
        // Update local state
        const updatedFoods = foods.map(food => 
          food._id === id ? { ...food, status: newStatus } : food
        );
        setFoods(updatedFoods);
        
        // Update filtered foods
        const updatedFilteredFoods = filteredFoods.map(food => 
          food._id === id ? { ...food, status: newStatus } : food
        );
        setFilteredFoods(updatedFilteredFoods);
      } else {
        message.error(response.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating food status:', error);
      message.error('Lỗi kết nối API: ' + error.message);
    } finally {
      setStatusLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Handle add food
  const handleAddFood = () => {
    setEditingFood(null);
    setImageUrl('');
    form.resetFields();
    form.setFieldsValue({
      status: 'available'
    });
    setIsModalVisible(true);
  };

  // Handle edit food
  const handleEditFood = (food) => {
    setEditingFood(food);
    setImageUrl(food.image || '');
    form.setFieldsValue({
      name: food.name,
      price: food.price,
      status: food.status,
    });
    setIsModalVisible(true);
  };

  // Handle save food
  const handleSaveFood = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const foodData = {
        name: values.name,
        price: values.price,
        status: values.status,
      };

      if (imageUrl) {
        foodData.image = imageUrl;
      }

      let response;
      if (editingFood) {
        // Update existing food
        response = await ApiService.updateFood(editingFood._id, foodData);
      } else {
        // Create new food
        response = await ApiService.createFood(foodData);
      }

      if (response.success) {
        message.success(editingFood ? 'Cập nhật món ăn thành công' : 'Thêm món ăn mới thành công');
        handleCancelModal();
        fetchFoods(); // Refresh data
      } else {
        message.error(response.message || 'Lỗi khi lưu món ăn');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Vui lòng kiểm tra lại thông tin form');
        return;
      }
      console.error('Error saving food:', error);
      message.error('Lỗi khi lưu món ăn');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setEditingFood(null);
    setImageUrl('');
    form.resetFields();
    setSaving(false);
  };

  // Handle image upload
  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    // For demo purposes, create a preview URL from the file
    if (info.file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        message.success('Tải ảnh thành công');
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
    
    if (info.file.status === 'done') {
      setImageUrl(info.file.response?.url || '');
      message.success('Tải ảnh thành công');
    }
    if (info.file.status === 'error') {
      message.error('Lỗi khi tải ảnh');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchFoods();
  }, []);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image, record) => (
        image ? (
          <Avatar 
            src={image}
            size="large"
            shape="square"
          />
        ) : (
          <Avatar 
            style={{ backgroundColor: '#ffa940' }} 
            icon={<CoffeeOutlined />}
            size="large"
            shape="square"
          />
        )
      ),
    },
    {
      title: 'Tên sản phẩm',
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => (
        <Switch
          checked={status === 'available'}
          loading={statusLoading[record._id]}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Đang bán"
          unCheckedChildren="Ngừng bán"
        />
      ),
      filters: [
        { text: 'Đang bán', value: 'available' },
        { text: 'Ngừng bán', value: 'unavailable' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="middle"
          icon={<EditOutlined />}
          onClick={() => handleEditFood(record)}
          style={{ 
            backgroundColor: '#1890ff', 
            borderColor: '#1890ff',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(24, 144, 255, 0.3)'
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
        <h2 style={{ margin: 0 }}>Danh sách món ăn/đồ uống</h2>
        <Space>
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={fetchFoods}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddFood}
          >
            Thêm món mới
          </Button>
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên..." 
          allowClear 
          style={{ maxWidth: 400 }} 
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <span style={{ marginLeft: 16, color: '#666' }}>
          Hiển thị {filteredFoods.length} / {foods.length} món ăn/đồ uống
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredFoods}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} món ăn/đồ uống`,
        }}
        bordered
        scroll={{ x: 800 }}
      />

      {/* Add/Edit Food Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CoffeeOutlined />
            <span>{editingFood ? 'Chỉnh sửa món ăn/đồ uống' : 'Thêm món ăn/đồ uống mới'}</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleSaveFood}
        onCancel={handleCancelModal}
        width={600}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar
              size={100}
              src={imageUrl}
              icon={<CoffeeOutlined />}
              shape="square"
              style={{ backgroundColor: '#ffa940' }}
            />
            <div style={{ marginTop: 12 }}>
              <Upload
                name="image"
                listType="picture"
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) => {
                  // Validate file type
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ có thể upload file ảnh!');
                    return false;
                  }
                  
                  // Validate file size (max 5MB)
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('Ảnh phải nhỏ hơn 5MB!');
                    return false;
                  }
                  
                  return false; // Prevent auto upload, handle manually
                }}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />} size="small">
                  {imageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                </Button>
              </Upload>
              <div style={{ marginTop: 8 }}>
                <Input
                  placeholder="Hoặc nhập URL ảnh..."
                  size="small"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ width: 200 }}
                />
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                Tùy chọn - có thể bỏ trống
              </div>
            </div>
          </div>

          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { min: 2, message: 'Tên sản phẩm phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VND)"
            rules={[
              { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
              { type: 'number', min: 1000, message: 'Giá phải ít nhất 1,000 VND!' }
            ]}
          >
            <InputNumber
              placeholder="Nhập giá sản phẩm"
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={1000}
              step={1000}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="available">Đang bán</Option>
              <Option value="unavailable">Ngừng bán</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodList;