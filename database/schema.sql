DROP DATABASE IF EXISTS social_web;
DROP TABLE IF EXISTS posts;

CREATE DATABASE social_web;
USE social_web;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (author) REFERENCES users(username)
);

INSERT INTO posts (author, content) VALUES
('Thuy', 'Hi'),
('ThuyVo', 'Hello World!');
