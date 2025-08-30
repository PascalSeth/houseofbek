-- Seed data for House of Bek Restaurant
-- Run this after running Prisma migrations

-- Insert menu categories
INSERT INTO "MenuCategory" (id, name, description, "displayOrder") VALUES
  (uuid_generate_v4(), 'Appetizers', 'Start your culinary journey', 1),
  (uuid_generate_v4(), 'Main Courses', 'Our signature dishes', 2),
  (uuid_generate_v4(), 'Desserts', 'Sweet endings', 3),
  (uuid_generate_v4(), 'Beverages', 'Craft cocktails and fine wines', 4);

-- Insert sample menu items
WITH categories AS (
  SELECT id, name FROM "MenuCategory"
)
INSERT INTO "MenuItem" (id, name, description, price, "categoryId", available, "imageUrl") 
SELECT 
  uuid_generate_v4(),
  item.name,
  item.description,
  item.price,
  c.id,
  true,
  item.image_url
FROM categories c
CROSS JOIN (
  VALUES 
    ('Appetizers', 'Truffle Arancini', 'Crispy risotto balls with black truffle and parmesan', 18.00, '/truffle-arancini.jpg'),
    ('Appetizers', 'Seared Scallops', 'Pan-seared scallops with cauliflower puree', 24.00, '/seared-scallops.jpg'),
    ('Main Courses', 'Wagyu Beef Tenderloin', 'Premium wagyu with roasted vegetables', 65.00, '/wagyu-beef.jpg'),
    ('Main Courses', 'Lobster Thermidor', 'Classic French preparation with gruyere', 48.00, '/lobster-thermidor.jpg'),
    ('Main Courses', 'Duck Confit', 'Slow-cooked duck leg with cherry gastrique', 38.00, '/duck-confit.jpg'),
    ('Desserts', 'Chocolate Soufflé', 'Dark chocolate soufflé with vanilla ice cream', 16.00, '/chocolate-souffle.jpg'),
    ('Desserts', 'Crème Brûlée', 'Classic vanilla custard with caramelized sugar', 14.00, '/creme-brulee.jpg'),
    ('Beverages', 'House Wine Selection', 'Curated wines by our sommelier', 12.00, '/wine-selection.jpg'),
    ('Beverages', 'Craft Cocktails', 'Artisanal cocktails with premium spirits', 16.00, '/craft-cocktails.jpg')
) AS item(category, name, description, price, image_url)
WHERE c.name = item.category;

-- Insert sample tables
INSERT INTO "Table" (id, number, capacity, location) VALUES
  (uuid_generate_v4(), 1, 2, 'Main Dining'),
  (uuid_generate_v4(), 2, 4, 'Main Dining'),
  (uuid_generate_v4(), 3, 6, 'Main Dining'),
  (uuid_generate_v4(), 4, 8, 'Private Room'),
  (uuid_generate_v4(), 5, 2, 'Bar Area'),
  (uuid_generate_v4(), 6, 4, 'Terrace'),
  (uuid_generate_v4(), 7, 6, 'Terrace'),
  (uuid_generate_v4(), 8, 10, 'Private Room');

-- Insert sample events
INSERT INTO "Event" (id, title, description, date, "startTime", "endTime", "maxAttendees", price, status, "imageUrl") VALUES
  (uuid_generate_v4(), 'Wine Tasting Evening', 'Explore premium wines with our sommelier', CURRENT_DATE + INTERVAL '7 days', '19:00', '22:00', 20, 85.00, 'UPCOMING', '/wine-tasting-event.jpg'),
  (uuid_generate_v4(), 'Chef''s Table Experience', 'Exclusive 7-course tasting menu', CURRENT_DATE + INTERVAL '14 days', '18:30', '22:30', 8, 150.00, 'UPCOMING', '/chefs-table-event.jpg'),
  (uuid_generate_v4(), 'Cooking Masterclass', 'Learn to cook signature dishes', CURRENT_DATE + INTERVAL '21 days', '15:00', '18:00', 12, 120.00, 'UPCOMING', '/cooking-class-event.jpg');
