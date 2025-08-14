import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  ReloadOutlined,
  EditOutlined,
  PlusOutlined,
  VideoCameraOutlined,
  BankOutlined,
  BorderOuterOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs';
import ApiService from "../services/ApiService";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ShowtimeManagement = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  
  // Forms
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [generateForm] = Form.useForm();
  
  // Data for dropdowns
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [editFilteredRooms, setEditFilteredRooms] = useState([]);
  
  // Edit state
  const [editingShowtime, setEditingShowtime] = useState(null);

  // Status filter state
  const [statusFilter, setStatusFilter] = useState('upcoming');

  // Alternative: Force reload component bằng cách thay đổi key
  const [componentKey, setComponentKey] = useState(0);
  
  const forceRefresh = () => {
    console.log('🔄 Force refresh component...');
    setComponentKey(prev => prev + 1);
    fetchData(true);
  };

  // Helper function để parse và hiển thị lỗi chi tiết
  const showDetailedError = (error, context = '') => {
    console.error(`💥 ${context} Error:`, error);
    console.log('🔍 showDetailedError called with:', { error, context });
    
    // Force test - hiển thị alert để đảm bảo function được gọi
    console.log('🚨 TESTING: showDetailedError function called!');
    
    // Các lỗi phổ biến và thông báo user-friendly
    const errorMessages = {
      'Vui lòng cung cấp đầy đủ thông tin': '❌ Thiếu thông tin bắt buộc. Vui lòng kiểm tra lại tất cả các trường.',
      'Thời gian chiếu này đã tồn tại cho phòng này': '⚠️ SUẤT CHIẾU ĐÃ TỒN TẠI!\n\n🎬 Phòng này đã có lịch chiếu vào thời gian được chọn.\n\n💡 Vui lòng:\n• Chọn giờ chiếu khác\n• Chọn phòng khác\n• Chọn ngày khác',
      'Phòng chiếu không thuộc rạp này': '🏢 Lỗi cấu hình: Phòng chiếu không thuộc rạp đã chọn. Vui lòng chọn lại.',
      'Phim không tồn tại': '🎬 Phim không hợp lệ. Vui lòng chọn lại phim.',
      'Phòng chiếu không tồn tại': '🏠 Phòng chiếu không hợp lệ. Vui lòng chọn lại phòng.',
      'Rạp chiếu không tồn tại': '🏢 Rạp chiếu không hợp lệ. Vui lòng chọn lại rạp.',
      'Tất cả thời gian chiếu đã tồn tại cho phòng này': '📅 TẤT CẢ SUẤT CHIẾU ĐÃ TỒN TẠI!\n\n⚠️ Phòng này đã có lịch chiếu cho tất cả thời gian đã chọn.\n\n💡 Vui lòng:\n• Chọn phòng khác\n• Chọn ngày khác\n• Chọn giờ chiếu khác',
      'Ngày bắt đầu phải nhỏ hơn ngày kết thúc': '📅 Lỗi khoảng ngày: Ngày bắt đầu phải trước ngày kết thúc.',
      'Danh sách thời gian không được rỗng': '⏰ Vui lòng chọn ít nhất một giờ chiếu.',
      'Movie, Room hoặc Cinema không tồn tại': '❌ Dữ liệu không hợp lệ: Phim, Phòng hoặc Rạp không tồn tại trong hệ thống.',
      'Không thể đặt lịch chiếu trong quá khứ': '📅 Lỗi thời gian: Không thể tạo suất chiếu cho thời gian đã qua.',
      'HTTP error! status: 400': '❌ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đã nhập.',
      'HTTP error! status: 500': '🔧 Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên.',
      'Network error': '🌐 Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.'
    };
    
    // Tìm thông báo phù hợp
    let userMessage = error;
    for (const [key, value] of Object.entries(errorMessages)) {
      if (error.includes(key)) {
        userMessage = value;
        break;
      }
    }
    
    console.log('💬 Final user message:', userMessage);
    console.log('🔍 Error contains "đã tồn tại":', error.includes('đã tồn tại'));
    
    // Hiển thị Modal thông báo chi tiết cho duplicate error
    if (error.includes('đã tồn tại')) {
      console.log('🎭 Showing duplicate modal...');
      
      // Force show simple alert first để test
      alert('⚠️ SUẤT CHIẾU ĐÃ TỒN TẠI!\n\nPhòng này đã có lịch chiếu vào thời gian được chọn.');
      
      // Then show proper modal
      Modal.warning({
        title: '⚠️ Suất chiếu đã tồn tại',
        content: (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold', color: '#fa8c16' }}>
              🎭 Phòng này đã có lịch chiếu vào thời gian được chọn!
            </div>
            <div style={{ marginBottom: 12, padding: 12, background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>💡 Giải pháp:</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>🕐 Chọn giờ chiếu khác</li>
                <li>🏠 Chọn phòng chiếu khác</li>
                <li>📅 Chọn ngày chiếu khác</li>
              </ul>
            </div>
            <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>
              💭 Mẹo: Sử dụng filter "Tất cả" để xem các suất chiếu hiện có
            </div>
          </div>
        ),
        width: 500,
        okText: 'Đã hiểu',
        centered: true,
      });
    } else {
      console.log('📝 Showing regular message...');
      // Force show simple alert first để test
      alert(`❌ Lỗi: ${userMessage}`);
      
      // Hiển thị thông báo với icon và màu sắc phù hợp cho các lỗi khác
      if (error.includes('không tồn tại') || error.includes('không thuộc')) {
        message.error(userMessage, 6);
      } else if (error.includes('Thiếu thông tin') || error.includes('không được rỗng')) {
        message.info(userMessage, 6);
      } else if (error.includes('Lỗi hệ thống') || error.includes('500')) {
        message.error(userMessage, 8);
      } else if (error.includes('kết nối') || error.includes('Network')) {
        message.warning(userMessage, 6);
      } else {
        message.error(userMessage, 6);
      }
    }
  };

  // Fetch all data với loading indicators
  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      console.log('🔄 Fetching fresh data...');
      
      const [showtimesRes, moviesRes, cinemasRes, roomsRes] = await Promise.all([
        ApiService.getShowtimes(),
        ApiService.getMovies(),
        ApiService.getCinemas(),
        ApiService.getRooms(),
      ]);

      if (showtimesRes.success) {
        console.log('🔍 Fresh showtimes from server:', showtimesRes.data.slice(0, 3));
        console.log('📊 Total showtimes received:', showtimesRes.data.length);
        
        // Debug: Kiểm tra duplicate data
        const uniqueIds = new Set();
        const duplicates = [];
        showtimesRes.data.forEach(showtime => {
          if (uniqueIds.has(showtime._id)) {
            duplicates.push(showtime._id);
          } else {
            uniqueIds.add(showtime._id);
          }
        });
        
        if (duplicates.length > 0) {
          console.warn('⚠️ Found duplicate showtimes:', duplicates);
          // Remove duplicates
          const uniqueShowtimes = showtimesRes.data.filter((showtime, index, self) => 
            index === self.findIndex(s => s._id === showtime._id)
          );
          console.log(`🧹 Removed ${showtimesRes.data.length - uniqueShowtimes.length} duplicates`);
          setShowtimes(uniqueShowtimes);
        } else {
          console.log('✅ No duplicates found');
          setShowtimes(showtimesRes.data);
        }
        
        // Apply filters after setting showtimes
        setTimeout(() => {
          applyFilters(searchText, statusFilter);
        }, 100);
      }

      if (moviesRes.success) {
        // Lọc phim đang chiếu dựa trên release_date
        const now = new Date();
        const activeMovies = moviesRes.data.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate <= now;
        });
        
        // Nếu không có phim nào đã phát hành, hiển thị tất cả
        if (activeMovies.length === 0) {
          setMovies(moviesRes.data);
        } else {
          setMovies(activeMovies);
        }
      }

      if (cinemasRes.success) {
        setCinemas(cinemasRes.data.filter(c => c.isActive));
      }

      if (roomsRes.success) {
        setRooms(roomsRes.data);
        setFilteredRooms(roomsRes.data);
        setEditFilteredRooms(roomsRes.data);
      }

      if (showLoading) {
        message.success(`🔄 Đã tải ${showtimesRes.data?.length || 0} suất chiếu lúc ${new Date().toLocaleTimeString()}`);
      }
      
      console.log('✅ Data fetched successfully');
    } catch (error) {
      console.error('💥 Fetch data error:', error);
      message.error("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Search functionality + Status filter
  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(searchText, value);
  };

  const applyFilters = (searchValue, statusValue) => {
    let filtered = showtimes;

    console.log('🔍 Applying filters:', { searchValue, statusValue, totalShowtimes: showtimes.length });

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter((showtime) => {
        return (
          showtime.movie?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          showtime.cinema?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          showtime.room?.name?.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      console.log(`📝 After search filter: ${filtered.length} items`);
    }

    // Apply status filter
    if (statusValue && statusValue !== 'all') {
      const now = dayjs();
      const today = now.startOf('day');
      
      filtered = filtered.filter((showtime) => {
        const showtimeDate = dayjs(showtime.date).startOf('day');
        
        switch (statusValue) {
          case 'upcoming':
            return showtimeDate.isAfter(today);
          case 'today':
            return showtimeDate.isSame(today);
          case 'past':
            return showtimeDate.isBefore(today);
          default:
            return true;
        }
      });
      console.log(`📅 After status filter (${statusValue}): ${filtered.length} items`);
    }

    console.log('✅ Final filtered result:', filtered.length);
    setFilteredShowtimes(filtered);
  };

  // Handle cinema change for room filtering - Add modal
  const handleCinemaChange = (cinemaId, form) => {
    console.log('🎭 Cinema changed to:', cinemaId);
    console.log('🏠 All rooms:', rooms);
    
    const cinemaRooms = rooms.filter(room => {
      // Kiểm tra cả trường hợp room.cinema là string hoặc object
      const roomCinemaId = typeof room.cinema === 'object' ? room.cinema._id : room.cinema;
      console.log(`🔍 Room ${room.name}: roomCinemaId=${roomCinemaId}, cinemaId=${cinemaId}`);
      return roomCinemaId === cinemaId;
    });
    
    console.log('🎯 Filtered rooms for cinema:', cinemaRooms);
    
    setFilteredRooms(cinemaRooms);
    form.setFieldsValue({ room: undefined });
    
    if (cinemaRooms.length === 0) {
      message.warning('Rạp này chưa có phòng chiếu nào!');
    } else {
      message.success(`Tìm thấy ${cinemaRooms.length} phòng chiếu`);
    }
  };

  // Handle cinema change for room filtering - Edit modal
  const handleEditCinemaChange = (cinemaId) => {
    const cinemaRooms = rooms.filter(room => {
      const roomCinemaId = typeof room.cinema === 'object' ? room.cinema._id : room.cinema;
      return roomCinemaId === cinemaId;
    });
    
    setEditFilteredRooms(cinemaRooms);
    editForm.setFieldsValue({ room: undefined });
    
    if (cinemaRooms.length === 0) {
      message.warning('Rạp này chưa có phòng chiếu nào!');
    }
  };

  // Handle cinema change for room filtering - Generate modal
  const handleGenerateCinemaChange = (cinemaId) => {
    console.log('🎭 Generate Cinema changed to:', cinemaId);
    console.log('🏠 All rooms:', rooms);
    
    const cinemaRooms = rooms.filter(room => {
      // Kiểm tra cả trường hợp room.cinema là string hoặc object
      const roomCinemaId = typeof room.cinema === 'object' ? room.cinema._id : room.cinema;
      console.log(`🔍 Generate Room ${room.name}: roomCinemaId=${roomCinemaId}, cinemaId=${cinemaId}`);
      return roomCinemaId === cinemaId;
    });
    
    console.log('🎯 Generate Filtered rooms for cinema:', cinemaRooms);
    
    setFilteredRooms(cinemaRooms);
    generateForm.setFieldsValue({ room: undefined });
    
    if (cinemaRooms.length === 0) {
      message.warning('Rạp này chưa có phòng chiếu nào!');
    } else {
      message.success(`Tìm thấy ${cinemaRooms.length} phòng chiếu`);
    }
  };

  // Add showtime - Updated to handle multiple times with detailed error handling
  const handleAddShowtime = async (values) => {
    setAddLoading(true);
    try {
      console.log('🎬 Adding showtimes with data:', values);
      
      const times = Array.isArray(values.times) ? values.times : [values.times];
      console.log('⏰ Times to create:', times);
      
      // Tạo multiple showtimes với detailed error handling
      const promises = times.map(async (time) => {
        const selectedDate = values.date.format('YYYY-MM-DD');
        const [hours, minutes] = time.split(':');
        
        // Tạo Date object chính xác theo backend expectation
        const timeObject = new Date(`${selectedDate}T${time}:00`);
        const dateObject = new Date(`${selectedDate}T00:00:00`);
        
        const showtimeData = {
          time: timeObject.toISOString(),
          date: dateObject.toISOString(),
          movie: values.movie,
          room: values.room,
          cinema: values.cinema,
        };
        
        console.log('📤 Creating showtime (backend format):', {
          ...showtimeData,
          selectedTime: time,
          selectedDate: selectedDate,
          timeLocal: timeObject.toString(),
          dateLocal: dateObject.toString(),
        });
        
        // Gọi API với error handling chi tiết
        try {
          const url = `${ApiService.getBaseURL()}/showtimes`;
          const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(showtimeData),
          });
          
          const responseText = await response.text();
          console.log(`📥 Response for ${time}:`, {
            status: response.status,
            statusText: response.statusText,
            responseText: responseText
          });
          
          if (!response.ok) {
            let errorData;
            try {
              errorData = JSON.parse(responseText);
            } catch (e) {
              errorData = { error: responseText };
            }
            
            console.error(`❌ Error for ${time}:`, errorData);
            
            // 🔍 DEBUG: Log error type để kiểm tra
            console.log('🔍 Error type check:', {
              originalError: errorData.error,
              includesDuplicate: errorData.error?.includes('đã tồn tại'),
              includesDuplicateEng: errorData.error?.includes('already exists'),
            });
            
            // Gọi showDetailedError ngay lập tức để test
            showDetailedError(errorData.error || 'Lỗi không xác định', `Tạo suất chiếu ${time}`);
            
            return { success: false, error: errorData.error || 'Unknown error', time };
          }
          
          const responseData = JSON.parse(responseText);
          console.log(`✅ Success for ${time}:`, responseData);
          return { success: true, data: responseData, time };
          
        } catch (networkError) {
          console.error(`💥 Network error for ${time}:`, networkError);
          return { success: false, error: `Network error: ${networkError.message}`, time };
        }
      });

      const responses = await Promise.all(promises);
      
      // Phân tích kết quả
      const successResults = responses.filter(r => r.success);
      const failResults = responses.filter(r => !r.success);
      
      console.log('📊 Results summary:', {
        total: responses.length,
        success: successResults.length,
        failed: failResults.length,
        failDetails: failResults
      });
      
      if (successResults.length > 0) {
        message.success(`Đã tạo thành công ${successResults.length} suất chiếu!`);
      }
      
      if (failResults.length > 0) {
        // Hiển thị tóm tắt nếu có nhiều lỗi
        const duplicateErrors = failResults.filter(r => r.error.includes('đã tồn tại'));
        const otherErrors = failResults.filter(r => !r.error.includes('đã tồn tại'));
        
        if (duplicateErrors.length > 0) {
          const duplicateTimes = duplicateErrors.map(r => r.time).join(', ');
          Modal.warning({
            title: '⚠️ Không thể tạo một số suất chiếu',
            content: (
              <div style={{ padding: '16px 0' }}>
                <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold', color: '#fa8c16' }}>
                  🎭 Các giờ chiếu sau đã tồn tại: <span style={{ color: '#d46b08' }}>{duplicateTimes}</span>
                </div>
                <div style={{ marginBottom: 12, padding: 12, background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>💡 Giải pháp:</div>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>🕐 Chọn giờ chiếu khác cho các suất bị trùng</li>
                    <li>🏠 Chọn phòng chiếu khác</li>
                    <li>📅 Chọn ngày chiếu khác</li>
                  </ul>
                </div>
                {successResults.length > 0 && (
                  <div style={{ padding: 8, background: '#f6ffed', borderRadius: 4, border: '1px solid #b7eb8f', marginTop: 12 }}>
                    ✅ Đã tạo thành công {successResults.length} suất chiếu khác
                  </div>
                )}
              </div>
            ),
            width: 520,
            okText: 'Đã hiểu',
            centered: true,
          });
        }
        
        // Hiển thị lỗi khác (nếu có)
        otherErrors.forEach(result => {
          showDetailedError(result.error, `Suất chiếu ${result.time}`);
        });
      }
      
      if (successResults.length > 0) {
        setIsAddModalVisible(false);
        addForm.resetFields();
        fetchData();
      }
      
    } catch (error) {
      console.error('💥 Add showtimes error:', error);
      showDetailedError(error.message || 'Lỗi kết nối', 'Thêm suất chiếu');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit showtime
  const handleEditShowtime = (showtime) => {
    setEditingShowtime(showtime);
    
    // Filter rooms based on selected cinema
    const cinemaRooms = rooms.filter(room => {
      const roomCinemaId = typeof room.cinema === 'object' ? room.cinema._id : room.cinema;
      return roomCinemaId === showtime.cinema._id;
    });
    
    setEditFilteredRooms(cinemaRooms);
    setIsEditModalVisible(true);
    
    // Set form values với delay để đảm bảo modal đã render
    setTimeout(() => {
      editForm.setFieldsValue({
        movie: showtime.movie._id,
        cinema: showtime.cinema._id,
        room: showtime.room._id,
        date: dayjs(showtime.date),
        time: dayjs(showtime.time),
      });
    }, 150);
  };

  // Tạm thời sửa handleUpdateShowtime để debug
  const handleUpdateShowtime = async (values) => {
    setEditLoading(true);
    try {
      console.log('🔄 Updating showtime with data:', values);
      console.log('🎯 Editing showtime ID:', editingShowtime._id);
      
      const updateData = {
        time: values.time.toISOString(),
        date: values.date.toISOString(),
        movie: values.movie,
        room: values.room,
        cinema: values.cinema,
      };

      console.log('📤 Sending update data:', updateData);
      
      // Debug: Gửi request thủ công để xem response chi tiết
      const url = `${ApiService.getBaseURL()}/showtimes/${editingShowtime._id}`;
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      
      console.log('📥 Raw response status:', response.status);
      console.log('📥 Raw response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('📥 Raw response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('📥 Parsed response data:', responseData);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error('❌ Server error details:', responseData);
        throw new Error(`Server error: ${responseData.message || responseData.error || 'Unknown error'}`);
      }
      
      if (responseData.success) {
        message.success("Cập nhật suất chiếu thành công!");
        
        console.log('🔄 Starting auto refresh after edit...');
        
        // Close modal and reset form
        setIsEditModalVisible(false);
        editForm.resetFields();
        setEditingShowtime(null);
        setEditFilteredRooms(rooms);
        
        // Force refresh
        forceRefresh();
        
        console.log('✅ Edit refresh triggered');
      } else {
        console.error('❌ Update failed:', responseData);
        message.error(responseData.message || "Lỗi khi cập nhật suất chiếu");
      }
    } catch (error) {
      console.error('💥 Update error:', error);
      message.error("Lỗi kết nối API: " + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Generate showtimes
  const handleGenerateShowtimes = async (values) => {
    setGenerateLoading(true);
    try {
      console.log('🚀 Generating showtimes with data:', values);
      
      // Debug: Kiểm tra format của dateRange và times
      console.log('📅 Date range:', {
        start: values.dateRange[0].toString(),
        end: values.dateRange[1].toString(),
        startISO: values.dateRange[0].toISOString(),
        endISO: values.dateRange[1].toISOString()
      });
      
      console.log('⏰ Selected times:', values.times);
      
      // Tạo times array theo format backend expect
      const timesArray = values.times.map(timeStr => {
        // Backend expect Date object được convert thành ISO string
        const [hours, minutes] = timeStr.split(':');
        const dateObj = new Date();
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        console.log(`🕐 Converting ${timeStr} to:`, {
          original: timeStr,
          dateObj: dateObj.toString(),
          iso: dateObj.toISOString()
        });
        
        return dateObj.toISOString();
      });
      
      const generateData = {
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        times: timesArray,
        movie: values.movie,
        room: values.room,
        cinema: values.cinema,
      };

      console.log('📤 Sending generate data:', generateData);

      // Sử dụng custom fetch để xem response detail
      const url = `${ApiService.getBaseURL()}/showtimes/generate`;
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(generateData),
      });
      
      const responseText = await response.text();
      console.log('📥 Generate response:', {
        status: response.status,
        statusText: response.statusText,
        responseText: responseText
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { error: responseText };
        }
        
        console.error('❌ Generate error details:', errorData);
        showDetailedError(errorData.error || 'Lỗi không xác định', 'Tạo hàng loạt');
        return;
      }
      
      const responseData = JSON.parse(responseText);
      console.log('✅ Generate success:', responseData);
      
      if (responseData.success) {
        const createdCount = responseData.data?.created || 0;
        const duplicatesCount = responseData.data?.duplicatesSkipped || 0;
        const duplicatesList = responseData.data?.duplicates || [];
        
        if (createdCount > 0 && duplicatesCount > 0) {
          message.success(`✅ Đã tạo ${createdCount} suất chiếu thành công!`);
          
          // Hiển thị chi tiết duplicates bị bỏ qua
          Modal.info({
            title: '📋 Kết quả tạo hàng loạt',
            content: (
              <div style={{ padding: '16px 0' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: 8 }}>
                    ✅ Thành công: {createdCount} suất chiếu
                  </div>
                  <div style={{ color: '#fa8c16', fontWeight: 'bold' }}>
                    ⚠️ Bỏ qua: {duplicatesCount} suất chiếu đã tồn tại
                  </div>
                </div>
                {duplicatesList.length > 0 && (
                  <div style={{ padding: 12, background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>📝 Danh sách bị bỏ qua:</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12 }}>
                      {duplicatesList.slice(0, 10).map((duplicate, index) => (
                        <li key={index}>{duplicate}</li>
                      ))}
                      {duplicatesList.length > 10 && <li>... và {duplicatesList.length - 10} suất chiếu khác</li>}
                    </ul>
                  </div>
                )}
              </div>
            ),
            width: 500,
            centered: true,
          });
        } else if (createdCount > 0) {
          message.success(`🎉 Đã tạo ${createdCount} suất chiếu thành công!`);
        } else {
          Modal.warning({
            title: '⚠️ Không có suất chiếu nào được tạo',
            content: (
              <div style={{ padding: '16px 0' }}>
                <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold', color: '#fa8c16' }}>
                  🎭 Tất cả suất chiếu trong khoảng thời gian này đã tồn tại!
                </div>
                <div style={{ marginBottom: 12, padding: 12, background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>💡 Thử:</div>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>📅 Chọn khoảng ngày khác</li>
                    <li>🕐 Chọn giờ chiếu khác</li>
                    <li>🏠 Chọn phòng chiếu khác</li>
                  </ul>
                </div>
              </div>
            ),
            width: 480,
            okText: 'Đã hiểu',
            centered: true,
          });
        }
        console.log('🔄 Starting auto refresh after generate...');
        
        // Close modal and reset
        setIsGenerateModalVisible(false);
        generateForm.resetFields();
        
        // Force refresh
        forceRefresh();
      } else {
        showDetailedError(responseData.message || "Lỗi không xác định", 'Tạo hàng loạt');
      }
    } catch (error) {
      console.error('💥 Generate error:', error);
      showDetailedError(error.message || 'Lỗi kết nối', 'Tạo hàng loạt');
    } finally {
      setGenerateLoading(false);
    }
  };

  // Cancel functions
  const handleCancelAdd = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditingShowtime(null);
    setEditFilteredRooms(rooms);
  };

  const handleCancelGenerate = () => {
    setIsGenerateModalVisible(false);
    generateForm.resetFields();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_, record, index) => {
        // Tính toán STT dựa trên trang hiện tại và pageSize
        return (
          <span style={{ 
            fontWeight: "bold", 
            color: "#1890ff",
            fontSize: "14px"
          }}>
            {(currentPage - 1) * pageSize + index + 1}
          </span>
        );
      },
    },
    {
      title: "Phim",
      dataIndex: ["movie", "name"],
      key: "movie",
      render: (movieName, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <VideoCameraOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: "bold" }}>{movieName}</span>
        </div>
      ),
    },
    {
      title: "Rạp chiếu",
      dataIndex: ["cinema", "name"],
      key: "cinema",
      render: (cinemaName) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BankOutlined style={{ color: "#52c41a" }} />
          {cinemaName}
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: ["room", "name"],
      key: "room",
      render: (roomName) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BorderOuterOutlined style={{ color: "#722ed1" }} />
          {roomName}
        </div>
      ),
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        const showtimeDate = dayjs(date);
        const now = dayjs();
        const isPast = showtimeDate.isBefore(now, 'day');
        const isToday = showtimeDate.isSame(now, 'day');
        
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarOutlined style={{ color: "#fa8c16" }} />
            <span style={{ 
              color: isPast ? '#999' : isToday ? '#fa8c16' : '#000',
              fontWeight: isToday ? 'bold' : 'normal'
            }}>
              {showtimeDate.format("DD/MM/YYYY")}
            </span>
            {isPast && <Tag color="default" size="small">Đã chiếu</Tag>}
            {isToday && <Tag color="orange" size="small">Hôm nay</Tag>}
            {!isPast && !isToday && <Tag color="green" size="small">Sắp chiếu</Tag>}
          </div>
        );
      },
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Giờ chiếu",
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ClockCircleOutlined style={{ color: "#eb2f96" }} />
          <Tag color="blue">{dayjs(time).format("HH:mm")}</Tag>
        </div>
      ),
      sorter: (a, b) => dayjs(a.time).unix() - dayjs(b.time).unix(),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => {
        const isPast = dayjs(record.date).isBefore(dayjs(), 'day');
        
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditShowtime(record)}
              disabled={isPast}
              title={isPast ? "Không thể sửa suất chiếu đã qua" : "Sửa suất chiếu"}
            >
              Sửa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ClockCircleOutlined style={{ color: "#1890ff" }} />
              Quản lý giờ chiếu
            </h2>
          </Col>
          <Col flex="auto" />
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={() => setIsGenerateModalVisible(true)}
                style={{ backgroundColor: "#722ed1", borderColor: "#722ed1" }}
              >
                Tạo hàng loạt
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Thêm suất chiếu
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => {
                  // Force clear cache và reload
                  setShowtimes([]);
                  setFilteredShowtimes([]);
                  setRefreshKey(prev => prev + 1);
                  fetchData(true); // Hiển thị loading
                }}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Search and Stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Search
            placeholder="Tìm kiếm theo tên phim, rạp, phòng..."
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => handleStatusFilter(value)}
          >
            <Option value="upcoming">📅 Sắp chiếu</Option>
            <Option value="today">🎬 Hôm nay</Option>
            <Option value="past">✅ Đã chiếu</Option>
            <Option value="all">📋 Tất cả</Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <div style={{ textAlign: "right", color: "#666", lineHeight: "32px" }}>
            Hiển thị {filteredShowtimes.length} / {showtimes.length} suất chiếu
          </div>
        </Col>
      </Row>

      {/* Table */}
      <Table
        key={`${refreshKey}-${componentKey}`}
        columns={columns}
        dataSource={filteredShowtimes}
        rowKey={(record) => record._id || `temp-${Date.now()}-${Math.random()}`}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} suất chiếu`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        bordered
        scroll={{ x: 1000 }}
        size="middle"
      />

      {/* Add Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PlusOutlined style={{ color: "#52c41a" }} />
            Thêm suất chiếu mới
          </div>
        }
        open={isAddModalVisible}
        onCancel={handleCancelAdd}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddShowtime}
          style={{ marginTop: 24 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phim"
                name="movie"
                rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
              >
                <Select placeholder="Chọn phim" size="large">
                  {movies.map((movie) => (
                    <Option key={movie._id} value={movie._id}>
                      {movie.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Rạp chiếu"
                name="cinema"
                rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
              >
                <Select 
                  placeholder="Chọn rạp" 
                  size="large"
                  onChange={(value) => handleCinemaChange(value, addForm)}
                >
                  {cinemas.map((cinema) => (
                    <Option key={cinema._id} value={cinema._id}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phòng chiếu"
                name="room"
                rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
              >
                <Select placeholder="Chọn phòng" size="large">
                  {filteredRooms.map((room) => (
                    <Option key={room._id} value={room._id}>
                      {room.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày chiếu"
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker 
                  placeholder="Chọn ngày" 
                  size="large" 
                  style={{ width: "100%" }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Giờ chiếu"
            name="times"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 giờ chiếu!" }]}
            extra="💡 Có thể chọn nhiều giờ chiếu để tạo nhiều suất cùng lúc"
          >
            <Select 
              mode="multiple"
              placeholder="Chọn các giờ chiếu" 
              size="large" 
              style={{ width: "100%" }}
              optionLabelProp="label"
            >
              {[
                "09:00", "10:30", "12:00", "13:30", "15:00", 
                "16:30", "18:00", "19:30", "21:00", "22:30"
              ].map((time) => (
                <Option key={time} value={time} label={time}>
                  {time}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancelAdd} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addLoading}
                size="large"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                {addLoading ? 'Đang tạo...' : 'Tạo suất chiếu'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EditOutlined style={{ color: "#1890ff" }} />
            Chỉnh sửa suất chiếu
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleCancelEdit}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateShowtime}
          style={{ marginTop: 24 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phim"
                name="movie"
                rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
              >
                <Select placeholder="Chọn phim" size="large">
                  {movies.map((movie) => (
                    <Option key={movie._id} value={movie._id}>
                      {movie.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Rạp chiếu"
                name="cinema"
                rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
              >
                <Select 
                  placeholder="Chọn rạp" 
                  size="large"
                  onChange={(value) => handleEditCinemaChange(value)}
                >
                  {cinemas.map((cinema) => (
                    <Option key={cinema._id} value={cinema._id}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phòng chiếu"
                name="room"
                rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
              >
                <Select placeholder="Chọn phòng" size="large">
                  {editFilteredRooms.map((room) => (
                    <Option key={room._id} value={room._id}>
                      {room.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày chiếu"
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker 
                  placeholder="Chọn ngày" 
                  size="large" 
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Giờ chiếu"
            name="time"
            rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
          >
            <TimePicker 
              placeholder="Chọn giờ" 
              size="large" 
              style={{ width: "100%" }}
              format="HH:mm"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancelEdit} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={editLoading}
                size="large"
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThunderboltOutlined style={{ color: "#722ed1" }} />
            Tạo suất chiếu hàng loạt
          </div>
        }
        open={isGenerateModalVisible}
        onCancel={handleCancelGenerate}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={generateForm}
          layout="vertical"
          onFinish={handleGenerateShowtimes}
          style={{ marginTop: 24 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phim"
                name="movie"
                rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
              >
                <Select placeholder="Chọn phim" size="large">
                  {movies.map((movie) => (
                    <Option key={movie._id} value={movie._id}>
                      {movie.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Rạp chiếu"
                name="cinema"
                rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
              >
                <Select 
                  placeholder="Chọn rạp" 
                  size="large"
                  onChange={(value) => handleGenerateCinemaChange(value)}
                >
                  {cinemas.map((cinema) => (
                    <Option key={cinema._id} value={cinema._id}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Phòng chiếu"
            name="room"
            rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
          >
            <Select placeholder="Chọn phòng" size="large">
              {filteredRooms.map((room) => (
                <Option key={room._id} value={room._id}>
                  {room.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Khoảng ngày"
            name="dateRange"
            rules={[{ required: true, message: "Vui lòng chọn khoảng ngày!" }]}
          >
            <RangePicker 
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} 
              size="large" 
              style={{ width: "100%" }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="Các giờ chiếu"
            name="times"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 giờ chiếu!" }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Chọn các giờ chiếu" 
              size="large"
              optionLabelProp="label"
            >
              {[
                "09:00", "10:30", "12:00", "13:30", "15:00", 
                "16:30", "18:00", "19:30", "21:00", "22:30"
              ].map((time) => (
                <Option key={time} value={time} label={time}>
                  {time}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: 16,
            fontSize: "13px"
          }}>
            <Space>
              <span>💡</span>
              <span>
                <strong>Lưu ý:</strong> Hệ thống sẽ tự động tạo suất chiếu cho tất cả các ngày trong khoảng thời gian đã chọn với các giờ chiếu đã chọn.
              </span>
            </Space>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancelGenerate} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={generateLoading}
                size="large"
                style={{ backgroundColor: "#722ed1", borderColor: "#722ed1" }}
              >
                Tạo hàng loạt
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShowtimeManagement;