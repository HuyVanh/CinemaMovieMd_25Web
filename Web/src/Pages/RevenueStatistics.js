import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Select,
  Button,
  Table,
  Row,
  Col,
  Typography,
  Card,
  Statistic,
  Space,
  message,
  Spin
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import {
  DollarOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  BankOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const RevenueStatistics = () => {
  const [selectedMovie, setSelectedMovie] = useState("all");
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 1672000,
    totalTickets: 13,
    totalMovies: 2,
    totalCinemas: 2
  });

  // Mock data - trong thực tế sẽ fetch từ API
  const chartData = [
    { name: "Rạp Mỹ Đình", total: 1336000, tickets: 9 },
    { name: "Rạp Long Biên", total: 336000, tickets: 4 },
  ];

  const movieData = [
    {
      key: "1",
      movie: "Bí Kíp Luyện Rồng",
      total: 1212000,
      tickets: 9,
      percentage: 72.5,
    },
    {
      key: "2",
      movie: "BỘ 5 SIÊU ĐẲNG CẤP",
      total: 460000,
      tickets: 4,
      percentage: 27.5,
    },
  ];

  const cinemaData = [
    {
      key: "1",
      cinema: "Rạp Mỹ Đình",
      total: 1336000,
      tickets: 9,
      percentage: 79.9,
    },
    {
      key: "2",
      cinema: "Rạp Long Biên",
      total: 336000,
      tickets: 4,
      percentage: 20.1,
    },
  ];

  // Pie chart data
  const pieData = [
    { name: "Bí Kíp Luyện Rồng", value: 1212000, color: "#1890ff" },
    { name: "BỘ 5 SIÊU ĐẲNG CẤP", value: 460000, color: "#52c41a" },
  ];

  // Line chart data for trend
  const trendData = [
    { date: "01/01", revenue: 200000 },
    { date: "02/01", revenue: 350000 },
    { date: "03/01", revenue: 460000 },
    { date: "04/01", revenue: 580000 },
    { date: "05/01", revenue: 720000 },
    { date: "06/01", revenue: 890000 },
    { date: "07/01", revenue: 1672000 },
  ];

  const movieColumns = [
    {
      title: "Phim",
      dataIndex: "movie",
      key: "movie",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      render: (value) => (
        <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
          {value.toLocaleString("vi-VN")} VNĐ
        </Text>
      ),
    },
    {
      title: "Số Vé",
      dataIndex: "tickets",
      key: "tickets",
      render: (value) => <Text>{value} vé</Text>,
    },
    {
      title: "Tỷ lệ (%)",
      dataIndex: "percentage",
      key: "percentage",
      render: (value) => <Text>{value}%</Text>,
    },
  ];

  const cinemaColumns = [
    {
      title: "Rạp",
      dataIndex: "cinema",
      key: "cinema",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      render: (value) => (
        <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
          {value.toLocaleString("vi-VN")} VNĐ
        </Text>
      ),
    },
    {
      title: "Số Vé",
      dataIndex: "tickets",
      key: "tickets",
      render: (value) => <Text>{value} vé</Text>,
    },
    {
      title: "Tỷ lệ (%)",
      dataIndex: "percentage",
      key: "percentage",
      render: (value) => <Text>{value}%</Text>,
    },
  ];

  const handleFilter = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success("Dữ liệu đã được cập nhật");
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      message.success("Dữ liệu đã được làm mới");
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        📊 Thống Kê Doanh Thu
      </Title>

      {/* Filter Controls */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Bộ lọc: </Text>
          </Col>
          <Col>
            <Select
              value={selectedMovie}
              onChange={setSelectedMovie}
              style={{ width: 250 }}
              placeholder="Chọn phim"
            >
              <Option value="all">Tất cả phim</Option>
              <Option value="BỘ 5 SIÊU ĐẲNG CẤP">BỘ 5 SIÊU ĐẲNG CẤP</Option>
              <Option value="Bí Kíp Luyện Rồng">
                Cuu Long Thanh Trai Vay Ham
              </Option>
            </Select>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={handleFilter} loading={loading}>
                Lọc dữ liệu
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
              suffix="VNĐ"
              valueStyle={{ color: "#52c41a" }}
              formatter={(value) => value.toLocaleString("vi-VN")}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng Số Vé"
              value={stats.totalTickets}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              suffix="vé"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số Phim"
              value={stats.totalMovies}
              prefix={<VideoCameraOutlined style={{ color: "#722ed1" }} />}
              suffix="phim"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số Rạp"
              value={stats.totalCinemas}
              prefix={<BankOutlined style={{ color: "#fa8c16" }} />}
              suffix="rạp"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Doanh thu theo rạp" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString("vi-VN") + " VNĐ", "Doanh thu"]}
                />
                <Bar dataKey="total" fill="#1890ff" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Phân bổ doanh thu theo phim" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString("vi-VN") + " VNĐ"]} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Trend Chart */}
      <Card title="Xu hướng doanh thu 7 ngày qua" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString("vi-VN") + " VNĐ", "Doanh thu"]} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#52c41a" 
              strokeWidth={3}
              dot={{ fill: "#52c41a", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary */}
      <Card style={{ marginBottom: 24, textAlign: "center" }}>
        <Title level={4} style={{ color: "#52c41a", margin: 0 }}>
          💰 Tổng doanh thu: {stats.totalRevenue.toLocaleString("vi-VN")} VNĐ
        </Title>
        <Text type="secondary">
          Từ {dateRange[0]?.format("DD/MM/YYYY")} đến {dateRange[1]?.format("DD/MM/YYYY")}
        </Text>
      </Card>

      {/* Data Tables */}
      <Row gutter={24}>
        <Col span={12}>
          <Card title="📽️ Doanh thu theo phim" size="small">
            <Table
              dataSource={movieData}
              columns={movieColumns}
              pagination={false}
              bordered
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="🏢 Doanh thu theo rạp" size="small">
            <Table
              dataSource={cinemaData}
              columns={cinemaColumns}
              pagination={false}
              bordered
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueStatistics;