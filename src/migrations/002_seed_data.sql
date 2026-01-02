-- Trust You Go Database - Seed Data
-- MySQL 8.0+
-- Created: January 3, 2026

-- ============================================
-- 1. DEFAULT ADMIN USER
-- ============================================
-- Password: Admin@2026
-- Hash generated with bcrypt cost factor 10
INSERT INTO admins (admin_id, email, password_hash, name, contact) VALUES 
(UUID(), 'admin@trustyou-go.com', '$2a$10$YourBcryptHashWillBeGeneratedHere', 'System Administrator', '+94XXXXXXXXX');

-- ============================================
-- 2. SAMPLE LOCATIONS
-- ============================================

-- Tourist Spots
INSERT INTO locations (location_id, name, description, location_type, location_url, is_active) VALUES
(UUID(), 'Sigiriya Rock Fortress', 'Ancient rock fortress and palace with stunning frescoes and water gardens. UNESCO World Heritage Site.', 'tourist_spot', 'https://maps.google.com/?q=Sigiriya', TRUE),
(UUID(), 'Temple of the Tooth (Sri Dalada Maligawa)', 'Sacred Buddhist temple in Kandy housing the relic of the tooth of Buddha.', 'tourist_spot', 'https://maps.google.com/?q=Temple+of+the+Tooth+Kandy', TRUE),
(UUID(), 'Nine Arch Bridge', 'Iconic railway bridge in Ella surrounded by tea plantations and lush greenery.', 'tourist_spot', 'https://maps.google.com/?q=Nine+Arch+Bridge+Ella', TRUE),
(UUID(), 'Galle Fort', 'Historic fort built by Portuguese and Dutch, now a UNESCO World Heritage Site.', 'tourist_spot', 'https://maps.google.com/?q=Galle+Fort', TRUE),
(UUID(), 'Yala National Park', 'Famous wildlife park known for leopards, elephants, and diverse bird species.', 'tourist_spot', 'https://maps.google.com/?q=Yala+National+Park', TRUE),
(UUID(), 'Pinnawala Elephant Orphanage', 'Elephant orphanage and breeding ground for wild Asian elephants.', 'tourist_spot', 'https://maps.google.com/?q=Pinnawala+Elephant+Orphanage', TRUE),
(UUID(), 'Nuwara Eliya Tea Plantations', 'Beautiful highland tea estates with stunning mountain views.', 'tourist_spot', 'https://maps.google.com/?q=Nuwara+Eliya', TRUE),
(UUID(), 'Mirissa Beach', 'Stunning beach destination known for whale watching and surfing.', 'tourist_spot', 'https://maps.google.com/?q=Mirissa+Beach', TRUE),
(UUID(), 'Adam''s Peak (Sri Pada)', 'Sacred mountain and pilgrimage site with breathtaking sunrise views.', 'tourist_spot', 'https://maps.google.com/?q=Adams+Peak', TRUE),
(UUID(), 'Polonnaruwa Ancient City', 'Ancient capital with well-preserved ruins and Buddhist temples.', 'tourist_spot', 'https://maps.google.com/?q=Polonnaruwa', TRUE);

-- Accommodations
INSERT INTO locations (location_id, name, description, location_type, location_url, is_active) VALUES
(UUID(), 'Hotel Sigiriya', 'Comfortable hotel near Sigiriya Rock with modern amenities.', 'accommodation', 'https://maps.google.com/?q=Hotel+Sigiriya', TRUE),
(UUID(), 'Earl''s Regency Hotel - Kandy', 'Luxury hotel in Kandy with scenic views and excellent service.', 'accommodation', 'https://maps.google.com/?q=Earls+Regency+Kandy', TRUE),
(UUID(), 'Ella Mount Heaven', 'Boutique hotel in Ella with panoramic mountain views.', 'accommodation', 'https://maps.google.com/?q=Ella+Mount+Heaven', TRUE),
(UUID(), 'Jetwing Lighthouse - Galle', 'Luxury resort in Galle designed by Geoffrey Bawa.', 'accommodation', 'https://maps.google.com/?q=Jetwing+Lighthouse+Galle', TRUE),
(UUID(), 'Grand Hotel - Nuwara Eliya', 'Colonial-era hotel with classic charm and beautiful gardens.', 'accommodation', 'https://maps.google.com/?q=Grand+Hotel+Nuwara+Eliya', TRUE);

-- Restaurants
INSERT INTO locations (location_id, name, description, location_type, location_url, is_active) VALUES
(UUID(), 'The Empire Cafe - Kandy', 'Popular restaurant in Kandy serving Sri Lankan and international cuisine.', 'restaurant', 'https://maps.google.com/?q=Empire+Cafe+Kandy', TRUE),
(UUID(), 'Cafe Chill - Ella', 'Cozy cafe in Ella with delicious food and great ambiance.', 'restaurant', 'https://maps.google.com/?q=Cafe+Chill+Ella', TRUE),
(UUID(), 'Pedlar''s Inn Cafe - Galle Fort', 'Charming cafe in Galle Fort with Dutch colonial architecture.', 'restaurant', 'https://maps.google.com/?q=Pedlars+Inn+Cafe+Galle', TRUE);

-- Activities
INSERT INTO locations (location_id, name, description, location_type, location_url, is_active) VALUES
(UUID(), 'Whale Watching - Mirissa', 'Exciting whale and dolphin watching tours in the Indian Ocean.', 'activity', 'https://maps.google.com/?q=Whale+Watching+Mirissa', TRUE),
(UUID(), 'Tea Factory Tour - Nuwara Eliya', 'Guided tour of tea factory with tasting session.', 'activity', 'https://maps.google.com/?q=Tea+Factory+Nuwara+Eliya', TRUE),
(UUID(), 'Safari - Yala National Park', 'Half-day or full-day safari tour to spot leopards and wildlife.', 'activity', 'https://maps.google.com/?q=Yala+Safari', TRUE);

-- ============================================
-- 3. SAMPLE TEMPLATE PACKAGES
-- ============================================

-- Get the admin_id for created_by
SET @admin_id = (SELECT admin_id FROM admins WHERE email = 'admin@trustyou-go.com' LIMIT 1);

-- Package 1: Cultural Triangle Tour
INSERT INTO packages (package_id, title, description, no_of_days, is_template, status, is_active, base_price, created_by) VALUES
(UUID(), '3-Day Cultural Triangle Tour', 'Explore the ancient cultural sites of Sri Lanka including Sigiriya, Dambulla, and Polonnaruwa.', 3, TRUE, 'published', TRUE, 45000.00, @admin_id);

-- Package 2: Hill Country Explorer
INSERT INTO packages (package_id, title, description, no_of_days, is_template, status, is_active, base_price, created_by) VALUES
(UUID(), '5-Day Hill Country Explorer', 'Experience the beauty of Sri Lanka''s hill country with visits to Kandy, Nuwara Eliya, and Ella.', 5, TRUE, 'published', TRUE, 75000.00, @admin_id);

-- Package 3: Complete Sri Lanka
INSERT INTO packages (package_id, title, description, no_of_days, is_template, status, is_active, base_price, created_by) VALUES
(UUID(), '7-Day Complete Sri Lanka', 'Comprehensive tour covering cultural sites, hill country, and coastal beaches.', 7, TRUE, 'published', TRUE, 120000.00, @admin_id);

-- Package 4: Beach Relaxation
INSERT INTO packages (package_id, title, description, no_of_days, is_template, status, is_active, base_price, created_by) VALUES
(UUID(), '4-Day Beach Relaxation', 'Unwind on the beautiful beaches of Galle and Mirissa with whale watching.', 4, TRUE, 'published', TRUE, 55000.00, @admin_id);

-- ============================================
-- 4. SAMPLE AGENTS (Optional)
-- ============================================
INSERT INTO agents (agent_id, name, contact, email, commission_rate, is_active, notes) VALUES
(UUID(), 'Travel Lanka Agency', '+94771234567', 'contact@travellanka.com', 5.00, TRUE, 'Reliable partner agency'),
(UUID(), 'Island Tours', '+94777654321', 'info@islandtours.lk', 7.50, TRUE, 'Premium service provider');

-- ============================================
-- END OF SEED DATA
-- ============================================
