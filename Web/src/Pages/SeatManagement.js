import React from 'react';
import { Select, Button } from 'antd';

const { Option } = Select;

const SeatManagement = () => {
  const seatRows = ['A','B','C','D','E','F','G','H'];
  const seatCols = [1,2,3,4,5,6,7,8];

  const getSeatStatus = (id) => {
    if (id === 'C3') return 'booked';
    if (id === 'F4') return 'pending';
    return 'available';
  };

  const seatStyle = (status) => {
    let backgroundColor = '#d9d9d9';
    if (status === 'booked') backgroundColor = '#52c41a';
    if (status === 'pending') backgroundColor = '#faad14';

    return {
      width: 50,
      height: 40,
      backgroundColor,
      borderRadius: 4,
      textAlign: 'center',
      lineHeight: '40px',
      fontWeight: 'bold',
      cursor: 'pointer',
      userSelect: 'none',
      color: status !== 'available' ? 'white' : 'black',
      margin: 5,
      transition: '0.3s',
    };
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: 'center' }}>Quản lý ghế</h2>

      {/* Dòng chứa các Select */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 12
      }}>
        <Select defaultValue="Rạp Mỹ Đình" style={{ width: 180 }}>
          <Option value="Rạp Mỹ Đình">Rạp Mỹ Đình</Option>
        </Select>
        <Select defaultValue="Phòng 1" style={{ width: 140 }}>
          <Option value="Phòng 1">Phòng 1</Option>
        </Select>
        <Select defaultValue="6/8/2024" style={{ width: 140 }}>
          <Option value="6/8/2024">6/8/2024</Option>
        </Select>
        <Select placeholder="Chọn Giờ Chiếu" style={{ width: 160 }}>
          <Option value="19:00">19:00</Option>
        </Select>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24
      }}>
        <Button type="primary">Thêm ghế mới</Button>
        <Button>Xem ghế</Button>
        <Button danger>Delete</Button>
      </div>

      <h3 style={{ textAlign: 'center', marginBottom: 20 }}>
        Phim đang chiếu: <strong>Cuu Long Thanh Trai Vay Ham</strong>
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10
      }}>
        {seatRows.map(row => (
          <div key={row} style={{ display: 'flex' }}>
            {seatCols.map(col => {
              const seatId = `${row}${col}`;
              const status = getSeatStatus(seatId);
              return (
                <div key={seatId} style={seatStyle(status)}>
                  {seatId}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 15, height: 15, backgroundColor: '#52c41a', borderRadius: 3 }}></div>
          <span>Đã đặt</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 15, height: 15, backgroundColor: '#faad14', borderRadius: 3 }}></div>
          <span>Chờ thanh toán</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 15, height: 15, backgroundColor: '#d9d9d9', borderRadius: 3 }}></div>
          <span>Có sẵn</span>
        </div>
      </div>
    </div>
  );
};

export default SeatManagement;
