import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Switch, 
  Input, 
  Avatar, 
  Tag, 
  message, 
  Spin,
  Card,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  UserOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states for editing employee
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // Fetch employees data
  const fetchEmployees = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        role: 'employee', // Chỉ lấy nhân viên
        ...params
      };

      if (searchText) {
        queryParams.search = searchText;
      }

      const response = await ApiService.getUsers(queryParams);
      
      if (response.success) {
        setEmployees(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total,
        }));
      } else {
        message.error(response.error || 'Không thể lấy danh sách nhân viên');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Reload data when pagination changes
  useEffect(() => {
    fetchEmployees();
  }, [pagination.current, pagination.pageSize]);

  // Reload data when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.current === 1) {
        fetchEmployees();
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
    fetchEmployees();
    message.success('Đã làm mới dữ liệu');
  };

  const toggleStatus = async (employee) => {
    try {
      const newStatus = employee.status === 'active' ? 'inactive' : 'active';
      const response = await ApiService.updateUser(employee._id, {
        status: newStatus
      });

      if (response.success) {
        message.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'khóa'} nhân viên`);
        fetchEmployees(); // Refresh data
      } else {
        message.error(response.error || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    editForm.setFieldsValue({
      name: employee.name,
      email: employee.email,
      number_phone: employee.number_phone,
      date_of_birth: employee.date_of_birth ? moment(employee.date_of_birth) : null,
      gender: employee.gender,
      status: employee.status,
      // Employee specific fields
      employee_id: employee.employee?.employee_id,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEmployee = async () => {
    try {
      const values = await editForm.validateFields();
      setSaving(true);
      
      // Prepare data for API
      const updateData = {
        name: values.name,
        email: values.email,
        number_phone: values.number_phone,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
        gender: values.gender,
        status: values.status, // Use the selected value directly
        role: 'employee', // Ensure role stays as employee
        
        // Employee specific data
        employee: {
          employee_id: values.employee_id,
          position: 'staff', // Fixed as staff
          department: editingEmployee?.employee?.department || 'operations', // Keep existing or default
          hire_date: editingEmployee?.employee?.hire_date || new Date().toISOString().split('T')[0], // Keep existing or today
          work_status: 'active', // Fixed as active
        }
      };

      // Update password if provided
      if (values.password && values.password.trim()) {
        updateData.password = values.password;
      }

      console.log('Updating employee with data:', updateData); // Debug log

      const response = await ApiService.updateUser(editingEmployee._id, updateData);
      
      if (response.success) {
        message.success('Cập nhật thông tin nhân viên thành công');
        
        // Force close any open DatePickers before closing modal
        const activeElement = document.activeElement;
        if (activeElement) {
          activeElement.blur();
        }
        
        // Close any open antd popover/dropdown
        const popoverElements = document.querySelectorAll('.ant-picker-dropdown');
        popoverElements.forEach(element => {
          element.style.display = 'none';
        });
        
        handleCancelEdit(); // Use this instead of manual cleanup
        fetchEmployees(); // Refresh data
      } else {
        message.error(response.error || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      if (error.errorFields) {
        // Validation error from form - don't close modal
        message.error('Vui lòng kiểm tra lại thông tin form');
        return;
      }
      console.error('Error updating employee:', error);
      message.error('Lỗi khi cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Force close any open DatePickers
    const activeElement = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }
    
    // Close any open antd popover/dropdown
    const popoverElements = document.querySelectorAll('.ant-picker-dropdown');
    popoverElements.forEach(element => {
      element.style.display = 'none';
    });
    
    setIsEditModalVisible(false);
    setEditingEmployee(null);
    editForm.resetFields();
    setSaving(false); // Reset saving state
    
    // Force re-render after a small delay
    setTimeout(() => {
      const remainingPopovers = document.querySelectorAll('.ant-picker-dropdown');
      remainingPopovers.forEach(element => {
        element.remove();
      });
    }, 100);
  };

  const handleTableChange = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
      total: pagination.total,
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, record, index) => (
        <span style={{ fontWeight: 500 }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
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
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        >
          {record.name?.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Thông tin nhân viên',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            <Link 
              to={`/admin/employees/${record._id}`} 
              style={{ color: '#1890ff', textDecoration: 'none' }}
            >
              {record.name}
            </Link>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
            ID: {record._id?.slice(-8)}
          </div>
          {record.employee?.employee_id && (
            <div style={{ fontSize: 12, color: '#666' }}>
              Mã NV: {record.employee.employee_id}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4, fontSize: 14 }}>
            📧 {record.email}
          </div>
          <div style={{ fontSize: 14 }}>
            📱 {record.number_phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Vị trí',
      key: 'position',
      render: () => (
        <Tag color="blue">
          Nhân viên
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <div>
          <Tag color={record.status === 'active' ? 'green' : 'red'}>
            {record.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
          </Tag>
          {record.employee?.work_status && (
            <div style={{ marginTop: 4 }}>
              <Tag 
                color={
                  record.employee.work_status === 'active' ? 'blue' :
                  record.employee.work_status === 'on_leave' ? 'orange' : 'default'
                }
                size="small"
              >
                {record.employee.work_status === 'active' ? 'Đang làm' :
                 record.employee.work_status === 'on_leave' ? 'Nghỉ phép' :
                 record.employee.work_status === 'inactive' ? 'Tạm nghỉ' :
                 record.employee.work_status}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Switch 
            checked={record.status === 'active'} 
            onChange={() => toggleStatus(record)}
            size="small"
          />
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/employees/${record._id}`)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
            title="Chỉnh sửa"
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Quản lý nhân viên</h2>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          type="default"
        >
          Làm mới
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Search 
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..." 
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: 400 }} 
            />
          </div>
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/employees/create')}
            >
              Thêm nhân viên
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <Table 
            columns={columns} 
            dataSource={employees} 
            rowKey="_id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      {/* Edit Employee Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <EditOutlined />
            <span>Chỉnh sửa nhân viên - {editingEmployee?.name}</span>
          </div>
        }
        open={isEditModalVisible}
        onOk={handleSaveEmployee}
        onCancel={handleCancelEdit}
        width={800}
        confirmLoading={saving}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form
          form={editForm}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập email" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="number_phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date_of_birth"
                label="Ngày sinh"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  getPopupContainer={trigger => trigger.parentElement}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu mới (để trống nếu không đổi)"
                rules={[
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="employee_id"
                label="Mã nhân viên"
              >
                <Input placeholder="Mã nhân viên (tự động tạo)" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Trạng thái tài khoản"
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Tạm khóa</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeList;