/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MariaDB
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : music

 Target Server Type    : MariaDB
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 17/04/2026 19:36:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for audio_track
-- ----------------------------
DROP TABLE IF EXISTS `audio_track`;
CREATE TABLE `audio_track`  (
  `audio_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `artist_id` int(11) NOT NULL,
  `audio_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Các giá trị: Short-audio, Instrumental, Full-song',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Mô tả ngữ cảnh, mục đích sử dụng để hỗ trợ Semantic Search',
  `lyrics` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `duration` int(11) NULL DEFAULT NULL COMMENT 'Thời lượng file âm thanh tính bằng giây',
  `original_file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `watermarked_file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT 'Pending' COMMENT 'Pending, Approved, Rejected, Revision',
  `play_count` int(11) NULL DEFAULT 0,
  `es_sync_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT 'Pending' COMMENT 'Pending, Synced, Failed',
  `upload_date` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`audio_id`) USING BTREE,
  INDEX `artist_id`(`artist_id`) USING BTREE,
  CONSTRAINT `audio_track_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audio_track
-- ----------------------------
INSERT INTO `audio_track` VALUES (1, 'You & Me', 1, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 148, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Pamela%20Yuen%20-%20You%20%26%20Me.mp3?alt=media&token=466c226a-7b7b-4273-b8c6-bc1f08d232e3', '', 'https://i1.sndcdn.com/artworks-XckRSUsvy3wMYU9w-xrjNsA-t1080x1080.jpg', 'Pending', 0, 'Pending', '2026-04-07 20:08:19');
INSERT INTO `audio_track` VALUES (2, '\r\nCloud Nine', 1, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 218, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Pamela%20Yuen%20-%20Cloud%20Nine.mp3?alt=media&token=9a68d8f6-4427-4ffc-8b55-947c11d28df8', '', 'https://www.shutterstock.com/image-illustration/on-cloud-nine-idiom-concept-260nw-594764105.jpg', 'Pending', 0, 'Pending', '2026-04-07 20:08:23');
INSERT INTO `audio_track` VALUES (3, '\r\nCome As You Are', 1, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 199, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Pamela%20Yuen%20-%20Come%20As%20You%20Are.mp3?alt=media&token=383837c3-2ecf-4b0e-a378-b0a3cc46b743', '', 'https://i.ytimg.com/vi/9I9c20LHmzY/sddefault.jpg', 'Pending', 0, 'Pending', '2026-04-07 20:08:27');
INSERT INTO `audio_track` VALUES (4, 'Undimmed Eyes', 1, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 60, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Pamela%20Yuen%20-%20Undimmed%20Eyes.mp3?alt=media&token=6168c6b7-cbe3-4a79-8cf0-d8bb0f72108a', '', 'https://substackcdn.com/image/fetch/$s_!SzYr!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc6c04b21-e53b-46fe-b592-199ec1cb1d71_1200x627.png', 'Pending', 0, 'Pending', '2026-04-07 20:08:31');
INSERT INTO `audio_track` VALUES (5, '\r\nContinue On', 1, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 154, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Pamela%20Yuen%20-%20Continue%20On.mp3?alt=media&token=3008ec16-4e6d-4fd0-b0f9-d64f907efc4d', '', 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-07 20:08:40');
INSERT INTO `audio_track` VALUES (6, 'enter the castle', 2, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 177, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Tommaso%20Croce%20-%20enter%20the%20castle.mp3?alt=media&token=64d923d2-cb2c-46c0-8f9b-a44e1741f54d', '', 'https://images.unsplash.com/photo-1631536565029-e6f979bc0717?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:05:47');
INSERT INTO `audio_track` VALUES (7, '\r\ndark alley', 2, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 125, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Tommaso%20Croce%20-%20dark%20alley.mp3?alt=media&token=02432188-c129-422a-baee-c9cfefc8debc', '', 'https://images.unsplash.com/photo-1512386923336-1440f4afe1d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:06:38');
INSERT INTO `audio_track` VALUES (8, '\r\ndark alley II', 2, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 109, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Tommaso%20Croce%20-%20dark%20alley%20II.mp3?alt=media&token=3f3e8ea0-3aea-4283-9bd2-455afd3fdbf4', '', 'https://images.unsplash.com/photo-1495745512803-dd531415ff55?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:07:24');
INSERT INTO `audio_track` VALUES (9, '\r\nserene village\r\n', 2, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 111, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Tommaso%20Croce%20-%20serene%20village.mp3?alt=media&token=b49a3867-e2ad-43de-8fbf-f50c34cb3e3f', '', 'https://images.unsplash.com/photo-1768325994062-a1a13893cec5?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:08:27');
INSERT INTO `audio_track` VALUES (10, 'arena', 2, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 96, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Tommaso%20Croce%20-%20arena.mp3?alt=media&token=a7e257f4-aff4-4101-947a-cb95ae7a1ad4', '', 'https://images.unsplash.com/photo-1585080523601-b371d8f791f0?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:09:28');
INSERT INTO `audio_track` VALUES (11, 'Flushed', 3, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 186, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Ketsa%20-%20Flushed.mp3?alt=media&token=395d02bd-cd95-4082-afd7-b6a88884cdc3', '', 'https://images.unsplash.com/photo-1555991910-65b4c0139fdf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:55:31');
INSERT INTO `audio_track` VALUES (12, 'Behind in Front', 3, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 180, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Ketsa%20-%20Behind%20in%20Front.mp3?alt=media&token=1af3e3f5-eaac-49c4-9d0f-e6d822dc9fae', '', 'https://images.unsplash.com/photo-1757092278930-ed8c52858c9e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:56:14');
INSERT INTO `audio_track` VALUES (13, '\r\nThem', 3, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 172, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Ketsa%20-%20Them.mp3?alt=media&token=269199c0-2be6-49d8-ac87-75ba02a2d274', '', 'https://images.unsplash.com/photo-1600202280882-c4458e54d257?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:56:44');
INSERT INTO `audio_track` VALUES (14, '\r\nNostalgia', 3, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 197, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Ketsa%20-%20Nostalgia.mp3?alt=media&token=4bcc77f7-0c68-4402-a22f-9f53efdec4c8', '', 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:57:17');
INSERT INTO `audio_track` VALUES (15, '\r\nDevolution', 3, 'Instrumental', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', NULL, 187, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Ketsa%20-%20Devolution.mp3?alt=media&token=92e7b6a1-1aef-4797-816c-3d99ad802707', '', 'https://plus.unsplash.com/premium_photo-1668902224017-4b131fe72ffd?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Pending', 0, 'Pending', '2026-04-08 15:57:43');
INSERT INTO `audio_track` VALUES (16, 'Người Im Lặng Gặp Người Hay Nói', 4, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Anh muốn thấy em cười\r\nTúi Chanel trên người\r\nTay toàn là Tiffany\r\nNói đi bất cứ gì babe\r\nAnh đều có thể đem tặng em đó baby\r\nĐem điều em mộng mơ\r\nBình phương nó baby\r\nNhưng tình yêu thì cứ để nó thế này đi\r\nTim anh không thể lớn hơn được\r\nNhớ ngày xưa từng mong mình\r\nSẽ là tình yêu chóng vánh\r\nDập dìu như sóng đánh\r\nNhanh chóng trôi qua\r\nAnh thì chưa chuẩn bị\r\nĐể mà thật lòng nghiêm túc với\r\nThật nhiều cảm xúc mới chen giữa đôi ta\r\nCứ như lún sâu trong nụ cười em\r\nChẳng thể bước đi khỏi nơi đây\r\nGiờ anh chỉ muốn ở bên em thôi\r\nAnh mong là anh sẽ không thay đổi\r\nNgười im lặng gặp người hay nói\r\nKhông bên cạnh ai quá lâu\r\nGiống như này đâu\r\nNên mong là hai trái tim\r\nSẽ không phải đau\r\nChưa từng yêu một ai nhiều như thế\r\nTừng cố bỏ đi nhưng đâu dễ\r\nNếu thế giới kia\r\nCó mong chúng ta chia đôi\r\nSẽ luôn có anh phía sau cùng em\r\nThề không để gì phải đổi thay\r\nHuh gọi là anh yêu đi\r\nHôm nay em không vui\r\nThì cầm tiền anh tiêu đi\r\nBao nhiêu câu này\r\nDành cho em không thôi\r\nVì bật nhạc anh lên nghe\r\nToàn là hey Kewtiie\r\nCho em bờ vai để mà ôm lấy\r\nMôi hơi bị khô đang cần hôn đấy\r\nBaby leo lên xe\r\nQua nhà anh như mọi hôm đấy\r\nCoi chừng bị trông thấy\r\nBao lâu nay chụp chung\r\nNhưng anh và em\r\nChưa bao giờ đăng\r\nChỉ lưu ở trong máy thôi\r\nBaby ơi\r\nEm y như truyện tranh\r\nAnh là bài hát không lời\r\nTrao cho anh vòng tay\r\nVì trời gió đông rồi\r\nKhi mà anh không còn fame\r\nLiệu còn em ở trong đời\r\nKể từ khi gặp em\r\nAnh đã bớt rong chơi\r\nBao câu thơ tràn ra\r\nVà nó mãi không vơi\r\nMai sau không còn nhau\r\nThì đừng khóc em ơi\r\nVì tình yêu ta trao\r\nCòn lại ở ông trời\r\nNhớ ngày xưa từng mong mình\r\nSẽ là tình yêu chóng vánh\r\nDập dìu như sóng đánh\r\nNhanh chóng trôi qua\r\nAnh thì chưa chuẩn bị\r\nĐể mà thật lòng nghiêm túc với\r\nThật nhiều cảm xúc mới chen giữa đôi ta\r\nCứ như lún sâu trong nụ cười em\r\nChẳng thể bước đi khỏi nơi đây\r\nGiờ anh chỉ muốn ở bên em thôi\r\nAnh mong là anh sẽ không thay đổi\r\nNgười im lặng gặp người hay nói\r\nKhông bên cạnh ai quá lâu\r\nGiống như này đâu\r\nNên mong là hai trái tim\r\nSẽ không phải đau\r\nChưa từng yêu một ai nhiều như thế\r\nTừng cố bỏ đi nhưng đâu dễ\r\nNếu thế giới kia\r\nCó mong chúng ta chia đôi\r\nSẽ luôn có anh phía sau cùng em\r\nThề không để gì phải đổi thay\r\nAnh mong là anh sẽ không thay đổi\r\nNgười im lặng gặp người hay nói\r\nKhông bên cạnh ai quá lâu\r\nGiống như này đâu\r\nNên mong là hai trái tim\r\nSẽ không phải đau\r\nChưa từng yêu một ai nhiều như thế\r\nTừng cố bỏ đi nhưng đâu dễ\r\nNếu thế giới kia\r\nCó mong chúng ta chia đôi\r\nSẽ luôn có anh phía sau cùng em\r\nThề không để gì phải đổi thay', 256, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Ng%C6%B0%E1%BB%9Di%20Im%20L%E1%BA%B7ng%20G%E1%BA%B7p%20Ng%C6%B0%E1%BB%9Di%20Hay%20N%C3%B3i.mp3?alt=media&token=5c7ea066-f791-4055-bc51-919a101fdb4b', '', 'https://image-cdn.nct.vn/song/2026/03/02/E/Y/l/H/1772460929773_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 21:45:28');
INSERT INTO `audio_track` VALUES (17, 'Exit Sign', 4, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Anh không nhớ nổi lần cuối cùng anh nhìn vào mắt em đó là từ bao giờ\r\nEm từng trách anh chỉ ôm ước mơ, còn không sợ mất em thì làm sao chờ\r\nLúc đó anh có xin lỗi hay không, thì kết quả nó cũng như nhau mà\r\nCuối cùng thì hai ta đều ích kỷ, nông nổi, tự trong cao mà\r\nTa từng bắt gặp nhau ở khắp Saigon chắc là lúc còn yêu thì muốn tránh cũng khó\r\nKhông thể tin là mình chưa từng gặp lại sau khi mà anh bước qua cánh cửa đó\r\nTình yêu mình từng là ánh lửa đỏ, từng là chim sẻ cố đập cánh giữa gió\r\nCố gắng sống 2 cuộc đời, chắc là thằng nhóc này muốn làm thần thánh nữa đó\r\nSao giờ em xuất hiện tại đây vầy\r\nCuối hàng khán giả với cánh tay vẫy\r\nEm từng cùng anh đứng ở hậu trường\r\nVà cùng anh về nhà sau khi mà bay nhảy\r\nCũng từng nói em không có gạt anh, em thích nhạc anh and you know the vision\r\nAnh từng hứa là mình không nhạt đâu, sẽ không lạc nhau, cùng bên nhau vào khi cần\r\nNgay lúc đó anh chỉ muốn lao xuống, anh thật sự tò mò em dạo này khỏe không\r\nNhưng mà sao hôm nay đi khuya vậy, ba mẹ em biết là ba mẹ sẽ trông\r\nAnh từng mong em hạnh phúc tới khi em nở nụ cười anh như bị đâm mười nhát\r\nKhi anh đứng trên sân khấu một mình\r\nCòn em đứng cạnh cùng với một người khác\r\n\r\nEm hiểu rằng chúng ta không ai là sai\r\nChỉ là em không muốn em mãi sẽ là lựa chọn thứ hai\r\nMãi sau những điều anh cho là lý do để anh tồn tại\r\nVậy đâu còn lý do để em ở lại?\r\nĐây sẽ là lý do em sẽ thôi đắn đo cứ ôm mộng hoài\r\nSo thanks for showing me the exit sign\r\n\r\nChưa nói tới đúng sai, nhưng chuyến xe dừng lại do chân anh đặt trên phanh\r\nAnh đã không ngần ngại, chia con đường làm hai vì anh nghĩ là anh quên nhanh\r\nGặp một cô gái mới, coi là cả thế giới, viết tên cả hai lên tranh\r\nKhông dễ nhiều đêm trắng để chờ lên nắng giờ thì kí ức gọi tên anh\r\nNên là cứ rót đi\r\nBàn vẫn ướt mặc dù có lót ly\r\nƯớc gì có thể paste nổi đau này qua chỗ khác, nhưng không nó nhân lên, nó chỉ copy\r\nThật khó để nhìn xung quanh khi chỉ trông ngóng vì sao như Xi-ôn-cốp-xki\r\nĐể bây giờ em đi mất, liên kết còn lại tồn tại giữa anh và em là chung một tài khoản shopee\r\nGom hết tất cả về em xong rồi thiêu nhanh\r\nGiọng em vang lên trước khi môi em mở, găm thẳng vào anh như là siêu thanh\r\nKhông cần phải là người giỏi toán đủ biết đây không phải đổi ngang\r\nEm chỉ mất đi một thằng thất bại, anh mất đi một người yêu anh\r\n8515 lần nói anh yêu em ở trong mess nếu mà em search\r\nCũng tới lúc mình phải quên đi thôi, dù từng có với nhau là rất nhiều cam kết\r\nTiếc nhất không phải chia tay mà là không yêu em nhiều hơn trước lúc tình yêu chết\r\nCó lẽ phải ghi tên em vào credit vì bài nhạc nào anh cũng viết về em hết\r\n\r\nEm hiểu rằng chúng ta không ai là sai\r\nChỉ là em không muốn em mãi sẽ là lựa chọn thứ hai\r\nMãi sau những điều anh cho là lý do để anh tồn tại\r\nVậy đâu còn lý do để em ở lại?\r\nĐây sẽ là lý do em sẽ thôi đắn đo cứ ôm mộng hoài\r\nSo thanks for showing me the exit sign\r\n\r\nHãy giữ gìn nhau trong những kỉ niệm\r\nI thank you for finally showing me the exit sign\r\n\r\nThanks for showing me the exit sign', 201, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Exit%20Sign.mp3?alt=media&token=39ff256f-3eef-4a62-8db7-aad4b50fe28b', '', 'https://image-cdn.nct.vn/song/2023/10/16/7/6/e/4/1697425533075_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 21:48:20');
INSERT INTO `audio_track` VALUES (18, 'KIM PHÚT, KIM GIỜ', 4, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Vậy đây là phút giây cuối thật sao\r\nSau bao nhiêu lần em nói\r\nĐây sẽ là đêm cuối cùng gặp nhau\r\nÔm trong lòng là những thành tích\r\nGiờ đã thành vô nghĩa\r\nNụ cười đã dần tắt, nhợt nhạt cả thần sắc,\r\nbàn tay nắm chặt vào nhau\r\nEm cho anh biết đi baby\r\nanh và em làm sai gì?\r\nĐể cho cuộc đời hành hạ hai ta\r\nnhư thể trái tim này chai lì\r\nĐồng hồ cứ tíc tắc trôi,\r\nanh biết rằng đã không kịp rồi...\r\nGiá như những lần em muốn cạnh bên,\r\nanh đã không \"Hẹn gặp ngày mai đi\"\r\nĐã từng nói rằng\r\n\"Anh không muốn mất thời gian để tranh cãi!\"\r\nGiờ thì chỉ có thể quỳ xuống và\r\nước cho thời gian sẽ trôi qua chậm lại\r\nAnh chỉ muốn mang hết số tiền trong bank chỉ để\r\nđổi lấy một phút mà thôi\r\nMua được chiếc đồ hồ trong mơ nhưng bây giờ\r\nchỉ mong rằng nó sẽ chết đi mà thôi\r\nAnh còn nhớ về những năm tháng mà\r\ncái tên của em không gắn liền với một kỷ niệm nào cả\r\nMắc cười ha, giờ thì xóa biệt danh là ta đã\r\ncó thể trở thành hai người xa lạ\r\nMình phải chia tay thật sao\r\nCòn nhiều lời hứa từng trao\r\nGiờ đây anh phải thế nào\r\nĐứng nhìn em cùng người ta sao\r\nChẳng muốn phải ôm khát vọng\r\nRồi lỡ buông tay bỏ mặc em ở lại phía sau\r\nƯớc cho kim đồng hồ kia ngưng\r\nĐể ta sẽ mãi đứng im\r\nChẳng phải đuổi theo điều gì\r\nWhere are you my baby\r\nNghe anh mà quay lại ngay đi\r\nBao nhiêu tình yêu em cần để đừng buông bàn tay đi\r\nTa đã làm sai điều gì em\r\nAnh đã phải thức thật nhiều đêm\r\nAnh anh tự yên lòng mình là chẳng còn duyên,\r\nlà maybe\r\nSao ông trời\r\nKhông cho gặp nhau ở một đoạn sau trong đời\r\nNgày mà mình không hay mơ mục tiêu xa vời\r\nEm hãy quên anh là ai\r\nMiễn là em sẽ không nhìn anh\r\nnhư là một trong những lựa chọn sai\r\nGhim giọt lệ đằng sau mi\r\nDành một ngày cho nhau đi\r\nThật lòng là anh không cam tâm là mai ta không gặp lại\r\nVì mặt trời và mây lên\r\nSẽ chẳng cầm được tay em\r\nLiệu bầu trời kia mưa rơi có phải đang giữa chân mình lại\r\nEm muốn nắm tay anh lần cuối cùng\r\nHãy làm ngay đi\r\nCho anh được ôm em một lần cuối thôi\r\nMau ôm rồi em đi\r\nHôm nay thật ra là anh đây\r\nkhông dám nhắm mắt dù chỉ 1 lần\r\nEm đi và sẽ ôm lấy những phút cuối\r\nđặt tận vào trong lòng\r\nEm cũng đâu có nói gì\r\nLặng nhìn anh đấy anh cứ nói đi\r\nBaby. I\'m not crying\r\nNhưng nói ra sợ nước mắt ở trên khóe mi\r\nChẳng còn giống ý như lần đầu\r\nEm có muốn em như vậy đâu\r\nKhông đi tiếp thôi đừng đợi\r\nđồng hồ đang quay chẳng biết ngừng đâu\r\nĐến giờ lại đếm giờ và em không muốn giải thích\r\nCho anh thêm thời gian để rồi có lỗi đó là tại mình\r\nNgười lặng nhìn vấn vương\r\nNgười nặng tình vẫn thương\r\nDừng lại đây là do khoảng cách hai ta\r\nMình phải chia tay thật sao\r\nCòn nhiều lời hứa từng trao\r\nGiờ đây anh phải thế nào\r\nĐứng nhìn em cùng người ta sao\r\nChẳng muốn phải ôm khát vọng\r\nRồi lỡ buông tay bỏ mặc em ở lại phía sau\r\nƯớc cho kim đồng hồ kia ngưng\r\nĐể ta sẽ mãi đứng im\r\nChẳng phải đuổi theo điều gì\r\nBiết trước kết thúc ta sẽ ra xa\r\nNhưng bao đêm suy tư anh dằn lòng đừng đau quá\r\nNgày mình chẳng thể ở bên nhau chưa một giây\r\ntrôi nào anh có thể nghĩ đến được\r\nTại sao phải là hôm nay?\r\nCứ biến mất thôi sẽ chẳn thể đau như này\r\nĐã bao giờ cuộc tình này nằm đầu dòng\r\nvà điền vào mai sau của nhau\r\nMình phải chia tay thật sao\r\nCòn nhiều lời hứa từng trao\r\nGiờ đây anh phải thế nào?\r\nĐứng nhìn em cùng người khác sao?\r\nChẳng muốn phải ôm khát vọng\r\nRồi lỡ buông tay bỏ mặc em ở lại phía sau\r\nƯớc chi kim đồng hồ kia ngưng\r\nĐể ta sẽ mãi đứng im\r\nChẳng phải đuổi theo điều gì\r\nChẳng phải đuổi theo điều gì...\r\nSẽ chỉ còn lại anh mang theo nuối tiếc\r\nVề một nơi xa\r\nKhông có em sau này\r\nGiờ phải làm sao níu lại từng giây trôi\r\nGiờ đây anh phải thế nào đây?\r\nChẳng muốn phải ôm khát vọng\r\nRồi lỡ buông tay em\r\nƯớc chi kim đồng hồ kia ngưng\r\nĐể ta sẽ mãi đứng im\r\nChẳng phải đuổi theo điều gì...', 295, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/KIM%20PH%C3%9AT%2C%20KIM%20GI%E1%BB%9C.mp3?alt=media&token=651425ef-7784-456f-af93-37d5a5a5c6ec', '', 'https://image-cdn.nct.vn/song/2024/08/23/e/c/3/c/1724421820127_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 21:48:23');
INSERT INTO `audio_track` VALUES (19, 'Không Thể Say', 4, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'CHORUS:\r\nĐã hơn một năm trôi qua\r\nMà mẹ vẫn thế cứ tiếc đôi ta\r\nXoá cả hình xăm trên da\r\nChuyện tình mình cũng chẳng thể phôi pha\r\nChắc cũng đã lâu anh không muốn say mà\r\nCuối cùng là hôm nay anh lại nhớ tới em\r\nCó thể sẽ phone cho em\r\nVà sẽ lại nói anh vẫn yêu em\r\nBấm chuông nhà em trong đêm\r\nVà hàng ngàn thứ biết chắc không nên\r\nHứa trong lòng anh sẽ không uống thêm được\r\nVì em là lý do số một, làm cho anh không thể say.\r\n\r\nVERSE A:\r\nAnh giờ đây thì vẫn đang cố quên\r\nNhững ngày ta còn được nằm ở bên\r\nCó thêm thành công hay kiếm thêm nhiều tiền\r\nĐược biết tên, bởi nhiều người\r\nChẳng giúp anh nở nụ cười được nữa đâu\r\nBởi vì đăng sau ánh đèn ở cạnh anh thì chẳng có ai\r\nVà cũng đã cố yêu nhiều mặc dù biết là điều đó sai\r\nCó lẽ anh chẳng yêu thêm\r\nGiờ mọi thông báo anh đều mong là của em\r\nƯớt ở trên mi\r\nMỗi lần qua từng nơi dấu chân ta đi\r\nGiờ còn đâu tình yêu lúc không là gì\r\nUống thêm là vì\r\n\r\nNước mắt anh rơi vào tận trong ly\r\nChúng ta không sai\r\nNhưng giờ đây làm sao để em quay lại\r\nNhà và xe làm chi ngóng trông em hoài\r\nThức cả đêm dài\r\nMuốn em bên anh phải gọi thêm chai\r\n\r\nCHORUS:\r\nĐã hơn một năm trôi qua\r\nMà mẹ vẫn thế cứ tiếc đôi ta\r\nXoá cả hình xăm trên da\r\nChuyện tình mình cũng chẳng thể phôi pha\r\nChắc cũng đã lâu anh không muốn say mà\r\nCuối cùng là hôm nay anh lại nhớ tới em\r\nCó thể sẽ phone cho em\r\nVà sẽ lại nói anh vẫn yêu em\r\nBấm chuông nhà em trong đêm\r\nVà hàng ngàn thứ biết chắc không nên\r\nHứa trong lòng anh sẽ không uống thêm được\r\nVì em là lý do số một, làm cho anh không thể say.\r\n\r\nVERSE B:\r\nBiết chắc chắn chẳng thể nào lại gặp nhau ở trên đường đời\r\nChỉ muốn ước mai sau em sẽ gặp thêm một ai tuyệt vời\r\nAnh cũng sẽ đi tiếp tục chẳng tổn thương người đến sau nhiều như em\r\nVì anh đã từng thấy em đây phải đau\r\nKhóc khi ta cãi nhau\r\nChẳng thể ngủ được đâu\r\nVà mắt sưng qua ngày sau\r\nCũng chẳng thể níu thêm chi\r\n\r\nChỉ bằng hãy giữ lấy nước mắt em đi\r\n\r\nƯớt ở trên mi\r\nMỗi lần qua từng nơi dấu chân ta đi\r\nGiờ còn đâu tình yêu lúc không là gì\r\nUống thêm là vì\r\nNước mắt anh rơi vào tận trong ly\r\nChúng ta không sai\r\nNhưng giờ đây làm sao để em quay lại\r\nNhà và xe làm chi ngóng trông em hoài\r\nThức cả đêm dài\r\nMuốn em bên anh phải gọi thêm chai\r\n\r\nBRIDGE:\r\nTừng hứa bao nhiêu câu\r\nGiờ cũng không bên nhau\r\nChẳng biết hôm chia tay em đã ngồi khóc trong bao lâu\r\nLúc đó đủ can đảm đâu mà nhìn lại\r\nCố gắng hết bao nhiêu giờ cũng xa nhau mãi\r\n\r\nCHORUS:\r\nĐã hơn một năm trôi qua\r\nMà mẹ vẫn thế cứ tiếc đôi ta\r\nXoá cả hình xăm trên da\r\nChuyện tình mình cũng chẳng thể phôi pha\r\nChắc cũng đã lâu anh không muốn say mà\r\nCuối cùng là hôm nay anh lại nhớ tới em\r\nCó thể sẽ phone cho em\r\nVà sẽ lại nói anh vẫn yêu em\r\nBấm chuông nhà em trong đêm\r\n\r\nVà hàng ngàn thứ biết chắc không nên\r\nHứa trong lòng anh sẽ không uống thêm được\r\nVì em là lý do số một, làm cho anh không thể say.', 228, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Kh%C3%B4ng%20Th%E1%BB%83%20Say.mp3?alt=media&token=8930f627-90bd-49fd-b30d-444829fc06a1', '', 'https://image-cdn.nct.vn/song/2023/04/19/d/2/5/3/1681879735020_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 21:49:28');
INSERT INTO `audio_track` VALUES (20, 'NGÁO NGƠ', 4, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', '[Verse 1: HIEUTHUHAI, Anh Tú Atus]\r\nHey!\r\nAnh vẫn nhớ tối đó khi hôn nhau đầu tiên là vào ngày mấy\r\nMình cùng bước dưới phố con tim đập nhanh ngày đầu nắm tay\r\nTừng một bầu trời đắm say\r\nGiờ tìm lại cảm xúc nơi đâu ngày hôm ấy\r\n\r\nĐằng nào thì mình cũng bước tiếp thôi\r\nAnh quên hết rồi\r\nHạnh phúc hơn ở nơi không có em\r\nGặp người mới luôn ở kế bên chịu lắng nghe\r\nMột người chẳng cố cho rằng tất cả tại anh sai\r\n\r\n[Pre-Chorus: JSOL]\r\nDù cho anh đã cố dối lòng em vẫn luôn trong đầu\r\nGiờ anh cứ lơ ngơ ôm giấc mơ không màu\r\nChỉ mong em sẽ quay lại\r\nSo baby please make up your mind\r\n\r\n[Chorus: Erik, HIEUTHUHAI]\r\nAnh cứ đi trên con đường xưa khi ta bên nhau\r\nTìm về nơi trước kia mình say sưa bao đêm thâu\r\nChờ một ngày tình cờ mình bước qua nhau 1 giây thôi\r\nĐể một lần được thấy như ta còn chung đôi\r\n\r\nNăm tháng qua anh luôn vờ như ta chưa chia ly\r\nDù hàng trăm lý do để con tim quên em đi\r\nTừng ngày đều phải cố để luôn tươi cười\r\nTrở thành một thằng ngáo ngơ\r\nAnh ngáo ngơ vì em mà\r\n\r\n[Rap: JSOL, Erik]\r\nTháng thứ nhất sau chia tay, anh okay\r\nFeeling free không ai call như lâu nay\r\nMong mau quên nhưng mà anh đây đâu hay\r\nBây giờ đây không ai cho con tim anh bay bay như là em\r\nƯơng bướng hâm hâm như là em\r\nTâm trí xoay quanh anh là em, toàn em\r\nGiờ nhìn mọi cô xung quanh, tất cả giống như một người\r\n\r\nVà mình còn một lời thề sẽ không yêu thêm một ai\r\nAnh mong cho em sẽ phải luôn ôm nó\r\nXung quanh yêu ai toàn sai\r\nChuyện tình yêu không may trừ khi anh trong đó\r\n\r\nAnh không can tâm khi người khác bên em\r\nVideo call nhìn em ngủ mỗi đêm\r\nBởi vì nếu anh chẳng thể ở bên em\r\nThì anh không muốn ai làm được\r\n\r\n[Pre-Chorus: Anh Tú Atus]\r\nDù cho anh đã cố dối lòng em vẫn luôn trong đầu\r\nGiờ anh cứ lơ ngơ ôm giấc mơ không màu\r\nChỉ mong em sẽ quay lại\r\nSo baby please make up your mind\r\n[Chorus: JSOL, Anh Tú Atus]\r\nAnh cứ đi trên con đường xưa khi ta bên nhau\r\nTìm về nơi trước kia mình say sưa bao đêm thâu\r\nChờ một ngày tình cờ mình bước qua nhau 1 giây thôi\r\nĐể một lần được thấy như ta còn chung đôi\r\n\r\nNăm tháng qua anh luôn vờ như ta chưa chia ly\r\nDù hàng trăm lý do để con tim quên em đi\r\nTừng ngày đều phải cố để luôn tươi cười\r\nTrở thành một thằng ngáo ngơ\r\nAnh ngáo ngơ vì em mà\r\n\r\n[Bridge: Orange]\r\nNếu mất em anh đã buồn như thế\r\nVậy lúc chia tay sao anh lại lạnh lùng như thế\r\nSự thật là chính anh cũng đâu hiểu được mình đâu\r\n\r\nEm đã khác xưa rất nhiều\r\nĐã bỏ đi những điều làm trái tim em bận tâm\r\nAnh còn chờ điều gì nữa\r\nNgười hãy tập quên em đi và tìm hạnh phúc mới\r\n\r\n[Chorus: HIEUTHUHAI, (Orange)]\r\nAnh cứ đi trên con đường xưa khi ta bên nhau (ah)\r\nTìm về nơi trước kia mình say sưa bao đêm thâu (ah)\r\nChờ một ngày tình cờ mình bước qua nhau 1 giây thôi\r\nĐể một lần được thấy như ta còn chung đôi', 252, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/NG%C3%81O%20NG%C6%A0.mp3?alt=media&token=c03f5b6b-589f-48a5-bba8-43755ad42c1d', '', 'https://image-cdn.nct.vn/song/2024/08/02/6/5/b/a/1722607585053_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 21:50:42');
INSERT INTO `audio_track` VALUES (21, 'Nơi Này Có Anh', 5, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Em là ai từ đâu bước đến nơi đây dịu dàng chân phương\r\nEm là ai tựa như ánh nắng ban mai ngọt ngào trong sương\r\nNgắm em thật lâu\r\nCon tim anh yếu mềm\r\nĐắm say từ phút đó\r\nTừng giây trôi yêu thêm\r\nBao ngày qua bình minh đánh thức xua tan bộn bề nơi anh\r\nBao ngày qua niềm thương nỗi nhớ bay theo bầu trời trong xanh\r\nLiếc đôi hàng mi\r\nMong manh anh thẫn thờ\r\nMuốn hôn nhẹ mái tóc\r\nBờ môi em anh mơ\r\nCầm tay anh dựa vai anh\r\nKề bên anh nơi này có anh\r\nGió mang câu tình ca\r\nNgàn ánh sao vụt qua nhẹ ôm lấy em\r\n(Yêu em thương em con tim anh chân thành)\r\nCầm tay anh dựa vai anh\r\nKề bên anh nơi này có anh\r\nKhép đôi mi thật lâu\r\nNguyện mãi bên cạnh nhau\r\nYêu say đắm như ngày đầu\r\nMùa xuân đến bình yên\r\nCho anh những giấc mơ\r\nHạ lưu giữ ngày mưa\r\nNgọt ngào nên thơ\r\nMùa thu lá vàng rơi\r\nĐông sang anh nhớ em\r\nTình yêu bé nhỏ xin\r\nDành tặng riêng em\r\nCòn đó tiếng nói ấy bên tai\r\nVấn vương bao ngày qua\r\nÁnh mắt bối rối\r\nNhớ thương bao ngày qua\r\nYêu em anh thẫn thờ\r\nCon tim bâng khuâng đâu có ngờ\r\nChẳng bao giờ phải mong chờ\r\nĐợi ai trong chiều hoàng hôn mờ\r\nĐắm chìm hòa vào vần thơ\r\nNgắm nhìn khờ dại mộng mơ\r\nĐừng bước vội vàng rồi làm ngơ\r\nLạnh lùng đó làm bộ dạng thờ ơ\r\nNhìn anh đi em nha\r\nHướng nụ cười cho riêng anh nha\r\nĐơn giản là yêu\r\nCon tim anh lên tiếng thôi\r\nCầm tay anh dựa vai anh\r\nKề bên anh nơi này có anh\r\nGió mang câu tình ca\r\nNgàn ánh sao vụt qua nhẹ ôm lấy em\r\n(Yêu em thương em con tim anh chân thành)\r\nCầm tay anh dựa vai anh\r\nKề bên anh nơi này có anh\r\nKhép đôi mi thật lâu\r\nNguyện mãi bên cạnh nhau\r\nYêu say đắm như ngày đầu\r\nMùa xuân đến bình yên\r\nCho anh những giấc mơ\r\nHạ lưu giữ ngày mưa\r\nNgọt ngào nên thơ\r\nMùa thu lá vàng rơi\r\nĐông sang anh nhớ em\r\nTình yêu bé nhỏ xin\r\nDành tặng riêng em\r\nOh nhớ thương em\r\nOh nhớ thương em lắm\r\nAh phía sau chân trời\r\nCó ai băng qua lối về\r\nCùng em đi trên đoạn đường dài\r\nCầm tay anh dựa vai anh\r\nKề bên anh nơi này có anh\r\nGió mang câu tình ca\r\nNgàn ánh sao vụt qua nhẹ ôm lấy em\r\n(Yêu em thương em con tim anh chân thành)\r\nCầm tay anh dựa vai anh\r\nKề bên anh nơi này có anh\r\nKhép đôi mi thật lâu\r\nNguyện mãi bên cạnh nhau\r\nYêu say đắm như ngày đầu\r\nMùa xuân đến bình yên\r\nCho anh những giấc mơ\r\nHạ lưu giữ ngày mưa\r\nNgọt ngào nên thơ\r\nMùa thu lá vàng rơi\r\nĐông sang anh nhớ em\r\nTình yêu bé nhỏ xin\r\nDành tặng riêng em', 260, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/N%C6%A1i%20N%C3%A0y%20C%C3%B3%20Anh.mp3?alt=media&token=8d04c545-869c-45e6-bde8-9f645d3bae24', '', 'https://image-cdn.nct.vn/song/2024/03/15/4/c/b/d/1710498649541_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 22:20:22');
INSERT INTO `audio_track` VALUES (22, 'Hãy Trao Cho Anh', 5, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Bóng ai đó nhẹ nhàng vụt qua nơi đây\r\nQuyến rũ ngây ngất loạn nhịp làm tim mê say\r\nCuốn lấy áng mây theo cơn sóng xô dập dìu\r\nNụ cười ngọt ngào cho ta tan vào phút giây miên man quên hết con đường về eh\r\nChẳng thể tìm thấy lối về ehhhhh\r\nĐiệu nhạc hòa quyện trong ánh mắt đôi môi\r\nDẫn lối những bối rối rung động khẽ lên ngôi\r\n\r\nChạm nhau mang vô vàn\r\nĐắm đuối vấn vương dâng tràn\r\nLấp kín chốn nhân gian\r\nLàn gió hóa sắc hương mơ màng\r\nMột giây ngang qua đời\r\nCất tiếng nói không nên lời\r\nẤm áp đến trao tay ngàn sao trời lòng càng thêm chơi vơi\r\nDịu êm không gian bừng sáng đánh thức muôn hoa mừng\r\nQuấn quít hát ngân nga từng chút níu bước chân em dừng\r\nBao ý thơ tương tư ngẩn ngơ\r\nLưu dấu nơi mê cung đẹp thẫn thờ\r\n\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh thứ anh đang mong chờ\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy mau làm điều ta muốn vào khoảnh khắc này đê\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao anh trao cho anh đi những yêu thương nồng cháy\r\nTrao anh ái ân nguyên vẹn đong đầy\r\n\r\nLooking at my Gucci is about that time\r\nWe can smoke a blunt and pop a bottle of wine\r\nNow get yourself together and be ready by nine\r\nCuz we gon’ do some things that will shatter your spine\r\nCome one, undone, Snoop Dogg, Son Tung\r\nLong Beach is the city that I come from\r\nSo if you want some, get some\r\nBetter enough take some, take some\r\n\r\n\r\nChạm nhau mang vô vàn\r\nĐắm đuối vấn vương dâng tràn\r\nLấp kín chốn nhân gian làn\r\nGió hóa sắc hương mơ màng\r\nMột giây ngang qua đời\r\nCất tiếng nói không nên lời\r\nẤm áp đến trao tay ngàn sao trời lòng càng thêm chơi vơi\r\nDịu êm không gian bừng sáng đánh thức muôn hoa mừng\r\nQuấn quít hát ngân nga từng chút níu bước chân em dừng\r\nBao ý thơ tương tư ngẩn ngơ\r\nLưu dấu nơi mê cung đẹp thẫn thờ\r\n\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh thứ anh đang mong chờ\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy mau làm điều ta muốn vào khoảnh khắc này đê\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao anh trao cho anh đi những yêu thương nồng cháy\r\nTrao anh ái ân nguyên vẹn đong đầy\r\n\r\n\r\nEm cho ta ngắm thiên đàng vội vàng qua chốc lát\r\nNhư thanh âm chứa bao lời gọi mời trong khúc hát\r\nLiêu xiêu ta xuyến xao rạo rực khát khao trông mong\r\nDịu dàng lại gần nhau hơn dang tay ôm em vào lòng\r\nTrao đi trao hết đi đừng ngập ngừng che dấu nữa\r\nQuên đi quên hết đi ngại ngùng lại gần thêm chút nữa\r\nChìm đắm giữa khung trời riêng hai ta như dần hòa quyện mắt nhắm mắt tay đan tay hồn lạc về miền trăng sao\r\n\r\nEm cho ta ngắm thiên đàng vội vàng qua chốc lát\r\nNhư thanh âm chứa bao lời gọi mời trong khúc hát\r\nLiêu xiêu ta xuyến xao rạo rực khát khao trông mong\r\nDịu dàng lại gần nhau hơn dang tay ôm em vào lòng\r\nTrao đi trao hết đi đừng ngập ngừng che dấu nữa\r\nQuên đi quên hết đi ngại ngùng lại gần thêm chút nữa\r\nChìm đắm giữa khung trời riêng hai ta như dần hòa quyện mắt nhắm mắt tay đan tay hồn lạc về miền trăng sao\r\n\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh\r\nHãy trao cho anh thứ anh đang mong chờ', 245, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/H%C3%A3y%20Trao%20Cho%20Anh.mp3?alt=media&token=acafc76d-a703-46bc-96be-43a623923288', '', 'https://image-cdn.nct.vn/song/2019/07/03/7/5/b/e/1562137543919_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 22:20:26');
INSERT INTO `audio_track` VALUES (23, 'CHẠY NGAY ĐI', 5, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Từng phút cứ mãi trôi xa phai nhòa dần kí ức giữa đôi ta\r\nTừng chút nỗi nhớ hôm qua đâu về lạc bước cứ thế phôi pha\r\nCon tim giờ không cùng chung đôi nhịp\r\nNụ cười lạnh băng còn đâu nồng ấm thân quen\r\nVô tâm làm ngơ thờ ơ tương lai ai ngờ\r\nQuên đi mộng mơ ngày thơ tan theo sương mờ\r\n\r\nMưa lặng thầm đường vắng chiều nay\r\nIn giọt lệ nhòe khóe mắt sầu cay\r\nBao hẹn thề tàn úa vụt bay\r\nTrôi dạt chìm vào những giấc nồng say\r\nQuay lưng chia hai lối\r\nCòn một mình anh thôi\r\nGiả dối bao trùm bỗng chốc lên ngôi\r\nTrong đêm tối\r\nBầu bạn cùng đơn côi\r\nSuy tư anh kìm nén đã bốc cháy yêu thương trao em rồi\r\n\r\nĐốt sạch hết\r\nSon môi hồng vương trên môi bấy lấu\r\nHương thơm dịu êm mê man bấy lâu\r\nAnh không chờ mong quan tâm nữa đâu\r\nTương lai từ giờ như bức tranh em quên tô màu\r\nĐốt sạch hết\r\nXin chôn vùi tên em trong đớn đau\r\nNơi hiu quạnh tan hoang ngàn nỗi đau\r\nDư âm tàn tro vô vọng phía sau\r\nĐua chen dày vò xâu xé quanh thân xác nát nhàu\r\n\r\nChạy ngay đi trước khi\r\nMọi điều dần tồi tệ hơn\r\nChạy ngay đi trước khi\r\nLòng hận thù cuộn từng cơn\r\nTựa giông tố đến bên ghé thăm\r\nTừ nơi hố sâu tối tăm\r\nChạy đi trước khi\r\nMọi điều dần tồi tệ hơn\r\n\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\n\r\nBuông bàn tay buông xuôi hi vọng buông bình yên\r\nĐâu còn nguyên tháng ngày rực rỡ phai úa hằn sâu triền miên\r\nVết thương cứ thêm khắc thêm mãi thêm\r\nChà đạp vùi dập dẫm lên tiếng yêu ấm êm\r\nNhìn lại niềm tin từng trao giờ sao sau bao ngu muội sai lầm anh vẫn yếu mềm\r\nCăn phòng giam cầm thiêu linh hồn cô độc em trơ trọi kêu gào xót xa\r\nCăm hận tuôn trào dâng lên nhuộm đen ghì đôi vai đừng mong chờ thứ tha\r\nAhhhh\r\nChính em gây ra mà\r\nNhững điều vừa diễn ra\r\nChính em gây ra mà, chính em gây ra mà\r\nNhững điều vừa diễn ra\r\nHết thật rồi\r\n\r\nĐốt sạch hết\r\nSon môi hồng vương trên môi bấy lâu\r\nHương thơm dịu êm mê man bấy lâu\r\nAnh không chờ mong quan tâm nữa đâu\r\nTương lai từ giờ như bức tranh em quên tô màu\r\nĐốt sạch hết\r\nXin chôn vùi tên em trong đớn đau\r\nNơi hiu quạnh tan hoang ngàn nỗi đau\r\nDư âm tàn tro vô vọng phía sau\r\nĐua chen dày vò xâu xé quanh thân xác nát nhàu\r\n\r\nChạy ngay đi trước khi\r\nMọi điều dần tồi tệ hơn\r\nChạy ngay đi trước khi\r\nLòng hận thù cuộn từng cơn\r\nTựa giông tố đến bên ghé thăm\r\nTừ nơi hố sâu tối tăm\r\nChạy đi trước khi\r\nMọi điều dần tồi tệ hơn!\r\n\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\n\r\nĐốt sạch hết ... Ohhhh\r\nChính em gây ra mà, chính em gây ra mà\r\nĐốt sạch hết ... Ohhhh!\r\nĐừng nhìn anh với khuôn mặt xa lạ\r\nXin đừng lang thang trong tâm trí anh từng đêm nữa\r\nQuên đi quên đi hết đi\r\nQuên đi quên đi hết đi\r\nThắp lên điều đáng thương lạnh giá ôm trọn giấc mơ vụn vỡ!\r\n\r\nBốc cháy lên cơn hận thù trong anh\r\nCơn hận thù trong anh\r\nBốc cháy lên cơn hận thù trong anh\r\nAi khơi dậy cơn hận thù trong anh\r\nBốc cháy lên cơn hận thù trong anh\r\nCơn hận thù trong anh\r\nBốc cháy lên cơn hận thù trong anh\r\nAi khơi dậy cơn hận thù trong anh\r\n\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái\r\nKhông còn ai cạnh bên em ngày mai\r\nTạm biệt một tương lai ngang trái', 248, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/CH%E1%BA%A0Y%20NGAY%20%C4%90I.mp3?alt=media&token=91a031da-c1e0-4e88-98a4-5d9b7b97b98f', '', 'https://image-cdn.nct.vn/song/2018/05/12/e/8/6/f/1526059033533_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 22:20:30');
INSERT INTO `audio_track` VALUES (24, 'Muộn Rồi Mà Sao Còn', 5, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', '[Verse 1]\r\nMuộn rồi mà sao còn\r\nNhìn lên trần nhà rồi quay ra lại quay vào\r\nNằm trằn trọc vậy đến sáng mai\r\nÔm tương tư nụ cười của ai đó\r\nLàm con tim ngô nghê như muốn khóc òa\r\nVắt tay lên trên trán mơ mộng\r\nĐược đứng bên em trong nắng xuân hồng\r\nMột giờ sáng trôi qua trôi nhanh kéo theo ưu phiền miên man\r\nÂm thầm gieo tên em vẽ lên hi vọng\r\nĐúng là yêu thật rồi còn không thì hơi phí này\r\nCứ thế loanh quanh loanh quanh loanh quanh lật qua lật lại hai giờ\r\n\r\n[Pre-Chorus]\r\nNhững ngôi sao trên cao là người bạn tâm giao\r\nLắng nghe anh luyên thuyên về một tình đầu đẹp tựa chiêm bao\r\nCó nghe thôi đã thấy ngọt ngào đủ biết anh si mê em nhường nào\r\nÍt khi văn thơ anh dạt dào bụng đói nhưng vui quên luôn cồn cào\r\nNắm đôi tay kiêu sa được một lần không ta\r\nNghĩ qua thôi con tim trong anh đập tung lên rung nóc rung nhà\r\nHóa ra yêu đơn phương một người, hóa ra khi tơ vương một người\r\nBa giờ đêm vẫn ngồi cười\r\n\r\n[Chorus]\r\nCứ ôm anh đi ôm anh đi ôm anh đi ôm anh đi\r\nÔm trong cơn mơ trong cơn mơ trong cơn mơ ôm trong cơn mơ\r\nCó thế cũng khiến anh vui điên lên ngỡ như em đang bên\r\nChắp bút đôi ba câu thơ ngọt ngào muốn em đặt tên\r\nCứ ôm anh đi ôm anh đi ôm anh đi ôm anh đi\r\nÔm trong giấc mơ trong cơn mơ trong cơn mơ ôm trong cơn mơ\r\nYêu đến vậy thôi phát điên rồi làm sao giờ\r\nChịu\r\n\r\n[Verse 2]\r\nĐêm nay không ngủ tay kê lên tủ\r\nMiên man anh tranh thủ\r\nChơi vơi suy tư bao nhiêu cho đủ\r\nYêu em ngu ngơ mình tôi\r\nYêu không quan tâm ngày trôi\r\nYêu ánh mắt bờ môi\r\nYêu đơn phương vậy thôi lại còn chối\r\nCon tim thẹn thùng đập lạc lối liên hồi\r\nĐừng chày cối\r\nMiệng cười cả ngày vậy là chết toi rồi\r\nNgày càng nhiều thêm\r\nTình yêu cho em ngày càng nhiều thêm\r\nMuốn nắm đôi bàn tay đó một lần\r\nDu dương chìm sâu trong từng câu ca dịu êm\r\n\r\n[Pre-Chorus]\r\nNhững ngôi sao trên cao là người bạn tâm giao\r\nLắng nghe anh luyên thuyên về một tình đầu đẹp tựa chiêm bao\r\nCó nghe thôi đã thấy ngọt ngào đủ biết anh si mê em nhường nào\r\nÍt khi văn thơ anh dạt dào bụng đói nhưng vui quên luôn cồn cào\r\nNắm đôi tay kiêu sa được một lần không ta\r\nNghĩ qua thôi con tim trong anh đập tung lên rung nóc rung nhà\r\nHóa ra yêu đơn phương một người, hóa ra khi tơ vương một người\r\nBa giờ đêm vẫn ngồi cười\r\n\r\n[Chorus]\r\nCứ ôm anh đi ôm anh đi ôm anh đi ôm anh đi\r\nÔm trong cơn mơ trong cơn mơ trong cơn mơ ôm trong cơn mơ\r\nCó thế cũng khiến anh vui điên lên ngỡ như em đang bên\r\nChắp bút đôi ba câu thơ ngọt ngào muốn em đặt tên\r\nCứ ôm anh đi ôm anh đi ôm anh đi ôm anh đi\r\nÔm trong giấc mơ trong cơn mơ trong cơn mơ ôm trong cơn mơ\r\nYêu đến vậy thôi phát điên rồi làm sao giờ\r\n\r\n[Bridge]\r\nEm xinh như một thiên thần\r\nNhư một thiên thần\r\nNhư một thiên thần\r\nNgỡ như em là thiên thần\r\nXinh như một thiên thần\r\nNhư một thiên thần\r\nEm xinh như một thiên thần\r\nNhư một thiên thần\r\nNhư một thiên thần\r\nNgỡ như em là thiên thần\r\nNgỡ như ngỡ như\r\nNgỡ như ngỡ như ngỡ như\r\n\r\n[Chorus]\r\nCứ ôm anh đi ôm anh đi ôm anh đi ôm anh đi\r\nÔm trong cơn mơ trong cơn mơ trong cơn mơ ôm trong cơn mơ\r\nCó thế cũng khiến anh vui điên lên ngỡ như em đang bên\r\nChắp bút đôi ba câu thơ ngọt ngào muốn em đặt tên\r\nCứ ôm anh đi ôm anh đi ôm anh đi ôm anh đi\r\nÔm trong giấc mơ trong cơn mơ trong cơn mơ ôm trong cơn mơ\r\nYêu đến vậy thôi phát điên rồi làm sao giờ', 275, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/Mu%E1%BB%99n%20R%E1%BB%93i%20M%C3%A0%20Sao%20C%C3%B2n.mp3?alt=media&token=d1be393c-eb32-4c98-862f-0cd696b1e6b7', '', 'https://image-cdn.nct.vn/song/2021/04/29/9/1/f/8/1619691182261_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 22:20:32');
INSERT INTO `audio_track` VALUES (25, 'Lạc Trôi', 5, 'Full-song', 'Bản nhạc này được cấp phép theo giấy phép Creative Commons CC BY, cho phép bạn sử dụng hoàn toàn miễn phí trong các dự án của mình (bao gồm cả dự án thương mại), miễn là bạn ghi rõ tên tác giả. Xem thêm Câu hỏi thường gặp tại đây.\n\nNếu bạn muốn sử dụng nhạc của tôi mà không cần ghi tên tác giả, vui lòng mua giấy phép tại đây.\n\nNghe trực tuyến và mua album trên các nền tảng yêu thích của bạn.\n\nNếu bạn thích hoặc sử dụng nhạc của tôi và thấy giá trị trong những gì tôi làm, hãy cân nhắc quyên góp.\n\nNếu bạn đã sử dụng nhạc của tôi, hãy để lại bình luận hoặc email cho tôi. Tôi rất muốn xem dự án của bạn! :)', 'Người theo hương hoa mây mù giăng lối\r\nLàn sương khói phôi phai đưa bước ai xa rồi\r\nĐơn côi mình ta vấn vương\r\nHồi ức, trong men say chiều mưa buồn\r\nNgăn giọt lệ ngừng khiến khoé mi sầu bi\r\nĐường xưa nơi cố nhân từ giã biệt li\r\nCánh hoa rụng rơi\r\nPhận duyên mong manh rẽ lối trong mơ ngày tương phùng\r\nTiếng khóc cuốn theo làn gió bay\r\nThuyền ai qua sông lỡ quên vớt ánh trăng tàn nơi này\r\nTrống vắng bóng ai dần hao gầy\r\n\r\nLòng ta xin nguyện khắc ghi trong tim tình nồng mê say\r\nMặc cho tóc mây vương lên đôi môi cay\r\nBâng khuâng mình ta lạc trôi giữa đời\r\nTa lạc trôi giữa trời\r\nĐôi chân lang thang về nơi đâu?\r\nBao yêu thương giờ nơi đâu?\r\nCâu thơ tình xưa vội phai mờ\r\nTheo làn sương tan biến trong cõi mơ\r\nMưa bụi vương trên làn mi mắt\r\nNgày chia lìa hoa rơi buồn hiu hắt\r\nTiếng đàn ai thêm sầu tương tư lặng mình trong chiều hoàng hôn,\r\nTan vào lời ca (Hey)\r\nLối mòn đường vắng một mình ta\r\nNắng chiều vàng úa nhuộm ngày qua\r\nXin đừng quay lưng xoá\r\nĐừng mang câu hẹn ước kia rời xa\r\nYên bình nơi nào đây\r\nChôn vùi theo làn mây\r\nEh-h-h-h-h, la-la-la-la-a-a\r\nNgười theo hương hoa mây mù giăng lối\r\nLàn sương khói phôi phai đưa bước ai xa rồi\r\nĐơn côi mình ta vấn vương, hồi ức trong men say chiều mưa buồn\r\nNgăn giọt lệ ngừng khiến khoé mi sầu bi\r\nĐường xưa nơi cố nhân từ giã biệt li\r\nCánh hoa rụng rơi\r\nPhận duyên mong manh rẽ lối trong mơ ngày tương phùng\r\nTiếng khóc cuốn theo làn gió bay\r\nThuyền ai qua sông lỡ quên vớt ánh trăng tàn nơi này\r\nTrống vắng bóng ai dần hao gầy\r\n\r\nLòng ta xin nguyện khắc ghi trong tim tình nồng mê say\r\nMặc cho tóc mây vương lên đôi môi cay\r\nBâng khuâng mình ta lạc trôi giữa đời\r\nTa lạc trôi giữa trời\r\n\r\nTa lạc trôi (Lạc trôi)\r\nTa lạc trôi giữa đời\r\nLạc trôi giữa trời\r\nYeah, ah-h-h-h-h-h\r\n\r\nTa đang lạc nơi nào (Lạc nơi nào, lạc nơi nào)\r\n\r\nTa đang lạc nơi nào\r\n\r\nLối mòn đường vắng một mình ta\r\nTa đang lạc nơi nào\r\n\r\nNắng chiều vàng úa nhuộm ngày qua\r\nTa đang lạc nơi nào', 233, 'https://firebasestorage.googleapis.com/v0/b/musicecommerce.firebasestorage.app/o/L%E1%BA%A1c%20Tr%C3%B4i.mp3?alt=media&token=92605480-14e9-4f2e-b51c-ab18579bc1f6', '', 'https://image-cdn.nct.vn/song/2024/03/15/4/c/b/d/1710498563935_300.jpg', 'Pending', 0, 'Pending', '2026-04-08 22:20:35');

-- ----------------------------
-- Table structure for audio_track_genre
-- ----------------------------
DROP TABLE IF EXISTS `audio_track_genre`;
CREATE TABLE `audio_track_genre`  (
  `audio_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  PRIMARY KEY (`audio_id`, `genre_id`) USING BTREE,
  INDEX `genre_id`(`genre_id`) USING BTREE,
  CONSTRAINT `audio_track_genre_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `audio_track_genre_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audio_track_genre
-- ----------------------------
INSERT INTO `audio_track_genre` VALUES (1, 1);
INSERT INTO `audio_track_genre` VALUES (1, 13);
INSERT INTO `audio_track_genre` VALUES (1, 14);
INSERT INTO `audio_track_genre` VALUES (2, 1);
INSERT INTO `audio_track_genre` VALUES (2, 10);
INSERT INTO `audio_track_genre` VALUES (2, 14);
INSERT INTO `audio_track_genre` VALUES (3, 1);
INSERT INTO `audio_track_genre` VALUES (3, 2);
INSERT INTO `audio_track_genre` VALUES (3, 14);
INSERT INTO `audio_track_genre` VALUES (4, 1);
INSERT INTO `audio_track_genre` VALUES (4, 3);
INSERT INTO `audio_track_genre` VALUES (4, 14);
INSERT INTO `audio_track_genre` VALUES (5, 1);
INSERT INTO `audio_track_genre` VALUES (5, 2);
INSERT INTO `audio_track_genre` VALUES (5, 14);
INSERT INTO `audio_track_genre` VALUES (6, 3);
INSERT INTO `audio_track_genre` VALUES (6, 8);
INSERT INTO `audio_track_genre` VALUES (7, 3);
INSERT INTO `audio_track_genre` VALUES (7, 8);
INSERT INTO `audio_track_genre` VALUES (8, 3);
INSERT INTO `audio_track_genre` VALUES (8, 8);
INSERT INTO `audio_track_genre` VALUES (9, 3);
INSERT INTO `audio_track_genre` VALUES (9, 8);
INSERT INTO `audio_track_genre` VALUES (10, 3);
INSERT INTO `audio_track_genre` VALUES (10, 8);
INSERT INTO `audio_track_genre` VALUES (10, 14);
INSERT INTO `audio_track_genre` VALUES (11, 4);
INSERT INTO `audio_track_genre` VALUES (11, 10);
INSERT INTO `audio_track_genre` VALUES (11, 14);
INSERT INTO `audio_track_genre` VALUES (12, 4);
INSERT INTO `audio_track_genre` VALUES (12, 5);
INSERT INTO `audio_track_genre` VALUES (12, 14);
INSERT INTO `audio_track_genre` VALUES (13, 8);
INSERT INTO `audio_track_genre` VALUES (14, 8);
INSERT INTO `audio_track_genre` VALUES (14, 14);
INSERT INTO `audio_track_genre` VALUES (15, 4);
INSERT INTO `audio_track_genre` VALUES (15, 10);
INSERT INTO `audio_track_genre` VALUES (15, 14);
INSERT INTO `audio_track_genre` VALUES (16, 1);
INSERT INTO `audio_track_genre` VALUES (16, 4);
INSERT INTO `audio_track_genre` VALUES (17, 1);
INSERT INTO `audio_track_genre` VALUES (17, 4);
INSERT INTO `audio_track_genre` VALUES (18, 1);
INSERT INTO `audio_track_genre` VALUES (18, 4);
INSERT INTO `audio_track_genre` VALUES (19, 1);
INSERT INTO `audio_track_genre` VALUES (19, 4);
INSERT INTO `audio_track_genre` VALUES (20, 1);
INSERT INTO `audio_track_genre` VALUES (20, 4);

-- ----------------------------
-- Table structure for audio_track_license
-- ----------------------------
DROP TABLE IF EXISTS `audio_track_license`;
CREATE TABLE `audio_track_license`  (
  `audio_id` int(11) NOT NULL,
  `license_id` int(11) NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`audio_id`, `license_id`) USING BTREE,
  INDEX `license_id`(`license_id`) USING BTREE,
  CONSTRAINT `audio_track_license_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `audio_track_license_ibfk_2` FOREIGN KEY (`license_id`) REFERENCES `license` (`license_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audio_track_license
-- ----------------------------
INSERT INTO `audio_track_license` VALUES (1, 1, 225000.00);
INSERT INTO `audio_track_license` VALUES (1, 2, 625000.00);
INSERT INTO `audio_track_license` VALUES (1, 3, 2500000.00);
INSERT INTO `audio_track_license` VALUES (2, 1, 300000.00);
INSERT INTO `audio_track_license` VALUES (2, 2, 750000.00);
INSERT INTO `audio_track_license` VALUES (2, 3, 3000000.00);
INSERT INTO `audio_track_license` VALUES (3, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (3, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (3, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (4, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (4, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (4, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (5, 1, 250000.00);
INSERT INTO `audio_track_license` VALUES (5, 2, 725000.00);
INSERT INTO `audio_track_license` VALUES (5, 3, 2750000.00);
INSERT INTO `audio_track_license` VALUES (6, 1, 250000.00);
INSERT INTO `audio_track_license` VALUES (6, 2, 750000.00);
INSERT INTO `audio_track_license` VALUES (6, 3, 2800000.00);
INSERT INTO `audio_track_license` VALUES (7, 1, 225000.00);
INSERT INTO `audio_track_license` VALUES (7, 2, 650000.00);
INSERT INTO `audio_track_license` VALUES (7, 3, 2500000.00);
INSERT INTO `audio_track_license` VALUES (8, 1, 225000.00);
INSERT INTO `audio_track_license` VALUES (8, 2, 650000.00);
INSERT INTO `audio_track_license` VALUES (8, 3, 2500000.00);
INSERT INTO `audio_track_license` VALUES (9, 1, 300000.00);
INSERT INTO `audio_track_license` VALUES (9, 2, 850000.00);
INSERT INTO `audio_track_license` VALUES (9, 3, 3000000.00);
INSERT INTO `audio_track_license` VALUES (10, 1, 350000.00);
INSERT INTO `audio_track_license` VALUES (10, 2, 1000000.00);
INSERT INTO `audio_track_license` VALUES (10, 3, 3500000.00);
INSERT INTO `audio_track_license` VALUES (11, 1, 250000.00);
INSERT INTO `audio_track_license` VALUES (11, 2, 700000.00);
INSERT INTO `audio_track_license` VALUES (11, 3, 2800000.00);
INSERT INTO `audio_track_license` VALUES (12, 1, 200000.00);
INSERT INTO `audio_track_license` VALUES (12, 2, 600000.00);
INSERT INTO `audio_track_license` VALUES (12, 3, 2400000.00);
INSERT INTO `audio_track_license` VALUES (13, 1, 350000.00);
INSERT INTO `audio_track_license` VALUES (13, 2, 1000000.00);
INSERT INTO `audio_track_license` VALUES (13, 3, 3500000.00);
INSERT INTO `audio_track_license` VALUES (14, 1, 300000.00);
INSERT INTO `audio_track_license` VALUES (14, 2, 850000.00);
INSERT INTO `audio_track_license` VALUES (14, 3, 3000000.00);
INSERT INTO `audio_track_license` VALUES (15, 1, 400000.00);
INSERT INTO `audio_track_license` VALUES (15, 2, 1200000.00);
INSERT INTO `audio_track_license` VALUES (15, 3, 4000000.00);
INSERT INTO `audio_track_license` VALUES (16, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (16, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (16, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (17, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (17, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (17, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (18, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (18, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (18, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (19, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (19, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (19, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (20, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (20, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (20, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (21, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (21, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (21, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (22, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (22, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (22, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (23, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (23, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (23, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (24, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (24, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (24, 3, 3750000.00);
INSERT INTO `audio_track_license` VALUES (25, 1, 375000.00);
INSERT INTO `audio_track_license` VALUES (25, 2, 1125000.00);
INSERT INTO `audio_track_license` VALUES (25, 3, 3750000.00);

-- ----------------------------
-- Table structure for audio_track_mood
-- ----------------------------
DROP TABLE IF EXISTS `audio_track_mood`;
CREATE TABLE `audio_track_mood`  (
  `audio_id` int(11) NOT NULL,
  `mood_id` int(11) NOT NULL,
  PRIMARY KEY (`audio_id`, `mood_id`) USING BTREE,
  INDEX `mood_id`(`mood_id`) USING BTREE,
  CONSTRAINT `audio_track_mood_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `audio_track_mood_ibfk_2` FOREIGN KEY (`mood_id`) REFERENCES `mood` (`mood_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audio_track_mood
-- ----------------------------
INSERT INTO `audio_track_mood` VALUES (1, 3);
INSERT INTO `audio_track_mood` VALUES (1, 5);
INSERT INTO `audio_track_mood` VALUES (1, 10);
INSERT INTO `audio_track_mood` VALUES (2, 1);
INSERT INTO `audio_track_mood` VALUES (2, 4);
INSERT INTO `audio_track_mood` VALUES (2, 8);
INSERT INTO `audio_track_mood` VALUES (3, 2);
INSERT INTO `audio_track_mood` VALUES (3, 6);
INSERT INTO `audio_track_mood` VALUES (3, 9);
INSERT INTO `audio_track_mood` VALUES (4, 4);
INSERT INTO `audio_track_mood` VALUES (4, 7);
INSERT INTO `audio_track_mood` VALUES (4, 8);
INSERT INTO `audio_track_mood` VALUES (5, 3);
INSERT INTO `audio_track_mood` VALUES (5, 8);
INSERT INTO `audio_track_mood` VALUES (5, 10);
INSERT INTO `audio_track_mood` VALUES (6, 7);
INSERT INTO `audio_track_mood` VALUES (6, 9);
INSERT INTO `audio_track_mood` VALUES (7, 6);
INSERT INTO `audio_track_mood` VALUES (7, 9);
INSERT INTO `audio_track_mood` VALUES (8, 6);
INSERT INTO `audio_track_mood` VALUES (8, 9);
INSERT INTO `audio_track_mood` VALUES (9, 3);
INSERT INTO `audio_track_mood` VALUES (9, 10);
INSERT INTO `audio_track_mood` VALUES (10, 4);
INSERT INTO `audio_track_mood` VALUES (10, 7);
INSERT INTO `audio_track_mood` VALUES (11, 4);
INSERT INTO `audio_track_mood` VALUES (12, 3);
INSERT INTO `audio_track_mood` VALUES (12, 10);
INSERT INTO `audio_track_mood` VALUES (13, 2);
INSERT INTO `audio_track_mood` VALUES (13, 6);
INSERT INTO `audio_track_mood` VALUES (14, 5);
INSERT INTO `audio_track_mood` VALUES (14, 8);
INSERT INTO `audio_track_mood` VALUES (15, 7);
INSERT INTO `audio_track_mood` VALUES (15, 9);
INSERT INTO `audio_track_mood` VALUES (16, 3);
INSERT INTO `audio_track_mood` VALUES (16, 5);
INSERT INTO `audio_track_mood` VALUES (17, 2);
INSERT INTO `audio_track_mood` VALUES (17, 3);
INSERT INTO `audio_track_mood` VALUES (18, 3);
INSERT INTO `audio_track_mood` VALUES (18, 10);
INSERT INTO `audio_track_mood` VALUES (19, 2);
INSERT INTO `audio_track_mood` VALUES (19, 6);
INSERT INTO `audio_track_mood` VALUES (20, 1);
INSERT INTO `audio_track_mood` VALUES (20, 4);
INSERT INTO `audio_track_mood` VALUES (21, 1);
INSERT INTO `audio_track_mood` VALUES (21, 5);
INSERT INTO `audio_track_mood` VALUES (22, 1);
INSERT INTO `audio_track_mood` VALUES (22, 4);
INSERT INTO `audio_track_mood` VALUES (23, 4);
INSERT INTO `audio_track_mood` VALUES (23, 6);
INSERT INTO `audio_track_mood` VALUES (24, 1);
INSERT INTO `audio_track_mood` VALUES (24, 3);
INSERT INTO `audio_track_mood` VALUES (25, 3);
INSERT INTO `audio_track_mood` VALUES (25, 6);

-- ----------------------------
-- Table structure for audio_track_review
-- ----------------------------
DROP TABLE IF EXISTS `audio_track_review`;
CREATE TABLE `audio_track_review`  (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `audio_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NULL DEFAULT 5 COMMENT 'Điểm đánh giá từ 1 đến 5 sao',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Nội dung bình luận, có thể null nếu chỉ đánh giá sao',
  `created_at` datetime NULL DEFAULT current_timestamp(),
  `updated_at` datetime NULL DEFAULT NULL COMMENT 'Lưu thời gian nếu người dùng sửa bình luận',
  PRIMARY KEY (`review_id`) USING BTREE,
  INDEX `audio_id`(`audio_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `audio_track_review_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `audio_track_review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audio_track_review
-- ----------------------------

-- ----------------------------
-- Table structure for audio_track_theme
-- ----------------------------
DROP TABLE IF EXISTS `audio_track_theme`;
CREATE TABLE `audio_track_theme`  (
  `audio_id` int(11) NOT NULL,
  `theme_id` int(11) NOT NULL,
  PRIMARY KEY (`audio_id`, `theme_id`) USING BTREE,
  INDEX `theme_id`(`theme_id`) USING BTREE,
  CONSTRAINT `audio_track_theme_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `audio_track_theme_ibfk_2` FOREIGN KEY (`theme_id`) REFERENCES `theme` (`theme_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audio_track_theme
-- ----------------------------
INSERT INTO `audio_track_theme` VALUES (1, 1);
INSERT INTO `audio_track_theme` VALUES (1, 3);
INSERT INTO `audio_track_theme` VALUES (2, 1);
INSERT INTO `audio_track_theme` VALUES (2, 5);
INSERT INTO `audio_track_theme` VALUES (3, 2);
INSERT INTO `audio_track_theme` VALUES (3, 4);
INSERT INTO `audio_track_theme` VALUES (4, 7);
INSERT INTO `audio_track_theme` VALUES (4, 10);
INSERT INTO `audio_track_theme` VALUES (5, 3);
INSERT INTO `audio_track_theme` VALUES (5, 8);
INSERT INTO `audio_track_theme` VALUES (6, 2);
INSERT INTO `audio_track_theme` VALUES (6, 4);
INSERT INTO `audio_track_theme` VALUES (7, 2);
INSERT INTO `audio_track_theme` VALUES (7, 4);
INSERT INTO `audio_track_theme` VALUES (8, 2);
INSERT INTO `audio_track_theme` VALUES (8, 4);
INSERT INTO `audio_track_theme` VALUES (9, 5);
INSERT INTO `audio_track_theme` VALUES (9, 9);
INSERT INTO `audio_track_theme` VALUES (9, 11);
INSERT INTO `audio_track_theme` VALUES (10, 4);
INSERT INTO `audio_track_theme` VALUES (10, 7);
INSERT INTO `audio_track_theme` VALUES (11, 1);
INSERT INTO `audio_track_theme` VALUES (11, 12);
INSERT INTO `audio_track_theme` VALUES (12, 3);
INSERT INTO `audio_track_theme` VALUES (12, 11);
INSERT INTO `audio_track_theme` VALUES (13, 2);
INSERT INTO `audio_track_theme` VALUES (13, 9);
INSERT INTO `audio_track_theme` VALUES (14, 2);
INSERT INTO `audio_track_theme` VALUES (14, 5);
INSERT INTO `audio_track_theme` VALUES (15, 4);
INSERT INTO `audio_track_theme` VALUES (15, 10);
INSERT INTO `audio_track_theme` VALUES (16, 1);
INSERT INTO `audio_track_theme` VALUES (17, 1);
INSERT INTO `audio_track_theme` VALUES (17, 12);
INSERT INTO `audio_track_theme` VALUES (18, 11);
INSERT INTO `audio_track_theme` VALUES (19, 2);
INSERT INTO `audio_track_theme` VALUES (20, 1);
INSERT INTO `audio_track_theme` VALUES (20, 5);
INSERT INTO `audio_track_theme` VALUES (21, 1);
INSERT INTO `audio_track_theme` VALUES (21, 5);
INSERT INTO `audio_track_theme` VALUES (22, 5);
INSERT INTO `audio_track_theme` VALUES (22, 12);
INSERT INTO `audio_track_theme` VALUES (23, 2);
INSERT INTO `audio_track_theme` VALUES (23, 12);
INSERT INTO `audio_track_theme` VALUES (24, 1);
INSERT INTO `audio_track_theme` VALUES (25, 2);

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`cart_id`) USING BTREE,
  UNIQUE INDEX `uk_cart_user`(`user_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------

-- ----------------------------
-- Table structure for cart_item
-- ----------------------------
DROP TABLE IF EXISTS `cart_item`;
CREATE TABLE `cart_item`  (
  `cart_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `audio_id` int(11) NOT NULL,
  `license_id` int(11) NOT NULL,
  PRIMARY KEY (`cart_item_id`) USING BTREE,
  UNIQUE INDEX `uk_cart_item`(`cart_id`, `audio_id`, `license_id`) USING BTREE,
  INDEX `cart_id`(`cart_id`) USING BTREE,
  INDEX `audio_id`(`audio_id`) USING BTREE,
  INDEX `license_id`(`license_id`) USING BTREE,
  CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_item_ibfk_3` FOREIGN KEY (`license_id`) REFERENCES `license` (`license_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart_item
-- ----------------------------

-- ----------------------------
-- Table structure for content_review_log
-- ----------------------------
DROP TABLE IF EXISTS `content_review_log`;
CREATE TABLE `content_review_log`  (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `audio_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action_taken` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Approved, Rejected',
  `reject_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `reviewed_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`review_id`) USING BTREE,
  INDEX `audio_id`(`audio_id`) USING BTREE,
  INDEX `admin_id`(`admin_id`) USING BTREE,
  CONSTRAINT `content_review_log_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `content_review_log_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of content_review_log
-- ----------------------------

-- ----------------------------
-- Table structure for copyright_info
-- ----------------------------
DROP TABLE IF EXISTS `copyright_info`;
CREATE TABLE `copyright_info`  (
  `copyright_id` int(11) NOT NULL AUTO_INCREMENT,
  `audio_id` int(11) NULL DEFAULT NULL COMMENT 'Quan hệ 1-1 với bài hát',
  `owner_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Tên người/tổ chức sở hữu hợp pháp',
  `isrc_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Mã thu âm tiêu chuẩn quốc tế (nếu có)',
  `certificate_file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Đường dẫn chứng nhận bản quyền',
  `registered_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`copyright_id`) USING BTREE,
  UNIQUE INDEX `audio_id`(`audio_id`) USING BTREE,
  CONSTRAINT `copyright_info_ibfk_1` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of copyright_info
-- ----------------------------
INSERT INTO `copyright_info` VALUES (1, 1, 'Music Journey Records', 'US-S1Z-26-00001', 'https://res.cloudinary.com/demo/image/upload/v1/certificates/cert_01.pdf', '2026-01-10 08:30:00');
INSERT INTO `copyright_info` VALUES (2, 2, 'Sky High Studio', 'US-S1Z-26-00002', 'https://res.cloudinary.com/demo/image/upload/v1/certificates/cert_02.pdf', '2026-01-15 10:00:00');
INSERT INTO `copyright_info` VALUES (3, 3, 'Dark Echo Media', 'US-S1Z-26-00003', 'https://res.cloudinary.com/demo/image/upload/v1/certificates/cert_03.pdf', '2026-02-01 14:20:00');
INSERT INTO `copyright_info` VALUES (4, 4, 'Victory Anthem Group', 'US-S1Z-26-00004', 'https://res.cloudinary.com/demo/image/upload/v1/certificates/cert_04.pdf', '2026-02-20 09:15:00');
INSERT INTO `copyright_info` VALUES (5, 5, 'Harmony Flow Collective', 'US-S1Z-26-00005', 'https://res.cloudinary.com/demo/image/upload/v1/certificates/cert_05.pdf', '2026-03-05 16:45:00');
INSERT INTO `copyright_info` VALUES (6, 6, 'Epic Kingdom Records', 'US-S1Z-26-00006', 'https://res.cloudinary.com/cert/6.pdf', '2026-03-10 09:00:00');
INSERT INTO `copyright_info` VALUES (7, 7, 'Shadow Sound Lab', 'US-S1Z-26-00007', 'https://res.cloudinary.com/cert/7.pdf', '2026-03-12 14:30:00');
INSERT INTO `copyright_info` VALUES (8, 8, 'Shadow Sound Lab', 'US-S1Z-26-00008', 'https://res.cloudinary.com/cert/8.pdf', '2026-03-12 15:00:00');
INSERT INTO `copyright_info` VALUES (9, 9, 'Zen Nature Audio', 'US-S1Z-26-00009', 'https://res.cloudinary.com/cert/9.pdf', '2026-03-15 08:20:00');
INSERT INTO `copyright_info` VALUES (10, 10, 'Victory Anthem Group', 'US-S1Z-26-00010', 'https://res.cloudinary.com/cert/10.pdf', '2026-03-18 11:45:00');
INSERT INTO `copyright_info` VALUES (11, 11, 'Urban Beat Collective', 'US-S1Z-26-00011', 'https://res.cloudinary.com/cert/11.pdf', '2026-03-20 09:00:00');
INSERT INTO `copyright_info` VALUES (12, 12, 'Lofi Dream Records', 'US-S1Z-26-00012', 'https://res.cloudinary.com/cert/12.pdf', '2026-03-22 14:30:00');
INSERT INTO `copyright_info` VALUES (13, 13, 'Shadow Sound Lab', 'US-S1Z-26-00013', 'https://res.cloudinary.com/cert/13.pdf', '2026-03-25 10:15:00');
INSERT INTO `copyright_info` VALUES (14, 14, 'Timeless Melodies Inc', 'US-S1Z-26-00014', 'https://res.cloudinary.com/cert/14.pdf', '2026-03-28 16:45:00');
INSERT INTO `copyright_info` VALUES (15, 15, 'Cyber Pulse Media', 'US-S1Z-26-00015', 'https://res.cloudinary.com/cert/15.pdf', '2026-04-01 11:20:00');
INSERT INTO `copyright_info` VALUES (16, 16, 'GERBERANG Records', 'VN-H24-26-00001', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_16.pdf', '2026-04-05 09:00:00');
INSERT INTO `copyright_info` VALUES (17, 17, 'GERBERANG Records', 'VN-H24-26-00002', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_17.pdf', '2026-04-05 10:30:00');
INSERT INTO `copyright_info` VALUES (18, 18, 'GERBERANG Records', 'VN-H24-26-00003', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_18.pdf', '2026-04-06 14:15:00');
INSERT INTO `copyright_info` VALUES (19, 19, 'GERBERANG Records', 'VN-H24-26-00004', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_19.pdf', '2026-04-07 08:45:00');
INSERT INTO `copyright_info` VALUES (20, 20, 'GERBERANG Records', 'VN-H24-26-00005', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_20.pdf', '2026-04-08 11:20:00');
INSERT INTO `copyright_info` VALUES (21, 21, 'M-TP Entertainment', 'VN-MTP-26-00001', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_21.pdf', '2026-04-08 14:00:00');
INSERT INTO `copyright_info` VALUES (22, 22, 'M-TP Entertainment', 'VN-MTP-26-00002', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_22.pdf', '2026-04-08 15:30:00');
INSERT INTO `copyright_info` VALUES (23, 23, 'M-TP Entertainment', 'VN-MTP-26-00003', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_23.pdf', '2026-04-09 09:15:00');
INSERT INTO `copyright_info` VALUES (24, 24, 'M-TP Entertainment', 'VN-MTP-26-00004', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_24.pdf', '2026-04-09 10:45:00');
INSERT INTO `copyright_info` VALUES (25, 25, 'M-TP Entertainment', 'VN-MTP-26-00005', 'https://res.cloudinary.com/music-sys/image/upload/v1/certificates/cert_25.pdf', '2026-04-10 08:20:00');

-- ----------------------------
-- Table structure for copyright_report
-- ----------------------------
DROP TABLE IF EXISTS `copyright_report`;
CREATE TABLE `copyright_report`  (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `reporter_id` int(11) NOT NULL COMMENT 'Người/Nghệ sĩ gửi báo cáo vi phạm',
  `reported_audio_id` int(11) NOT NULL COMMENT 'Sản phẩm âm thanh bị nghi ngờ vi phạm (reup)',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Lý do chi tiết hoặc đường dẫn bằng chứng vi phạm',
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT 'Pending' COMMENT 'Trạng thái giải quyết: Pending, Investigating, Resolved, Rejected',
  `created_at` datetime NULL DEFAULT current_timestamp(),
  `resolved_at` datetime NULL DEFAULT NULL COMMENT 'Thời gian Admin xử lý xong',
  `resolved_by` int(11) NULL DEFAULT NULL COMMENT 'Admin nào đã giải quyết báo cáo này',
  PRIMARY KEY (`report_id`) USING BTREE,
  INDEX `reporter_id`(`reporter_id`) USING BTREE,
  INDEX `reported_audio_id`(`reported_audio_id`) USING BTREE,
  INDEX `resolved_by`(`resolved_by`) USING BTREE,
  CONSTRAINT `copyright_report_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `copyright_report_ibfk_2` FOREIGN KEY (`reported_audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `copyright_report_ibfk_3` FOREIGN KEY (`resolved_by`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of copyright_report
-- ----------------------------

-- ----------------------------
-- Table structure for genre
-- ----------------------------
DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre`  (
  `genre_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`genre_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of genre
-- ----------------------------
INSERT INTO `genre` VALUES (1, 'Pop');
INSERT INTO `genre` VALUES (2, 'Rock');
INSERT INTO `genre` VALUES (3, 'Electronic / Dance');
INSERT INTO `genre` VALUES (4, 'Hip-Hop / Rap');
INSERT INTO `genre` VALUES (5, 'Jazz');
INSERT INTO `genre` VALUES (6, 'Classical');
INSERT INTO `genre` VALUES (7, 'Acoustic');
INSERT INTO `genre` VALUES (8, 'Lo-Fi');
INSERT INTO `genre` VALUES (9, 'Cinematic');
INSERT INTO `genre` VALUES (10, 'R&B / Soul');
INSERT INTO `genre` VALUES (11, 'Ambient');
INSERT INTO `genre` VALUES (12, 'Folk / Country');
INSERT INTO `genre` VALUES (13, 'Piano');
INSERT INTO `genre` VALUES (14, 'Instrumental');

-- ----------------------------
-- Table structure for license
-- ----------------------------
DROP TABLE IF EXISTS `license`;
CREATE TABLE `license`  (
  `license_id` int(11) NOT NULL AUTO_INCREMENT,
  `license_type` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Cá nhân, Thương mại',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  PRIMARY KEY (`license_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of license
-- ----------------------------
INSERT INTO `license` VALUES (1, 'Personal License', 'Dành cho nhu cầu nghe cá nhân, sử dụng trong các dự án phi lợi nhuận, video gia đình, hoặc video mạng xã hội không bật kiếm tiền.');
INSERT INTO `license` VALUES (2, 'Commercial License', 'Cho phép sử dụng trong các video mạng xã hội có bật kiếm tiền (YouTube, TikTok), chạy quảng cáo online và các dự án kinh doanh quy mô nhỏ.');
INSERT INTO `license` VALUES (3, 'Extended License', 'Quyền sử dụng không giới hạn, bao gồm phát sóng truyền hình, phim chiếu rạp, tích hợp vào phần mềm, game thương mại và phân phối vật lý.');

-- ----------------------------
-- Table structure for mood
-- ----------------------------
DROP TABLE IF EXISTS `mood`;
CREATE TABLE `mood`  (
  `mood_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`mood_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mood
-- ----------------------------
INSERT INTO `mood` VALUES (1, 'Happy');
INSERT INTO `mood` VALUES (2, 'Sad');
INSERT INTO `mood` VALUES (3, 'Chill');
INSERT INTO `mood` VALUES (4, 'Energetic');
INSERT INTO `mood` VALUES (5, 'Romantic');
INSERT INTO `mood` VALUES (6, 'Dark');
INSERT INTO `mood` VALUES (7, 'Epic');
INSERT INTO `mood` VALUES (8, 'Inspiring');
INSERT INTO `mood` VALUES (9, 'Suspense');
INSERT INTO `mood` VALUES (10, 'Relaxing');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10, 2) NOT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Pending, Completed, Failed',
  `created_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order
-- ----------------------------

-- ----------------------------
-- Table structure for order_detail
-- ----------------------------
DROP TABLE IF EXISTS `order_detail`;
CREATE TABLE `order_detail`  (
  `order_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `audio_id` int(11) NOT NULL,
  `license_id` int(11) NOT NULL,
  `price` decimal(10, 2) NOT NULL COMMENT 'Lưu giá tại thời điểm mua',
  PRIMARY KEY (`order_detail_id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `audio_id`(`audio_id`) USING BTREE,
  INDEX `license_id`(`license_id`) USING BTREE,
  CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_detail_ibfk_3` FOREIGN KEY (`license_id`) REFERENCES `license` (`license_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_detail
-- ----------------------------

-- ----------------------------
-- Table structure for payment_transaction
-- ----------------------------
DROP TABLE IF EXISTS `payment_transaction`;
CREATE TABLE `payment_transaction`  (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'VNPay, MoMo, PayPal, Thẻ tín dụng...',
  `gateway_transaction_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Mã giao dịch trả về từ cổng thanh toán',
  `amount` decimal(10, 2) NOT NULL,
  `transaction_date` datetime NULL DEFAULT current_timestamp(),
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'SUCCESS, FAILED, PENDING',
  PRIMARY KEY (`transaction_id`) USING BTREE,
  UNIQUE INDEX `order_id`(`order_id`) USING BTREE,
  CONSTRAINT `payment_transaction_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payment_transaction
-- ----------------------------

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user, artist, admin',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'admin');
INSERT INTO `role` VALUES (2, 'artist');
INSERT INTO `role` VALUES (3, 'user');

-- ----------------------------
-- Table structure for search_history
-- ----------------------------
DROP TABLE IF EXISTS `search_history`;
CREATE TABLE `search_history`  (
  `search_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL COMMENT 'Có thể null nếu user chưa đăng nhập',
  `search_query` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `searched_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`search_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of search_history
-- ----------------------------

-- ----------------------------
-- Table structure for theme
-- ----------------------------
DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme`  (
  `theme_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Ví dụ: Tình yêu, Lãng mạn, Vlog, Cinematic, Mưa...',
  PRIMARY KEY (`theme_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of theme
-- ----------------------------
INSERT INTO `theme` VALUES (1, 'Vlog & Lifestyle');
INSERT INTO `theme` VALUES (2, 'Cinematic & Film');
INSERT INTO `theme` VALUES (3, 'Podcast & Radio');
INSERT INTO `theme` VALUES (4, 'Gaming & Stream');
INSERT INTO `theme` VALUES (5, 'Travel & Explore');
INSERT INTO `theme` VALUES (6, 'Wedding');
INSERT INTO `theme` VALUES (7, 'Workout & Fitness');
INSERT INTO `theme` VALUES (8, 'Corporate');
INSERT INTO `theme` VALUES (9, 'Nature & Rain');
INSERT INTO `theme` VALUES (10, 'Technology');
INSERT INTO `theme` VALUES (11, 'Study & Focus');
INSERT INTO `theme` VALUES (12, 'Fashion & Beauty');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'Có thể null nếu user đăng nhập bằng Google/Facebook',
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `is_email_verified` tinyint(1) NULL DEFAULT 0 COMMENT 'Trạng thái xác thực email',
  `auth_provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT 'local' COMMENT 'Giá trị: local, google, facebook',
  `provider_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL COMMENT 'ID định danh trả về từ Google/Facebook',
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE,
  INDEX `role_id`(`role_id`) USING BTREE,
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'pamela@gmail.com', '123456', 'Pamela Yuen', 'https://freemusicarchive.org/image/?file=artist_image%2FJJ7dDFZg9HlABRKZIVlNrUcwSdYEDHeKxkOr0fa1.jpg&width=290&height=290&type=artist', 2, 1, 1, 'local', NULL, '2026-04-06 14:27:07', NULL);
INSERT INTO `user` VALUES (2, 'croce@gmail.com', '123456', 'Tommaso Croce', 'https://freemusicarchive.org/image/?file=artist_image%2F7OLQ8VH3UQAxQOTvuRZQ1JaRigJjiTItCsNQKJix.png&width=290&height=290&type=artist', 2, 1, 1, 'local', NULL, '2026-04-08 15:02:45', NULL);
INSERT INTO `user` VALUES (3, 'ketsa@gmail.com', '123456', 'Ketsa', 'https://freemusicarchive.org/image/?file=artist_image%2FCIPeL9rmMA9ojtVqaoleGmXXoM7V2cvVwmf7SaUn.jpg&width=290&height=290&type=artist', 2, 1, 1, 'local', NULL, '2026-04-08 15:54:00', NULL);
INSERT INTO `user` VALUES (4, 'hieuthuhai@gmail.com', '123456', 'HIEUTHUHAI', 'https://cdn-media.sforum.vn/storage/app/media/giakhanh/t%C3%B3c%20hieuthuhai/toc-hieuthuhai-4.jpg', 2, 1, 1, 'local', NULL, '2026-04-08 21:42:44', NULL);
INSERT INTO `user` VALUES (5, 'sontungmtp@gmail.com', '123456', 'Sơn Tùng M-TP', 'https://thethaovanhoa.mediacdn.vn/Upload/O5NP4aFt6GVwE7JTFAOaA/files/2022/06/son-tung-mtp-va-hai-tu%20(1).jpg', 2, 1, 1, 'local', NULL, '2026-04-08 22:14:40', NULL);

-- ----------------------------
-- Table structure for user_library
-- ----------------------------
DROP TABLE IF EXISTS `user_library`;
CREATE TABLE `user_library`  (
  `library_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `audio_id` int(11) NOT NULL,
  `license_id` int(11) NOT NULL,
  `unlocked_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`library_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `audio_id`(`audio_id`) USING BTREE,
  INDEX `license_id`(`license_id`) USING BTREE,
  CONSTRAINT `user_library_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_library_ibfk_2` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_library_ibfk_3` FOREIGN KEY (`license_id`) REFERENCES `license` (`license_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_library
-- ----------------------------

-- ----------------------------
-- Table structure for user_listen_history
-- ----------------------------
DROP TABLE IF EXISTS `user_listen_history`;
CREATE TABLE `user_listen_history`  (
  `history_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `audio_id` int(11) NOT NULL,
  `listened_at` datetime NULL DEFAULT current_timestamp(),
  `listen_duration` int(11) NULL DEFAULT NULL COMMENT 'Thời gian nghe (giây)',
  PRIMARY KEY (`history_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `audio_id`(`audio_id`) USING BTREE,
  CONSTRAINT `user_listen_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_listen_history_ibfk_2` FOREIGN KEY (`audio_id`) REFERENCES `audio_track` (`audio_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_listen_history
-- ----------------------------

-- ----------------------------
-- Table structure for user_token
-- ----------------------------
DROP TABLE IF EXISTS `user_token`;
CREATE TABLE `user_token`  (
  `token_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `token_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Các loại: REFRESH, VERIFICATION, RESET_PASSWORD',
  `expires_at` datetime NOT NULL COMMENT 'Thời gian hết hạn của token',
  `is_revoked` tinyint(1) NULL DEFAULT 0 COMMENT 'Đánh dấu true khi user Logout hoặc Token đã được sử dụng',
  `created_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`token_id`) USING BTREE,
  UNIQUE INDEX `token`(`token`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_token
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
