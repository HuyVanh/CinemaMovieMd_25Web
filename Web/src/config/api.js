const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.163:3000/api';

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
      const data = await response.json();
      return data;
    } catch (error) {
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

  // ============ GENRE MANAGEMENT ============
  async getGenres(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/genres${queryString ? `?${queryString}` : ''}`);
  }

  async getGenreById(id) {
    return this.request(`/genres/${id}`);
  }

  async createGenre(genreData) {
    return this.request('/genres', {
      method: 'POST',
      body: JSON.stringify(genreData),
    });
  }

  async updateGenre(id, genreData) {
    return this.request(`/genres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(genreData),
    });
  }

  async deleteGenre(id) {
    return this.request(`/genres/${id}`, {
      method: 'DELETE',
    });
  }

  // Get genres for dropdown/select
  async getGenresForSelect() {
    return this.request('/genres/select');
  }

  // Get genre statistics
  async getGenreStatistics() {
    return this.request('/genres/statistics');
  }

  // ============ ACTOR MANAGEMENT ============
  async getActors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/actors${queryString ? `?${queryString}` : ''}`);
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

  // Get actors for dropdown/select
  async getActorsForSelect() {
    return this.request('/actors/select');
  }

  async uploadActorImage(actorId, formData) {
    const url = `${this.baseURL}/actors/${actorId}/image`;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    const config = {
      method: 'PUT',
      headers: {},
      body: formData,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  // ============ DIRECTOR MANAGEMENT ============
  async getDirectors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/directors${queryString ? `?${queryString}` : ''}`);
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

  // Get directors for dropdown/select
  async getDirectorsForSelect() {
    return this.request('/directors/select');
  }

  async uploadDirectorImage(directorId, formData) {
    const url = `${this.baseURL}/directors/${directorId}/image`;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    const config = {
      method: 'PUT',
      headers: {},
      body: formData,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  // ============ MOVIE-GENRE RELATIONSHIPS ============
  async getMoviesByGenre(genreId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/genres/${genreId}/movies${queryString ? `?${queryString}` : ''}`);
  }

  async addGenreToMovie(movieId, genreId) {
    return this.request(`/movies/${movieId}/genres`, {
      method: 'POST',
      body: JSON.stringify({ genreId }),
    });
  }

  async removeGenreFromMovie(movieId, genreId) {
    return this.request(`/movies/${movieId}/genres/${genreId}`, {
      method: 'DELETE',
    });
  }

  // ============ ENHANCED MOVIE METHODS ============
  // Cập nhật method getMovies để include genres
  async getMoviesWithGenres(params = {}) {
    const queryString = new URLSearchParams({
      ...params,
      include: 'genres'
    }).toString();
    return this.request(`/movies${queryString ? `?${queryString}` : ''}`);
  }

  // ============ MOVIE-ACTOR RELATIONSHIPS ============
  async getMoviesByActor(actorId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/actors/${actorId}/movies${queryString ? `?${queryString}` : ''}`);
  }

  async addActorToMovie(movieId, actorId) {
    return this.request(`/movies/${movieId}/actors`, {
      method: 'POST',
      body: JSON.stringify({ actorId }),
    });
  }

  async removeActorFromMovie(movieId, actorId) {
    return this.request(`/movies/${movieId}/actors/${actorId}`, {
      method: 'DELETE',
    });
  }

  // ============ MOVIE-DIRECTOR RELATIONSHIPS ============
  async getMoviesByDirector(directorId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/directors/${directorId}/movies${queryString ? `?${queryString}` : ''}`);
  }

  async addDirectorToMovie(movieId, directorId) {
    return this.request(`/movies/${movieId}/directors`, {
      method: 'POST',
      body: JSON.stringify({ directorId }),
    });
  }

  async removeDirectorFromMovie(movieId, directorId) {
    return this.request(`/movies/${movieId}/directors/${directorId}`, {
      method: 'DELETE',
    });
  }
  // Thêm các methods này vào class ApiService của bạn

// ============ USER MANAGEMENT (ADMIN) ============
async getUsers(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return this.request(`/users${queryString ? `?${queryString}` : ''}`);
}

async getUserById(id) {
  return this.request(`/users/${id}`);
}

async createUser(userData) {
  return this.request('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

async updateUser(id, userData) {
  return this.request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

async deleteUser(id) {
  return this.request(`/users/${id}`, {
    method: 'DELETE',
  });
}

async getUserStats() {
  return this.request('/users/stats');
}

// Upload user avatar
async uploadUserAvatar(formData) {
  const url = `${this.baseURL}/users/upload-avatar`;
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  
  const config = {
    method: 'POST',
    headers: {},
    body: formData,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}
// Thêm các methods này vào ApiService của bạn - SỬ DỤNG TICKET API

// ============ TICKET HISTORY MANAGEMENT ============
async getTicketsByUser(userId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return this.request(`/tickets/user/${userId}${queryString ? `?${queryString}` : ''}`);
}

async getTicketById(ticketId) {
  return this.request(`/tickets/${ticketId}`);
}

async getTicketDetails(ticketId) {
  return this.request(`/tickets/${ticketId}/details`);
}

// Get all tickets (admin)
async getAllTickets(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return this.request(`/tickets${queryString ? `?${queryString}` : ''}`);
}

// Get user's own tickets
async getMyTickets() {
  return this.request('/tickets/mytickets');
}

// Cancel ticket
async cancelTicket(ticketId, reason) {
  return this.request(`/tickets/${ticketId}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
}

// Validate ticket
async validateTicket(ticketId) {
  return this.request(`/tickets/${ticketId}/validate`);
}
// Thêm các methods này vào ApiService của bạn

// ============ FOOD MANAGEMENT ============

// Get all foods (public - chỉ available ones)
async getFoods() {
  return this.request('/foods');
}

// Get all foods for admin (include unavailable ones)
async getAllFoods() {
  // Since backend getFoods only returns available ones,
  // we need a workaround or backend modification
  // For now, use the same endpoint and handle in frontend
  return this.request('/foods');
}

// Get single food by ID
async getFoodById(id) {
  return this.request(`/foods/${id}`);
}

// Create new food (admin only)
async createFood(foodData) {
  return this.request('/foods', {
    method: 'POST',
    body: JSON.stringify(foodData),
  });
}

// Update food (admin only)
async updateFood(id, foodData) {
  return this.request(`/foods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(foodData),
  });
}

// Delete food (admin only)
async deleteFood(id) {
  return this.request(`/foods/${id}`, {
    method: 'DELETE',
  });
}

// Upload food image (admin only)
async uploadFoodImage(id, formData) {
  const url = `${this.baseURL}/foods/${id}/image`;
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  
  const config = {
    method: 'PUT',
    headers: {},
    body: formData,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}

  // Add more API methods as needed
}

export default new ApiService();