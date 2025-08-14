import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BarChartOutlined,
  TeamOutlined,
  PlusOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  BankOutlined,
  PercentageOutlined,
  BorderOuterOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
  StarOutlined,
  TagsOutlined,
  HistoryOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Cập nhật để match với routes trong App.js (với prefix /admin/)
  const getSelectedKey = (pathname) => {
    if (pathname === "/admin/dashboard" || pathname === "/admin/statistics") return "1";
    
    // Movie management submenu
    if (pathname.startsWith("/admin/movie/list")) return "2-1";
    if (pathname.startsWith("/admin/addmovie")) return "2-2";
    if (pathname.startsWith("/admin/directors")) return "2-3";
    if (pathname.startsWith("/admin/actors")) return "2-4";
    if (pathname.startsWith("/admin/genres")) return "2-5";
    
    // Customer management submenu
    if (pathname.startsWith("/admin/customers") && !pathname.includes("/history")) return "3-1";
    if (pathname.startsWith("/admin/customers/history") || pathname.includes("/booking-history")) return "3-2";
    
    if (pathname.startsWith("/admin/employees")) return "4";
    if (pathname.startsWith("/admin/foods")) return "5";
    if (pathname.startsWith("/admin/cinemas")) return "6";
    if (pathname.startsWith("/admin/discounts")) return "7";
    if (pathname.startsWith("/admin/rooms")) return "8";
    if (pathname.startsWith("/admin/seats")) return "9";
    if (pathname.startsWith("/admin/bookings")) return "10";
    if (pathname.startsWith("/admin/showtimes")) return "11";
    return "";
  };

  // Get open keys for SubMenu
  const getOpenKeys = (pathname) => {
    if (pathname.startsWith("/admin/movie") || 
        pathname.startsWith("/admin/directors") || 
        pathname.startsWith("/admin/actors") ||
        pathname.startsWith("/admin/genres")) {
      return ["movie-management"];
    }
    if (pathname.startsWith("/admin/customers")) {
      return ["customer-management"];
    }
    return [];
  };

  // Handle logout
  const handleLogout = () => {
    AuthService.logout();
    navigate("/admin/login");
  };

  // Get current user info
  const currentUser = AuthService.getUser();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Cài đặt tài khoản',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        theme="dark"
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
        }}
      >
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            borderBottom: '1px solid #1f1f1f',
          }}
        >
          <VideoCameraOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
          <Title level={4} style={{ color: '#fff', margin: '8px 0 0 0' }}>
            CinemaAdmin
          </Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          defaultOpenKeys={getOpenKeys(location.pathname)}
          style={{
            background: 'transparent',
            border: 'none',
          }}
        >
          <Menu.Item key="1" icon={<BarChartOutlined />}>
            <Link to="/admin/dashboard">Thống kê doanh thu</Link>
          </Menu.Item>

          {/* Movie Management SubMenu */}
          <SubMenu 
            key="movie-management" 
            icon={<VideoCameraOutlined />} 
            title="Quản lý phim"
            style={{ 
              backgroundColor: 'transparent'
            }}
          >
            <Menu.Item key="2-1" icon={<UnorderedListOutlined />}>
              <Link to="/admin/movie/list">Danh sách phim</Link>
            </Menu.Item>
            <Menu.Item key="2-2" icon={<PlusOutlined />}>
              <Link to="/admin/addmovie">Thêm phim mới</Link>
            </Menu.Item>
            <Menu.Item key="2-3" icon={<VideoCameraOutlined />}>
              <Link to="/admin/directors">Quản lý đạo diễn</Link>
            </Menu.Item>
            <Menu.Item key="2-4" icon={<StarOutlined />}>
              <Link to="/admin/actors">Quản lý diễn viên</Link>
            </Menu.Item>
            <Menu.Item key="2-5" icon={<TagsOutlined />}>
              <Link to="/admin/genres">Thể loại phim</Link>
            </Menu.Item>
          </SubMenu>

          {/* Customer Management SubMenu */}
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/admin/customers">Quản lý khách hàng</Link>
          </Menu.Item>
          
          <Menu.Item key="4" icon={<TeamOutlined />}>
            <Link to="/admin/employees">Quản lý nhân viên</Link>
          </Menu.Item>
          
          <Menu.Item key="5" icon={<CoffeeOutlined />}>
            <Link to="/admin/foods">Quản Lý Dịch Vụ</Link>
          </Menu.Item>
          
          <Menu.Item key="6" icon={<BankOutlined />}>
            <Link to="/admin/cinemas">Quản Lý Rạp Chiếu</Link>
          </Menu.Item>
          
          <Menu.Item key="7" icon={<PercentageOutlined />}>
            <Link to="/admin/discounts">Quản Lý Khuyen Mái</Link>
          </Menu.Item>
          
          <Menu.Item key="8" icon={<BorderOuterOutlined />}>
            <Link to="/admin/rooms">Quản Lý Rạp Phim</Link>
          </Menu.Item>
          
          <Menu.Item key="9" icon={<AppstoreOutlined />}>
            <Link to="/admin/seats">Quản lý ghế</Link>
          </Menu.Item>
          
          <Menu.Item key="10" icon={<FileTextOutlined />}>
            <Link to="/admin/bookings">Lịch sử đặt vé</Link>
          </Menu.Item>
          
          <Menu.Item key="11" icon={<ClockCircleOutlined />}>
            <Link to="/admin/showtimes">Quản lý giờ chiếu</Link>
          </Menu.Item>
        </Menu>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "16px",
            borderTop: "1px solid #434343",
          }}
        >
          {currentUser && (
            <div
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                marginBottom: "8px",
                fontSize: "12px",
              }}
            >
              <div>Xin chào, {currentUser.name}</div>
              <div>Role: {currentUser.role}</div>
            </div>
          )}
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: "100%" }}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Title level={3} style={{ margin: 0, color: '#333' }}>
            Hệ thống quản lý rạp chiếu phim
          </Title>

          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size="small" style={{ backgroundColor: '#ff6b35', marginRight: 8 }}>
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
                {currentUser?.name || 'Admin'}
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;