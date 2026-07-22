# Hướng dẫn cập nhật website và kết nối chức năng đăng nhập

## 1. Mục đích

Tài liệu này giúp đơn vị đang quản lý website **The Peak Garden** hoàn thành hai
việc:

1. Cập nhật giao diện mới có chức năng **Đăng ký, Đăng nhập và Đăng xuất**.
2. Kết nối website hiện tại với hệ thống backend đã được triển khai.

Website vẫn sử dụng địa chỉ quen thuộc:

**https://thepeakgarden.vn**

Không cần đổi tên miền và không cần chuyển toàn bộ website sang nơi khác.

## 2. Mô hình sau khi hoàn tất

- Khách truy cập website tại `https://thepeakgarden.vn` như hiện nay.
- Các trang, hình ảnh và nội dung vẫn do hosting hiện tại cung cấp.
- Khi khách đăng ký hoặc đăng nhập, website gọi địa chỉ có dạng
  `https://thepeakgarden.vn/api/...`.
- Hosting chuyển riêng các yêu cầu bắt đầu bằng `/api/` đến backend Go.

Nói ngắn gọn: **giao diện vẫn ở hosting cũ, chỉ chức năng tài khoản được chuyển
đến backend mới**.

## 3. Thông tin backend

Backend đã hoạt động tại:

`https://thepeakgarden-api-ghvw23jquq-as.a.run.app`

Backend chỉ cung cấp chức năng API và không cung cấp giao diện website.

Các địa chỉ API đang sử dụng:

- `POST /api/auth/signup`: đăng ký tài khoản
- `POST /api/auth/login`: đăng nhập
- `GET /api/auth/me`: kiểm tra trạng thái đăng nhập
- `POST /api/auth/logout`: đăng xuất

## 4. Việc khách hàng cần thực hiện

### Bước 1: Sao lưu website hiện tại

Trước khi thay tệp, hãy tải về và lưu một bản sao của website hiện tại. Ít nhất
cần sao lưu ba tệp sắp được cập nhật:

- `index.html`
- `assets/styles/main.css`
- `assets/script/auth.js` nếu tệp này đã tồn tại

Việc sao lưu giúp khôi phục nhanh nếu tải nhầm tệp hoặc nhầm thư mục.

### Bước 2: Cập nhật ba tệp giao diện

Từ gói mã nguồn được bàn giao, tải đúng ba tệp sau lên thư mục đang thực sự phục
vụ tên miền `thepeakgarden.vn`:

| Tệp trong gói bàn giao | Vị trí trên hosting |
| --- | --- |
| `index.html` | `index.html` |
| `assets/styles/main.css` | `assets/styles/main.css` |
| `assets/script/auth.js` | `assets/script/auth.js` |

Khi hệ thống hỏi có ghi đè tệp cũ hay không, chọn ghi đè sau khi đã sao lưu.
Không cần tải thư mục backend, tệp Go hoặc Dockerfile lên hosting website.

Nếu website trên hosting đã được chỉnh sửa riêng và không giống mã nguồn bàn
giao, không nên ghi đè ngay `index.html` và `main.css`. Hãy nhờ người quản trị
website gộp phần đăng nhập từ bản mới vào bản đang chạy để tránh mất nội dung
đã chỉnh sửa trước đây. Tệp `auth.js` có thể được thêm mới nguyên vẹn.

### Bước 3: Nhờ đơn vị hosting kết nối đường dẫn `/api/`

Đây là bước bắt buộc. Người có quyền quản trị máy chủ hoặc đơn vị cung cấp
hosting cần cấu hình:

`https://thepeakgarden.vn/api/`

chuyển tiếp đến:

`https://thepeakgarden-api-ghvw23jquq-as.a.run.app/api/`

Việc này thường được gọi là **reverse proxy**. Không phải thay đổi DNS và cũng
không tạo tên miền phụ.

Khách hàng có thể sao chép nguyên văn nội dung dưới đây gửi cho đơn vị hosting:

> Chào anh/chị, vui lòng cấu hình reverse proxy trên website
> `https://thepeakgarden.vn` như sau: mọi yêu cầu có đường dẫn bắt đầu bằng
> `/api/` được chuyển tiếp đến
> `https://thepeakgarden-api-ghvw23jquq-as.a.run.app/api/`. Vui lòng giữ nguyên
> phần đường dẫn và phương thức GET/POST, hỗ trợ cookie, không cache phản hồi
> `/api/`, và không chuyển các đường dẫn khác của website. Sau khi cấu hình, truy
> cập `https://thepeakgarden.vn/api/auth/me` phải nhận phản hồi JSON với mã 401
> khi chưa đăng nhập, không phải trang HTML 404 của Apache.

Lưu ý: cấu hình chuyển tiếp thường không thực hiện được chỉ bằng File Manager.
Nếu khách hàng không có quyền cấu hình máy chủ, đơn vị hosting cần hỗ trợ bước
này.

## 5. Thông tin kỹ thuật dành cho đơn vị hosting

Phần này dành cho kỹ thuật viên. Khách hàng thông thường không cần tự thực hiện.

### Ví dụ Apache

Thêm vào cấu hình VirtualHost HTTPS của `thepeakgarden.vn`:

```apache
SSLProxyEngine On
ProxyPass        /api/ https://thepeakgarden-api-ghvw23jquq-as.a.run.app/api/
ProxyPassReverse /api/ https://thepeakgarden-api-ghvw23jquq-as.a.run.app/api/
```

Máy chủ cần bật các mô-đun `proxy`, `proxy_http` và `ssl`. Sau khi thay đổi, kiểm
tra cấu hình rồi tải lại Apache. Không đặt quy tắc này sau một quy tắc bắt toàn bộ
đường dẫn về `index.html`.

### Ví dụ Nginx

Thêm vào khối `server` HTTPS của `thepeakgarden.vn`:

```nginx
location /api/ {
    proxy_pass https://thepeakgarden-api-ghvw23jquq-as.a.run.app;
    proxy_ssl_server_name on;
    proxy_set_header Host thepeakgarden-api-ghvw23jquq-as.a.run.app;
    proxy_set_header X-Forwarded-Proto https;
    proxy_no_cache 1;
    proxy_cache_bypass 1;
}
```

Sau khi thay đổi, kiểm tra cấu hình rồi tải lại Nginx.

## 6. Cách kiểm tra sau khi cập nhật

### Kiểm tra kết nối backend

Mở địa chỉ sau bằng trình duyệt:

`https://thepeakgarden.vn/api/auth/me`

Khi chưa đăng nhập, kết quả đúng là một dòng tương tự:

```json
{"error":"not authenticated"}
```

Trình duyệt có thể hiển thị trang trắng kèm dòng trên. Đây là kết quả bình
thường. Mã phản hồi kỹ thuật là `401`.

Các kết quả chưa đúng:

- Trang “404 Not Found” của Apache: hosting chưa cấu hình `/api/`.
- Trang chủ website xuất hiện: quy tắc `/api/` đang bị chuyển về `index.html`.
- Lỗi 502/503: hosting chưa kết nối được tới backend.

### Kiểm tra giao diện

1. Mở `https://thepeakgarden.vn` trong cửa sổ ẩn danh.
2. Kiểm tra nút **Đăng nhập** trên máy tính và điện thoại.
3. Bấm **Đăng ký**, nhập email và mật khẩu từ 12 ký tự.
4. Tải lại trang và xác nhận tài khoản vẫn ở trạng thái đăng nhập.
5. Bấm **Đăng xuất**, sau đó thử đăng nhập lại.

Nếu chưa thấy giao diện mới, nhấn `Ctrl + F5` trên Windows hoặc
`Command + Shift + R` trên macOS để tải lại không dùng bộ nhớ đệm. Nếu website
có CDN hoặc hệ thống cache, đơn vị hosting cần xóa cache sau khi cập nhật.

## 7. Danh sách xác nhận bàn giao

- [ ] Đã sao lưu website hiện tại.
- [ ] Đã cập nhật hoặc gộp `index.html`.
- [ ] Đã cập nhật hoặc gộp `assets/styles/main.css`.
- [ ] Đã tải lên `assets/script/auth.js`.
- [ ] Đơn vị hosting đã chuyển tiếp `/api/` đến backend.
- [ ] `/api/auth/me` trả về JSON, không trả về trang HTML 404.
- [ ] Đã xóa cache website/CDN.
- [ ] Đăng ký, đăng nhập, tải lại trang và đăng xuất đều hoạt động.

## 8. Những việc không cần làm

- Không đổi DNS của `thepeakgarden.vn`.
- Không chuyển toàn bộ website sang Cloud Run.
- Không tạo `api.thepeakgarden.vn`.
- Không tải mã nguồn Go hoặc tệp cấu hình backend lên hosting frontend.
- Không đưa khóa dịch vụ hoặc mật khẩu quản trị vào thư mục website.

