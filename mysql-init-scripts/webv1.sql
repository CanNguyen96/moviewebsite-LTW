-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: web
-- ------------------------------------------------------
-- Server version	8.0.42

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
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (13,'Âm nhạc'),(14,'Anime'),(15,'Bí ẩn'),(16,'Bi kịch'),(17,'CN Animation'),(18,'Demon'),(19,'Dị giới'),(58,'Đô Thị'),(59,'Đời thường'),(20,'Drama'),(21,'Ecchi'),(22,'Gia đình'),(11,'Giả tưởng'),(2,'Hài hước'),(1,'Hành động'),(23,'Harem'),(24,'Hệ thống'),(25,'HH2D'),(26,'HH3D'),(7,'Học đường'),(27,'Huyền ảo'),(28,'Khoa học'),(29,'Khoa huyễn'),(30,'Kinh dị'),(10,'Kỳ ảo'),(8,'Lãng mạn'),(5,'Lịch sử'),(31,'Live Action'),(32,'Luyện cấp'),(33,'Ma cà rồng'),(34,'Mạt thế'),(35,'Mecha'),(36,'Ngôn tình'),(37,'OVA'),(9,'Phiêu lưu'),(38,'Psychological'),(39,'Quân đội'),(40,'Samurai'),(41,'Sắp chiếu'),(42,'Seinen'),(43,'Shoujo'),(44,'Shoujo AI'),(45,'Shounen'),(46,'Shounen AI'),(47,'Siêu năng lực'),(48,'Siêu nhiên'),(6,'Thể thao'),(49,'Thriller'),(50,'Tiên Hiệp'),(3,'Tình cảm'),(51,'Tokusatsu'),(12,'Trình thám'),(52,'Trò chơi'),(53,'Trùng sinh'),(54,'Tu tiên'),(55,'Viễn tưởng'),(56,'Võ Hiệp'),(4,'Võ thuật'),(57,'Xuyên Không');
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
  `views_count` int DEFAULT '0',
  PRIMARY KEY (`episode_id`),
  KEY `episode_idx` (`movie_id`),
  CONSTRAINT `episode` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `episodes`
--

LOCK TABLES `episodes` WRITE;
/*!40000 ALTER TABLE `episodes` DISABLE KEYS */;
INSERT INTO `episodes` VALUES (1,1,1,'Tập 1','https://short.icu/2GRGedeag',0),(2,1,2,'Tập 2','https://short.icu/0wDlccXYS',0),(3,1,3,'Tập 3','https://short.icu/0wDlccXYS',0),(4,2,1,'Tập 1','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg',0),(5,1,4,'Tập 4 ','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg',0),(7,1,5,'tập 5','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg',0),(8,1,6,'tập 6','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg',0),(9,1,7,'tập 7','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg',0),(10,1,8,'tập 8','https://www.youtube.com/embed/90DTOLDdJ8w?si=01InocXPRytLnXBi',0),(11,8,1,'tập 1','https://www.youtube.com/embed/kwnF-N5u69A?si=3sdtiyjFEiDzbJqg',0),(12,1,9,'Tập 9','https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8',0),(13,31,1,'Tập 1','https://short.icu/2GRGedeag',0),(14,31,2,'Tập 2','https://short.icu/0wDlccXYS',0),(17,32,1,'Tập 1','https://short.icu/2GRGedeag',0),(18,30,1,'Tập 1','https://short.icu/0wDlccXYS',0),(19,29,1,'Tập 1','https://short.icu/2GRGedeag',0),(20,26,1,'Tập 1','https://short.icu/2GRGedeag',0),(21,6,1,'Tập 1','https://short.icu/2GRGedeag',0),(22,3,1,'Tập 1','https://short.icu/2GRGedeag',0),(24,8,2,'Tập 2','https://short.icu/gHoJiQTgO',0),(25,35,1,'Tập 1','https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8',0),(26,35,135,'Tập 135','https://s6.kkphimplayer6.com/20260406/2bjlDgBJ/index.m3u8',0),(27,35,134,'Tập 134','https://s6.kkphimplayer6.com/20260330/x6BsEIcb/index.m3u8',0),(28,35,133,'Tập 133','https://s6.kkphimplayer6.com/20260323/tlFeBygy/index.m3u8',0),(29,35,132,'Tập 132','https://s6.kkphimplayer6.com/20260317/V3eYakpW/index.m3u8',0),(30,35,131,'Tập 131','https://s6.kkphimplayer6.com/20260309/lL5Jz2co/index.m3u8',0),(31,35,130,'Tập 130','https://s6.kkphimplayer6.com/20260302/GzztpVYB/index.m3u8',0),(32,35,129,'Tập 129','https://s6.kkphimplayer6.com/20260223/ATmpJFZ6/index.m3u8',0),(33,35,128,'Tập 128','https://s6.kkphimplayer6.com/20260216/OsgL5g9B/index.m3u8',0),(34,35,127,'Tập 127','https://s6.kkphimplayer6.com/20260209/8HNpRzCa/index.m3u8',0),(35,35,126,'Tập 126','https://s6.kkphimplayer6.com/20260202/TiRpXnXy/index.m3u8',0),(36,35,125,'Tập 125','https://s6.kkphimplayer6.com/20260126/yJmCuVRM/index.m3u8',0),(37,35,124,'Tập 124','https://s6.kkphimplayer6.com/20260119/Za0qyXSD/index.m3u8',0),(38,35,123,'Tập 123','https://s6.kkphimplayer6.com/20260112/TXODlCvA/index.m3u8',0),(39,35,122,'Tập 122','https://s6.kkphimplayer6.com/20260105/hKA0MbvL/index.m3u8',0),(40,35,121,'Tập 121','https://s6.kkphimplayer6.com/20251229/B7MuH4x0/index.m3u8',0),(41,35,120,'Tập 120','https://s6.kkphimplayer6.com/20251222/x4DDm68O/index.m3u8',0),(42,35,119,'Tập 119','https://s6.kkphimplayer6.com/20251215/1LjoFDEH/index.m3u8',0),(43,35,118,'Tập 118','https://s6.kkphimplayer6.com/20251208/Ozq3pc8f/index.m3u8',0),(44,35,117,'Tập 117','https://s6.kkphimplayer6.com/20251130/XNRMqlJF/index.m3u8',0),(45,35,116,'Tập 116','https://s6.kkphimplayer6.com/20251123/km737TkW/index.m3u8',0),(46,35,115,'Tập 115','https://s6.kkphimplayer6.com/20251116/w3QUN352/index.m3u8',0),(47,35,114,'Tập 114','https://s6.kkphimplayer6.com/20251109/Mlw3oaAX/index.m3u8',0),(48,35,113,'Tập 113','https://s6.kkphimplayer6.com/20251103/7kaGY4Az/index.m3u8',0),(49,35,112,'Tập 112','https://s6.kkphimplayer6.com/20251103/QgYDekJy/index.m3u8',0),(50,35,111,'Tập 111','https://s6.kkphimplayer6.com/20251020/pwGh7FcV/index.m3u8',0),(51,35,110,'Tập 110','https://s6.kkphimplayer6.com/20251013/PyQnpX5Y/index.m3u8',0),(52,35,109,'Tập 109','https://s6.kkphimplayer6.com/20251006/Nn9XuTXc/index.m3u8',0),(53,35,108,'Tập 108','https://s6.kkphimplayer6.com/20250930/ZIE5kF1t/index.m3u8',0),(54,35,107,'Tập 107','https://s6.kkphimplayer6.com/20250922/IqSifeBs/index.m3u8',0),(55,35,106,'Tập 106','https://s6.kkphimplayer6.com/20250915/q8R2ht6s/index.m3u8',0),(56,35,105,'Tập 105','https://s6.kkphimplayer6.com/20250907/KwVRQ6qF/index.m3u8',0),(57,35,104,'Tập 104','https://s6.kkphimplayer6.com/20250901/w0afEOVq/index.m3u8',0),(58,35,103,'Tập 103','https://s6.kkphimplayer6.com/20250825/v4gxLfJd/index.m3u8',0),(59,35,102,'Tập 102','https://s6.kkphimplayer6.com/20250819/YHakKU9Y/index.m3u8',0),(60,35,101,'Tập 101','https://s6.kkphimplayer6.com/20250811/rIeKyOog/index.m3u8',0),(61,35,100,'Tập 100','https://s6.kkphimplayer6.com/20250805/qRrLo11N/index.m3u8',0),(62,35,99,'Tập 99','https://s6.kkphimplayer6.com/20250728/DwPkieIz/index.m3u8',0),(63,35,98,'Tập 98','https://s6.kkphimplayer6.com/20250720/9p8psu23/index.m3u8',0),(64,35,97,'Tập 97','https://s6.kkphimplayer6.com/20250713/XWc58Mqq/index.m3u8',0),(65,35,96,'Tập 96','https://s6.kkphimplayer6.com/20250707/0cPvATsU/index.m3u8',0),(66,35,95,'Tập 95','https://s6.kkphimplayer6.com/20250630/AfuvfaNo/index.m3u8',0),(67,35,94,'Tập 94','https://s6.kkphimplayer6.com/20250625/ZmAN0RVB/index.m3u8',0),(68,35,93,'Tập 93','https://s6.kkphimplayer6.com/20250616/oPZUpkff/index.m3u8',0),(69,35,92,'Tập 92','https://s6.kkphimplayer6.com/20250609/sbhhXwD0/index.m3u8',0),(70,35,91,'Tập 91','https://s6.kkphimplayer6.com/20250602/2gCXJwTu/index.m3u8',0),(71,35,90,'Tập 90','https://s6.kkphimplayer6.com/20250525/6VjWTWRK/index.m3u8',0),(72,35,89,'Tập 89','https://s4.phim1280.tv/20250519/EYnWB7NX/index.m3u8',0),(73,35,88,'Tập 88','https://s5.phim1280.tv/20250512/Kg5rNTil/index.m3u8',0),(74,35,87,'Tập 87','https://s5.phim1280.tv/20250505/Zpo48XHh/index.m3u8',0),(75,35,86,'Tập 86','https://s4.phim1280.tv/20250428/3JFqX7zD/index.m3u8',0),(76,35,85,'Tập 85','https://s5.phim1280.tv/20250421/h4YYM2VR/index.m3u8',0),(77,35,84,'Tập 84','https://s4.phim1280.tv/20250414/qF3LiXXQ/index.m3u8',0),(78,35,83,'Tập 83','https://s5.phim1280.tv/20250407/WHjTD1Bv/index.m3u8',0),(79,35,82,'Tập 82','https://s4.phim1280.tv/20250401/H4EySjYc/index.m3u8',0),(80,35,81,'Tập 81','https://s5.phim1280.tv/20250324/BcQQ8wlx/index.m3u8',0),(81,35,80,'Tập 80','https://s5.phim1280.tv/20250322/ExajaR4u/index.m3u8',0),(82,35,79,'Tập 79','https://s4.phim1280.tv/20250310/AzMBuXLM/index.m3u8',0),(83,35,78,'Tập 78','https://s4.phim1280.tv/20250307/OI61voPZ/index.m3u8',0),(84,35,77,'Tập 77','https://s5.phim1280.tv/20250225/kerZ5vM0/index.m3u8',0),(85,35,76,'Tập 76','https://s4.phim1280.tv/20250217/FnsyBqiP/index.m3u8',0),(86,35,75,'Tập 75','https://s4.phim1280.tv/20250211/ZGjJUTzf/index.m3u8',0),(87,35,74,'Tập 74','https://s4.phim1280.tv/20250203/hn7glH9O/index.m3u8',0),(88,35,73,'Tập 73','https://s4.phim1280.tv/20250128/5fmooGLO/index.m3u8',0),(89,35,72,'Tập 72','https://s5.phim1280.tv/20250121/GsCqvjIJ/index.m3u8',0),(90,35,71,'Tập 71','https://s5.phim1280.tv/20250113/TJlfC5Ym/index.m3u8',0),(91,35,70,'Tập 70','https://s5.phim1280.tv/20250113/HbYRkB5Q/index.m3u8',0),(92,35,69,'Tập 69','https://s5.phim1280.tv/20241230/vpoQSKuU/index.m3u8',0),(93,35,68,'Tập 68','https://s4.phim1280.tv/20241223/SfYqeLSI/index.m3u8',0),(94,35,67,'Tập 67','https://s4.phim1280.tv/20241223/npxPlKjZ/index.m3u8',0),(95,35,66,'Tập 66','https://s4.phim1280.tv/20241209/lHJqyIqQ/index.m3u8',0),(96,35,65,'Tập 65','https://s4.phim1280.tv/20241209/9sv21U3V/index.m3u8',0),(97,35,64,'Tập 64','https://s4.phim1280.tv/20241126/ZPy2j4fV/index.m3u8',0),(98,35,63,'Tập 63','https://s4.phim1280.tv/20241126/xzwaQY40/index.m3u8',0),(99,35,62,'Tập 62','https://s5.phim1280.tv/20241112/L2S2UFfL/index.m3u8',0),(100,35,61,'Tập 61','https://s4.phim1280.tv/20241104/ubgQPtgV/index.m3u8',0),(101,35,60,'Tập 60','https://s5.phim1280.tv/20241028/C5zAGgfh/index.m3u8',0),(102,35,59,'Tập 59','https://s4.phim1280.tv/20241021/hbsz3IqB/index.m3u8',0),(103,35,58,'Tập 58','https://s4.phim1280.tv/20241021/AvZ9KDGX/index.m3u8',0),(104,35,57,'Tập 57','https://s5.phim1280.tv/20241008/tZhxIMfd/index.m3u8',0),(105,35,56,'Tập 56','https://s5.phim1280.tv/20240930/wJyZTmgh/index.m3u8',0),(106,35,55,'Tập 55','https://s5.phim1280.tv/20240925/ev5LaTe5/index.m3u8',0),(107,35,54,'Tập 54','https://s4.phim1280.tv/20240916/pQwFfDJh/index.m3u8',0),(108,35,53,'Tập 53','https://s4.phim1280.tv/20240910/AgnW6jg5/index.m3u8',0),(109,35,52,'Tập 52','https://s4.phim1280.tv/20240902/72u6OKhp/index.m3u8',0),(110,35,51,'Tập 51','https://s4.phim1280.tv/20240902/Gc31K6ES/index.m3u8',0),(111,35,50,'Tập 50','https://s4.phim1280.tv/20240902/A368EtxJ/index.m3u8',0),(112,35,49,'Tập 49','https://s4.phim1280.tv/20240902/lf1u1s2u/index.m3u8',0),(113,35,48,'Tập 48','https://s4.phim1280.tv/20240902/IAoPWvC6/index.m3u8',0),(114,35,47,'Tập 47','https://s4.phim1280.tv/20240902/q6U5PdGa/index.m3u8',0),(115,35,46,'Tập 46','https://s4.phim1280.tv/20240902/wz7lSCVI/index.m3u8',0),(116,35,45,'Tập 45','https://s4.phim1280.tv/20240902/EBPVfPpA/index.m3u8',0),(117,35,44,'Tập 44','https://s4.phim1280.tv/20240902/Qxlr84Rk/index.m3u8',0),(118,35,43,'Tập 43','https://s4.phim1280.tv/20240902/WPiED4QN/index.m3u8',0),(119,35,42,'Tập 42','https://s4.phim1280.tv/20240902/s952CEmg/index.m3u8',0),(120,35,41,'Tập 41','https://s4.phim1280.tv/20240902/91I83K0q/index.m3u8',0),(121,35,40,'Tập 40','https://s4.phim1280.tv/20240902/3fWNeYaO/index.m3u8',0),(122,35,39,'Tập 39','https://s4.phim1280.tv/20240902/6MYLKhBA/index.m3u8',0),(123,35,38,'Tập 38','https://s4.phim1280.tv/20240902/5qYtUXrU/index.m3u8',0),(124,35,37,'Tập 37','https://s4.phim1280.tv/20240902/pcV053Zf/index.m3u8',0),(125,35,36,'Tập 36','https://s4.phim1280.tv/20240902/q8kWvxP3/index.m3u8',0),(126,35,35,'Tập 35','https://s4.phim1280.tv/20240902/vwmU5Dqr/index.m3u8',0),(127,35,34,'Tập 34','https://s4.phim1280.tv/20240902/UzcisvC0/index.m3u8',0),(128,35,33,'Tập 33','https://s4.phim1280.tv/20240902/UexGW1KC/index.m3u8',0),(129,35,32,'Tập 32','https://s4.phim1280.tv/20240902/KoJy5F26/index.m3u8',0),(130,35,31,'Tập 31','https://s4.phim1280.tv/20240902/udjaoPjF/index.m3u8',0),(131,35,30,'Tập 30','https://s4.phim1280.tv/20240902/RFGt0l9A/index.m3u8',0),(132,35,29,'Tập 29','https://s4.phim1280.tv/20240902/ii77Y5Ur/index.m3u8',0),(133,35,28,'Tập 28','https://s4.phim1280.tv/20240902/evZDqztr/index.m3u8',0),(134,35,27,'Tập 27','https://s4.phim1280.tv/20240902/Lld9jJhv/index.m3u8',0),(135,35,26,'Tập 26','https://s4.phim1280.tv/20240902/b6vOL0z2/index.m3u8',0),(136,35,25,'Tập 25','https://s4.phim1280.tv/20240902/UcgaQIy8/index.m3u8',0),(137,35,24,'Tập 24','https://s4.phim1280.tv/20240902/IszCdMJJ/index.m3u8',0),(138,35,23,'Tập 23','https://s4.phim1280.tv/20240902/osEqerpC/index.m3u8',0),(139,35,22,'Tập 22','https://s4.phim1280.tv/20240902/Y6YFZf1I/index.m3u8',0),(140,35,21,'Tập 21','https://s4.phim1280.tv/20240902/ZHwwFGpT/index.m3u8',0),(141,35,20,'Tập 20','https://s4.phim1280.tv/20240902/I7xOOHGv/index.m3u8',0),(142,35,19,'Tập 19','https://s4.phim1280.tv/20240902/lIkT49nH/index.m3u8',0),(143,35,18,'Tập 18','https://s4.phim1280.tv/20240902/dwHrM6X9/index.m3u8',0),(144,35,17,'Tập 17','https://s4.phim1280.tv/20240902/32HJMyxH/index.m3u8',0),(145,35,16,'Tập 16','https://s4.phim1280.tv/20240902/DAJ1aPht/index.m3u8',0),(146,35,15,'Tập 15','https://s4.phim1280.tv/20240902/p0dbdtCV/index.m3u8',0),(147,35,14,'Tập 14','https://s4.phim1280.tv/20240902/raqbZK8W/index.m3u8',0),(148,35,13,'Tập 13','https://s4.phim1280.tv/20240902/dpGukr3a/index.m3u8',0),(149,35,12,'Tập 12','https://s4.phim1280.tv/20240902/Csf5y5ea/index.m3u8',0),(150,35,11,'Tập 11','https://s4.phim1280.tv/20240902/xUrVd8wF/index.m3u8',0),(151,35,10,'Tập 10','https://s4.phim1280.tv/20240902/gpI609pJ/index.m3u8',0),(152,35,9,'Tập 9','https://s4.phim1280.tv/20240902/oz4kRHxo/index.m3u8',0),(153,35,8,'Tập 8','https://s4.phim1280.tv/20240902/tZXy5eVa/index.m3u8',0),(154,35,7,'Tập 7','https://s4.phim1280.tv/20240902/e1ZUCMpW/index.m3u8',0),(155,35,6,'Tập 6','https://s4.phim1280.tv/20240902/9GBHeFgZ/index.m3u8',0),(156,35,5,'Tập 5','https://s4.phim1280.tv/20240902/qxtZu37s/index.m3u8',0),(157,35,4,'Tập 4','https://s4.phim1280.tv/20240902/P9JDqwRd/index.m3u8',0),(158,35,3,'Tập 3','https://s4.phim1280.tv/20240902/vnt5dWem/index.m3u8',0),(159,35,2,'Tập 2','https://s4.phim1280.tv/20240902/81WUV6fg/index.m3u8',0),(160,36,1,'Tập 1','https://s3.phim1280.tv/20240715/6VEHSDxf/index.m3u8',0),(161,37,1,'Tập 1','https://s6.kkphimplayer6.com/20260325/6EiVe9J2/index.m3u8',0),(162,38,1,'Tập 1','https://s3.phim1280.tv/20240821/wFIU7kDd/index.m3u8',0);
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
INSERT INTO `favorites` VALUES (8,1,'2025-05-20 15:54:19'),(8,3,'2025-06-02 23:21:33'),(8,6,'2025-05-25 23:59:32'),(8,31,'2025-06-04 08:19:55'),(8,32,'2025-06-17 10:07:58'),(15,36,'2026-04-23 13:56:50'),(15,38,'2026-04-23 13:56:22');
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
INSERT INTO `movie_categories` VALUES (1,1),(2,1),(3,1),(6,1),(26,1),(31,1),(35,1),(38,1),(8,2),(32,3),(1,4),(26,4),(8,7),(32,8),(29,9),(30,9),(31,9),(29,10),(30,10),(32,11),(37,17),(38,17),(35,26),(36,26),(37,26),(38,26),(35,27),(36,27),(37,27),(38,29),(35,50),(36,50),(35,54),(36,54),(37,54);
/*!40000 ALTER TABLE `movie_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_ratings`
--

DROP TABLE IF EXISTS `movie_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_ratings` (
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`movie_id`),
  KEY `fk_rating_movie` (`movie_id`),
  CONSTRAINT `fk_rating_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `movie_ratings_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 10)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_ratings`
--

LOCK TABLES `movie_ratings` WRITE;
/*!40000 ALTER TABLE `movie_ratings` DISABLE KEYS */;
INSERT INTO `movie_ratings` VALUES (6,1,10,'2025-05-08 22:56:03'),(8,2,10,'2025-05-25 23:42:42'),(8,31,10,'2025-06-04 08:20:00'),(8,32,6,'2025-06-17 10:07:17');
/*!40000 ALTER TABLE `movie_ratings` ENABLE KEYS */;
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
  `views_count` int DEFAULT '0',
  `average_rating` decimal(3,1) DEFAULT '0.0',
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Jujutsu No Yaiba','Trong một thế giới nơi những con quỷ ăn thịt người không nghi ngờ gì, những mảnh vỡ của con quỷ huyền thoại và đáng sợ Ryoumen Sukuna đã bị thất lạc và nằm rải rác. Nếu bất kỳ con quỷ nào tiêu thụ các bộ phận cơ thể của Sukuna, sức mạnh mà chúng có được có thể phá hủy thế giới như chúng ta đã biết. May mắn thay, có một ngôi trường bí ẩn của các Phù thủy Jujutsu tồn tại để bảo vệ sự tồn tại bấp bênh của người sống khỏi xác sống!Yuuji Itadori là một học sinh trung học dành cả ngày để thăm ông nội nằm liệt giường của mình. Mặc dù anh ấy trông giống như một thiếu niên bình thường của bạn, nhưng sức mạnh thể chất to lớn của anh ấy là một điều đáng chú ý! Mọi câu lạc bộ thể thao đều muốn cậu tham gia, nhưng Itadori thà đi chơi với những đứa trẻ bị trường ruồng bỏ trong Câu lạc bộ huyền bí. Một ngày nọ, câu lạc bộ quản lý để có được bàn tay của họ trên một vật thể bị nguyền rủa bị phong ấn, nhưng họ ít biết nỗi kinh hoàng mà họ sẽ gây ra khi phá vỡ phong ấn ...',2024,24,'Võ thuật, Hành động','/images/anime1.jpg','/images/anime1.jpg','Approved',0,0.0),(2,'Bất lương nhân','phim hành động',2014,24,'Hành động','/images/batluongnhan.jpg','/images/15.jpg','Approved',0,0.0),(3,'Naruto','Trong một thế giới nơi những con quỷ ăn thịt người không nghi ngờ gì, những mảnh vỡ của con quỷ huyền thoại và đáng sợ Ryoumen Sukuna đã bị thất lạc và nằm rải rác. Nếu bất kỳ con quỷ nào tiêu thụ các bộ phận cơ thể của Sukuna, sức mạnh mà chúng có được có thể phá hủy thế giới như chúng ta đã biết. May mắn thay, có một ngôi trường bí ẩn của các Phù thủy Jujutsu tồn tại để bảo vệ sự tồn tại bấp bênh của người sống khỏi xác sống!Yuuji Itadori là một học sinh trung học dành cả ngày để thăm ông nội nằm liệt giường của mình. Mặc dù anh ấy trông giống như một thiếu niên bình thường của bạn, nhưng sức mạnh thể chất to lớn của anh ấy là một điều đáng chú ý! Mọi câu lạc bộ thể thao đều muốn cậu tham gia, nhưng Itadori thà đi chơi với những đứa trẻ bị trường ruồng bỏ trong Câu lạc bộ huyền bí. Một ngày nọ, câu lạc bộ quản lý để có được bàn tay của họ trên một vật thể bị nguyền rủa bị phong ấn, nhưng họ ít biết nỗi kinh hoàng mà họ sẽ gây ra khi phá vỡ phong ấn ...',2014,24,'Hành động','/images/Naruto.jpg','/images/Naruto.jpg','Approved',0,0.0),(6,'One Piece','Anime được phát sóng lần đầu tiên vào năm 1999 và nhanh chóng trở thành một trong những series anime phổ biến nhất trên thế giới. Câu chuyện xoay quanh Monkey D. Luffy, một chàng trai trẻ với giấc mơ trở thành Vua Hải Tặc. Luffy, người có khả năng co giãn như cao su sau khi ăn nhầm Trái Ác Quỷ, lãnh đạo nhóm Hải Tặc Mũ Rơm đi khắp Grand Line để tìm kiếm kho báu huyền thoại One Piece và theo đuổi giấc mơ của mình. Series nổi tiếng với cốt truyện phong phú, nhân vật đa dạng, và những pha hành động hấp dẫn',2004,24,'hành động','/images/onepiece.jpg','/images/15.jpg','Approved',0,0.0),(8,'Doraemon','fadgfgfdgfdgfdgdfgdfg',2004,23,'Hài hước, Học đường','/images/doramon.jpg','/images/doramon.jpg','Approved',0,0.0),(26,'Solo Leveling','Bộ phim anime hay, mới nhất đầu năm 2024 - Solo Leveling được chuyển thể từ tiểu thuyết mạng cùng tên. Phim kể về nhân vật thợ săn yếu nhất tên Sung Jin Woo và câu chuyện sinh tồn của anh tại không gian ngoài trái đất. Tình cờ một lần, Jung Jin Woo phát hiện ra một chương trình bí ẩn giúp anh thăng hạng nhanh chóng, từng bước trở thành thợ săn mạnh mẽ và có thể đối mặt với bất kì quái vật hung ác nào.',2024,23,'Hành động, Võ thuật','/images/solo.jpg','/images/BG-solo.jpg','Approved',0,0.0),(29,'Phù Thuỷ Và Quái Vật ','Bước chân vào thị trấn, Guideau và Ashaf phải đối mặt với nhiều nguy hiểm, từ những thế lực ma quái cho đến âm mưu của phù thuỷ xấu xa. Hai người đã dựa vào sức mạnh của bản thân để giải quyết những rắc rối đồng thời bảo vệ người dân trong thị trấn. Với cốt truyện thú vị cùng đồ hoạ và âm thanh sống động, bộ phim xứng đáng lọt top phim anime hay, mới nhất không nên bỏ lỡ.',2024,24,'Hoạt hình, phiêu lưu, kỳ ảo','/images/phuthuy.jpg','/images/phuthuy.jpg','Approved',0,0.0),(30,'Hoàng Tử Vệ Thần Nhà Momochi ','Khi tìm đến ngôi nhà, Momochi bất ngờ khi nơi đây đã trở thành căn cứ của 3 chàng trai khôi ngô là Aoi, Yukari và Ise. Trong đó, Aoi chính là Hoàng Tử Vệ Thần của gia tộc Momochi và cũng là người bảo vệ Himari thoát khỏi những hiểm nguy. Diễn biến sau đó của bộ phim anime này sẽ thế nào? Bạn hãy tự mình khám phá nhé.',2024,23,'Hoạt hình, phiêu lưu, kỳ ảo','/images/momochi.jpg','/images/momochi.jpg','Approved',0,0.0),(31,'My Hero Academia Season 7','My Hero Academia Season 7 là bộ phim anime mới nhất trong series Học Viện Anh Hùng. Ở phần này, chúng ta sẽ thấy sự trở lại của tổ chức All for One và họ trở nên mạnh mẽ hơn bao giờ hết. Deku quay trở lại trường học, đoàn tụ với lớp 1A và kêu gọi sự giúp đỡ từ các anh hùng khác để chống lại mối đe dọa.',2024,22,'hành động, phiêu lưu','/images/hero.jpg','/images/hero.jpg','Approved',0,0.0),(32,'Weathering with You – Đứa Con Của Thời Tiết','Weathering with you là một trong những bộ phim Anime tình yêu mới hay nhất đạt được nhiều giải thưởng trong và ngoài nước nhất Nhật Bản. Đồng thời, đây cũng là phim có doanh thu cao nhất Nhật Bản chỉ sau 3 ngày công chiếu.\n\nBộ phim kể về một cậu học sinh trung học Morishima Hodaka bỏ hòn đảo quê hương để đến thủ đô Tokyo. Trong một cơn mưa lớn, cậu gặp cô gái Amano Hina có khả năng thay đổi thời tiết và hai người bắt đầu chuyến phiêu lưu kỳ thú tại đây.',2019,111,'Tình cảm, lãng mạn, giả tưởng','/images/mua.jpg','/images/mua.jpg','Approved',0,0.0),(35,'Tiên Nghịch','Tiên Nghịch: kể về Vương Lâm, một cậu bé bình thường ở vùng nông thôn, đã quyết định tu luyện để nghịch thiên. Anh không chỉ mong cầu trường sinh mà còn muốn thoát khỏi thân phận nhỏ bé, tầm thường. Vương Lâm tin vào con đường tu chân dành cho những người có tư chất bình thường, trải qua bao nhiêu thăng trầm, dựa vào trí tuệ và sự thông minh của mình, từng bước tiến lên đỉnh cao, tự mình làm rạng danh trong Tu Chân Giới.',2022,24,'Hành động, HH3D, Huyền ảo, Tiên Hiệp, Tu tiên','/images/image-1775483726047.jpg','/images/background-1775483726051.jpg','Approved',0,0.0),(36,' Phàm Nhân Tu Tiên','Nhân vật chính là Hàn Lập, một thiếu niên xuất thân bần hàn, có thiên tư bình thường, không có căn cơ đặc biệt. Ban đầu, Hàn Lập nhập môn một tiểu phái tu tiên, vốn chỉ mong muốn \"kéo dài tuổi thọ, sống yên ổn\". Tuy nhiên, trải qua hàng loạt biến cố: phản bội, tranh đấu, mưu đồ trong giới tu tiên, Hàn Lập từng bước dựa vào sự nhẫn nại, trí tuệ, cơ duyên và sự kiên định để mạnh dần lên.',2022,23,'HH3D, Huyền ảo, Tiên Hiệp, Tu tiên','/images/image-1775536869004.webp','/images/background-1775537186591.jpg','Approved',0,0.0),(37,' Bách Luyện Thành Thần','Gia tộc suy tàn, chí thân chịu khổ. La Chinh từ đám mây ngã xuống, trở thành một người hèn mọn gian nô ở các tộc, đấu tranh không ngừng. Thần bí lực lượng thống trị thế giới. Không cam lòng sa đọa, La Chinh ngẫu nhiên có được thần bí công pháp, luyện tự thân vì khí, một đạo đấu tranh mở màn như vậy, ầm ầm kéo ra.',2022,24,'CN Animation, HH3D, Huyền ảo, Tu tiên','/images/image-1775537630120.jpg','/images/background-1775537630130.jpg','Approved',0,0.0),(38,' Thôn Phệ Tinh Không','Thôn Phệ Tinh Không kể về câu chuyện xoay quanh nhân vật chính là La Phong, người luôn khao khát trở thành một võ giả trong thế giới tương lai hiện đại đầy mới lạ. Mở đầu phim là một loạt câu chuyện hấp dẫn liên quan đến chàng trai này, trong cuộc hành trình của mình, anh luôn phải đối đầu với những thử thách khác nhau. Với nỗ lực và khát khao là một người có tình có nghĩa, La Phong luôn hành động theo những gì anh cho là đúng. Chính vì vậy, anh luôn được những người bạn ủng hộ. Cuộc hành trình trong vũ trụ tinh không của La Phong sẽ diễn biến ra sao đây?',2020,24,'CN Animation, Hành động, HH3D, Khoa huyễn','/images/image-1775538016353.webp','/images/background-1775538016384.webp','Approved',0,0.0);
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
  `comment` longtext,
  `review_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `movie_id_idx` (`movie_id`),
  CONSTRAINT `movie1_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,6,1,'hay quá\n','2025-05-08 22:56:03'),(2,6,1,'hay quáaaaa','2025-05-08 23:07:24'),(6,8,2,'hay quá','2025-05-25 23:42:42'),(7,8,31,'hìau','2025-06-04 08:20:00'),(8,8,32,'hay','2025-06-17 10:07:17'),(9,8,32,'tuyet voi\n','2025-06-17 14:12:35'),(10,8,32,'vip','2025-06-17 14:13:23');
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
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `role_idx` (`role_id`),
  CONSTRAINT `role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'trandang','$2b$10$vjF.rJ/Tu9P3apvijmuaL.ZkyLtXVZxnTzzWLIruxFghiHl1o9N8C','trandang@gmail.com',4,'2025-04-11 21:38:59','Banned',NULL),(3,'trandangd','$2b$10$HejCzuw39jJb3w80eLd3.OugYFNSy0AWWINffrz5sqNxxZ74jSTaO','trandangduy@gmail.com',4,'2025-04-11 21:43:08','Banned',NULL),(4,'dangd','$2b$10$HejCzuw39jJb3w80eLd3.OugYFNSy0AWWINffrz5sqNxxZ74jSTaO','tranda@gmail.com',1,'2025-04-11 21:43:08','Banned',NULL),(5,'duy','$2b$10$Yt7w.qDrPouFNL4IZjuQa.5lb.ldEFi5s2rLQZAYfdxR8TSUxJHO6','duy@gmail.com',1,'2025-04-11 21:43:08','Banned',NULL),(6,'tranda','$2b$10$/s2avQaVsUczSiIk2YUGPeb7dWMPYV7YQm4H.crodani7R5UnMRBS','trandan@gmail.com',4,'2025-04-21 14:04:38','Active',NULL),(7,'tron','$2b$10$/s2avQaVsUczSiIk2YUGPeb7dWMPYV7YQm4H.crodani7R5UnMRBS','tron@gmail.com',1,'2025-04-23 19:14:27','Active',NULL),(8,'tronn','$2b$10$BuOxbR6s7Qx9ssUjAfp8WODFBecgGSGiyqpmVlNh.NrUlZCScdGGa','tronn@gmail.com',4,'2025-04-24 20:41:42','Active',NULL),(9,'trondang','$2b$10$JI6kXTbAUy9sZzIq6TvUk.f4ZPc.NfyVPDHd3.cxoM34iN18vIVae','trondang@gmail.com',4,'2025-05-20 12:14:14','Active',NULL),(11,'admin','$2b$10$Ba8j4pI1vinorO.qVy35HeSkFP8abpks59Jocj..3Lte3CpDrdK6W','admin@gmail.com',1,'2025-05-25 16:32:43','Active',NULL),(14,'Cannguyen','$2b$10$10.aVFSe0Lv3yqvLCCaSre6XQGGQg2INNPNM2.cakO2QzU0MWWqsi','admin123@gmail.com',1,'2026-04-06 13:29:00','Active',NULL),(15,'TestLê2024','$2b$10$PpL/ZEjaH7eslC0wzQkR7eGTXNuIXXWOYk.CQue/X94kabf/fG0gm','tktest7749@gmail.com',4,'2026-04-23 13:50:36','Active',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchhistory`
--

LOCK TABLES `watchhistory` WRITE;
/*!40000 ALTER TABLE `watchhistory` DISABLE KEYS */;
INSERT INTO `watchhistory` VALUES (38,8,1,'2025-06-04 00:06:14'),(39,8,31,'2025-06-04 08:20:08'),(41,8,8,'2025-06-17 11:38:38'),(43,8,32,'2025-06-19 15:29:36'),(46,15,38,'2026-04-23 13:56:31'),(47,15,36,'2026-04-23 13:56:51'),(51,15,35,'2026-04-23 14:02:42'),(52,15,37,'2026-04-23 14:03:18');
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

-- Dump completed on 2026-04-23 14:40:14
