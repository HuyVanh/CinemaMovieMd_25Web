import React, { useEffect, useState } from 'react';
import { Descriptions, Tag, Button, Typography, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fakeData = [
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
    ];

    const found = fakeData.find((b) => b.id === id);
    if (found) setTicket(found);
    else {
      message.error('Không tìm thấy vé');
      navigate('/bookings');
    }
  }, [id, navigate]);

  if (!ticket) return null;

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <Title level={3}>Chi tiết vé #{ticket.id}</Title>

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Tên người dùng">{ticket.user}</Descriptions.Item>
        <Descriptions.Item label="Tên phim">{ticket.movie}</Descriptions.Item>
        <Descriptions.Item label="Rạp chiếu">{ticket.theater}</Descriptions.Item>
        <Descriptions.Item label="Ghế">
          {ticket.seats.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày chiếu">{ticket.date}</Descriptions.Item>
        <Descriptions.Item label="Giờ chiếu">{ticket.time}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {ticket.total.toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={ticket.status === 'Thành công' ? 'green' : 'red'}>
            {ticket.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Button style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </div>
  );
};

export default TicketDetail;
