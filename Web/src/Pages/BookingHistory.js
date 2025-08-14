import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Modal, 
  Card, 
  Descriptions, 
  message, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col,
  Spin,
  Empty,
  Tooltip,
  Alert
} from 'antd';
import { 
  ReloadOutlined, 
  EyeOutlined, 
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  PrinterOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ApiService from '../services/ApiService';
import AuthService from '../services/authService';

const { Option } = Select;
const { RangePicker } = DatePicker;

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: null,
    movieId: '',
    cinemaId: '',
  });
  
  // Modal states
  const [detailModal, setDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Data for filters
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  
  // Auth states
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Load data on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Load data when auth is checked
  useEffect(() => {
    if (authChecked) {
      loadBookings();
    }
  }, [authChecked]);

  // Load filter data when bookings change
  useEffect(() => {
    if (authChecked && bookings.length > 0) {
      loadFilterData();
    }
  }, [authChecked, bookings]);

  // Load data when pagination or filters change
  useEffect(() => {
    if (authChecked) {
      loadBookings();
    }
  }, [pagination.current, pagination.pageSize, filters]);

  // Check authentication status
  const checkAuthentication = async () => {
    try {
      console.log('=== CHECKING AUTHENTICATION ===');
      
      // Check if user is authenticated
      const isAuthenticated = AuthService.isAuthenticated();
      const isAdminUser = AuthService.isAdmin();
      const currentUser = AuthService.getUser();
      
      console.log('Is Authenticated:', isAuthenticated);
      console.log('Is Admin:', isAdminUser);
      console.log('Current User:', currentUser);
      
      if (isAuthenticated) {
        // Try to get fresh user data
        try {
          const freshUser = await AuthService.getCurrentUser();
          setUser(freshUser);
          setIsAdmin(freshUser.role === 'admin');
          console.log('✅ Authentication valid - Fresh user data:', freshUser);
        } catch (error) {
          // Token might be expired
          console.warn('⚠️ Token expired or invalid:', error.message);
          AuthService.logout();
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        console.log('❌ No authentication found');
        setUser(null);
        setIsAdmin(false);
      }
      
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setAuthChecked(true);
    }
  };

  // Load bookings from API
  const loadBookings = async () => {
    try {
      setLoading(true);
      
      // Check authentication before making requests
      if (!user) {
        console.log('❌ No user authenticated');
        message.warning('Vui lòng đăng nhập để xem lịch sử đặt vé');
        setBookings([]);
        setPagination(prev => ({ ...prev, total: 0 }));
        return;
      }
      
      // Prepare query parameters
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      };
      
      // Format date range if exists
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
        delete params.dateRange;
      }

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('Loading bookings with params:', params);
      console.log('User role:', user.role);
      
      let response;
      let bookingsData = [];
      let total = 0;
      
      if (isAdmin) {
        // Admin user - get all tickets
        try {
          console.log('Admin user - trying admin routes');
          
          // Try real admin route
          response = await ApiService.getTickets(params);
          console.log('Real admin tickets response:', response);
          
          if (response && response.success && response.data) {
            bookingsData = response.data;
            total = response.total || response.count || bookingsData.length;
            console.log('✅ Success with real admin route - Total:', total);
          } else {
            throw new Error('Admin route failed');
          }
          
        } catch (adminError) {
          console.error('Admin routes failed:', adminError);
          throw adminError;
        }
        
      } else {
        // Regular user - get only their tickets
        console.log('Regular user - getting user tickets');
        
        try {
          response = await ApiService.getMyTickets();
          console.log('My tickets response:', response);
          
          if (response && response.success && response.data) {
            bookingsData = response.data;
            total = response.total || response.count || bookingsData.length;
            console.log('✅ Success with user tickets - Total:', total);
          } else {
            throw new Error('User tickets response not valid');
          }
        } catch (userError) {
          console.error('User tickets failed:', userError);
          throw userError;
        }
      }
      
      console.log('Final processed bookings data:', bookingsData.length, 'tickets');
      
      // Transform data to match frontend structure
      const transformedBookings = bookingsData.map(ticket => {
        // ✅ DEBUG: Log first ticket to see data structure
        if (bookingsData.indexOf(ticket) === 0) {
          console.log('🔍 DEBUGGING FIRST TICKET STRUCTURE:');
          console.log('Raw ticket data:', ticket);
          console.log('Price fields:', {
            total: ticket.total,
            totalAmount: ticket.totalAmount,
            price: ticket.price,
            seatTotalPrice: ticket.seatTotalPrice,
            foodTotalPrice: ticket.foodTotalPrice,
            total_food: ticket.total_food
          });
        }
        
        // ✅ Smart price handling - try multiple field names
        const totalAmount = ticket.total || 
                           ticket.totalAmount || 
                           ticket.price || 
                           ticket.totalPrice ||
                           (ticket.seatTotalPrice || 0) + (ticket.foodTotalPrice || ticket.total_food || 0) ||
                           0;
        
        return {
          id: ticket._id || ticket.id,
          ticketCode: ticket.orderId || `#${ticket._id}`,
          
          // Customer info
          user: ticket.user,
          customerName: ticket.userInfo?.fullName || ticket.user?.name || 'N/A',
          customerEmail: ticket.userInfo?.email || ticket.user?.email || 'N/A',
          customerPhone: ticket.userInfo?.phone || ticket.user?.number_phone || 'N/A',
          
          // Movie info
          movieTitle: ticket.movie?.name || 'N/A',
          duration: ticket.movie?.duration || 0,
          
          // Cinema & Room info
          cinemaName: ticket.cinema?.name || 'N/A',
          roomName: ticket.room?.name || 'N/A',
          
          // Showtime info
          showtime: ticket.time,
          showDate: ticket.time?.showDate || ticket.time?.date || ticket.showdate,
          startTime: ticket.time?.startTime || ticket.time?.time,
          
          // Seats info - handle both single seat and multiple seats
          seats: ticket.seats || (ticket.seat ? [ticket.seat] : []),
          
          // ✅ FIXED: Financial info with better fallbacks
          totalAmount: totalAmount,
          seatTotalPrice: ticket.seatTotalPrice || 0,
          foodTotalPrice: ticket.foodTotalPrice || ticket.total_food || 0,
          discountAmount: ticket.discountAmount || 0,
          
          // Status & dates
          status: ticket.status || 'pending_payment',
          createdAt: ticket.bookingTime || ticket.date || ticket.createdAt,
          confirmedAt: ticket.confirmedAt,
          cancelledAt: ticket.cancelledAt,
          
          // Additional info
          paymentMethod: ticket.paymentMethod || 'cash',
          foodItems: ticket.foodItems || [],
          discount: ticket.discount,
          
          // Original ticket object for detail view
          _original: ticket
        };
      });
      
      setBookings(transformedBookings);
      setPagination(prev => ({
        ...prev,
        total: total,
      }));
      
      if (transformedBookings.length === 0) {
        console.log('✅ API success but no data found');
        message.info(isAdmin ? 'Chưa có vé nào trong hệ thống' : 'Bạn chưa đặt vé nào');
      } else {
        console.log(`✅ Loaded ${transformedBookings.length} tickets successfully`);
        const userType = isAdmin ? 'tất cả' : 'của bạn';
        message.success(`Đã tải ${transformedBookings.length} vé ${userType} (tổng ${total} vé)`);
      }
      
    } catch (error) {
      console.error('Error loading bookings:', error);
      
      if (error.message.includes('401')) {
        console.error('❌ AUTHENTICATION ERROR');
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        
        // Logout and refresh auth
        AuthService.logout();
        setUser(null);
        setIsAdmin(false);
        
      } else {
        message.error(`Có lỗi xảy ra: ${error.message}`);
      }
      
      // Clear bookings on error
      setBookings([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
      }));
      
    } finally {
      setLoading(false);
    }
  };

  // Load data for filter dropdowns
  const loadFilterData = async () => {
    try {
      console.log('Loading filter data...');
      
      // ✅ Get movies from tickets instead of all movies
      const [cinemasRes] = await Promise.all([
        ApiService.getCinemas().catch(err => {
          console.log('Cinemas API failed:', err);
          return { success: false, data: [] };
        })
      ]);
      
      console.log('Cinemas response:', cinemasRes);
      
      // ✅ Extract unique movies from current bookings (đang chiếu)
      const uniqueMovies = [];
      const movieMap = new Map();
      
      bookings.forEach(booking => {
        const movieId = booking._original?.movie?._id || booking._original?.movie?.id;
        const movieName = booking.movieTitle;
        
        if (movieId && movieName && !movieMap.has(movieId)) {
          movieMap.set(movieId, {
            id: movieId,
            title: movieName,
            name: movieName // Support both field names
          });
          uniqueMovies.push(movieMap.get(movieId));
        }
      });
      
      console.log('📽️ Movies from tickets (đang chiếu):', uniqueMovies);
      setMovies(uniqueMovies);
      
      // Handle cinemas data
      if (cinemasRes && cinemasRes.success && cinemasRes.data) {
        setCinemas(cinemasRes.data);
      } else if (cinemasRes && Array.isArray(cinemasRes)) {
        setCinemas(cinemasRes);
      } else {
        // Mock cinemas data
        setCinemas([
          { id: 1, name: 'CGV Aeon Tân Phú' },
          { id: 2, name: 'Lotte Cinema Gò Vấp' },
          { id: 3, name: 'Galaxy Cinema Nguyễn Du' }
        ]);
      }
      
    } catch (error) {
      console.error('Error loading filter data:', error);
      
      // Set mock data as fallback
      setMovies([]);
      setCinemas([
        { id: 1, name: 'CGV Aeon Tân Phú' },
        { id: 2, name: 'Lotte Cinema Gò Vấp' },
        { id: 3, name: 'Galaxy Cinema Nguyễn Du' }
      ]);
    }
  };

  // View booking details
  const viewBookingDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      setDetailModal(true);
      
      console.log('Loading booking detail for ID:', bookingId);
      
      // Handle demo data separately
      if (bookingId && bookingId.toString().startsWith('demo')) {
        console.log('📄 Loading demo booking detail');
        
        // Find demo booking from current bookings state
        const demoBooking = bookings.find(b => b.id === bookingId);
        if (demoBooking) {
          // Create detailed demo data
          const demoDetail = {
            ...demoBooking,
            userInfo: {
              fullName: demoBooking.customerName,
              email: demoBooking.customerEmail,
              phone: demoBooking.customerPhone || '0123456789'
            },
            movie: {
              name: demoBooking.movieTitle,
              duration: demoBooking.duration,
              image: '/placeholder-movie.jpg'
            },
            cinema: {
              name: demoBooking.cinemaName,
              address: '123 Demo Street, Ho Chi Minh City'
            },
            room: {
              name: demoBooking.roomName
            },
            time: {
              date: demoBooking.showDate,
              time: demoBooking.startTime
            },
            seats: demoBooking.seats || [],
            foodItems: demoBooking.foodItems || [],
            total: demoBooking.totalAmount,
            status: demoBooking.status,
            createdAt: demoBooking.createdAt,
            orderId: demoBooking.ticketCode
          };
          
          setBookingDetail(demoDetail);
          return;
        }
      }
      
      // Try to load real booking detail
      try {
        const response = await ApiService.getTicketById(bookingId);
        console.log('Booking detail response:', response);
        
        if (response && response.success && response.data) {
          setBookingDetail(response.data);
        } else if (response && response._id) {
          // Direct ticket object response
          setBookingDetail(response);
        } else {
          message.error('Không thể tải chi tiết đặt vé');
        }
      } catch (apiError) {
        console.error('API Error loading detail:', apiError);
        
        if (apiError.message.includes('401')) {
          message.warning('Không có quyền xem chi tiết vé. Hiển thị thông tin cơ bản.');
          
          // Create basic detail from list data
          const booking = bookings.find(b => b.id === bookingId);
          if (booking) {
            const basicDetail = {
              ...booking,
              userInfo: {
                fullName: booking.customerName,
                email: booking.customerEmail,
                phone: booking.customerPhone || 'N/A'
              },
              movie: { name: booking.movieTitle, duration: booking.duration },
              cinema: { name: booking.cinemaName },
              room: { name: booking.roomName },
              time: { date: booking.showDate, time: booking.startTime },
              total: booking.totalAmount,
              orderId: booking.ticketCode
            };
            setBookingDetail(basicDetail);
          } else {
            message.error('Không tìm thấy thông tin vé');
          }
        } else {
          message.error('Có lỗi xảy ra khi tải chi tiết');
        }
      }
      
    } catch (error) {
      console.error('Error loading booking detail:', error);
      message.error('Có lỗi xảy ra khi tải chi tiết');
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      current: 1 // Reset to first page when filtering
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: null,
      movieId: '',
      cinemaId: '',
    });
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'thành công':
      case 'success':
        return 'green';
      case 'cancelled':
      case 'đã hủy':
      case 'canceled':
        return 'red';
      case 'pending_payment':
      case 'pending':
      case 'chờ xử lý':
        return 'orange';
      case 'used':
      case 'đã sử dụng':
        return 'blue';
      case 'expired':
      case 'hết hạn':
        return 'default';
      default:
        return 'blue';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'Thành công';
      case 'cancelled':
      case 'canceled':
        return 'Đã hủy';
      case 'pending_payment':
      case 'pending':
        return 'Chờ thanh toán';
      case 'used':
        return 'Đã sử dụng';
      case 'expired':
        return 'Hết hạn';
      default:
        return status || 'Không xác định';
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'ticketCode',
      key: 'ticketCode',
      render: (text, record) => (
        <Link to={`/bookings/${record.id}`}>
          <strong>{text || `#${record.id}`}</strong>
        </Link>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'name'],
      key: 'customerName',
      render: (text, record) => (
        <div>
          <div><strong>{text || record.customerName}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.user?.email || record.customerEmail}
          </div>
        </div>
      ),
    },
    {
      title: 'Phim',
      dataIndex: ['showtime', 'movie', 'title'],
      key: 'movie',
      render: (text, record) => (
        <div>
          <div><strong>{text || record.movieTitle}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.showtime?.movie?.duration || record.duration} phút
          </div>
        </div>
      ),
    },
    {
      title: 'Rạp & Phòng',
      key: 'cinema',
      render: (text, record) => (
        <div>
          <div>{record.showtime?.room?.cinema?.name || record.cinemaName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Phòng: {record.showtime?.room?.name || record.roomName}
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày & Giờ',
      key: 'datetime',
      render: (text, record) => (
        <div>
          <div>{moment(record.showtime?.showDate || record.showDate).format('DD/MM/YYYY')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.showtime?.startTime || record.startTime}
          </div>
        </div>
      ),
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats) => (
        <div>
          {seats?.map(seat => (
            <Tag key={seat.id} size="small">
              {seat.name || seat.seatNumber || `${seat.row || ''}${seat.column || ''}`}
            </Tag>
          )) || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => (
        <strong style={{ color: '#f50' }}>
          {value?.toLocaleString() || 0} đ
        </strong>
      ),
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Thành công', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
        { text: 'Chờ thanh toán', value: 'pending_payment' },
        { text: 'Đã sử dụng', value: 'used' },
      ],
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedBooking(record);
                viewBookingDetail(record.id);
              }}
            />
          </Tooltip>
          <Tooltip title="In vé">
            <Button
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => {
                // Handle print ticket
                window.open(`/tickets/${record.id}/print`, '_blank');
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>
            {isAdmin ? 'Quản lý lịch sử đặt vé' : 'Lịch sử đặt vé của tôi'}
          </h2>
          
          {/* User info display */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color={isAdmin ? 'red' : 'blue'}>
                {isAdmin ? 'Admin' : 'User'}: {user.name}
              </Tag>
              <Button 
                size="small" 
                onClick={() => {
                  AuthService.logout();
                  window.location.reload();
                }}
              >
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
        
        {/* Auth status alert */}
        {!authChecked && (
          <Alert
            message="Đang kiểm tra đăng nhập..."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        {authChecked && !user && (
          <Alert
            message="Chưa đăng nhập"
            description={
              <div>
                Vui lòng đăng nhập để xem lịch sử đặt vé.
                <Button 
                  type="link" 
                  icon={<LoginOutlined />}
                  onClick={() => window.location.href = '/login'}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  Đăng nhập ngay
                </Button>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        {/* Show content only when authenticated */}
        {authChecked && user && (
          <>
            {/* Filters */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Input
                    placeholder={isAdmin ? "Tìm kiếm mã vé, tên khách hàng..." : "Tìm kiếm mã vé..."}
                    prefix={<SearchOutlined />}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    allowClear
                  />
                </Col>
                
                <Col span={4}>
                  <Select
                    placeholder="Trạng thái"
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="completed">Thành công</Option>
                    <Option value="cancelled">Đã hủy</Option>
                    <Option value="pending_payment">Chờ thanh toán</Option>
                    <Option value="used">Đã sử dụng</Option>
                  </Select>
                </Col>
                
                <Col span={6}>
                  <RangePicker
                    placeholder={['Từ ngày', 'Đến ngày']}
                    value={filters.dateRange}
                    onChange={(dates) => handleFilterChange('dateRange', dates)}
                    style={{ width: '100%' }}
                  />
                </Col>
                
                <Col span={4}>
                  <Select
                    placeholder="Phim đang chiếu"
                    value={filters.movieId}
                    onChange={(value) => handleFilterChange('movieId', value)}
                    allowClear
                    style={{ width: '100%' }}
                    notFoundContent={movies.length === 0 ? "Chưa có phim nào" : "Không tìm thấy"}
                  >
                    {movies.map(movie => (
                      <Option key={movie.id} value={movie.id}>
                        {movie.title || movie.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                
                <Col span={4}>
                  <Space>
                    <Button 
                      icon={<FilterOutlined />} 
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<ReloadOutlined />} 
                      onClick={loadBookings}
                      loading={loading}
                    >
                      Làm mới
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Actions */}
            <Space style={{ marginBottom: 16 }}>
              {isAdmin && (
                <Button icon={<ExportOutlined />}>
                  Xuất Excel
                </Button>
              )}
              
              <Button 
                type="dashed" 
                onClick={() => {
                  console.log('=== CURRENT STATE DEBUG ===');
                  console.log('User:', user);
                  console.log('Is Admin:', isAdmin);
                  console.log('Bookings:', bookings.length, 'tickets loaded');
                  console.log('Pagination:', pagination);
                  console.log('Filters:', filters);
                  console.log('Auth tokens:', {
                    token: AuthService.getToken()?.substring(0, 20) + '...',
                    adminToken: AuthService.getAdminToken()?.substring(0, 20) + '...'
                  });
                  console.log('💰 PRICE DEBUG - First 3 bookings:');
                  bookings.slice(0, 3).forEach((booking, index) => {
                    console.log(`Booking ${index + 1}:`, {
                      ticketCode: booking.ticketCode,
                      totalAmount: booking.totalAmount,
                      originalData: booking._original
                    });
                  });
                }}
              >
                🐛 Debug Info
              </Button>
            </Space>
          </>
        )}
      </div>

      {/* Table - only show when authenticated */}
      {authChecked && user && (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => {
              const userType = isAdmin ? 'vé' : 'vé của bạn';
              return `${range[0]}-${range[1]} của ${total} ${userType}`;
            },
          }}
          onChange={handleTableChange}
          bordered
          locale={{
            emptyText: <Empty description={isAdmin ? "Chưa có vé nào trong hệ thống" : "Bạn chưa đặt vé nào"} />
          }}
        />
      )}

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đặt vé"
        open={detailModal}
        onCancel={() => {
          setDetailModal(false);
          setBookingDetail(null);
          setSelectedBooking(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModal(false)}>
            Đóng
          </Button>,
          <Button 
            key="print" 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={() => window.open(`/tickets/${selectedBooking?.id}/print`, '_blank')}
          >
            In vé
          </Button>
        ]}
        width={800}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : bookingDetail ? (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã vé" span={2}>
                <strong>{bookingDetail.ticketCode || bookingDetail.orderId || `#${bookingDetail.id}`}</strong>
              </Descriptions.Item>
              
              <Descriptions.Item label="Khách hàng">
                {bookingDetail.userInfo?.fullName || bookingDetail.user?.name || bookingDetail.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {bookingDetail.userInfo?.email || bookingDetail.user?.email || bookingDetail.customerEmail}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                {bookingDetail.userInfo?.phone || bookingDetail.user?.phone || bookingDetail.customerPhone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(bookingDetail.status)}>
                  {getStatusText(bookingDetail.status)}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Phim" span={2}>
                <strong>{bookingDetail.movie?.name || bookingDetail.movieTitle}</strong>
              </Descriptions.Item>
              
              <Descriptions.Item label="Rạp">
                {bookingDetail.cinema?.name || bookingDetail.cinemaName}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng">
                {bookingDetail.room?.name || bookingDetail.roomName}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày chiếu">
                {moment(bookingDetail.time?.showDate || bookingDetail.time?.date || bookingDetail.showDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ chiếu">
                {bookingDetail.time?.startTime || bookingDetail.time?.time || bookingDetail.startTime}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ghế đã chọn" span={2}>
                {bookingDetail.seats?.map(seat => (
                  <Tag key={seat.id || seat._id} color="blue">
                    {seat.name || seat.seatNumber || `${seat.row || ''}${seat.column || ''}`} - {seat.price?.toLocaleString()}đ
                  </Tag>
                )) || 'N/A'}
              </Descriptions.Item>
              
              {bookingDetail.foodItems && bookingDetail.foodItems.length > 0 && (
                <Descriptions.Item label="Đồ ăn & nước" span={2}>
                  {bookingDetail.foodItems.map((foodItem, index) => (
                    <div key={index}>
                      {foodItem.food?.name || foodItem.name} x{foodItem.quantity} = {(foodItem.price * foodItem.quantity).toLocaleString()}đ
                    </div>
                  ))}
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="Tổng tiền">
                <strong style={{ color: '#f50', fontSize: '16px' }}>
                  {(bookingDetail.total || bookingDetail.totalAmount)?.toLocaleString() || 0} đ
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {moment(bookingDetail.createdAt || bookingDetail.bookingTime).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <Empty description="Không có dữ liệu chi tiết" />
        )}
      </Modal>
    </div>
  );
};

export default BookingHistory;