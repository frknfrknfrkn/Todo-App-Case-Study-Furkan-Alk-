-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 05 May 2025, 14:30:23
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `turkticaret00010101012`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `created_at`, `ip_address`) VALUES
(1, 'admin', '$2y$10$pqFAxCbIWnH48NvHfZy6eOUxKL28d11SmE3OjOtPfJpeAfgmhKqEy', '2025-05-04 13:10:13', '::1');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#FFFFFF',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`id`, `name`, `color`, `created_at`, `updated_at`) VALUES
(5, 'vasdvasd', '#43cd1d', '2025-05-04 23:00:05', '2025-05-04 23:00:05'),
(7, 'vqwevqwe', '#4B5563', '2025-05-04 23:18:41', '2025-05-04 23:18:41'),
(8, 'avdasvda', '#4B5563', '2025-05-04 23:18:43', '2025-05-04 23:18:43'),
(9, 'vasdvasdazzz', '#33300a', '2025-05-04 23:19:16', '2025-05-04 23:19:28'),
(11, 'ASVASDVAD', '#bc015b', '2025-05-04 23:22:06', '2025-05-04 23:22:06'),
(12, 'qeee', '#ff7300', '2025-05-05 12:12:13', '2025-05-05 12:12:13');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ip_failures`
--

CREATE TABLE `ip_failures` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `attempt_count` int(11) DEFAULT 0,
  `last_attempt_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ip_failures`
--

INSERT INTO `ip_failures` (`id`, `ip_address`, `email`, `attempt_count`, `last_attempt_at`) VALUES
(1, '::12', 'admin', 5, '2025-05-05 02:47:36');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `todos`
--

CREATE TABLE `todos` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `todos`
--

INSERT INTO `todos` (`id`, `title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'TEST', 'TEST TEST LRKRRKRK XXXX ZZZ', 'cancelled', 'medium', '2025-05-11 12:00:00', '2025-05-04 12:52:03', '2025-05-04 12:54:08', '2025-05-04 12:54:08'),
(2, 'vsdvs', 'vs', NULL, 'medium', '1993-02-06 00:00:00', '2025-05-04 17:17:23', '2025-05-04 17:33:17', '2025-05-04 17:33:17'),
(3, 'vwevw', 'evwe', 'pending', 'low', '1993-05-04 00:00:00', '2025-05-04 17:28:48', '2025-05-04 17:33:16', '2025-05-04 17:33:16'),
(4, 'qvcwvq', 'vwqvqw', 'pending', 'high', '1993-02-06 00:00:00', '2025-05-04 17:33:09', '2025-05-04 17:33:14', '2025-05-04 17:33:14'),
(5, 'vqwevqe', 'vqwevqwe', 'completed', NULL, NULL, '2025-05-04 17:47:24', '2025-05-04 17:48:31', '2025-05-04 17:48:31'),
(6, 'vqwev', 'weqv', 'in_progress', 'medium', NULL, '2025-05-04 22:35:48', '2025-05-04 22:35:51', '2025-05-04 22:35:51'),
(7, 'vqwev', 'wevw', 'completed', 'medium', NULL, '2025-05-04 22:44:11', '2025-05-04 22:46:46', '2025-05-04 22:46:46'),
(8, 'qvweqvwe', 'vwe', 'completed', 'medium', NULL, '2025-05-04 22:47:48', '2025-05-04 23:23:33', '2025-05-04 23:23:33'),
(9, 'qvweqvwe', 'qvwe', 'in_progress', 'medium', NULL, '2025-05-04 23:02:02', '2025-05-04 23:02:02', NULL),
(10, 'vqwevqwe', 'qvwe', 'completed', 'medium', NULL, '2025-05-04 23:03:41', '2025-05-04 23:03:41', NULL),
(11, 'vasdavsd', 'avdsasvdadvadasdavsdavdsad', 'completed', NULL, NULL, '2025-05-04 23:04:00', '2025-05-04 23:15:53', '2025-05-04 23:15:53'),
(12, 'qwewe', 'avsdavsd', 'in_progress', 'high', NULL, '2025-05-04 23:14:39', '2025-05-04 23:14:39', NULL),
(13, 'vasdavsd', 'avsdasd', 'cancelled', 'high', NULL, '2025-05-04 23:16:04', '2025-05-04 23:16:04', NULL),
(14, 'avsda', 'vdasvd', 'cancelled', 'high', NULL, '2025-05-04 23:16:12', '2025-05-04 23:24:11', '2025-05-04 23:24:11'),
(15, 'sdvasd', 'avsda', 'completed', 'low', NULL, '2025-05-04 23:16:25', '2025-05-04 23:22:47', '2025-05-04 23:22:47'),
(16, 'dsdsdsds', 'dssdsdsd', 'cancelled', 'high', NULL, '2025-05-04 23:22:20', '2025-05-04 23:22:20', NULL),
(17, 'vqwevq', 'wevqe', 'completed', 'high', NULL, '2025-05-05 00:31:22', '2025-05-05 00:31:22', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `todo_category`
--

CREATE TABLE `todo_category` (
  `todo_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `todo_category`
--

INSERT INTO `todo_category` (`todo_id`, `category_id`) VALUES
(9, 5),
(10, 5),
(12, 5),
(13, 5),
(16, 11),
(17, 8),
(17, 9);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `ip_failures`
--
ALTER TABLE `ip_failures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ip_address` (`ip_address`,`email`);

--
-- Tablo için indeksler `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `todo_category`
--
ALTER TABLE `todo_category`
  ADD PRIMARY KEY (`todo_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `ip_failures`
--
ALTER TABLE `ip_failures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `todo_category`
--
ALTER TABLE `todo_category`
  ADD CONSTRAINT `todo_category_ibfk_1` FOREIGN KEY (`todo_id`) REFERENCES `todos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `todo_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
