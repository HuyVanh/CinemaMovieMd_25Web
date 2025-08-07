import React, { useState } from 'react';
import './AdminLayout.css';
import Dashboard from './Dashboard';
import Users from './Users';
import Actors from './Actors';
import Cinemas from './Cinemas';
import Genres from './Genres';

const AdminLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user] = useState({
    name: 'Admin User',
    email: 'admin@techmaster.vn',
    avatar: 'https://via.placeholder.com/40x40/667eea/ffffff?text=A'
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'users', label: 'Người dùng', icon: 'fas fa-users' },
    { id: 'actors', label: 'Diễn viên', icon: 'fas fa-star' },
    { id: 'cinemas', label: 'Rạp chiếu', icon: 'fas fa-building' },
    { id: 'genres', label: 'Thể loại', icon: 'fas fa-tags' },
    { id: 'movies', label: 'Phim', icon: 'fas fa-film' },
    { id: 'bookings', label: 'Đặt vé', icon: 'fas fa-ticket-alt' },
    { id: 'settings', label: 'Cài đặt', icon: 'fas fa-cog' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'actors':
        return <Actors />;
      case 'cinemas':
        return <Cinemas />;
      case 'genres':
        return <Genres />;
      case 'movies':
        return <div className="coming-soon">Trang Quản lý Phim đang được phát triển...</div>;
      case 'bookings':
        return <div className="coming-soon">Trang Quản lý Đặt vé đang được phát triển...</div>;
      case 'settings':
        return <div className="coming-soon">Trang Cài đặt đang được phát triển...</div>;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-film"></i>
            <span>Cinema Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <img src={user.avatar} alt={user.name} />
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <div className="breadcrumb">
            <i className="fas fa-home"></i>
            <span>Admin</span>
            <i className="fas fa-chevron-right"></i>
            <span>{menuItems.find(item => item.id === activeTab)?.label}</span>
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu">
              <img src={user.avatar} alt={user.name} />
              <span>{user.name}</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
