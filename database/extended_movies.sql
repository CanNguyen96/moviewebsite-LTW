-- =============================================================
-- extended_movies.sql
-- Dữ liệu dự phòng: Nâng cấp cột genre + Chèn 13 phim HH3D
-- Chạy file này bằng: mysql -u root -p moviewebsite < database/extended_movies.sql
-- =============================================================

USE moviewebsite;

-- ============================================================
-- PHẦN 1: Nâng cấp schema - Mở rộng cột genre lên VARCHAR(255)
-- ============================================================
ALTER TABLE movies MODIFY COLUMN genre VARCHAR(255);


-- ============================================================
-- PHẦN 2: Chèn 13 phim HH3D (bỏ qua nếu đã tồn tại theo title)
-- ============================================================

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Thần Mộ' AS title,
  'Thần Mộ theo chân Thần Nam – chàng trai bình dị nhưng có số phận đặc biệt, hồi sinh tại Thần Ma Lăng Viên – nơi yên nghỉ của các tu sĩ mạnh mẽ suốt nhiều thời đại. Dấn thân vào sáu tầng luân hồi, anh không chỉ tìm kiếm người yêu Vũ Hinh mà còn lần ra bí mật sụp đổ của Thần Ma. Hành trình đầy cạm bẫy và khí thế mãnh liệt này...' AS description,
  2024 AS release_year,
  25 AS duration,
  'Kiếm Hiệp, Tiên Hiệp, Tu Tiên' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Than-Mo.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Than-Mo.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Thần Mộ');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Tinh Thần Biến Phần 7' AS title,
  'Sau quãng thời giang đợi chờ khi phần 6 khép lại thì phần thứ 7, cũng là phần cuối cùng của bộ phim hoạt hình 3D Tinh Thần Biến cũng đã xuất hiện. Với sự xuất hiện của 3 loại Ấn trong truyền thuyết là Hậu Thổ Ấn, Thương Thiên Ấn và Vạn Dân Ấn sau sự việc núi Thiên Tôn giáng xuống, từ đó mà đã kéo theo những trận chiến đẫm máu để tranh đoạt 3 loại Ấn đó. Trong khi đó, vừa mới được làm cha nhưng Tần Vũ vì để cứu anh em Hầu Phí nên cũng đã trở thành kẻ thù nhắm đến của nữ vương Huyết Hải.' AS description,
  2026 AS release_year,
  25 AS duration,
  'Kiếm Hiệp, Tiên Hiệp, Tu Tiên' AS genre,
  'https://hh3d.online/wp-content/uploads/2026/05/Tinh-Than-Bien-Phan-7-scaled.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2026/05/Tinh-Than-Bien-Phan-7-scaled.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Tinh Thần Biến Phần 7');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Nghịch Thiên Tà Thần 3D' AS title,
  'Nghịch Thiên Tà Thần xoay quanh câu chuyện về Vân Triệt - một thiếu niên mang trong mình huyền mạch bị tàn phế nhưng lại vô tình có được Thiên Độc Châu, bảo vật chí tôn của thế gian. Trải qua cái chết và sự tái sinh, Vân Triệt dấn thân vào con đường nghịch thiên, tu luyện huyền lực mạnh mẽ, chiến đấu với các thế lực tà ác để bảo vệ những người thân yêu và vươn tới đỉnh cao võ đạo.' AS description,
  2024 AS release_year,
  25 AS duration,
  'Kiếm Hiệp, Trùng Sinh, Tu Tiên' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Nghich-Thien-Ta-Than-3D.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Nghich-Thien-Ta-Than-3D.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Nghịch Thiên Tà Thần 3D');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Tương Dạ' AS title,
  'Tương Dạ là câu chuyện về Ninh Khuyết, một thiếu niên từ cõi chết trở về, mang theo mối thù sâu sắc của gia tộc. Cùng với cô bé Tang Tang, Ninh Khuyết bước vào học viện thư viện danh tiếng của Đường quốc, đối đầu với số phận Tương Dạ (đêm dài vô tận) đang cận kề và những âm mưu tranh đoạt quyền lực giữa các quốc gia và thế lực thần bí.' AS description,
  2024 AS release_year,
  25 AS duration,
  'Xuyên Không, Tu Tiên, Kiếm Hiệp' AS genre,
  'https://hh3d.online/wp-content/uploads/2026/04/Tuong-Da.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2026/04/Tuong-Da.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Tương Dạ');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Bàn Long' AS title,
  'Bàn Long kể về Lâm Lôi Ba Lỗ Khắc, một thiếu niên xuất thân từ gia tộc chiến sĩ Long Huyết đã sa sút. Lâm Lôi vô tình nhặt được một chiếc nhẫn hình rồng cổ xưa, từ đó bước vào hành trình tu luyện trở thành ma pháp sư và chiến sĩ vĩ đại, tìm lại vinh quang cho gia tộc và khám phá những bí ẩn sâu xa của thế giới nguyên tố.' AS description,
  2024 AS release_year,
  24 AS duration,
  'Tu Tiên, Huyền Ảo, Phiêu Lưu' AS genre,
  'https://hh3d.online/wp-content/uploads/2026/04/Ban-Long.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2026/04/Ban-Long.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Bàn Long');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Sư Huynh À Sư Huynh' AS title,
  'Phim kể về Lý Trường Thọ, một thanh niên tu tiên cực kỳ cẩn thận và điềm đạm, tôn thờ triết lý "an toàn là trên hết". Nhập môn Độ Tiên Môn, Lý Trường Thọ giấu kín thực lực, chỉ muốn bình yên tu luyện trường sinh. Thế nhưng, hàng loạt sự kiện bất ngờ ngoài ý muốn liên tiếp xảy ra đẩy anh vào những tình huống dở khóc dở cười và những cuộc chiến long trời lở đất.' AS description,
  2023 AS release_year,
  25 AS duration,
  'Tu Tiên, Hài Hước, Giả Tưởng' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Su-Huynh-A-Su-Huynh.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Su-Huynh-A-Su-Huynh.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Sư Huynh À Sư Huynh');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Toàn Chức Pháp Sư Phần 7' AS title,
  'Toàn Chức Pháp Sư Phần 7 tiếp tục hành trình của Mạc Phàm trong thế giới pháp thuật đầy rẫy yêu ma nguy hiểm. Sở hữu thiên phú song hệ đặc biệt, Mạc Phàm phải đối mặt với các thử thách mới, tham gia vào các cuộc chiến bảo vệ thành trì và phá tan âm mưu tà ác của Hắc Giáo Đình.' AS description,
  2026 AS release_year,
  23 AS duration,
  'Đô Thị, Siêu Năng Lực, Giả Tưởng' AS genre,
  'https://hh3d.online/wp-content/uploads/2026/05/Toan-Chuc-Phap-Su-Phan-7.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2026/05/Toan-Chuc-Phap-Su-Phan-7.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Toàn Chức Pháp Sư Phần 7');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Già Thiên' AS title,
  'Già Thiên kể về Diệp Phàm, một thanh niên bình thường vô tình bị một chiếc Cửu Long Kéo Hòm từ vũ trụ đưa đến một thế giới tu chân tàn khốc và rộng lớn. Tại đây, Diệp Phàm phát hiện bản thân sở hữu Hoang Cổ Thánh Thể cực kỳ khó tu luyện. Bằng ý chí kiên định và cơ duyên vượt trội, anh từng bước đánh bại kẻ thù, tu luyện các thần thông cổ xưa và đi tìm con đường trở về Trái Đất.' AS description,
  2023 AS release_year,
  25 AS duration,
  'Tu Tiên, Huyền Ảo, Tiên Hiệp' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Gia-Thien.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Gia-Thien.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Già Thiên');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Thần Y Cổ Đại Ở Đô Thị' AS title,
  'Thần Y Cổ Đại Ở Đô Thị xoay quanh nhân vật Cao Thiên, một thần y ở thời cổ đại trùng sinh về thời hiện đại. Sử dụng y thuật thượng cổ và võ công tuyệt thế của mình, Cao Thiên vừa chữa bệnh cứu người, vừa trừng trị kẻ ác và xây dựng đế chế y học của riêng mình giữa lòng đô thị náo nhiệt.' AS description,
  2024 AS release_year,
  25 AS duration,
  'Đô Thị, Huyền Ảo, Trùng Sinh' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Than-Y-Co-Dai-O-Do-Thi.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Than-Y-Co-Dai-O-Do-Thi.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Thần Y Cổ Đại Ở Đô Thị');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Tử Xuyên Phần 2' AS title,
  'Tử Xuyên Phần 2 tiếp tục câu chuyện xoay quanh ba anh em kết nghĩa Tử Xuyên Tú, Đế Lâm và Tư Đặc Lâm trong cuộc chiến bảo vệ Tử Xuyên gia tộc khỏi sự xâm lăng của Ma Tộc và các cuộc nội loạn tranh giành quyền lực tàn khốc.' AS description,
  2025 AS release_year,
  25 AS duration,
  'Tu Tiên, Kiếm Hiệp, Chiến Tranh' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/07/Tu-Xuyen-2.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/07/Tu-Xuyen-2.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Tử Xuyên Phần 2');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Vạn Giới Độc Tôn' AS title,
  'Lâm Phong bị vị hôn thê hãm hại, cướp mất kiếm hồn. Nhưng nhờ cơ duyên xảo hợp, anh thức tỉnh được sức mạnh tối cổ và bắt đầu hành trình trả thù, tu luyện võ học tối thượng để trở thành Vạn Giới Độc Tôn.' AS description,
  2021 AS release_year,
  24 AS duration,
  'Trùng Sinh, Tu Tiên, Hành Động' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Van-Gioi-Doc-Ton.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Van-Gioi-Doc-Ton.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Vạn Giới Độc Tôn');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Võ Thần Chúa Tể' AS title,
  'Võ Thần Chúa Tể kể về Tần Trần, một đại sư võ học kỳ tài ở Thiên Vũ Đại Lục bị bạn bè và người yêu phản bội, rơi xuống Vực Thẳm Tử Vong. 300 năm sau, anh trùng sinh vào thân xác một thiếu niên cùng tên bị ruồng bỏ trong một gia tộc nhỏ. Bằng ký ức kiếp trước và ý chí phục thù, Tần Trần luyện võ học tối cao, bảo vệ gia đình và vươn lên đỉnh cao của võ thần.' AS description,
  2020 AS release_year,
  24 AS duration,
  'Trùng Sinh, Tu Tiên, Hành Động' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/Vo-Than-Chua-Te.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/Vo-Than-Chua-Te.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Võ Thần Chúa Tể');

INSERT INTO movies (title, description, release_year, duration, genre, image_url, background_url, status, views_count, average_rating)
SELECT * FROM (SELECT
  'Thế Giới Hoàn Mỹ' AS title,
  'Thế Giới Hoàn Mỹ kể về quá trình trưởng thành của Thạch Hạo, một đứa trẻ mang Chí Tôn Cốt bị người trong tộc cướp đoạt mất, lớn lên ở Thạch Thôn hẻo lánh. Với ý chí bất khuất, Thạch Hạo dấn thân vào hành trình tu luyện, chiến đấu với thái cổ di chủng, các đại giáo thần bí để tìm lại gia đình, giải cứu nhân tộc và vươn lên đỉnh cao của con đường tu tiên.' AS description,
  2021 AS release_year,
  25 AS duration,
  'Tu Tiên, Huyền Ảo, Tiên Hiệp' AS genre,
  'https://hh3d.online/wp-content/uploads/2025/04/The-Gioi-Hoan-My.jpg' AS image_url,
  'https://hh3d.online/wp-content/uploads/2025/04/The-Gioi-Hoan-My.jpg' AS background_url,
  'Approved' AS status,
  0 AS views_count,
  0.0 AS average_rating
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Thế Giới Hoàn Mỹ');


-- ============================================================
-- PHẦN 3: Chèn Tập 1 mẫu cho 13 phim trên (nếu chưa có)
-- ============================================================

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Thần Mộ'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Tinh Thần Biến Phần 7'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Nghịch Thiên Tà Thần 3D'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Tương Dạ'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Bàn Long'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Sư Huynh À Sư Huynh'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Toàn Chức Pháp Sư Phần 7'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Già Thiên'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Thần Y Cổ Đại Ở Đô Thị'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Tử Xuyên Phần 2'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Vạn Giới Độc Tôn'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Võ Thần Chúa Tể'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);

INSERT INTO episodes (movie_id, episode_number, title, video_url, views_count)
SELECT m.movie_id, 1, 'Tập 1', 'https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8', 0
FROM movies m
WHERE m.title = 'Thế Giới Hoàn Mỹ'
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.movie_id = m.movie_id AND e.episode_number = 1);


-- ============================================================
-- PHẦN 4: Liên kết thể loại (movie_categories) cho 13 phim
-- ============================================================

-- Thần Mộ → Kiếm Hiệp, Tiên Hiệp, Tu tiên, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Thần Mộ' AND c.category_name IN ('Kiếm Hiệp', 'Tiên Hiệp', 'Tu tiên', 'HH3D');

-- Tinh Thần Biến Phần 7 → Kiếm Hiệp, Tiên Hiệp, Tu tiên, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Tinh Thần Biến Phần 7' AND c.category_name IN ('Kiếm Hiệp', 'Tiên Hiệp', 'Tu tiên', 'HH3D');

-- Nghịch Thiên Tà Thần 3D → Kiếm Hiệp, Trùng sinh, Tu tiên, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Nghịch Thiên Tà Thần 3D' AND c.category_name IN ('Kiếm Hiệp', 'Trùng sinh', 'Tu tiên', 'HH3D');

-- Tương Dạ → Xuyên Không, Tu tiên, Kiếm Hiệp, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Tương Dạ' AND c.category_name IN ('Xuyên Không', 'Tu tiên', 'Kiếm Hiệp', 'HH3D');

-- Bàn Long → Tu tiên, Huyền ảo, Phiêu lưu, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Bàn Long' AND c.category_name IN ('Tu tiên', 'Huyền ảo', 'Phiêu lưu', 'HH3D');

-- Sư Huynh À Sư Huynh → Tu tiên, Hài hước, Giả tưởng, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Sư Huynh À Sư Huynh' AND c.category_name IN ('Tu tiên', 'Hài hước', 'Giả tưởng', 'HH3D');

-- Toàn Chức Pháp Sư Phần 7 → Đô Thị, Siêu năng lực, Giả tưởng, Anime
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Toàn Chức Pháp Sư Phần 7' AND c.category_name IN ('Đô Thị', 'Siêu năng lực', 'Giả tưởng', 'Anime');

-- Già Thiên → Tu tiên, Huyền ảo, Tiên Hiệp, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Già Thiên' AND c.category_name IN ('Tu tiên', 'Huyền ảo', 'Tiên Hiệp', 'HH3D');

-- Thần Y Cổ Đại Ở Đô Thị → Đô Thị, Huyền ảo, Trùng sinh, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Thần Y Cổ Đại Ở Đô Thị' AND c.category_name IN ('Đô Thị', 'Huyền ảo', 'Trùng sinh', 'HH3D');

-- Tử Xuyên Phần 2 → Tu tiên, Kiếm Hiệp, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Tử Xuyên Phần 2' AND c.category_name IN ('Tu tiên', 'Kiếm Hiệp', 'HH3D');

-- Vạn Giới Độc Tôn → Trùng sinh, Tu tiên, Hành động, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Vạn Giới Độc Tôn' AND c.category_name IN ('Trùng sinh', 'Tu tiên', 'Hành động', 'HH3D');

-- Võ Thần Chúa Tể → Trùng sinh, Tu tiên, Hành động, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Võ Thần Chúa Tể' AND c.category_name IN ('Trùng sinh', 'Tu tiên', 'Hành động', 'HH3D');

-- Thế Giới Hoàn Mỹ → Tu tiên, Huyền ảo, Tiên Hiệp, HH3D
INSERT IGNORE INTO movie_categories (movie_id, category_id)
SELECT m.movie_id, c.category_id FROM movies m, categories c
WHERE m.title = 'Thế Giới Hoàn Mỹ' AND c.category_name IN ('Tu tiên', 'Huyền ảo', 'Tiên Hiệp', 'HH3D');
