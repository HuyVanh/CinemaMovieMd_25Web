import React, { useState, useEffect } from "react";
import { Table, Button, Input, message, Space, Tag } from "antd";
import { Link } from 'react-router-dom';
import { EditOutlined, EyeOutlined, SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import ApiService from '../services/ApiService';
import avatar2 from '../Assets/avatar2.png';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Fetch movies from API
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await ApiService.request('/movies');
      
      if (response.success) {
        console.log('Movies data:', response.data); // Debug log
        setMovies(response.data);
        setFilteredMovies(response.data);
        message.success(`Đã tải ${response.data.length} phim`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách phim');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback với data mẫu nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'Avatar 2: The Way of Water',
          duration: '02:30:00',
          durationFormatted: '2:30h',
          subtitle: 'Vietnamese',
          censorship: 'T13',
          ageLimit: '13+',
          rate: 4.5,
          rating: 4.5,
          release_date: '2024-09-13',
          releaseData: '2024-09-13',
          image: avatar2,
          trailer: 'https://youtube.com/watch?v=example',
          director: [{ _id: '1', name: 'James Cameron' }],
          genre: [{ _id: '1', name: 'Action' }, { _id: '2', name: 'Sci-Fi' }],
          actor: [{ _id: '1', name: 'Sam Worthington' }, { _id: '2', name: 'Zoe Saldana' }],
          spoken_language: 'English'
        }
      ];
      setMovies(fallbackData);
      setFilteredMovies(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => {
        const movieName = movie.name || '';
        
        // Safe access to genre names
        const movieGenres = Array.isArray(movie.genre) ? 
          movie.genre.map(g => typeof g === 'object' ? g.name : g).join(' ') : '';
        
        // Safe access to director names  
        const movieDirectors = Array.isArray(movie.director) ?
          movie.director.map(d => typeof d === 'object' ? d.name : d).join(' ') : '';
          
        const searchFields = `${movieName} ${movieGenres} ${movieDirectors}`.toLowerCase();
        return searchFields.includes(value.toLowerCase());
      });
      setFilteredMovies(filtered);
    }
  };

  // Safe render helpers
  const renderGenres = (genres) => {
    if (!Array.isArray(genres)) return 'N/A';
    
    return genres.map((genre, index) => {
      const genreName = typeof genre === 'object' ? genre.name : genre;
      return (
        <Tag key={index} size="small" color="blue">
          {genreName || 'Unknown'}
        </Tag>
      );
    });
  };

  const renderDirectors = (directors) => {
    if (!Array.isArray(directors) || directors.length === 0) return 'N/A';
    
    return directors.map((director, index) => {
      const directorName = typeof director === 'object' ? director.name : director;
      return (
        <div key={index} style={{ fontSize: '12px', color: '#666' }}>
          {directorName || 'Unknown'}
        </div>
      );
    });
  };

  const renderActors = (actors) => {
    if (!Array.isArray(actors) || actors.length === 0) return 'N/A';
    
    const actorNames = actors.map(actor => 
      typeof actor === 'object' ? actor.name : actor
    ).filter(Boolean);
    
    return actorNames.slice(0, 3).join(', ') + 
           (actorNames.length > 3 ? ` (+${actorNames.length - 3})` : '');
  };

  // Load data on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Table columns configuration
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (src, record) => {
        const imageSrc = src || '/assets/default-movie.png';
        return (
          <img 
            src={imageSrc} 
            alt={record.name} 
            style={{ 
              width: 60, 
              height: 80, 
              objectFit: 'cover',
              borderRadius: 4
            }}
            onError={(e) => {
              e.target.src = '/assets/default-movie.png';
            }}
          />
        );
      },
    },
    {
      title: 'Tên phim',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {name || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
      width: 150,
      render: (genres) => renderGenres(genres),
    },
    {
      title: 'Đạo diễn',
      dataIndex: 'director',
      key: 'director',
      width: 120,
      render: (directors) => renderDirectors(directors),
    },
    {
      title: 'Diễn viên',
      dataIndex: 'actor',
      key: 'actor',
      width: 150,
      render: (actors) => (
        <div style={{ fontSize: '12px' }}>
          {renderActors(actors)}
        </div>
      ),
    },
    {
      title: 'Thời lượng',
      key: 'duration',
      width: 100,
      render: (_, record) => {
        const duration = record.duration || record.durationFormatted;
        if (!duration) return 'N/A';
        if (duration.includes(':')) {
          return duration.substring(0, 5); // "02:30" 
        }
        return duration;
      },
    },
    {
      title: 'Phụ đề',
      dataIndex: 'subtitle',
      key: 'subtitle',
      width: 100,
      render: (subtitle) => subtitle || 'Không có',
    },
    {
      title: 'Phân loại',
      key: 'censorship',
      width: 80,
      render: (_, record) => {
        const censorship = record.censorship || record.ageLimit;
        const colorMap = {
          'P': 'green',
          'K': 'blue', 
          'T13': 'orange',
          'T16': 'red',
          'T18': 'volcano',
          'C': 'purple',
          '13+': 'orange',
          '16+': 'red',
          '18+': 'volcano'
        };
        return (
          <Tag color={colorMap[censorship] || 'default'}>
            {censorship || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'Đánh giá',
      key: 'rate',
      width: 100,
      render: (_, record) => {
        const rate = record.rate || record.rating;
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ⭐ {rate ? rate.toFixed(1) : '0.0'}
          </div>
        );
      },
    },
    {
      title: 'Ngày phát hành',
      key: 'release_date',
      width: 120,
      render: (_, record) => {
        const date = record.release_date || record.releaseData;
        if (date) {
          return new Date(date).toLocaleDateString('vi-VN');
        }
        return 'N/A';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              if (record.trailer) {
                window.open(record.trailer, '_blank');
              } else {
                message.info('Không có trailer');
              }
            }}
          >
            Trailer
          </Button>
          
          <Link to={`/admin/movie/edit/${record._id}`}>
            <Button 
              type="default" 
              size="small"
              icon={<EditOutlined />}
            >
              Sửa
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <h2 style={{ margin: 0 }}>Danh sách Phim</h2>
        <Space>
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={fetchMovies} 
            loading={loading}
          >
            Làm mới
          </Button>
          <Link to="/admin/addmovie">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm phim mới
            </Button>
          </Link>
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search 
          placeholder="Tìm kiếm theo tên phim, thể loại hoặc đạo diễn..." 
          allowClear 
          style={{ maxWidth: 400 }} 
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <span style={{ marginLeft: 16, color: '#666' }}>
          Hiển thị {filteredMovies.length} / {movies.length} phim
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredMovies}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} phim`,
        }}
        scroll={{ x: 1400 }}
      />
    </div>
  );
};

export default MovieList;