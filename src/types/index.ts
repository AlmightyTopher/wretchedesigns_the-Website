export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  inStock: boolean;
  stripeProductId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryData {
  images: GalleryImage[];
  lastUpdated: string;
}

export interface ProductData {
  products: Product[];
  paymentsEnabled: boolean;
  lastUpdated: string;
}