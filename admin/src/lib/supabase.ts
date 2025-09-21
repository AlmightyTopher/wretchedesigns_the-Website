import { Pool } from 'pg';

// PostgreSQL connection for server-side operations
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'wretched_designs',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'wretchedsecret2024',
});

// Helper function to execute queries
async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Database schemas
export interface GalleryImageDB {
  id: string;
  title: string;
  url: string;
  description: string;
  order: number;
  category?: string;
  created_at: string;
}

export interface ProductDB {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

// Gallery operations
export async function getGalleryImages(): Promise<GalleryImageDB[]> {
  const result = await query('SELECT * FROM gallery_images ORDER BY "order" ASC');
  return result.rows;
}

export async function addGalleryImage(image: Omit<GalleryImageDB, 'id' | 'created_at'>): Promise<GalleryImageDB> {
  const id = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const result = await query(
    'INSERT INTO gallery_images (id, title, url, description, "order", category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, image.title, image.url, image.description, image.order, image.category]
  );
  return result.rows[0];
}

export async function updateGalleryImages(images: GalleryImageDB[]): Promise<GalleryImageDB[]> {
  // Delete all existing images
  await query('DELETE FROM gallery_images');

  // Insert new images
  const insertPromises = images.map(image =>
    query(
      'INSERT INTO gallery_images (id, title, url, description, "order", category, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [image.id, image.title, image.url, image.description, image.order, image.category, image.created_at]
    )
  );

  await Promise.all(insertPromises);
  return await getGalleryImages();
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await query('DELETE FROM gallery_images WHERE id = $1', [id]);
}

// Product operations
export async function getProducts(): Promise<ProductDB[]> {
  const result = await query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
}

export async function addProduct(product: Omit<ProductDB, 'id' | 'created_at' | 'updated_at'>): Promise<ProductDB> {
  const id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const result = await query(
    'INSERT INTO products (id, name, description, price, image, category, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [id, product.name, product.description, product.price, product.image, product.category, product.in_stock]
  );
  return result.rows[0];
}

export async function updateProduct(id: string, product: Partial<ProductDB>): Promise<ProductDB> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(product).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      updates.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  updates.push(`updated_at = $${paramIndex}`);
  values.push(new Date().toISOString());
  values.push(id);

  const query_text = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`;
  const result = await query(query_text, values);
  return result.rows[0];
}

export async function deleteProduct(id: string): Promise<void> {
  await query('DELETE FROM products WHERE id = $1', [id]);
}