-- Flyway V3: Advance Bookings, Custom Shop Address, Google Maps, and Website Section Management

-- 1. Alter shop_settings to support structured address fields, Google Maps, opening hours, announcements, and hero customization
ALTER TABLE shop_settings
    ADD COLUMN IF NOT EXISTS building_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS door_plot_number VARCHAR(50),
    ADD COLUMN IF NOT EXISTS street_road VARCHAR(255),
    ADD COLUMN IF NOT EXISTS landmark VARCHAR(255),
    ADD COLUMN IF NOT EXISTS village_locality VARCHAR(150),
    ADD COLUMN IF NOT EXISTS mandal_district VARCHAR(150),
    ADD COLUMN IF NOT EXISTS pincode VARCHAR(20),
    ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India',
    ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
    ADD COLUMN IF NOT EXISTS directions_url TEXT,
    ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7),
    ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7),
    ADD COLUMN IF NOT EXISTS opening_hours TEXT,
    ADD COLUMN IF NOT EXISTS announcement_text TEXT,
    ADD COLUMN IF NOT EXISTS announcement_enabled BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS pickup_instructions TEXT,
    ADD COLUMN IF NOT EXISTS hero_cta_text VARCHAR(100) DEFAULT 'Explore Products',
    ADD COLUMN IF NOT EXISTS hero_book_cta_text VARCHAR(100) DEFAULT 'Book Online';

-- Seed default structured address fields for Telangana store if not already set
UPDATE shop_settings
SET
    building_name = COALESCE(building_name, 'Sri Anjaneya Nilayam'),
    door_plot_number = COALESCE(door_plot_number, 'Shop No. 4-12/A'),
    street_road = COALESCE(street_road, 'Main Road'),
    landmark = COALESCE(landmark, 'Near Rythu Bharosa Kendram & Bus Stand'),
    village_locality = COALESCE(village_locality, 'Choutuppal'),
    mandal_district = COALESCE(mandal_district, 'Yadadri Bhuvanagiri District'),
    pincode = COALESCE(pincode, '508252'),
    country = COALESCE(country, 'India'),
    opening_hours = COALESCE(opening_hours, 'Mon - Sat: 7:00 AM - 8:30 PM | Sunday: 7:00 AM - 2:00 PM'),
    announcement_text = COALESCE(announcement_text, '🌾 Kharif Season Fertilizer & Seed Booking Open! Book Online for Fast Counter Pickup.'),
    announcement_enabled = COALESCE(announcement_enabled, TRUE),
    pickup_instructions = COALESCE(pickup_instructions, '1. Add products to cart or click Book Now. 2. Show your Order/Booking Reference at our store counter. 3. Pay via Cash or UPI and collect genuine inputs immediately.')
WHERE id = 1;

-- 2. Alter products table to support booking availability and special booking instructions
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS booking_available BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS booking_notes TEXT;

-- 3. Create Bookings Table for Customer Advance Reservations
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    product_id BIGINT,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(150),
    pack_size VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    preferred_pickup_date DATE,
    customer_notes TEXT,
    admin_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_mobile ON bookings(customer_mobile);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(created_at);

-- 4. Create Website Sections Table for Dynamic Section Customization & Reordering
CREATE TABLE IF NOT EXISTS website_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    content TEXT,
    button_label VARCHAR(100),
    button_link VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default configurable sections
INSERT INTO website_sections (section_key, title, subtitle, button_label, button_link, enabled, display_order)
VALUES
    ('announcement_bar', 'Announcement Banner', 'Top agricultural notice and store updates', NULL, NULL, TRUE, 1),
    ('hero', 'Hero Banner', 'Main banner featuring actual shop photograph and store introduction', 'Explore Products', '/products', TRUE, 2),
    ('categories', 'Product Categories', 'Fertilizers, Pesticides, Certified Seeds, and Micronutrients', 'View Category', '/products', TRUE, 3),
    ('featured_products', 'Featured Agricultural Inputs', 'Top-selling fertilizers and crop protection inputs', 'View All Products', '/products', TRUE, 4),
    ('benefits', 'Why Choose Sri Anjaneya', 'Govt approved inputs, genuine quality, and fair farmer pricing', NULL, NULL, TRUE, 5),
    ('booking_info', 'Advance Product Booking', 'Reserve scarce seasonal fertilizers and hybrid seeds in advance', 'Book Online', '/products', TRUE, 6),
    ('pickup_instructions', 'Local Counter Pickup Policy', 'Fast counter verification, vehicle loading, and UPI/Cash payment', 'View Instructions', '/contact', TRUE, 7),
    ('location_map', 'Store Location & Directions', 'Easy road access in Telangana for tractor and transport loading', 'Get Directions', '/contact', TRUE, 8),
    ('contact_section', 'Contact & Store Hours', 'Store timings, Call Now, and WhatsApp Us links', 'Contact Us', '/contact', TRUE, 9),
    ('footer', 'Footer & Shop Information', 'Agricultural disclaimer, quick links, and copyright', NULL, NULL, TRUE, 10),
    ('floating_whatsapp', 'Quick WhatsApp Floating Button', 'Instant chat with store counter for stock inquiries', 'WhatsApp Us', NULL, TRUE, 11)
ON DUPLICATE KEY UPDATE title = VALUES(title);
