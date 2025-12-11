# Hướng Dẫn Di Chuyển Ảnh Minh Chứng

## Bước 1: Tạo Folder
Đã tạo folder `minh_chung` trong thư mục `wrap to web/progress/`

## Bước 2: Di Chuyển Các File Ảnh
Vui lòng di chuyển các file ảnh sau vào folder `wrap to web/progress/minh_chung/`:

- progress_online_meet.png
- 582184579_812787881622260_6971717357119720173_n.png
- 582422520_1409022314177798_2766183900000120454_n.png
- image_2025-11-13_210743183.png
- Screenshot 2025-11-21 204400.png

## Bước 3: Thêm Ảnh Mới
Để thêm ảnh minh chứng mới:
1. Đặt file ảnh vào folder `wrap to web/progress/minh_chung/`
2. Mở file `index.html`
3. Tìm phần `<!-- Modal for Meeting Images Gallery -->` (khoảng dòng 731)
4. Thêm một `<div class="gallery-item">` mới với đường dẫn đến ảnh của bạn

Ví dụ:
```html
<div class="gallery-item">
    <img src="wrap to web/progress/minh_chung/ten_file_anh_moi.png" alt="Mô tả ảnh" onclick="openImageModal(this.src)">
</div>
```

## Lưu ý
- Code đã được cập nhật để tự động tìm ảnh trong folder `minh_chung`
- Chỉ cần di chuyển file và thêm vào HTML là xong!
