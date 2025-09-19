import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
export async function getGalleryImages() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addGalleryImage(image: Omit<GalleryImageDB, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([image])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryImages(images: GalleryImageDB[]) {
  // Delete all existing images
  await supabase.from('gallery_images').delete().gte('order', 0);

  // Insert new images
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(images)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Product operations
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addProduct(product: Omit<ProductDB, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<ProductDB>) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}