-- Flyway V5: Online Payments & Gateway Verification Tracking
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_reference VARCHAR(100) NOT NULL UNIQUE,
    order_number VARCHAR(50),
    booking_reference VARCHAR(50),
    gateway VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    customer_name VARCHAR(150),
    customer_mobile VARCHAR(20),
    idempotency_key VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_number);
CREATE INDEX idx_payments_booking ON payments(booking_reference);
CREATE INDEX idx_payments_gateway_order ON payments(gateway_order_id);
CREATE INDEX idx_payments_status ON payments(status);

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'UNPAID',
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COUNTER_PICKUP';

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'UNPAID',
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COUNTER_PICKUP';
