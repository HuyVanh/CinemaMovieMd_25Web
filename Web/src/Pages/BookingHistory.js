import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings([
      {
        id: '1',
        user: 'Phạm Đình Tiến',
        movie: 'Avengers: Endgame',
        theater: 'CGV Aeon Tân Phú',
        seats: ['B5', 'B6'],
        date: '30-06-2024',
        time: '18:00',
        total: 180000,
        status: 'Thành công',
      },
      {
        id: '2',
        user: 'Mai Đạt Thiên',
        movie: 'Spider-Man: No Way Home',
        theater: 'Lotte Cinema Gò Vấp',
        seats: ['C3'],
        date: '29-06-2024',
        time: '20:00',
        total: 90000,
        status: 'Đã hủy',
      },
    ]);
  }, []);

  const columns = [
    {
        title: 'Người đặt',
        dataIndex: 'user',
        key: 'user',
        render: (text, record) => (
            <Link to={`/bookings/${record.id}`}>{text}</Link>
        ),
    },
    {
      title: 'Phim',
      dataIndex: 'movie',
      key: 'movie',
    },
    {
      title: 'Rạp',
      dataIndex: 'theater',
      key: 'theater',
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats) => seats.join(', '),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (value) => `${value.toLocaleString()} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Thành công' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 16 }}>Lịch sử đặt vé</h2>

      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ReloadOutlined />}>Làm mới</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default BookingHistory;
