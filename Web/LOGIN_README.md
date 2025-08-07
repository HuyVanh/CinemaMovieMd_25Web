# Cinema Admin - Giao Diện Đăng Nhập

Giao diện đăng nhập đơn giản và đẹp mắt cho hệ thống quản lý rạp chiếu phim.

## Tính năng

✅ **Giao diện đẹp mắt**
- Background với poster phim động
- Form đăng nhập responsive
- Animation mượt mà

✅ **Validation form**
- Kiểm tra email hợp lệ
- Kiểm tra mật khẩu tối thiểu 6 ký tự
- Thông báo lỗi rõ ràng

✅ **UI/UX tốt**
- Loading state khi đăng nhập
- Hover effects
- Mobile responsive

## Cách chạy

```bash
cd Web
npm install
npm start
```

Truy cập: http://localhost:3000

## Thông tin đăng nhập demo

```
Email: admin@cinema.com
Password: admin123
```

## Cấu trúc file

```
src/
├── Pages/
│   ├── SimpleLogin.js      # Component đăng nhập
│   └── SimpleLogin.css     # Styles cho đăng nhập
├── App.js                  # App chính
└── App.css                 # Global styles
```

## Customization

Bạn có thể tùy chỉnh:

- **Màu sắc**: Thay đổi trong file `.css` (hiện tại dùng màu cam #ff6b35)
- **Background**: Thay đổi URL hình ảnh poster trong CSS
- **Logo**: Thay đổi icon và tên brand trong component
- **Validation**: Thêm rules validation trong Form.Item

## Screenshots

### Desktop
- Form đăng nhập căn giữa với background động
- Hiệu ứng hover và animation

### Mobile
- Responsive hoàn hảo
- Touch-friendly buttons
- Optimized layout

---

🎬 Designed for Cinema Management System
