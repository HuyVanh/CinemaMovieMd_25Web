import React, { useState } from "react";
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
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Cập nhật để match với routes trong App.js (với prefix /admin/)
  const getSelectedKey = (pathname) => {
    if (pathname === "/admin/dashboard" || pathname === "/admin/statistics") return "1";
    
    // Movie management submenu
    if (pathname.startsWith("/admin/movie/list")) return "2-1";
    if (pathname.startsWith("/admin/addmovie")) return "2-2";
    if (pathname.startsWith("/admin/directors")) return "2-3";
    if (pathname.startsWith("/admin/actors")) return "2-4";
    if (pathname.startsWith("/admin/genres")) return "2-5";
    
    // Customer management - sửa lại để khớp với key
    if (pathname.startsWith("/admin/customers")) return "3";
    
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
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="80"
        width={250}
        theme="dark"
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px',
            textAlign: 'center',
            borderBottom: '1px solid #1f1f1f',
            minHeight: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <VideoCameraOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
          {!collapsed && (
            <Title level={4} style={{ color: '#fff', margin: '8px 0 0 0', fontSize: '16px' }}>
              CinemaAdmin
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          defaultOpenKeys={collapsed ? [] : getOpenKeys(location.pathname)}
          style={{
            background: 'transparent',
            border: 'none',
            flex: 1,
          }}
        >
          <Menu.Item key="1" icon={<BarChartOutlined />}>
            <Link to="/admin/dashboard">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Thống kê doanh thu
              </span>
            </Link>
          </Menu.Item>

          {/* Movie Management SubMenu */}
          <SubMenu 
            key="movie-management" 
            icon={<VideoCameraOutlined />} 
            title={
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản lý phim
              </span>
            }
            style={{ backgroundColor: 'transparent' }}
          >
            <Menu.Item key="2-1" icon={<UnorderedListOutlined />}>
              <Link to="/admin/movie/list">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Danh sách phim
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2-2" icon={<PlusOutlined />}>
              <Link to="/admin/addmovie">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Thêm phim mới
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2-3" icon={<VideoCameraOutlined />}>
              <Link to="/admin/directors">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Quản lý đạo diễn
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2-4" icon={<StarOutlined />}>
              <Link to="/admin/actors">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Quản lý diễn viên
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2-5" icon={<TagsOutlined />}>
              <Link to="/admin/genres">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Thể loại phim
                </span>
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/admin/customers">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản lý khách hàng
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="4" icon={<TeamOutlined />}>
            <Link to="/admin/employees">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản lý nhân viên
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="5" icon={<CoffeeOutlined />}>
            <Link to="/admin/foods">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản Lý Dịch Vụ
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="6" icon={<BankOutlined />}>
            <Link to="/admin/cinemas">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản Lý Rạp Chiếu
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="7" icon={<PercentageOutlined />}>
            <Link to="/admin/discounts">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản Lý Khuyến Mãi
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="8" icon={<BorderOuterOutlined />}>
            <Link to="/admin/rooms">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản Lý Phòng Chiếu
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="9" icon={<AppstoreOutlined />}>
            <Link to="/admin/seats">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản lý ghế
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="10" icon={<FileTextOutlined />}>
            <Link to="/admin/bookings">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Lịch sử đặt vé
              </span>
            </Link>
          </Menu.Item>
          
          <Menu.Item key="11" icon={<ClockCircleOutlined />}>
            <Link to="/admin/showtimes">
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quản lý giờ chiếu
              </span>
            </Link>
          </Menu.Item>
        </Menu>

        {!collapsed && (
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #434343",
              marginTop: 'auto',
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
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Xin chào, {currentUser.name}
                </div>
                <div>Role: {currentUser.role}</div>
              </div>
            )}
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ width: "100%" }}
              size="small"
            >
              Đăng xuất
            </Button>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Title level={3} style={{ 
            margin: 0, 
            color: '#333',
            fontSize: window.innerWidth < 768 ? '18px' : '24px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            Hệ thống quản lý rạp chiếu phim
          </Title>

          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size="small" style={{ backgroundColor: '#ff6b35', marginRight: 8 }}>
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
                <span style={{ 
                  display: window.innerWidth < 768 ? 'none' : 'inline',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100px',
                }}>
                  {currentUser?.name || 'Admin'}
                </span>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: window.innerWidth < 768 ? '16px' : '24px',
            padding: window.innerWidth < 768 ? '16px' : '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;