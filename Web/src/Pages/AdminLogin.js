// src/components/AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import AuthService from '../services/authService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Check if admin is already logged in
  useEffect(() => {
    if (AuthService.isAdminAuthenticated()) {
      setMessage({ type: 'success', text: 'Bạn đã đăng nhập rồi!' });
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ email và mật khẩu' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Sử dụng AuthService để login
      const result = await AuthService.adminLogin(loginData);
      
      setMessage({ type: 'success', text: result.message });
      
      // Log thông tin admin đã đăng nhập
      console.log('Admin logged in:', result.user);
      console.log('Token saved:', result.token);
      console.log('Is admin authenticated:', AuthService.isAdminAuthenticated());
      
      // Redirect to admin dashboard
      setTimeout(() => {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin/dashboard');
      }, 1500);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleTestLogin = () => {
    setLoginData({
      email: 'admin@company.com',
      password: 'admin123456'
    });
    setMessage({ type: 'info', text: 'Đã điền thông tin test admin' });
  };

  // Handle logout (for testing)
  const handleLogout = () => {
    AuthService.logout();
    setMessage({ type: 'success', text: 'Đã đăng xuất!' });
    setLoginData({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-300 text-sm">Đăng nhập vào hệ thống quản trị</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
              : message.type === 'info'
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              : 'bg-red-500/10 text-red-300 border border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email admin"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 h-5 w-5 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang đăng nhập...
              </div>
            ) : (
              'Đăng nhập Admin'
            )}
          </button>

          {/* Test Login Button */}
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Điền thông tin test
          </button>

          {/* Logout Button (for testing) */}
          {AuthService.isAdminAuthenticated() && (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600/20 border border-red-500/30 text-red-300 py-3 rounded-xl font-medium hover:bg-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            >
              Đăng xuất
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            © 2025 Admin System. Chỉ dành cho quản trị viên.
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white font-medium">Đang xử lý...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;