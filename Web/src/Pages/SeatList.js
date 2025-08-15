import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { 
  Pencil, 
  Plus, 
  RefreshCw,
  Calendar,
  Users,
  Eye,
  Clock
} from 'lucide-react';

const SeatList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [seats, setSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seatBookingStatus, setSeatBookingStatus] = useState({});
  const [bookingStats, setBookingStats] = useState({ totalBooked: 0, confirmedBookings: 0, pendingBookings: 0 });
  
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  
  const [openSeatDialog, setOpenSeatDialog] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [seatForm, setSeatForm] = useState({ name: '', price: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('layout'); // 'layout' hoặc 'booking'
  
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: 'info' 
  });
  
  // Load cinemas on component mount
  useEffect(() => {
    fetchCinemas();
  }, []);

  // Load rooms when cinema is selected
  useEffect(() => {
    if (selectedCinema) {
      fetchRooms(selectedCinema);
      setSelectedRoom('');
      setSelectedShowtime('');
    } else {
      setRooms([]);
      setSelectedRoom('');
      setSelectedShowtime('');
    }
  }, [selectedCinema]);

  // Load seats and showtimes when room is selected
  useEffect(() => {
    if (selectedRoom) {
      fetchSeats(selectedRoom);
      fetchShowtimes(selectedRoom);
      setSelectedShowtime('');
    } else {
      setSeats([]);
      setShowtimes([]);
      setSelectedShowtime('');
    }
  }, [selectedRoom]);

  // Load booking status when showtime is selected
  useEffect(() => {
    if (selectedShowtime) {
      fetchSeatBookingStatus(selectedShowtime);
    } else {
      setSeatBookingStatus({});
      setBookingStats({ totalBooked: 0, confirmedBookings: 0, pendingBookings: 0 });
    }
  }, [selectedShowtime]);

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCinemas();
      setCinemas(response.data);
    } catch (error) {
      showNotification('Lỗi khi tải danh sách rạp: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (cinemaId) => {
    try {
      setLoading(true);
      const response = await ApiService.getRooms({ cinema: cinemaId });
      
      let roomsData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          roomsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          roomsData = response.data.data;
        }
      }
      
      const filteredRooms = roomsData.filter(room => {
        return room.cinema === cinemaId || 
               room.cinemaId === cinemaId || 
               room.cinema?._id === cinemaId ||
               room.cinema?.id === cinemaId;
      });
      
      setRooms(filteredRooms);
    } catch (error) {
      showNotification('Lỗi khi tải danh sách phòng: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeats = async (roomId) => {
    try {
      setLoading(true);
      const response = await ApiService.getSeatsByRoom(roomId);
      
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data.seats)) {
          setSeats(response.data.data.seats);
        } else if (Array.isArray(response.data)) {
          setSeats(response.data);
        } else if (response.data.seats && Array.isArray(response.data.seats)) {
          setSeats(response.data.seats);
        } else {
          showNotification('Cấu trúc dữ liệu không được hỗ trợ', 'error');
        }
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách ghế: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch showtimes for selected room
  const fetchShowtimes = async (roomId) => {
    try {
      setLoading(true);
      const response = await ApiService.getShowtimesByRoom(roomId);
      
      if (response && response.data) {
        const showtimesData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setShowtimes(showtimesData);
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách suất chiếu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch seat booking status for selected showtime
  const fetchSeatBookingStatus = async (showtimeId) => {
    try {
      setLoading(true);
      const response = await ApiService.getSeatBookingStatus(showtimeId);
      
      if (response && response.data) {
        setSeatBookingStatus(response.data.seatStatus || {});
        setBookingStats(response.data.statistics || { totalBooked: 0, confirmedBookings: 0, pendingBookings: 0 });
      }
    } catch (error) {
      showNotification('Lỗi khi tải trạng thái đặt vé: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  // ✅ Get seat booking info
  const getSeatBookingInfo = (seatId) => {
    return seatBookingStatus[seatId] || null;
  };

  // ✅ Get seat status
  const getSeatStatus = (seatId) => {
    const bookingInfo = getSeatBookingInfo(seatId);
    if (bookingInfo) {
      return bookingInfo.status; // 'booked' hoặc 'pending'
    }
    return 'available';
  };

  // ✅ Get seat color based on status
  const getSeatColor = (seatId) => {
    const status = getSeatStatus(seatId);
    switch (status) {
      case 'booked': return 'bg-red-500 text-white border-red-600';
      case 'pending': return 'bg-yellow-500 text-white border-yellow-600';
      case 'reserved': return 'bg-orange-500 text-white border-orange-600';
      default: return 'bg-green-500 text-white border-green-600';
    }
  };

  // Handle form input changes
  const handleSeatFormChange = (e) => {
    const { name, value } = e.target;
    setSeatForm({
      ...seatForm,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value // ✅ Cho phép empty string
    });
  };

  // Open dialogs
  const handleAddSeat = () => {
    setIsEditMode(false);
    setSeatForm({ name: '', price: '' }); // ✅ Thay đổi từ 0 thành ''
    setOpenSeatDialog(true);
  };

  const handleEditSeat = (seat) => {
    setIsEditMode(true);
    setSelectedSeat(seat);
    setSeatForm({
      name: seat.name,
      price: seat.price
    });
    setOpenSeatDialog(true);
  };

  const handleViewBooking = (seat) => {
    setSelectedSeat(seat);
    setOpenBookingDialog(true);
  };

  // Close dialogs
  const handleCloseDialogs = () => {
    setOpenSeatDialog(false);
    setOpenBookingDialog(false);
  };

  // Submit handlers
  const handleSeatSubmit = async () => {
    try {
      setLoading(true);
      
      // ✅ Check duplicate seat name
      const existingSeat = seats.find(seat => 
        seat.name.toLowerCase() === seatForm.name.toLowerCase() && 
        (!isEditMode || seat._id !== selectedSeat._id)
      );
      
      if (existingSeat) {
        showNotification(`Ghế ${seatForm.name} đã tồn tại trong phòng này!`, 'error');
        setLoading(false);
        return;
      }
      
      if (isEditMode && selectedSeat) {
        await ApiService.updateSeat(selectedSeat._id, {
          ...seatForm,
          room: selectedRoom
        });
        showNotification(`Cập nhật ghế ${seatForm.name} thành công`, 'success');
      } else {
        await ApiService.createSeat({
          ...seatForm,
          room: selectedRoom
        });
        showNotification(`Thêm ghế ${seatForm.name} thành công`, 'success');
      }
      
      fetchSeats(selectedRoom);
      handleCloseDialogs();
    } catch (error) {
      showNotification('Lỗi: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.name.match(/^[A-Z]+/)?.[0] || 'Other';
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(seat);
    return acc;
  }, {});

  // Sort rows alphabetically and seats within each row
  const sortedRows = Object.keys(groupedSeats).sort();
  sortedRows.forEach(row => {
    groupedSeats[row].sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)?.[0] || 0);
      const numB = parseInt(b.name.match(/\d+/)?.[0] || 0);
      return numA - numB;
    });
  });

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format date/time for display - FIXED
  const formatDateTime = (showtime) => {
    if (!showtime) return 'N/A';
    
    try {
      let displayDate = '';
      let displayTime = '';
      
      // Extract date part
      if (showtime.date) {
        const dateObj = new Date(showtime.date);
        displayDate = dateObj.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      // Extract time part
      if (showtime.time) {
        const timeObj = new Date(showtime.time);
        displayTime = timeObj.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      
      // Combine date and time
      if (displayDate && displayTime) {
        return `${displayTime} ${displayDate}`;
      } else if (showtime.time) {
        // Fallback: use time field for both date and time
        const fullDateTime = new Date(showtime.time);
        return fullDateTime.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      
      return 'N/A';
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return 'N/A';
    }
  };

  // Get total seats and calculate available seats
  const totalSeats = seats.length;
  const availableSeats = totalSeats - bookingStats.totalBooked;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý Ghế & Đặt Vé</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rạp phim
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
            >
              <option value="">Chọn rạp phim</option>
              {cinemas.map((cinema) => (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phòng chiếu
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              disabled={!selectedCinema}
            >
              <option value="">Chọn phòng chiếu</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suất chiếu
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(e.target.value)}
              disabled={!selectedRoom}
            >
              <option value="">Chọn suất chiếu</option>
              {showtimes.map((showtime) => (
                <option key={showtime._id} value={showtime._id}>
                  {showtime.movie?.name || 'N/A'} - {formatDateTime(showtime)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chế độ xem
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="layout">Sơ đồ ghế</option>
              <option value="booking">Trạng thái đặt vé</option>
            </select>
          </div>
        </div>

        {/* Thống kê booking */}
        {selectedShowtime && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Tổng ghế</p>
                  <p className="text-2xl font-bold text-blue-600">{totalSeats}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Đã đặt</p>
                  <p className="text-2xl font-bold text-red-600">{bookingStats.totalBooked}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Còn trống</p>
                  <p className="text-2xl font-bold text-green-600">{availableSeats}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-600">{bookingStats.pendingBookings}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          {selectedRoom && viewMode === 'layout' && (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              onClick={handleAddSeat}
            >
              <Plus className="mr-1 h-4 w-4" /> Thêm ghế
            </button>
          )}

          {viewMode === 'booking' && selectedShowtime && (
            <div className="flex gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Còn trống</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Đã đặt</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span>Chờ xử lý</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                <span>Đã đặt chỗ</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedRoom && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {viewMode === 'layout' ? 'Sơ đồ ghế' : 'Trạng thái đặt vé'}
            </h2>
            <button 
              className="flex items-center text-blue-600 hover:text-blue-800"
              onClick={() => {
                fetchSeats(selectedRoom);
                if (selectedShowtime) {
                  fetchSeatBookingStatus(selectedShowtime);
                }
              }}
              disabled={loading}
            >
              <RefreshCw className={`mr-1 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
              Làm mới
            </button>
          </div>
          
          <hr className="mb-6" />
          
          {seats.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Chưa có ghế nào trong phòng này</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                onClick={handleAddSeat}
              >
                Thêm ghế đầu tiên
              </button>
            </div>
          ) : (
            <>
              {/* Màn hình phim */}
              <div className="w-4/5 h-2 bg-blue-600 mx-auto mb-10 rounded"></div>
              <p className="text-center text-gray-500 italic mb-8">Màn hình</p>
              
              {/* Hiển thị ghế theo hàng */}
              <div className="flex flex-col gap-4">
                {sortedRows.map((row) => (
                  <div key={row} className="flex flex-wrap gap-2 justify-center">
                    <div className="flex items-center justify-center w-10">
                      <span className="font-bold">{row}</span>
                    </div>
                    
                    {groupedSeats[row].map((seat) => {
                      const isBookingMode = viewMode === 'booking' && selectedShowtime;
                      const seatColor = isBookingMode ? getSeatColor(seat._id) : 'bg-white border-gray-300 text-gray-700';
                      
                      return (
                        <div
                          key={seat._id}
                          className={`w-12 h-12 flex flex-col items-center justify-center border rounded shadow cursor-pointer hover:shadow-lg transition-all ${seatColor}`}
                          onClick={() => {
                            if (isBookingMode) {
                              handleViewBooking(seat);
                            } else {
                              handleEditSeat(seat);
                            }
                          }}
                        >
                          <span className="text-xs font-medium">{seat.name}</span>
                          <span className="text-xs opacity-75">
                            {Math.round(seat.price / 1000)}k
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Dialog thêm/sửa ghế */}
      {openSeatDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? `Sửa ghế ${selectedSeat?.name}` : 'Thêm ghế mới'}
            </h2>
            
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên ghế
                </label>
                <input
                  type="text"
                  name="name"
                  value={seatForm.name}
                  onChange={handleSeatFormChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: A1, B5, C10"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VND)
                </label>
                <input
                  type="number"
                  name="price"
                  value={seatForm.price}
                  onChange={handleSeatFormChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  placeholder="Ví dụ: 50000"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={handleCloseDialogs}
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSeatSubmit}
                disabled={!seatForm.name || !seatForm.price || seatForm.price <= 0 || loading} // ✅ Kiểm tra !seatForm.price
              >
                {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog xem thông tin booking */}
      {openBookingDialog && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Thông tin ghế {selectedSeat.name}
            </h2>
            
            {(() => {
              const bookingInfo = getSeatBookingInfo(selectedSeat._id);
              const status = getSeatStatus(selectedSeat._id);
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá ghế:</span>
                    <span className="font-semibold">{formatPrice(selectedSeat.price)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      status === 'booked' ? 'bg-red-100 text-red-800' :
                      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      status === 'reserved' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {status === 'booked' ? 'Đã đặt' :
                       status === 'pending' ? 'Đang xử lý' : 
                       status === 'reserved' ? 'Đã đặt chỗ' : 'Còn trống'}
                    </span>
                  </div>
                  
                  {bookingInfo && (
                    <>
                      <hr />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">Thông tin khách hàng:</h3>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tên:</span>
                          <span>{bookingInfo.customerName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số điện thoại:</span>
                          <span>{bookingInfo.customerPhone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="text-sm">{bookingInfo.customerEmail || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã vé:</span>
                          <span className="font-mono text-sm">{bookingInfo.orderId || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian đặt:</span>
                          <span className="text-sm">
                            {bookingInfo.bookingTime ? 
                              new Date(bookingInfo.bookingTime).toLocaleString('vi-VN') : 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={handleCloseDialogs}
              >
                Đóng
              </button>
              {(() => {
                const bookingInfo = getSeatBookingInfo(selectedSeat._id);
                if (bookingInfo && bookingInfo.ticketId) {
                  return (
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      onClick={() => {
                        showNotification(`Mã vé: ${bookingInfo.orderId}`, 'info');
                      }}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Xem vé
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-sm ${
          notification.type === 'success' ? 'bg-green-600' : 
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`}>
          <div className="flex items-center">
            <span className="flex-1">{notification.message}</span>
            <button 
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatList;