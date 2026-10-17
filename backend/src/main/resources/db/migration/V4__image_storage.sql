-- Flyway V4: Persistent MySQL Binary Image Storage for Cross-Device CDN and Local Uploads
CREATE TABLE IF NOT EXISTS uploaded_images (
    id VARCHAR(64) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    image_data LONGBLOB NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
