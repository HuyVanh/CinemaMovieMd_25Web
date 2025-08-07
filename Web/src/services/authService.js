// src/services/authService.js
import ApiService from './ApiService';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'token';
    this.USER_KEY = 'user';
    this.ADMIN_TOKEN_KEY = 'adminToken';
    this.ADMIN_USER_KEY = 'adminUser';
  }

  // ==================== LOGIN METHODS ====================
  
  /**
   * Admin login
   */
  async adminLogin(credentials) {
    try {
      const response = await ApiService.login(credentials);
      
      if (response.success) {
        // Kiểm tra role admin
        if (response.data.role !== 'admin') {
          throw new Error('Bạn không có quyền truy cập vào trang admin');
        }
        
        // Lưu token và user info
        this.setToken(response.token);
        this.setUser(response.data);
        this.setAdminToken(response.token);
        this.setAdminUser(response.data);
        
        return {
          success: true,
          user: response.data,
          token: response.token,
          message: 'Đăng nhập admin thành công'
        };
      } else {
        throw new Error(response.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối server');
    }
  }

  /**
   * User login (nếu cần)
   */
  async userLogin(credentials) {
    try {
      const response = await ApiService.login(credentials);
      
      if (response.success) {
        // Lưu token và user info
        this.setToken(response.token);
        this.setUser(response.data);
        
        return {
          success: true,
          user: response.data,
          token: response.token,
          message: 'Đăng nhập thành công'
        };
      } else {
        throw new Error(response.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối server');
    }
  }

  // ==================== REGISTER METHODS ====================
  
  /**
   * User register
   */
  async register(userData) {
    try {
      const response = await ApiService.register(userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Lỗi đăng ký');
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(otpData) {
    try {
      const response = await ApiService.verifyEmail(otpData);
      
      if (response.success) {
        // Lưu token sau khi verify
        this.setToken(response.token);
        this.setUser(response.data);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Lỗi xác thực OTP');
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(email) {
    try {
      return await ApiService.resendOTP(email);
    } catch (error) {
      throw new Error(error.message || 'Lỗi gửi lại OTP');
    }
  }

  // ==================== TOKEN MANAGEMENT ====================
  
  /**
   * Set token to localStorage
   */
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get token from localStorage
   */
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set admin token
   */
  setAdminToken(token) {
    localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
  }

  /**
   * Get admin token
   */
  getAdminToken() {
    return localStorage.getItem(this.ADMIN_TOKEN_KEY);
  }

  /**
   * Remove token
   */
  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
  }

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Set user info to localStorage
   */
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user info from localStorage
   */
  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Set admin user info
   */
  setAdminUser(user) {
    localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(user));
  }

  /**
   * Get admin user info
   */
  getAdminUser() {
    const user = localStorage.getItem(this.ADMIN_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Remove user info
   */
  removeUser() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ADMIN_USER_KEY);
  }

  // ==================== AUTH CHECKING ====================
  
  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  /**
   * Check if admin is logged in
   */
  isAdminAuthenticated() {
    return this.isAuthenticated() && this.isAdmin();
  }

  /**
   * Get current user profile from API
   */
  async getCurrentUser() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Chưa đăng nhập');
      }
      
      const response = await ApiService.getMe();
      
      if (response.success) {
        // Cập nhật user info trong localStorage
        this.setUser(response.data);
        if (response.data.role === 'admin') {
          this.setAdminUser(response.data);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Lỗi lấy thông tin user');
      }
    } catch (error) {
      // Token có thể đã hết hạn
      this.logout();
      throw new Error(error.message || 'Token hết hạn, vui lòng đăng nhập lại');
    }
  }

  // ==================== LOGOUT ====================
  
  /**
   * Logout - clear all stored data
   */
  logout() {
    this.removeToken();
    this.removeUser();
    
    // Optional: Call logout API
    // ApiService.logout();
    
    // Redirect to login (optional)
    // window.location.href = '/login';
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Get user role
   */
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }

  /**
   * Get user name
   */
  getUserName() {
    const user = this.getUser();
    return user ? user.name : null;
  }

  /**
   * Get user email
   */
  getUserEmail() {
    const user = this.getUser();
    return user ? user.email : null;
  }

  /**
   * Check token expiry (if JWT payload is accessible)
   */
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      // Decode JWT payload (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Auto refresh user data periodically
   */
  startAutoRefresh(intervalMinutes = 30) {
    setInterval(async () => {
      if (this.isAuthenticated() && !this.isTokenExpired()) {
        try {
          await this.getCurrentUser();
          console.log('User data refreshed');
        } catch (error) {
          console.error('Auto refresh failed:', error);
        }
      }
    }, intervalMinutes * 60 * 1000);
  }
}

// Export singleton instance
export default new AuthService();