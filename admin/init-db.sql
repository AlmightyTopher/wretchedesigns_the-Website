-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample gallery images
INSERT INTO gallery_images (id, title, url, description, "order", category) VALUES
('art-1758303434881-1', 'Art #2', '/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg', 'Beautiful art design', 0, 'Art'),
('art-1758303434880-0', 'Art #1', '/Images/Art/0e24c8e1-ad42-4b6c-b538-672c737cec86.jpg', 'Beautiful art design', 1, 'Art'),
('cup-1758303434882-2', 'Cup Design #1', '/Images/Cups/0769b870-babf-40e7-8a82-0682dc5abcfb.jpg', 'Custom printed cup', 2, 'Cups'),
('shirt-1758303434883-3', 'Shirt Design #1', '/Images/Shirts/6e6b35c8-59a0-4ac4-9489-b08e05475e87.jpg', 'Custom printed shirt', 3, 'Shirts')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, image, category, in_stock) VALUES
('prod-art-001', 'Cyberpunk Art Print #1', 'High-quality digital art print with cyberpunk aesthetic', 29.99, '/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg', 'Art', true),
('prod-cup-001', 'Neon Glow Coffee Cup', 'Custom printed coffee cup with neon glow design', 19.99, '/Images/Cups/0769b870-babf-40e7-8a82-0682dc5abcfb.jpg', 'Cups', true),
('prod-shirt-001', 'Techno Gothic T-Shirt', 'Premium quality t-shirt with techno gothic print', 24.99, '/Images/Shirts/6e6b35c8-59a0-4ac4-9489-b08e05475e87.jpg', 'Shirts', true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images("order");
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);