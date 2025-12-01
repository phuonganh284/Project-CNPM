# Kịch bản kiểm thử cho Ứng dụng Thư viện Thông minh

Dưới đây là các kịch bản kiểm thử (test case) chi tiết cho các chức năng chính của hệ thống, được phân loại theo vai trò người dùng.

---

## 1. Khách (Guest - Người dùng chưa đăng nhập)

| ID | Chức năng | Kịch bản kiểm thử | Các bước thực hiện | Kết quả mong đợi | Loại |
| :-- | :--- | :--- | :--- | :--- | :--- |
| G-01 | Duyệt sách | Xem danh sách các sách có trong thư viện | 1. Mở trang "Browse". <br> 2. Quan sát danh sách sách. | Hiển thị danh sách các sách với thông tin cơ bản (tên, tác giả, ảnh bìa). | Positive |
| G-02 | Tìm kiếm sách | Tìm kiếm sách theo tên | 1. Nhập tên sách vào thanh tìm kiếm. <br> 2. Nhấn Enter hoặc nút tìm kiếm. | Hiển thị các sách có tên khớp với từ khóa tìm kiếm. | Positive |
| G-03 | Xem chi tiết sách | Nhấn vào một cuốn sách để xem thông tin chi tiết | 1. Từ trang "Browse", nhấn vào một cuốn sách. | Chuyển đến trang chi tiết sách, hiển thị đầy đủ thông tin (mô tả, NXB, năm, số lượng, v.v.). | Positive |
| G-04 | Mượn sách | Cố gắng mượn sách khi chưa đăng nhập | 1. Vào trang chi tiết sách. <br> 2. Nhấn nút "Borrow". | Hệ thống chuyển hướng đến trang chọn vai trò đăng nhập (`/select-role`) hoặc trang đăng nhập. | Negative |
| G-05 | Đăng ký | Đăng ký tài khoản Reader mới với thông tin hợp lệ | 1. Vào trang "Register". <br> 2. Điền đầy đủ và hợp lệ các thông tin. <br> 3. Nhấn "Register". | Hiển thị thông báo đăng ký thành công và yêu cầu xác thực email. | Positive |
| G-06 | Đăng ký | Đăng ký với email đã tồn tại | 1. Vào trang "Register". <br> 2. Nhập email đã được sử dụng. <br> 3. Điền các thông tin khác. <br> 4. Nhấn "Register". | Hiển thị thông báo lỗi "Email already exists" hoặc tương tự. | Negative |
| G-07 | Đăng ký | Đăng ký với mật khẩu không khớp | 1. Vào trang "Register". <br> 2. Nhập mật khẩu và xác nhận mật khẩu không giống nhau. <br> 3. Nhấn "Register". | Hiển thị lỗi "Passwords do not match". | Negative |
| G-08 | Đăng nhập | Đăng nhập với vai trò Reader bằng tài khoản hợp lệ | 1. Vào trang "Select Role", chọn "Reader". <br> 2. Nhập email và mật khẩu đúng. <br> 3. Nhấn "Login". | Đăng nhập thành công và chuyển hướng đến trang chủ của Reader. | Positive |
| G-09 | Đăng nhập | Đăng nhập với vai trò Librarian bằng tài khoản hợp lệ | 1. Vào trang "Select Role", chọn "Librarian". <br> 2. Nhập email và mật khẩu đúng. <br> 3. Nhấn "Login". | Đăng nhập thành công và chuyển hướng đến Dashboard của Librarian. | Positive |
| G-10 | Đăng nhập | Đăng nhập với sai mật khẩu | 1. Vào trang đăng nhập. <br> 2. Nhập email đúng và mật khẩu sai. <br> 3. Nhấn "Login". | Hiển thị thông báo lỗi "Invalid credentials" hoặc "Incorrect password". | Negative |

---

## 2. Reader (Người dùng đã đăng nhập với vai trò Reader)

| ID | Chức năng | Kịch bản kiểm thử | Các bước thực hiện | Kết quả mong đợi | Loại |
| :-- | :--- | :--- | :--- | :--- | :--- |
| R-01 | Yêu cầu mượn sách | Gửi yêu cầu mượn một cuốn sách còn hàng | 1. Đăng nhập với tài khoản Reader. <br> 2. Tìm một cuốn sách "Available". <br> 3. Vào trang chi tiết, nhấn "Borrow". <br> 4. Chọn ngày lấy sách và xác nhận. | Hiển thị thông báo gửi yêu cầu thành công. Sách xuất hiện trong trang "My Requests" với trạng thái "pending". | Positive |
| R-02 | Yêu cầu mượn sách | Cố gắng mượn sách đã hết hàng | 1. Đăng nhập. <br> 2. Tìm một cuốn sách "Out of stock". <br> 3. Vào trang chi tiết. | Nút "Borrow" bị vô hiệu hóa hoặc hiển thị "OUT OF STOCK". | Negative |
| R-03 | Yêu cầu mượn sách | Cố gắng mượn sách khi đã đạt giới hạn mượn (5 cuốn) | 1. Đăng nhập tài khoản đã mượn 5 cuốn. <br> 2. Tìm một cuốn sách còn hàng. <br> 3. Vào trang chi tiết. | Nút "Borrow" bị vô hiệu hóa và hiển thị thông báo "LIMIT REACHED". | Negative |
| R-04 | Yêu cầu mượn sách | Cố gắng mượn lại một cuốn sách đang mượn hoặc đang yêu cầu | 1. Đăng nhập. <br> 2. Tìm đến sách mình đang mượn hoặc đang trong trạng thái "pending"/"approved". <br> 3. Vào trang chi tiết. | Nút "Borrow" bị vô hiệu hóa và hiển thị "You already have this item". | Negative |
| R-05 | Quản lý yêu cầu | Hủy một yêu cầu mượn sách đang ở trạng thái "pending" | 1. Vào trang "My Requests". <br> 2. Tìm một yêu cầu có trạng thái "pending". <br> 3. Nhấn nút "Cancel" và xác nhận. | Yêu cầu bị xóa khỏi danh sách. | Positive |
| R-06 | Quản lý mượn sách | Xem danh sách các sách đang mượn | 1. Vào trang "My Borrows". | Hiển thị danh sách các sách đang mượn, cùng với ngày hết hạn. | Positive |
| R-07 | Yêu cầu trả sách | Gửi yêu cầu trả sách cho một cuốn sách đang mượn | 1. Vào trang "My Borrows". <br> 2. Nhấn nút "Return" trên một cuốn sách. <br> 3. Xác nhận yêu cầu. | Hiển thị thông báo thành công. Trạng thái của sách trong "My Borrows" đổi thành "Pending return". | Positive |
| R-08 | Lịch sử mượn | Xem lịch sử các sách đã mượn và trả | 1. Vào trang "Borrowing History". | Hiển thị danh sách các sách đã hoàn tất quá trình mượn trả, bao gồm thông tin về phí phạt (nếu có). | Positive |
| R-09 | Thông báo | Xem thông báo mới | 1. Nhấn vào biểu tượng chuông thông báo. <br> 2. Nhấn vào một thông báo chưa đọc. | Số lượng thông báo chưa đọc giảm đi. Nội dung chi tiết của thông báo được hiển thị. | Positive |
| R-10 | Đổi mật khẩu | Đổi mật khẩu với thông tin hợp lệ | 1. Vào trang "Profile", tab "Login & Security". <br> 2. Nhấn "Change Password". <br> 3. Nhập đúng mật khẩu hiện tại và mật khẩu mới. | Hiển thị thông báo đổi mật khẩu thành công. | Positive |
| R-11 | Đổi mật khẩu | Đổi mật khẩu với mật khẩu hiện tại không đúng | 1. Vào trang đổi mật khẩu. <br> 2. Nhập sai mật khẩu hiện tại. | Hiển thị thông báo lỗi "Incorrect current password". | Negative |

---

## 3. Librarian (Người dùng đã đăng nhập với vai trò Thủ thư)

| ID | Chức năng | Kịch bản kiểm thử | Các bước thực hiện | Kết quả mong đợi | Loại |
| :-- | :--- | :--- | :--- | :--- | :--- |
| L-01 | Dashboard | Xem thống kê tổng quan | 1. Đăng nhập với tài khoản Librarian. <br> 2. Quan sát trang Dashboard. | Các số liệu (tổng số sách, sách đang được mượn, yêu cầu chờ xử lý, v.v.) được hiển thị chính xác. | Positive |
| L-02 | Quản lý sách | Thêm một đầu sách mới với thông tin hợp lệ | 1. Vào trang "Manage Books". <br> 2. Nhấn "Add Book". <br> 3. Điền đầy đủ thông tin và lưu lại. | Sách mới xuất hiện trong danh sách. | Positive |
| L-03 | Quản lý sách | Sửa thông tin một đầu sách | 1. Vào trang "Manage Books". <br> 2. Nhấn "Edit" trên một cuốn sách. <br> 3. Thay đổi thông tin và lưu lại. | Thông tin của sách được cập nhật trong danh sách. | Positive |
| L-04 | Quản lý sách | Xóa một đầu sách | 1. Vào trang "Manage Books". <br> 2. Nhấn "Delete" trên một cuốn sách và xác nhận. | Sách bị xóa khỏi danh sách. | Positive |
| L-05 | Quản lý bản sao | Thêm bản sao cho một đầu sách | 1. Từ trang "Manage Books", vào trang quản lý bản sao của một sách. <br> 2. Nhập số lượng và nhấn "Add Copies". | Số lượng bản sao tăng lên. | Positive |
| L-06 | Quản lý bản sao | Xóa một bản sao chưa được mượn | 1. Vào trang quản lý bản sao. <br> 2. Nhấn "Delete" trên một bản sao có trạng thái "Available". | Bản sao bị xóa khỏi danh sách. | Positive |
| L-07 | Quản lý bản sao | Cố gắng xóa một bản sao đang được mượn | 1. Vào trang quản lý bản sao. <br> 2. Tìm một bản sao có trạng thái "Borrowed". | Nút "Delete" bị vô hiệu hóa. | Negative |
| L-08 | Quản lý người dùng | Cấm (ban) một tài khoản Reader | 1. Vào trang "Manage Readers". <br> 2. Nhấn nút "Ban" trên một tài khoản. | Trạng thái của người dùng đổi thành "banned". Người dùng đó không thể đăng nhập. | Positive |
| L-09 | Quản lý người dùng | Bỏ cấm (unban) một tài khoản Reader | 1. Vào trang "Manage Readers". <br> 2. Nhấn nút "Un-Ban" trên một tài khoản đã bị cấm. | Trạng thái của người dùng đổi thành "active". | Positive |
| L-10 | Xử lý yêu cầu mượn | Phê duyệt một yêu cầu mượn sách | 1. Vào trang "Borrow Requests". <br> 2. Nhấn "Approve" trên một yêu cầu. | Yêu cầu biến mất khỏi danh sách chờ và chuyển sang trang "Approved Requests". Reader nhận được thông báo. | Positive |
| L-11 | Xử lý yêu cầu mượn | Từ chối một yêu cầu mượn sách | 1. Vào trang "Borrow Requests". <br> 2. Nhấn "Reject" trên một yêu cầu, nhập lý do. | Yêu cầu biến mất khỏi danh sách chờ. Reader nhận được thông báo về việc bị từ chối kèm lý do. | Positive |
| L-12 | Xử lý giao sách | Xác nhận đã giao sách cho Reader | 1. Vào trang "Approved Requests". <br> 2. Nhấn "Confirm Delivery" trên một yêu cầu. | Yêu cầu biến mất khỏi danh sách. Một bản ghi mượn sách mới được tạo trong trang "Current Borrowing". | Positive |
| L-13 | Xử lý trả sách | Đánh giá tình trạng sách trả và tính phí | 1. Vào trang "Return Requests". <br> 2. Nhấn "Assess" trên một yêu cầu. <br> 3. Nhập tình trạng sách, hệ thống tự tính phí hư hỏng/trễ hạn. <br> 4. Lưu lại. | Trạng thái yêu cầu đổi thành "assessed". Reader nhận được thông báo về phí phạt. | Positive |
| L-14 | Xử lý trả sách | Hoàn tất quá trình trả sách | 1. Vào trang "Return Requests". <br> 2. Tìm một yêu cầu đã "assessed". <br> 3. Nhấn "Receive Book". | Yêu cầu biến mất khỏi danh sách. Bản ghi mượn sách kết thúc và được chuyển vào lịch sử. | Positive |
| L-15 | Phân quyền | Truy cập trang chỉ dành cho Reader | 1. Đăng nhập tài khoản Librarian. <br> 2. Cố gắng truy cập trực tiếp vào URL của trang "My Borrows" (`/my-borrows`). | Hệ thống từ chối truy cập, hiển thị trang "Unauthorized" hoặc chuyển hướng về Dashboard. | Negative |
