-- =============================================================
-- add_10_donghua.sql
-- Chèn thêm 10 phim Hoạt hình Trung Quốc (Donghua 3D/2D) tên tiếng Việt với link ảnh chuẩn CDN
-- Chạy bằng: mysql -u root -p moviewebsite < database/add_10_donghua.sql
-- =============================================================

USE moviewebsite;

-- Mở rộng cột genre
ALTER TABLE movies MODIFY COLUMN genre VARCHAR(255);

-- 1. Đấu La Đại Lục
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Đấu La Đại Lục' AS title,
  'Đường Tam - đệ tử ngoại môn Đường Môn do vi phạm môn quy nên phải gieo mình xuống vực sâu tự sát. Nào ngờ, thần thức anh không diệt mà trùng sinh sang Đấu La Đại Lục, một thế giới thuộc về Hồn Lực và Hồn Sư. Tại đây, Đường Tam thức tỉnh Song Sinh Võ Hồn hiếm có, cùng các bằng hữu Sử Lai Khắc Thất Quái bắt đầu hành trình tu luyện gian khổ, chiến đấu chống lại mưu đồ bá chủ của Vũ Hồn Điện.' AS description,
  2018 AS release_year, 25 AS duration,
  'Huyền Ảo, Tu Tiên, Hồn Sư, Hành Động' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Dau-La-Dai-Luc.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Dau-La-Dai-Luc.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Đấu La Đại Lục');

-- 2. Đấu Phá Thương Khung
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Đấu Phá Thương Khung' AS title,
  'Tại Đấu Khí Đại Lục, Tiêu Viêm từng là thiên tài tu luyện khét tiếng của Tiêu Gia. Tuy nhiên năm 12 tuổi, anh đột ngột mất đi khả năng tích tụ Đấu Khí và bị coi là phế vật. Nguyên nhân xuất phát từ chiếc nhẫn đen do mẹ anh để lại – nơi ẩn chứa linh hồn Dược Lão. Dưới sự chỉ dẫn của Dược Lão, Tiêu Viêm bắt đầu hành trình thu thập Dị Hỏa, từng bước rửa sạch mối nhục và tiến tới đỉnh cao Đấu Đế.' AS description,
  2017 AS release_year, 25 AS duration,
  'Tiên Hiệp, Huyền Ảo, Tu Tiên, Hành Động' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Dau-Pha-Thuong-Khung-Phan-5.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Dau-Pha-Thuong-Khung-Phan-5.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Đấu Phá Thương Khung');

-- 3. Trảm Thần
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Trảm Thần' AS title,
  'Lâm Thất Dạ - một thiếu niên khiếm thị sinh sống tại Thương Niên Thị. Trong một biến cố thần bí, anh vô tình thức tỉnh và sở hữu sức mạnh của Thần Minh Tiệm Chi Dạ. Bước vào thế giới ẩn giấu sau màn sương mù, anh gia nhập Đội 136 Trảm Thần, trở thành người gác đêm bảo vệ nhân loại trước sự xâm lăng của những tà thần và dị ma cổ xưa.' AS description,
  2024 AS release_year, 24 AS duration,
  'Đô Thị, Dị Năng, Giả Tưởng, Hành Động' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Tram-Than.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Tram-Than.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Trảm Thần');

-- 4. Đại Chủ Tể
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Đại Chủ Tể' AS title,
  'Mục Trần xuất thân từ Bắc Linh Cảnh, mang trong mình dòng máu thần bí của Linh Trận Sư. Tiến vào Đại Thiên Thế Giới - nơi hội tụ các thiên tài và cường giả võ đạo đỉnh phong, Mục Trần trải qua vô số trận chiến sinh tử, tu luyện chí tôn pháp thân và vượt qua nghịch cảnh để trở thành Đại Chủ Tể trấn giữ chư thiên vạn giới.' AS description,
  2023 AS release_year, 25 AS duration,
  'Tu Tiên, Huyền Ảo, Tiên Hiệp' AS genre,
  'https://phimimg.com/upload/vod/20260415-1/b5d7394aa49cde793f86f5d9163ced85.jpg' AS image_url,
  'https://phimimg.com/upload/vod/20260415-1/b5d7394aa49cde793f86f5d9163ced85.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Đại Chủ Tể');

-- 5. Tây Hành Kỷ
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Tây Hành Kỷ' AS title,
  '16 năm sau khi thỉnh thành công "Kỳ Kinh" về trao lại cho Thiên Đình, Đường Tam Tạng mới bừng tỉnh nhận ra sự tàn bạo của các chư thần. Nhận lời ủy thác của Bạch Tơ Long Lang, thầy trò Đường Tam Tạng quyết định tập hợp lại lần nữa, lên đường hộ tiễn Kỳ Kinh trở lại Tây Thiên để trả lại bình yên cho nhân giới.' AS description,
  2018 AS release_year, 23 AS duration,
  'Thần Thoại, Giả Tưởng, Hàng Yêu, Hành Động' AS genre,
  'https://phimimg.com/upload/vod/20250603-1/f820553818b1a46f68715e48e4a8ac6c.jpg' AS image_url,
  'https://phimimg.com/upload/vod/20250603-1/f820553818b1a46f68715e48e4a8ac6c.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Tây Hành Kỷ');

-- 6. Vũ Canh Kỷ
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Vũ Canh Kỷ' AS title,
  'Tân Vương Thương Quốc nổi dậy chống lại sự áp bức vô lý của Thần Tộc và bị Hắc Long tiêu diệt. Hoàng tử Vũ Canh may mắn trốn thoát, sống lại trong thân xác nô lệ A Cẩu. Để trả thù và giải phóng nhân loại khỏi xiềng xắc nô dịch của Thần Tộc, Vũ Canh dấn thân vào con đường tu luyện sức mạnh Thần Lực và Khí Công.' AS description,
  2016 AS release_year, 25 AS duration,
  'Thần Thoại, Tiên Hiệp, Huyền Ảo' AS genre,
  'https://phimimg.com/upload/vod/20240310-1/9c9414cdff091e5f4acf517f0103d125.jpg' AS image_url,
  'https://phimimg.com/upload/vod/20240310-1/9c9414cdff091e5f4acf517f0103d125.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Vũ Canh Kỷ');

-- 7. Toàn Chức Cao Thủ
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Toàn Chức Cao Thủ' AS title,
  'Diệp Tu – cao thủ cấp thần thoại của tựa game E-Sports Vinh Quang bị câu lạc bộ ép buộc giải nghệ và nộp lại tài khoản Nhất Diệp Chi Thu. Không từ bỏ đam mê, anh làm quản lý ca đêm tại một tiệm Net nhỏ đối diện câu lạc bộ, tạo tài khoản mới Quân Mạc Tiếu tại Máy Chủ 10 và bắt đầu hành trình trở lại đỉnh cao.' AS description,
  2017 AS release_year, 24 AS duration,
  'Đô Thị, E-Sports, Giả Tưởng, Hành Động' AS genre,
  'https://phimimg.com/upload/vod/20250506-1/ca7f500bd5ab064f5720bc396330d354.jpg' AS image_url,
  'https://phimimg.com/upload/vod/20250506-1/ca7f500bd5ab064f5720bc396330d354.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Toàn Chức Cao Thủ');

-- 8. Trùng Sinh Đô Thị Tu Tiên
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Trùng Sinh Đô Thị Tu Tiên' AS title,
  'Độ Kiếp Kỳ Tôn Giả Trần Bắc Huyền ngã xuống trong kiếp nạn trời phạt, linh hồn trùng sinh trở về thời niên thiếu 500 năm trước tại Trái Đất đô thị. Mang theo toàn bộ ký ức võ học và thần thông tu tiên kiếp trước, Trần Bắc Huyền thề sẽ bù đắp mọi tiếc nuối, giẫm đạp lên kẻ thù và trấn áp mọi giới võ đạo đô thị.' AS description,
  2024 AS release_year, 24 AS duration,
  'Đô Thị, Trùng Sinh, Tu Tiên, Hành Động' AS genre,
  'https://phimimg.com/upload/vod/20241018-1/422e01866d2bfcb0adfd4ae2a31ef32f.jpg' AS image_url,
  'https://phimimg.com/upload/vod/20241018-1/422e01866d2bfcb0adfd4ae2a31ef32f.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Trùng Sinh Đô Thị Tu Tiên');

-- 9. Yêu Thần Ký
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Yêu Thần Ký' AS title,
  'Thánh Linh Đại Lục tối cao Yêu Thần Sư Nhiếp Ly trong trận chiến với Yêu Thần và sáu con Thần Mấp Yêu Thú đã ngã xuống. Thần thức anh trùng sinh về năm 13 tuổi khi Quang Huy Thành chưa bị tiêu diệt. Nhờ tri thức kiếp trước, Nhiếp Ly tu luyện thần công thượng cổ, luyện chế đan dược và dẫn dắt bạn bè trở thành các Yêu Thần Sư tối thượng.' AS description,
  2017 AS release_year, 22 AS duration,
  'Trùng Sinh, Tu Tiên, Giả Tưởng, Hành Động' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Yeu-Than-Ky.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Yeu-Than-Ky.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Yêu Thần Ký');

-- 10. Tuyết Ưng Lĩnh Chủ
INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Tuyết Ưng Lĩnh Chủ' AS title,
  'Đông Bá Tuyết Ưng sinh ra tại Tuyết Ưng Lĩnh thuộc An Dương Tỉnh. Vì giải cứu cha mẹ bị gia tộc lớn bắt giữ, Tuyết Ưng vùi đầu vào tu luyện Trường Thương Thuật đến mức quên ăn quên ngủ. Bằng ý chí kiên định và tư chất hơn người, anh bứt phá ranh giới siêu phàm, bước vào cuộc chiến bảo vệ hạ giới.' AS description,
  2018 AS release_year, 25 AS duration,
  'Huyền Ảo, Tu Tiên, Võ Thuật' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Tuyet-Ung-Linh-Chu.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Tuyet-Ung-Linh-Chu.jpg' AS background_url,
  'Approved' AS status, 0 AS views_count, 0.0 AS average_rating
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Tuyết Ưng Lĩnh Chủ');
