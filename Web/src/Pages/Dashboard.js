import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Button } from 'antd';
import { 
  UserOutlined, 
  VideoCameraOutlined, 
  ShoppingOutlined, 
  DollarOutlined,
  TrophyOutlined,
  CalendarOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const stats = [
    {
      title: 'Tổng người dùng',
      value: 1234,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Phim đang chiếu',
      value: 24,
      icon: <VideoCameraOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Vé đã bán hôm nay',
      value: 456,
      icon: <ShoppingOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16'
    },
    {
      title: 'Doanh thu hôm nay',
      value: 15670000,
      prefix: '₫',
      icon: <DollarOutlined style={{ color: '#eb2f96' }} />,
      color: '#eb2f96'
    }
  ];

  const topMovies = [
    { name: 'Avengers: Endgame', tickets: 156, revenue: 8900000 },
    { name: 'Spider-Man: No Way Home', tickets: 134, revenue: 7650000 },
    { name: 'Top Gun: Maverick', tickets: 98, revenue: 5590000 },
    { name: 'Black Panther', tickets: 87, revenue: 4960000 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Dashboard</Title>
        <Paragraph>Chào mừng bạn đến với hệ thống quản lý rạp chiếu phim</Paragraph>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                valueStyle={{ color: stat.color }}
                suffix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Movies */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined style={{ color: '#fa8c16' }} />
                Phim bán chạy nhất hôm nay
              </Space>
            }
            extra={<Button type="link">Xem tất cả</Button>}
          >
            {topMovies.map((movie, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < topMovies.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{movie.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {movie.tickets} vé đã bán
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#52c41a', fontWeight: 500 }}>
                  ₫{movie.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                Thao tác nhanh
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button type="primary" size="large" block icon={<VideoCameraOutlined />}>
                Thêm phim mới
              </Button>
              <Button size="large" block icon={<CalendarOutlined />}>
                Quản lý lịch chiếu
              </Button>
              <Button size="large" block icon={<UserOutlined />}>
                Xem danh sách người dùng
              </Button>
              <Button size="large" block icon={<ShoppingOutlined />}>
                Báo cáo bán hàng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;