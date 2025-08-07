# Cinema Admin Dashboard

Hệ thống quản lý rạp chiếu phim - Giao diện Admin

## Tính năng

### 🔐 Đăng nhập
- Giao diện đăng nhập đẹp mắt với background động
- Xác thực admin với form validation
- Tự động chuyển hướng sau khi đăng nhập thành công

### 📊 Dashboard
- Hiển thị thống kê tổng quan (người dùng, phim, vé bán, doanh thu)
- Top phim bán chạy nhất
- Các thao tác nhanh cho admin

### 👥 Quản lý người dùng
- Danh sách người dùng với thông tin chi tiết
- Tìm kiếm và lọc người dùng
- Thêm, sửa, xóa người dùng
- Thống kê người dùng

## Công nghệ sử dụng

- **React** - Framework frontend
- **Ant Design** - UI Component Library
- **React Router** - Routing
- **CSS3** - Animations & Styling

## Hướng dẫn chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Cài đặt và chạy

1. **Cài đặt dependencies**
   ```bash
   cd Web
   npm install
   ```

2. **Chạy development server**
   ```bash
   npm start
   ```

3. **Truy cập ứng dụng**
   - Mở trình duyệt và truy cập: http://localhost:3000
   - Sẽ tự động chuyển hướng đến trang đăng nhập

### Thông tin đăng nhập demo

```
Email: admin@cinema.com
Password: admin123
```

## Cấu trúc dự án

```
Web/
├── public/                 # Static files
├── src/
│   ├── Components/        # Reusable components
│   │   ├── MainLayout.js  # Layout chính với sidebar
│   │   └── PrivateRoute.js # Component bảo vệ route
│   ├── Pages/             # Các trang chính
│   │   ├── Login.js       # Trang đăng nhập
│   │   ├── Login.css      # Styles cho trang đăng nhập
│   │   ├── Dashboard.js   # Trang dashboard
│   │   └── Users.js       # Trang quản lý người dùng
│   ├── App.js             # Component gốc
│   ├── App.css            # Global styles
│   └── index.js           # Entry point
└── package.json
```

## Tính năng đặc biệt

### 🎨 Giao diện đăng nhập
- Background với các poster phim động
- Form đăng nhập với validation
- Animation mượt mà
- Responsive design

### 🔒 Bảo mật
- Private Routes để bảo vệ các trang admin
- JWT token simulation
- Auto redirect khi chưa đăng nhập

### 📱 Responsive
- Tối ưu cho các thiết bị desktop, tablet, mobile
- Sidebar collapse trên mobile
- Grid layout linh hoạt

## Mở rộng

Để mở rộng hệ thống, bạn có thể:

1. **Thêm trang mới**: Tạo component trong `/Pages` và cập nhật routing
2. **Kết nối API**: Thay thế mock data bằng API calls thực
3. **Thêm tính năng**: Quản lý phim, lịch chiếu, báo cáo, v.v.
4. **Cải thiện UI**: Thêm themes, dark mode, animations

## Screenshot

### Trang đăng nhập
- Giao diện modern với background phim
- Form validation đầy đủ
- Animation và effects

### Dashboard
- Thống kê trực quan
- Charts và graphs
- Quick actions

### Quản lý người dùng
- Table với search và filter
- Modal để thêm/sửa
- Bulk actions

---

Developed with ❤️ for Cinema Management System
