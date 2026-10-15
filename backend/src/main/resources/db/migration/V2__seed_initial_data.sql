-- Flyway V2: Seed Data for Categories, Products and Shop Settings

-- 1. Shop Settings
INSERT INTO shop_settings (id, shop_name, phone, whatsapp, address, state, hero_title, hero_subtitle, hero_image_url, logo_url)
VALUES (
    1,
    'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS',
    '917095891270',
    '917095891270',
    'Main Road, Near Rythu Bharosa Kendram, Telangana - 508213, India',
    'Telangana',
    'Empowering Telangana Farmers with Genuine Agricultural Inputs',
    'Authorized dealer of premium Fertilizers, certified Seeds, trusted Pesticides, and high-yield Micronutrients. Book online for local store pickup.',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=200&q=80'
) ON DUPLICATE KEY UPDATE shop_name = VALUES(shop_name);

-- 2. Categories
INSERT INTO categories (id, name, slug, description, display_order, active) VALUES
(1, 'Fertilizers', 'fertilizers', 'Primary macronutrients including Urea, DAP, MOP, Complex NPK and Soil Conditioners', 1, TRUE),
(2, 'Pesticides', 'pesticides', 'Approved Insecticides, Fungicides, Herbicides and Plant Protection chemicals', 2, TRUE),
(3, 'Seeds', 'seeds', 'Certified High-Yield Hybrid Cotton, Paddy, Maize, Vegetable and Pulses Seeds', 3, TRUE),
(4, 'Micronutrients', 'micronutrients', 'Zinc, Boron, Ferrous, Magnesium and Balanced Multi-Micronutrient formulas', 4, TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Seed Products (Authentic Telangana Agriculture Brands)
INSERT INTO products (id, name, brand, category_id, description, price, pack_size, stock, image_url, active, featured) VALUES
-- Fertilizers
(1, 'Gromor DAP 18:46:0 Fertilizer', 'Coromandel International', 1, 'High-grade phosphatic fertilizer providing 18% Ammoniacal Nitrogen and 46% Phosphorus. Promotes strong root establishment and vigorous early crop growth.', 1350.00, '50 kg Bag', 120, 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(2, 'IFFCO Neem Coated Urea', 'IFFCO', 1, 'Contains 46% Nitrogen coated with pure neem oil to slow nitrogen release, minimize leaching, and enhance nutrient uptake efficiency.', 266.50, '45 kg Bag', 250, 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(3, 'Gromor 20:20:0:13 Ammonium Phosphate Sulphate', 'Coromandel International', 1, 'Balanced granular fertilizer with Nitrogen, Phosphate, and Sulphur. Ideal for oilseeds, pulses, cotton, and paddy.', 1400.00, '50 kg Bag', 90, 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),
(4, 'Muriate of Potash (MOP) 60% K2O', 'Indian Potash Limited (IPL)', 1, 'Essential potassium fertilizer improving grain filling, disease resistance, drought tolerance, and harvest quality.', 1700.00, '50 kg Bag', 65, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),

-- Pesticides
(5, 'Coragen Insecticide (Chlorantraniliprole 18.5% SC)', 'FMC India', 2, 'Industry benchmark broad-spectrum insecticide for control of stem borers, leaf folders, bollworms, and spodoptera in rice, sugarcane, and cotton.', 1850.00, '150 ml', 45, 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(6, 'Regent 5% SC (Fipronil)', 'Bayer CropScience', 2, 'Broad-spectrum phenylpyrazole insecticide providing excellent systemic control against sucking pests, root grubs, and stem borers.', 820.00, '500 ml', 35, 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),
(7, 'Amistar Top (Azoxystrobin + Difenoconazole)', 'Syngenta', 2, 'Dual active broad-spectrum systemic fungicide offering preventive and curative defense against blast, sheath blight, and leaf spots.', 1650.00, '200 ml', 30, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(8, 'Confidor 17.8% SL (Imidacloprid)', 'Bayer CropScience', 2, 'Premier systemic insecticide for long-lasting protection against aphids, jassids, thrips, and whiteflies in chilli and cotton.', 480.00, '100 ml', 50, 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),

-- Seeds
(9, 'Rasi 659 BG II Cotton Seeds', 'Rasi Seeds', 3, 'High-yielding Bollgard II hybrid cotton seeds with big boll size, superior fiber quality, and excellent sucking pest tolerance for Telangana soils.', 864.00, '475 g Packet', 80, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(10, 'US 312 Hybrid Paddy Seeds', 'Bayer CropScience', 3, 'Fine grain, high-tillering hybrid paddy seeds with exceptional grain recovery and bacterial blight tolerance. Suitable for Kharif & Rabi.', 1050.00, '3 kg Pack', 60, 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(11, 'Kaveri Chintoo F1 Hybrid Chilli Seeds', 'Kaveri Seed Company', 3, 'Vigorous erect plant type bearing pungent, attractive dark red dry chillies. Highly preferred by Khammam & Warangal chilli growers.', 1450.00, '10 g Pouch', 40, 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),
(12, 'Pioneer 3396 Hybrid Maize Seeds', 'Corteva Agriscience', 3, 'High yielding yellow flint hybrid maize seeds with strong lodging resistance and heavy kernel weight.', 2200.00, '4 kg Bag', 50, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),

-- Micronutrients
(13, 'Multiplex Kranti Complete Micronutrient Fertilizer', 'Multiplex Group', 4, 'Multi-micronutrient liquid formulation containing Zinc, Iron, Manganese, Copper, Boron, and Molybdenum in balanced proportions for foliar spray.', 650.00, '1 Litre Bottle', 40, 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80', TRUE, TRUE),
(14, 'Coromandel Zinc Sulfate Heptahydrate 21% Zn', 'Coromandel International', 4, 'Essential zinc fertilizer correcting Khaira disease in paddy and pale leaves in maize and pulses.', 420.00, '5 kg Bag', 75, 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),
(15, 'Aries Chelamin Gold (Chelated Zinc 12% EDTA)', 'Aries Agro Limited', 4, '100% water-soluble EDTA chelated zinc ensuring quick absorption by crop leaves without chemical fixation.', 320.00, '250 g Box', 55, 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80', TRUE, FALSE),
(16, 'Aries Boron 20% Disodium Octaborate Tetrahydrate', 'Aries Agro Limited', 4, 'Foliar spray and fertigation boron aiding pollen germination, fruit set, and sugar translocation in cotton, chilli, and vegetables.', 290.00, '250 g Pack', 60, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80', TRUE, FALSE)
ON DUPLICATE KEY UPDATE name = VALUES(name);
