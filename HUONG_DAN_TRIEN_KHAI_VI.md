# Hướng dẫn triển khai tính năng Đăng ký / Đăng nhập

Tài liệu này dành cho đơn vị tiếp nhận và vận hành website The Peak Garden. Các bước được viết theo hướng dễ thực hiện, kể cả khi người triển khai không chuyên sâu về lập trình.

## 1. Hệ thống mới gồm những gì?

Website hiện có hai phần:

1. **Frontend**: giao diện mà khách hàng nhìn thấy, gồm nút Đăng nhập, cửa sổ Đăng ký/Đăng nhập và trạng thái tài khoản.
2. **Backend Go**: tiếp nhận yêu cầu đăng ký, đăng nhập, đăng xuất và kiểm tra phiên đăng nhập.
3. **PostgreSQL**: lưu tài khoản và phiên đăng nhập.

Luồng hoạt động:

```text
Khách truy cập website
        |
        v
https://ten-mien-cua-ban.vn
        |
        +-- Nội dung website --------> Frontend hiện tại
        |
        +-- /api/auth/... -----------> Backend Go ----------> PostgreSQL
```

Backend không lưu mật khẩu gốc. Mật khẩu được băm bằng bcrypt trước khi ghi vào cơ sở dữ liệu. Phiên đăng nhập được lưu bằng cookie `HttpOnly`, vì vậy mã JavaScript trên trình duyệt không thể đọc token đăng nhập.

## 2. Cấu hình triển khai được khuyến nghị

Frontend đã hoạt động trên tên miền hiện tại. Hãy giữ nguyên tên miền đó và cấu hình máy chủ frontend chuyển tiếp tất cả địa chỉ bắt đầu bằng `/api/` đến backend Go.

Ví dụ:

- Website: `https://thepeakgarden.vn`
- API mà trình duyệt gọi: `https://thepeakgarden.vn/api/auth/login`
- Backend chạy nội bộ: `http://127.0.0.1:8080`

Đây được gọi là **reverse proxy**. Người dùng vẫn nhìn thấy một tên miền duy nhất.

> Không nên để frontend gọi trực tiếp một tên miền khác như `https://api.example.vn` nếu chưa thay đổi mã nguồn. Phiên bản hiện tại được thiết kế để frontend và API có cùng tên miền nhằm bảo vệ cookie và tránh lỗi CORS.

## 3. Những thứ cần chuẩn bị

Đơn vị hosting cần cung cấp:

- Một máy chủ Linux có thể chạy ứng dụng Go liên tục. Ubuntu LTS là lựa chọn phổ biến.
- Quyền quản trị máy chủ (`sudo`).
- PostgreSQL.
- Tên miền website đang hoạt động.
- HTTPS hợp lệ cho tên miền.
- Khả năng cấu hình Nginx hoặc reverse proxy tương đương.
- File mã nguồn được bàn giao.

Nên chuẩn bị thêm:

- Email/người chịu trách nhiệm quản trị máy chủ.
- Mật khẩu PostgreSQL mạnh và không dùng lại ở dịch vụ khác.
- Phương án sao lưu cơ sở dữ liệu hàng ngày.

## 4. Các file cần đưa lên máy chủ

Sao chép toàn bộ mã nguồn được bàn giao vào một thư mục, ví dụ:

```text
/opt/thepeakgarden/
```

Các file backend quan trọng:

```text
cmd/server/main.go
internal/auth/
go.mod
go.sum
```

Các file frontend mới cần cập nhật lên hosting frontend:

```text
index.html
assets/script/auth.js
assets/styles/main.css
```

Nếu hosting frontend đang giữ một bản sao khác của website, hãy cập nhật đúng ba file trên vào thư mục website thực tế. Nếu không cập nhật, người dùng sẽ không thấy nút và cửa sổ đăng nhập mới.

## 5. Cài đặt phần mềm trên máy chủ

Ví dụ với Ubuntu:

```sh
sudo apt update
sudo apt install -y postgresql postgresql-contrib nginx
```

Cài Go phiên bản 1.24 trở lên theo phương thức mà đơn vị hosting đang sử dụng. Kiểm tra bằng:

```sh
go version
```

Kết quả phải hiển thị Go 1.24 hoặc mới hơn.

Nếu đội hosting nhận file backend đã được biên dịch sẵn cho Linux thì máy chủ không cần cài Go. Trong trường hợp đó, có thể bỏ qua bước biên dịch ở phần 8.

## 6. Tạo cơ sở dữ liệu PostgreSQL

Mở giao diện PostgreSQL:

```sh
sudo -u postgres psql
```

Chạy lần lượt các lệnh sau. Hãy thay `MAT_KHAU_RAT_MANH` bằng mật khẩu riêng, đủ dài và khó đoán:

```sql
CREATE USER thepeakgarden WITH PASSWORD 'MAT_KHAU_RAT_MANH';
CREATE DATABASE thepeakgarden OWNER thepeakgarden;
\q
```

Lưu ý:

- Không sử dụng nguyên văn `MAT_KHAU_RAT_MANH`.
- Không gửi mật khẩu qua nhóm chat công khai.
- Không ghi mật khẩu vào Git.
- Nên lưu mật khẩu trong trình quản lý mật khẩu của công ty.

Kiểm tra kết nối:

```sh
psql 'postgres://thepeakgarden:MAT_KHAU_RAT_MANH@127.0.0.1:5432/thepeakgarden?sslmode=disable'
```

Nếu xuất hiện dấu nhắc của PostgreSQL, kết nối đã thành công. Gõ `\q` để thoát.

## 7. Tạo file cấu hình bảo mật

Tạo thư mục lưu cấu hình:

```sh
sudo mkdir -p /etc/thepeakgarden
```

Tạo file:

```sh
sudo nano /etc/thepeakgarden/backend.env
```

Điền nội dung sau và thay thông tin thực tế:

```ini
DATABASE_URL=postgres://thepeakgarden:MAT_KHAU_RAT_MANH@127.0.0.1:5432/thepeakgarden?sslmode=disable
ADDRESS=127.0.0.1:8080
STATIC_DIR=/opt/thepeakgarden
COOKIE_SECURE=true
ALLOWED_ORIGIN=https://thepeakgarden.vn
```

Giải thích:

- `DATABASE_URL`: địa chỉ kết nối PostgreSQL.
- `ADDRESS`: backend chỉ nghe tại máy nội bộ, không mở trực tiếp ra Internet.
- `STATIC_DIR`: thư mục mã nguồn. Backend có khả năng phục vụ frontend, dù cấu hình này chủ yếu dùng API.
- `COOKIE_SECURE=true`: bắt buộc khi website chạy HTTPS.
- `ALLOWED_ORIGIN`: địa chỉ website chính xác, không thêm dấu `/` cuối cùng.

Nếu website dùng `www`, giá trị phải khớp với địa chỉ mà khách thực sự truy cập. Ví dụ:

```ini
ALLOWED_ORIGIN=https://www.thepeakgarden.vn
```

Không đặt cả hai địa chỉ trong cùng một dòng.

Giới hạn quyền đọc file cấu hình:

```sh
sudo chmod 600 /etc/thepeakgarden/backend.env
```

Nếu mật khẩu chứa ký tự đặc biệt như `@`, `:`, `/`, `#` hoặc `%`, mật khẩu phải được URL-encode trong `DATABASE_URL`. Đội hosting có thể tạo mật khẩu chỉ gồm chữ hoa, chữ thường, số và dấu gạch dưới để giảm nguy cơ nhập sai chuỗi kết nối.

## 8. Biên dịch backend

Đi vào thư mục mã nguồn:

```sh
cd /opt/thepeakgarden
```

Tải thư viện và chạy kiểm tra:

```sh
go mod download
go test ./...
```

Nếu kiểm tra thành công, biên dịch:

```sh
CGO_ENABLED=0 go build -trimpath -ldflags='-s -w' -o thepeakgarden-server ./cmd/server
```

Kiểm tra file đã được tạo:

```sh
ls -lh /opt/thepeakgarden/thepeakgarden-server
```

## 9. Chạy thử backend

Nạp cấu hình bằng quyền quản trị và chạy thử:

```sh
sudo bash -c 'set -a; source /etc/thepeakgarden/backend.env; set +a; exec /opt/thepeakgarden/thepeakgarden-server'
```

Nếu thành công, màn hình sẽ hiện thông báo tương tự:

```text
The Peak Garden server listening on 127.0.0.1:8080
```

Mở một cửa sổ SSH khác và kiểm tra:

```sh
curl -i http://127.0.0.1:8080/api/auth/me
```

Kết quả đúng khi chưa đăng nhập là HTTP `401 Unauthorized` cùng nội dung:

```json
{"error":"not authenticated"}
```

HTTP 401 ở bước này là bình thường và chứng minh API đang hoạt động.

Nhấn `Ctrl+C` ở cửa sổ chạy backend để dừng bản chạy thử.

Khi backend khởi động lần đầu, hệ thống tự tạo bảng `users` và `sessions`. Không cần nhập thủ công file SQL.

## 10. Cho backend tự khởi động bằng systemd

Tạo file dịch vụ:

```sh
sudo nano /etc/systemd/system/thepeakgarden.service
```

Nội dung:

```ini
[Unit]
Description=The Peak Garden Authentication Backend
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/thepeakgarden
EnvironmentFile=/etc/thepeakgarden/backend.env
ExecStart=/opt/thepeakgarden/thepeakgarden-server
Restart=on-failure
RestartSec=5
User=www-data
Group=www-data
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadOnlyPaths=/opt/thepeakgarden

[Install]
WantedBy=multi-user.target
```

Cấp quyền để tài khoản chạy dịch vụ có thể đọc file cấu hình:

```sh
sudo chown root:www-data /etc/thepeakgarden/backend.env
sudo chmod 640 /etc/thepeakgarden/backend.env
sudo chown -R root:www-data /opt/thepeakgarden
sudo chmod 750 /opt/thepeakgarden/thepeakgarden-server
```

Khởi động dịch vụ:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now thepeakgarden
```

Kiểm tra trạng thái:

```sh
sudo systemctl status thepeakgarden
```

Trạng thái đúng là `active (running)`.

Xem nhật ký nếu có lỗi:

```sh
sudo journalctl -u thepeakgarden -n 100 --no-pager
```

## 11. Kết nối frontend hiện tại với backend

Đây là bước quan trọng nhất.

Trong cấu hình Nginx của tên miền website, thêm khối `location /api/` vào bên trong khối `server` HTTPS đang có:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_connect_timeout 5s;
    proxy_read_timeout 15s;
    proxy_send_timeout 15s;
}
```

Không thêm dấu `/` sau `8080` trong dòng `proxy_pass` của cấu hình trên.

Phần phục vụ frontend hiện tại vẫn được giữ nguyên. Ví dụ cấu trúc tổng quát:

```nginx
server {
    listen 443 ssl;
    server_name thepeakgarden.vn;

    # Cấu hình SSL hiện tại được giữ nguyên.

    root /duong-dan/frontend-hien-tai;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 15s;
        proxy_send_timeout 15s;
    }
}
```

Kiểm tra cấu hình trước khi áp dụng:

```sh
sudo nginx -t
```

Chỉ khi thấy thông báo cấu hình hợp lệ mới tải lại Nginx:

```sh
sudo systemctl reload nginx
```

Nếu frontend và backend nằm trên hai máy khác nhau, thay `127.0.0.1:8080` bằng địa chỉ nội bộ của máy backend. Nên dùng mạng riêng/VPN giữa hai máy và không mở cổng backend công khai nếu không cần thiết.

Nếu hosting hiện tại dùng cPanel, Plesk, Apache, CloudPanel hoặc dịch vụ hosting không cho cấu hình reverse proxy, hãy gửi yêu cầu sau cho nhà cung cấp:

> Vui lòng cấu hình reverse proxy cho đường dẫn `https://TEN-MIEN/api/` đến dịch vụ backend `http://DIA-CHI-BACKEND:8080`, giữ nguyên Host header và HTTPS ở phía người dùng.

Nếu nhà cung cấp không hỗ trợ reverse proxy theo đường dẫn, cần liên hệ đội phát triển trước khi chuyển API sang tên miền phụ. Không tự đổi URL trong JavaScript vì cấu hình cookie và bảo mật cũng phải thay đổi đồng thời.

## 12. HTTPS

Website phải hoạt động qua HTTPS trước khi đưa tính năng đăng nhập vào sử dụng thật.

Kiểm tra:

- Truy cập `https://thepeakgarden.vn` không có cảnh báo chứng chỉ.
- Truy cập HTTP phải tự chuyển sang HTTPS.
- `COOKIE_SECURE=true` trong file cấu hình.

Không chuyển `COOKIE_SECURE=false` trên môi trường thật để “sửa nhanh” lỗi đăng nhập. Hãy sửa HTTPS hoặc reverse proxy đúng cách.

## 13. Kiểm tra sau khi triển khai

### Kiểm tra API

Từ máy tính cá nhân, chạy:

```sh
curl -i https://thepeakgarden.vn/api/auth/me
```

Kết quả mong đợi khi chưa đăng nhập:

```text
HTTP/2 401
```

Nếu nhận HTML của website thay vì JSON, `/api/` chưa được chuyển tiếp đúng tới backend.

### Kiểm tra trên trình duyệt

Thực hiện lần lượt:

1. Mở website bằng cửa sổ ẩn danh.
2. Nhấn **Đăng ký**.
3. Nhập một email thử nghiệm và mật khẩu từ 12 đến 72 ký tự.
4. Xác nhận giao diện hiển thị email tài khoản và nút **Đăng xuất**.
5. Tải lại trang. Tài khoản vẫn phải ở trạng thái đăng nhập.
6. Nhấn **Đăng xuất**.
7. Tải lại trang. Giao diện phải trở về nút **Đăng nhập**.
8. Đăng nhập lại bằng email và mật khẩu đã đăng ký.
9. Thử mật khẩu sai và xác nhận hệ thống báo `invalid email or password`.
10. Kiểm tra cả điện thoại và máy tính.
11. Kiểm tra cả giao diện VI và EN.

### Kiểm tra cơ sở dữ liệu

```sh
sudo -u postgres psql -d thepeakgarden
```

Trong PostgreSQL:

```sql
SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 10;
SELECT user_id, expires_at, created_at FROM sessions ORDER BY created_at DESC LIMIT 10;
\q
```

Không có cột nào chứa mật khẩu gốc. Cột `password_hash` phải chứa chuỗi bcrypt bắt đầu tương tự `$2a$` hoặc `$2b$`.

## 14. Sao lưu dữ liệu

Tạo bản sao lưu thủ công:

```sh
sudo -u postgres pg_dump -Fc thepeakgarden > /var/backups/thepeakgarden-$(date +%F).dump
```

Phục hồi vào một cơ sở dữ liệu trống:

```sh
sudo -u postgres pg_restore -d TEN_DATABASE_MOI /var/backups/TEN_FILE.dump
```

Đơn vị hosting nên:

- Sao lưu ít nhất mỗi ngày.
- Giữ nhiều phiên bản sao lưu.
- Mã hóa hoặc giới hạn quyền đọc file sao lưu.
- Lưu thêm một bản ở vị trí khác máy chủ chính.
- Thử phục hồi định kỳ; có file sao lưu nhưng chưa từng thử phục hồi vẫn là rủi ro.

## 15. Dọn phiên đăng nhập hết hạn

Backend tự từ chối phiên đã hết hạn nhưng không tự xóa bản ghi cũ. Có thể chạy lệnh sau mỗi ngày:

```sql
DELETE FROM sessions WHERE expires_at <= NOW();
```

Đội hosting có thể đặt lệnh này trong cron hoặc công cụ lập lịch của PostgreSQL.

## 16. Cập nhật phiên bản mới

Quy trình cập nhật an toàn:

1. Sao lưu PostgreSQL.
2. Sao lưu phiên bản mã nguồn/binary đang chạy.
3. Đưa mã nguồn mới lên thư mục tạm.
4. Chạy `go test ./...`.
5. Biên dịch binary mới.
6. Thay binary cũ.
7. Khởi động lại dịch vụ.
8. Kiểm tra API và luồng đăng nhập.

Lệnh khởi động lại:

```sh
sudo systemctl restart thepeakgarden
sudo systemctl status thepeakgarden
```

Theo dõi log:

```sh
sudo journalctl -u thepeakgarden -f
```

## 17. Các lỗi thường gặp

### Nút đăng nhập xuất hiện nhưng đăng ký báo lỗi

Kiểm tra DevTools của trình duyệt hoặc chạy:

```sh
curl -i https://thepeakgarden.vn/api/auth/me
```

- Nếu trả về HTML: reverse proxy `/api/` sai.
- Nếu trả về `502 Bad Gateway`: backend chưa chạy hoặc Nginx không kết nối được cổng 8080.
- Nếu trả về `401` JSON: API đang hoạt động; kiểm tra dữ liệu nhập hoặc log backend.

### Lỗi `502 Bad Gateway`

```sh
sudo systemctl status thepeakgarden
sudo journalctl -u thepeakgarden -n 100 --no-pager
curl -i http://127.0.0.1:8080/api/auth/me
```

### Backend không khởi động

Các nguyên nhân phổ biến:

- Sai `DATABASE_URL`.
- PostgreSQL chưa chạy.
- Mật khẩu có ký tự đặc biệt nhưng chưa URL-encode.
- Cổng 8080 đang được chương trình khác sử dụng.
- Backend không có quyền đọc `/etc/thepeakgarden/backend.env`.

Kiểm tra PostgreSQL:

```sh
sudo systemctl status postgresql
```

Kiểm tra cổng 8080:

```sh
sudo ss -lntp | grep 8080
```

### Đăng nhập thành công nhưng tải lại trang lại bị đăng xuất

Kiểm tra:

- Website có đang dùng HTTPS hay không.
- `COOKIE_SECURE=true` hay chưa.
- Frontend và API có cùng tên miền hiển thị trên trình duyệt hay không.
- `/api/` có đi qua cùng tên miền website hay không.
- `ALLOWED_ORIGIN` có đúng chính xác tên miền, gồm cả `www` nếu sử dụng hay không.

### Lỗi `invalid request origin`

Giá trị `ALLOWED_ORIGIN` không khớp với địa chỉ website. Ví dụ website mở bằng `https://www.example.vn` thì không được cấu hình thành `https://example.vn`.

Sau khi sửa file môi trường, chạy:

```sh
sudo systemctl restart thepeakgarden
```

### Lỗi `too many login attempts`

Một địa chỉ mạng đã nhập sai quá tám lần trong 15 phút. Chờ hết thời gian hoặc khởi động lại backend trong trường hợp kiểm thử nội bộ. Không nên khởi động lại dịch vụ chỉ để bỏ giới hạn trên hệ thống thật.

## 18. Danh sách nghiệm thu trước khi bàn giao

- [ ] Frontend đã cập nhật `index.html`, `auth.js` và `main.css`.
- [ ] Backend có trạng thái `active (running)`.
- [ ] PostgreSQL hoạt động và có hai bảng `users`, `sessions`.
- [ ] Website dùng HTTPS hợp lệ.
- [ ] `COOKIE_SECURE=true`.
- [ ] `ALLOWED_ORIGIN` đúng tên miền thực tế.
- [ ] `/api/` được reverse proxy tới backend.
- [ ] Đăng ký thành công.
- [ ] Đăng nhập thành công.
- [ ] Tải lại trang vẫn giữ đăng nhập.
- [ ] Đăng xuất thành công.
- [ ] Giao diện hoạt động trên máy tính và điện thoại.
- [ ] Đã thiết lập sao lưu PostgreSQL.
- [ ] Đã lưu thông tin người chịu trách nhiệm và cách xem log.

## 19. Thông tin cần gửi cho đội phát triển khi có lỗi

Không gửi mật khẩu hoặc toàn bộ file `.env`.

Hãy gửi:

1. Thời gian xảy ra lỗi.
2. URL đang truy cập.
3. Ảnh chụp lỗi trên trình duyệt.
4. Mã HTTP nhận được (`401`, `403`, `404`, `502`...).
5. Kết quả của:

   ```sh
   sudo systemctl status thepeakgarden
   sudo journalctl -u thepeakgarden -n 100 --no-pager
   ```

6. Phiên bản mã nguồn/binary đang triển khai.

Hãy che mật khẩu, cookie, chuỗi kết nối cơ sở dữ liệu và dữ liệu cá nhân trước khi gửi log.
