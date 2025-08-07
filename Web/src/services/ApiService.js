// src/services/ApiService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.101:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`API Error: ${error.message}`);
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(otpData) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  async resendOTP(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetData) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }

  // Admin specific methods (if needed)
  async getUsers() {
    return this.request('/admin/users');
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Director methods
  async getDirectors() {
    return this.request('/directors');
  }

  async getDirectorById(id) {
    return this.request(`/directors/${id}`);
  }

  async createDirector(directorData) {
    return this.request('/directors', {
      method: 'POST',
      body: JSON.stringify(directorData),
    });
  }

  async updateDirector(id, directorData) {
    return this.request(`/directors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(directorData),
    });
  }

  async deleteDirector(id) {
    return this.request(`/directors/${id}`, {
      method: 'DELETE',
    });
  }

  // Movie methods
  async getMovies() {
    return this.request('/movies');
  }

  async getMovieById(id) {
    return this.request(`/movies/${id}`);
  }

  async createMovie(movieData) {
    return this.request('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  }

  async updateMovie(id, movieData) {
    return this.request(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    });
  }

  async deleteMovie(id) {
    return this.request(`/movies/${id}`, {
      method: 'DELETE',
    });
  }

// Actor methods
async getActors() {
  return this.request('/actors');
}

async getActorById(id) {
  return this.request(`/actors/${id}`);
}

async createActor(actorData) {
  return this.request('/actors', {
    method: 'POST',
    body: JSON.stringify(actorData),
  });
}

async updateActor(id, actorData) {
  return this.request(`/actors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(actorData),
  });
}

async deleteActor(id) {
  return this.request(`/actors/${id}`, {
    method: 'DELETE',
  });
}

async uploadActorImage(id, imageData) {
  return this.request(`/actors/${id}/image`, {
    method: 'PUT',
    body: JSON.stringify(imageData),
  });
}
// Thêm các phương thức sau vào class ApiService

// Food methods
async getFoods() {
  return this.request('/foods');
}

async getFoodById(id) {
  return this.request(`/foods/${id}`);
}

async createFood(foodData) {
  return this.request('/foods', {
    method: 'POST',
    body: JSON.stringify(foodData),
  });
}

async updateFood(id, foodData) {
  return this.request(`/foods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(foodData),
  });
}

async deleteFood(id) {
  return this.request(`/foods/${id}`, {
    method: 'DELETE',
  });
}

async uploadFoodImage(id, imageData) {
  return this.request(`/foods/${id}/image`, {
    method: 'PUT',
    body: JSON.stringify(imageData),
  });
}
// Thêm các phương thức sau vào class ApiService

// Cinema methods
async getCinemas() {
  return this.request('/cinemas');
}

async getCinemaById(id) {
  return this.request(`/cinemas/${id}`);
}

async createCinema(cinemaData) {
  return this.request('/cinemas', {
    method: 'POST',
    body: JSON.stringify(cinemaData),
  });
}

async updateCinema(id, cinemaData) {
  return this.request(`/cinemas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cinemaData),
  });
}

async deleteCinema(id) {
  return this.request(`/cinemas/${id}`, {
    method: 'DELETE',
  });
}
// Thêm các phương thức sau vào class ApiService

// Discount methods
async getDiscounts() {
  return this.request('/discounts');
}

async getDiscountById(id) {
  return this.request(`/discounts/${id}`);
}

async verifyDiscount(code) {
  return this.request(`/discounts/verify/${code}`);
}

async createDiscount(discountData) {
  return this.request('/discounts', {
    method: 'POST',
    body: JSON.stringify(discountData),
  });
}

async updateDiscount(id, discountData) {
  return this.request(`/discounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(discountData),
  });
}

async deleteDiscount(id) {
  return this.request(`/discounts/${id}`, {
    method: 'DELETE',
  });
}
// Thêm các phương thức sau vào class ApiService

// Room methods
async getRooms(cinemaId = null) {
  let endpoint = '/rooms';
  if (cinemaId) {
    endpoint = `/rooms/cinema/${cinemaId}`;
  }
  return this.request(endpoint);
}

async getRoomById(id) {
  return this.request(`/rooms/${id}`);
}

// Các phương thức sau đây không cần thiết cho giai đoạn hiện tại, nhưng có thể 
// hữu ích khi bạn muốn thêm chức năng thêm/sửa/xóa trong tương lai
async createRoom(roomData) {
  return this.request('/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  });
}

async updateRoom(id, roomData) {
  return this.request(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  });
}

async deleteRoom(id) {
  return this.request(`/rooms/${id}`, {
    method: 'DELETE',
  });
}
// Thêm các phương thức seat vào ApiService

// Seat methods
// Thêm các phương thức seat vào ApiService.js
// Sao chép và thêm đoạn mã này vào class ApiService, trước dòng export default

// Seat methods
async getSeats() {
  return this.request('/seats');
}

async getSeatById(id) {
  return this.request(`/seats/${id}`);
}

async getSeatsByRoom(roomId) {
  return this.request(`/seats/room/${roomId}`);
}

async createSeat(seatData) {
  return this.request('/seats', {
    method: 'POST',
    body: JSON.stringify(seatData),
  });
}

async createBulkSeats(seatsData) {
  return this.request('/seats/bulk', {
    method: 'POST',
    body: JSON.stringify({ seats: seatsData }),
  });
}

async autoGenerateSeats(roomId, configData) {
  return this.request(`/seats/auto-generate/${roomId}`, {
    method: 'POST',
    body: JSON.stringify(configData),
  });
}

async updateSeat(id, seatData) {
  return this.request(`/seats/${id}`, {
    method: 'PUT',
    body: JSON.stringify(seatData),
  });
}

async deleteSeat(id) {
  return this.request(`/seats/${id}`, {
    method: 'DELETE',
  });
}

async deleteAllSeatsInRoom(roomId) {
  return this.request(`/seats/room/${roomId}`, {
    method: 'DELETE',
  });
}

  // Utility methods
  getBaseURL() {
    return this.baseURL;
  }

  setBaseURL(url) {
    this.baseURL = url;
  }
}

export default new ApiService();