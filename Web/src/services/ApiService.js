// src/services/ApiService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.163:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ============ UTILITY METHODS ============
  getBaseURL() {
    return this.baseURL;
  }

  setBaseURL(url) {
    this.baseURL = url;
  }

  // Generic request method with improved error handling
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`API Error: ${error.message}`);
    }
  }

  // Generic file upload method
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  // ============ AUTHENTICATION ============
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

  // ============ USER MANAGEMENT ============
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

  async uploadUserAvatar(formData) {
    return this.uploadFile('/users/upload-avatar', formData);
  }

  // ============ MOVIE MANAGEMENT ============
  async getMovies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/movies${queryString ? `?${queryString}` : ''}`);
  }

  async getMoviesWithGenres(params = {}) {
    const queryString = new URLSearchParams({
      ...params,
      include: 'genres'
    }).toString();
    return this.request(`/movies${queryString ? `?${queryString}` : ''}`);
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

  async getGenresForSelect() {
    return this.request('/genres/select');
  }

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

  async getActorsForSelect() {
    return this.request('/actors/select');
  }

  async uploadActorImage(actorId, formData) {
    return this.uploadFile(`/actors/${actorId}/image`, formData);
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

  async getDirectorsForSelect() {
    return this.request('/directors/select');
  }

  async uploadDirectorImage(directorId, formData) {
    return this.uploadFile(`/directors/${directorId}/image`, formData);
  }

  // ============ CINEMA MANAGEMENT ============
  async getCinemas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/cinemas${queryString ? `?${queryString}` : ''}`);
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

  async toggleCinemaStatus(id) {
    return this.request(`/cinemas/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  // ============ ROOM MANAGEMENT ============
  async getRooms(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/rooms${queryString ? `?${queryString}` : ''}`);
  }

  async getRoomById(id) {
    return this.request(`/rooms/${id}`);
  }

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

  // ============ SEAT MANAGEMENT ============
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

  // ============ SHOWTIME MANAGEMENT ============
  async getShowtimes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/showtimes${queryString ? `?${queryString}` : ''}`);
  }

  async getShowtimeById(id) {
    return this.request(`/showtimes/${id}`);
  }

  async createShowtime(showtimeData) {
    return this.request('/showtimes', {
      method: 'POST',
      body: JSON.stringify(showtimeData),
    });
  }

  async updateShowtime(id, showtimeData) {
    return this.request(`/showtimes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(showtimeData),
    });
  }

  async deleteShowtime(id) {
    return this.request(`/showtimes/${id}`, {
      method: 'DELETE',
    });
  }

  async getShowtimesByMovie(movieId) {
    return this.request(`/showtimes/movie/${movieId}`);
  }

  async getShowtimesByRoom(roomId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/showtimes/room/${roomId}${queryString ? `?${queryString}` : ''}`);
  }

  async getShowtimesByDate(date) {
    return this.request(`/showtimes/date/${date}`);
  }

  async generateShowtimes(generateData) {
    return this.request('/showtimes/generate', {
      method: 'POST',
      body: JSON.stringify(generateData),
    });
  }

  async deleteShowtimesByDateRange(deleteData) {
    return this.request('/showtimes/bulk', {
      method: 'DELETE',
      body: JSON.stringify(deleteData),
    });
  }

  // ============ FOOD MANAGEMENT ============
  async getFoods() {
    return this.request('/foods');
  }

  async getAllFoods() {
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

  async uploadFoodImage(id, formData) {
    return this.uploadFile(`/foods/${id}/image`, formData);
  }

  // ============ DISCOUNT MANAGEMENT ============
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

  // ============ TICKET MANAGEMENT ============
  async getTickets(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tickets${queryString ? `?${queryString}` : ''}`);
  }

  // ✅ NEW: Temporary public route for testing
  async getAllTicketsPublic(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tickets/test-all${queryString ? `?${queryString}` : ''}`);
  }

  async getTicketById(id) {
    return this.request(`/tickets/${id}`);
  }

  async getTicketByOrderId(orderId) {
    return this.request(`/tickets/order/${orderId}`);
  }

  async getMyTickets() {
    return this.request('/tickets/mytickets');
  }

  async getTicketsByEmail(email) {
    return this.request(`/tickets/email/${email}`);
  }

  async getTicketsByUser(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tickets/user/${userId}${queryString ? `?${queryString}` : ''}`);
  }

  async createTicket(ticketData) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(id, ticketData) {
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  }

  async deleteTicket(id) {
    return this.request(`/tickets/${id}`, {
      method: 'DELETE',
    });
  }

  async updatePaymentStatus(id, statusData) {
    return this.request(`/tickets/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async cancelTicket(ticketId, reason) {
    return this.request(`/tickets/${ticketId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async validateTicket(ticketId) {
    return this.request(`/tickets/${ticketId}/validate`);
  }

  // Legacy methods for compatibility
  async getAllTickets(params = {}) {
    return this.getTickets(params);
  }

  async getTicketDetails(ticketId) {
    return this.getTicketById(ticketId);
  }

  // ============ RELATIONSHIP METHODS ============
  // Movie-Genre relationships
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

  // Movie-Actor relationships
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

  // Movie-Director relationships
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
}

export default new ApiService();