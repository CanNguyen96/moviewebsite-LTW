-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: web
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (11,'Giả tưởng'),(2,'Hài hước'),(1,'Hành động'),(7,'Học đường'),(10,'Kỳ ảo'),(8,'Lãng mạn'),(5,'Lịch sử'),(9,'Phiêu lưu'),(6,'Thể thao'),(3,'Tình cảm'),(12,'Trình thám'),(4,'Võ thuật');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `episodes`
--

DROP TABLE IF EXISTS `episodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `episodes` (
  `episode_id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int DEFAULT NULL,
  `episode_number` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `video_url` text,
  PRIMARY KEY (`episode_id`),
  KEY `episode_idx` (`movie_id`),
  CONSTRAINT `episode` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `episodes`
--

LOCK TABLES `episodes` WRITE;
/*!40000 ALTER TABLE `episodes` DISABLE KEYS */;
INSERT INTO `episodes` VALUES (1,1,1,'Tập 1','https://short.icu/2GRGedeag'),(2,1,2,'Tập 2','https://short.icu/0wDlccXYS'),(3,1,3,'Tập 3','https://short.icu/0wDlccXYS'),(4,2,1,'Tập 1','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(5,1,4,'Tập 4 ','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(7,1,5,'tập 5','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(8,1,6,'tập 6','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(9,1,7,'tập 7','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(10,1,8,'tập 8','https://www.youtube.com/embed/90DTOLDdJ8w?si=01InocXPRytLnXBi'),(11,8,1,'tập 1','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(12,1,9,'Tập 9','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg'),(13,31,1,'Tập 1','https://short.icu/2GRGedeag'),(14,31,2,'Tập 2','https://short.icu/0wDlccXYS'),(15,34,1,'Tập 1','https://short.icu/2GRGedeag'),(16,33,1,'Tập 1','https://short.icu/0wDlccXYS'),(17,32,1,'Tập 1','https://short.icu/2GRGedeag'),(18,30,1,'Tập 1','https://short.icu/0wDlccXYS'),(19,29,1,'Tập 1','https://short.icu/2GRGedeag'),(20,26,1,'Tập 1','https://short.icu/2GRGedeag'),(21,6,1,'Tập 1','https://short.icu/2GRGedeag'),(22,3,1,'Tập 1','https://short.icu/2GRGedeag'),(23,34,2,'Tập 2','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg');
/*!40000 ALTER TABLE `episodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`movie_id`),
  KEY `favorites_movie_idx` (`movie_id`),
  CONSTRAINT `favorites_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (8,1,'2025-05-20 15:54:19'),(8,3,'2025-06-02 23:21:33'),(8,6,'2025-05-25 23:59:32'),(8,31,'2025-06-04 08:19:55');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_categories`
--

DROP TABLE IF EXISTS `movie_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_categories` (
  `movie_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`movie_id`,`category_id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_categories`
--

LOCK TABLES `movie_categories` WRITE;
/*!40000 ALTER TABLE `movie_categories` DISABLE KEYS */;
INSERT INTO `movie_categories` VALUES (1,1),(2,1),(3,1),(6,1),(26,1),(31,1),(33,1),(34,1),(8,2),(32,3),(1,4),(26,4),(8,7),(32,8),(29,9),(30,9),(31,9),(29,10),(30,10),(32,11);
/*!40000 ALTER TABLE `movie_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movie_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` longtext,
  `release_year` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `background_url` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Jujutsu No Yaiba','Trong một thế giới nơi những con quỷ ăn thịt người không nghi ngờ gì, những mảnh vỡ của con quỷ huyền thoại và đáng sợ Ryoumen Sukuna đã bị thất lạc và nằm rải rác. Nếu bất kỳ con quỷ nào tiêu thụ các bộ phận cơ thể của Sukuna, sức mạnh mà chúng có được có thể phá hủy thế giới như chúng ta đã biết. May mắn thay, có một ngôi trường bí ẩn của các Phù thủy Jujutsu tồn tại để bảo vệ sự tồn tại bấp bênh của người sống khỏi xác sống!Yuuji Itadori là một học sinh trung học dành cả ngày để thăm ông nội nằm liệt giường của mình. Mặc dù anh ấy trông giống như một thiếu niên bình thường của bạn, nhưng sức mạnh thể chất to lớn của anh ấy là một điều đáng chú ý! Mọi câu lạc bộ thể thao đều muốn cậu tham gia, nhưng Itadori thà đi chơi với những đứa trẻ bị trường ruồng bỏ trong Câu lạc bộ huyền bí. Một ngày nọ, câu lạc bộ quản lý để có được bàn tay của họ trên một vật thể bị nguyền rủa bị phong ấn, nhưng họ ít biết nỗi kinh hoàng mà họ sẽ gây ra khi phá vỡ phong ấn ...',2024,24,'Võ thuật, Hành động','/images/anime1.jpg','/images/anime1.jpg','Approved'),(2,'Bất lương nhân','phim hành động',2014,24,'Hành động','/images/batluongnhan.jpg','/images/15.jpg','Approved'),(3,'Naruto','Trong một thế giới nơi những con quỷ ăn thịt người không nghi ngờ gì, những mảnh vỡ của con quỷ huyền thoại và đáng sợ Ryoumen Sukuna đã bị thất lạc và nằm rải rác. Nếu bất kỳ con quỷ nào tiêu thụ các bộ phận cơ thể của Sukuna, sức mạnh mà chúng có được có thể phá hủy thế giới như chúng ta đã biết. May mắn thay, có một ngôi trường bí ẩn của các Phù thủy Jujutsu tồn tại để bảo vệ sự tồn tại bấp bênh của người sống khỏi xác sống!Yuuji Itadori là một học sinh trung học dành cả ngày để thăm ông nội nằm liệt giường của mình. Mặc dù anh ấy trông giống như một thiếu niên bình thường của bạn, nhưng sức mạnh thể chất to lớn của anh ấy là một điều đáng chú ý! Mọi câu lạc bộ thể thao đều muốn cậu tham gia, nhưng Itadori thà đi chơi với những đứa trẻ bị trường ruồng bỏ trong Câu lạc bộ huyền bí. Một ngày nọ, câu lạc bộ quản lý để có được bàn tay của họ trên một vật thể bị nguyền rủa bị phong ấn, nhưng họ ít biết nỗi kinh hoàng mà họ sẽ gây ra khi phá vỡ phong ấn ...',2014,24,'Hành động','/images/Naruto.jpg','/images/Naruto.jpg','Approved'),(6,'One Piece','Anime được phát sóng lần đầu tiên vào năm 1999 và nhanh chóng trở thành một trong những series anime phổ biến nhất trên thế giới. Câu chuyện xoay quanh Monkey D. Luffy, một chàng trai trẻ với giấc mơ trở thành Vua Hải Tặc. Luffy, người có khả năng co giãn như cao su sau khi ăn nhầm Trái Ác Quỷ, lãnh đạo nhóm Hải Tặc Mũ Rơm đi khắp Grand Line để tìm kiếm kho báu huyền thoại One Piece và theo đuổi giấc mơ của mình. Series nổi tiếng với cốt truyện phong phú, nhân vật đa dạng, và những pha hành động hấp dẫn',2004,24,'hành động','/images/onepiece.jpg','/images/15.jpg','Approved'),(8,'Doraemon','fadgfgfdgfdgfdgdfgdfg',2004,23,'Hài hước, Học đường','/images/doramon.jpg','/images/doramon.jpg','Approved'),(26,'Solo Leveling','Bộ phim anime hay, mới nhất đầu năm 2024 - Solo Leveling được chuyển thể từ tiểu thuyết mạng cùng tên. Phim kể về nhân vật thợ săn yếu nhất tên Sung Jin Woo và câu chuyện sinh tồn của anh tại không gian ngoài trái đất. Tình cờ một lần, Jung Jin Woo phát hiện ra một chương trình bí ẩn giúp anh thăng hạng nhanh chóng, từng bước trở thành thợ săn mạnh mẽ và có thể đối mặt với bất kì quái vật hung ác nào.',2024,23,'Hành động, Võ thuật','/images/solo.jpg','/images/BG-solo.jpg','Approved'),(29,'Phù Thuỷ Và Quái Vật ','Bước chân vào thị trấn, Guideau và Ashaf phải đối mặt với nhiều nguy hiểm, từ những thế lực ma quái cho đến âm mưu của phù thuỷ xấu xa. Hai người đã dựa vào sức mạnh của bản thân để giải quyết những rắc rối đồng thời bảo vệ người dân trong thị trấn. Với cốt truyện thú vị cùng đồ hoạ và âm thanh sống động, bộ phim xứng đáng lọt top phim anime hay, mới nhất không nên bỏ lỡ.',2024,24,'Hoạt hình, phiêu lưu, kỳ ảo','/images/phuthuy.jpg','/images/phuthuy.jpg','Approved'),(30,'Hoàng Tử Vệ Thần Nhà Momochi ','Khi tìm đến ngôi nhà, Momochi bất ngờ khi nơi đây đã trở thành căn cứ của 3 chàng trai khôi ngô là Aoi, Yukari và Ise. Trong đó, Aoi chính là Hoàng Tử Vệ Thần của gia tộc Momochi và cũng là người bảo vệ Himari thoát khỏi những hiểm nguy. Diễn biến sau đó của bộ phim anime này sẽ thế nào? Bạn hãy tự mình khám phá nhé.',2024,23,'Hoạt hình, phiêu lưu, kỳ ảo','/images/momochi.jpg','/images/momochi.jpg','Approved'),(31,'My Hero Academia Season 7','My Hero Academia Season 7 là bộ phim anime mới nhất trong series Học Viện Anh Hùng. Ở phần này, chúng ta sẽ thấy sự trở lại của tổ chức All for One và họ trở nên mạnh mẽ hơn bao giờ hết. Deku quay trở lại trường học, đoàn tụ với lớp 1A và kêu gọi sự giúp đỡ từ các anh hùng khác để chống lại mối đe dọa.',2024,22,'hành động, phiêu lưu','/images/hero.jpg','/images/hero.jpg','Approved'),(32,'Weathering with You – Đứa Con Của Thời Tiết','Weathering with you là một trong những bộ phim Anime tình yêu mới hay nhất đạt được nhiều giải thưởng trong và ngoài nước nhất Nhật Bản. Đồng thời, đây cũng là phim có doanh thu cao nhất Nhật Bản chỉ sau 3 ngày công chiếu.\n\nBộ phim kể về một cậu học sinh trung học Morishima Hodaka bỏ hòn đảo quê hương để đến thủ đô Tokyo. Trong một cơn mưa lớn, cậu gặp cô gái Amano Hina có khả năng thay đổi thời tiết và hai người bắt đầu chuyến phiêu lưu kỳ thú tại đây.',2019,111,'Tình cảm, lãng mạn, giả tưởng','/images/mua.jpg','/images/mua.jpg','Approved'),(33,'Black Clover – Thế Giới Pháp Thuật','Black Clover là một trong những bộ phim Anime hay kinh điển thuộc thể loại phép thuật được sản xuất bởi Pierrot. Bộ phim có cốt truyện hấp dẫn, lôi cuốn mang đến cho khán giả những trải nghiệm đa dạng từ hài hước, bất ngờ đến cảm động, lãng mạn.\n\nTrong phim, Asta và Yuno sống trong thế giới Clover Kingdom, nơi coi trọng sức mạnh phép thuật và phẩm chất con người. Tại đây, họ cùng hội một nhóm pháp sư chiến đấu chống lại quân xâm lược và bảo vệ vương quốc. Đồng thời, khám phá những bí mật và tìm kiếm sức mạnh ma thuật.',2017,24,'hành động','/images/blackclover.jpg','/images/blackclover.jpg','Approved'),(34,'Phim A','fdafsdafsd',2024,23,'Hành động','/images/solo2.jpg','/images/solo.jpg','Approved');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `movie_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` longtext,
  `review_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `movie_id_idx` (`movie_id`),
  CONSTRAINT `movie1_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,6,1,10,'hay quá\n','2025-05-08 22:56:03'),(2,6,1,4,'hay quáaaaa','2025-05-08 23:07:24'),(6,8,2,10,'hay quá','2025-05-25 23:42:42'),(7,8,31,10,'hìau','2025-06-04 08:20:00');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` enum('admin','user') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name_UNIQUE` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Quản trị viên hệ thống'),(4,'user','Người dùng thông thường');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(45) NOT NULL,
  `role_id` int NOT NULL DEFAULT '2',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Active','Banned') DEFAULT 'Active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `role_idx` (`role_id`),
  CONSTRAINT `role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'trandang','$2b$10$vjF.rJ/Tu9P3apvijmuaL.ZkyLtXVZxnTzzWLIruxFghiHl1o9N8C','trandang@gmail.com',4,'2025-04-11 21:38:59','Banned'),(3,'trandangd','$2b$10$HejCzuw39jJb3w80eLd3.OugYFNSy0AWWINffrz5sqNxxZ74jSTaO','trandangduy@gmail.com',4,'2025-04-11 21:43:08','Banned'),(4,'dangd','$2b$10$HejCzuw39jJb3w80eLd3.OugYFNSy0AWWINffrz5sqNxxZ74jSTaO','tranda@gmail.com',1,'2025-04-11 21:43:08','Banned'),(5,'duy','$2b$10$Yt7w.qDrPouFNL4IZjuQa.5lb.ldEFi5s2rLQZAYfdxR8TSUxJHO6','duy@gmail.com',1,'2025-04-11 21:43:08','Banned'),(6,'tranda','$2b$10$/s2avQaVsUczSiIk2YUGPeb7dWMPYV7YQm4H.crodani7R5UnMRBS','trandan@gmail.com',4,'2025-04-21 14:04:38','Active'),(7,'tron','$2b$10$/s2avQaVsUczSiIk2YUGPeb7dWMPYV7YQm4H.crodani7R5UnMRBS','tron@gmail.com',1,'2025-04-23 19:14:27','Active'),(8,'tronn','$2b$10$hnISoEoFsW4ZRxJW4q.55u74DVVZu.hhoBc40r82SYdYn8rgahsYW','tronn@gmail.com',4,'2025-04-24 20:41:42','Banned'),(9,'trondang','$2b$10$JI6kXTbAUy9sZzIq6TvUk.f4ZPc.NfyVPDHd3.cxoM34iN18vIVae','trondang@gmail.com',4,'2025-05-20 12:14:14','Active'),(11,'admin','$2b$10$Ba8j4pI1vinorO.qVy35HeSkFP8abpks59Jocj..3Lte3CpDrdK6W','admin@gmail.com',1,'2025-05-25 16:32:43','Active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watchhistory`
--

DROP TABLE IF EXISTS `watchhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchhistory` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `movie_id` int DEFAULT NULL,
  `watched_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `history_user_idx` (`user_id`),
  KEY `history_movie_idx` (`movie_id`),
  CONSTRAINT `history_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchhistory`
--

LOCK TABLES `watchhistory` WRITE;
/*!40000 ALTER TABLE `watchhistory` DISABLE KEYS */;
INSERT INTO `watchhistory` VALUES (30,8,8,'2025-05-21 14:29:12'),(38,8,1,'2025-06-04 00:06:14'),(39,8,31,'2025-06-04 08:20:08');
/*!40000 ALTER TABLE `watchhistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-13 18:03:01
