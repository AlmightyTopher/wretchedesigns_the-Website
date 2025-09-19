# Data Model: Admin Dashboard

**Date**: 2025-01-09 | **Feature**: Admin Dashboard with Google OAuth, Gallery, Storefront, and Payments
**Status**: ✅ IMPLEMENTED - All entities operational in production

## Overview
This document defines the data entities, relationships, and validation rules for the Wretched Designs admin dashboard. All models have been implemented using TypeScript interfaces and JSON persistence.

## Core Entities

### 1. Gallery Image Entity

```typescript
interface GalleryImage {
  id: string;              // UUID v4 - Primary key
  url: string;             // Image URL - Required, valid URL format
  title: string;           // Display title - Required, 1-100 characters
  description?: string;    // Optional description - Max 500 characters
  order: number;           // Display order - Integer >= 0
  createdAt: string;       // ISO 8601 timestamp - Auto-generated
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `url`: Must be valid HTTP/HTTPS URL, accessible image format
- `title`: Required, 1-100 characters, no HTML tags
- `description`: Optional, max 500 characters, basic HTML allowed
- `order`: Non-negative integer, used for sorting display
- `createdAt`: ISO 8601 format, auto-generated on creation

**Business Rules**:
- Images with same order value sorted by creation date
- Deletion requires admin confirmation
- URLs validated for accessibility during creation
- Order values automatically adjusted when items deleted

### 2. Product Entity

```typescript
interface Product {
  id: string;              // UUID v4 - Primary key
  name: string;            // Product name - Required, 1-200 characters
  description: string;     // Product description - Required, 1-2000 characters
  price: number;           // Price in USD - Required, > 0, 2 decimal places
  image: string;           // Product image URL - Required, valid URL
  category?: string;       // Product category - Optional, 1-50 characters
  inStock: boolean;        // Inventory status - Required, default true
  stripeProductId?: string; // Stripe product ID - Optional, for future use
  createdAt: string;       // ISO 8601 timestamp - Auto-generated
  updatedAt: string;       // ISO 8601 timestamp - Auto-updated
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `name`: Required, 1-200 characters, no special characters except (-.&')
- `description`: Required, 1-2000 characters, basic HTML allowed
- `price`: Positive number, max 2 decimal places, max $999,999.99
- `image`: Must be valid HTTP/HTTPS URL, accessible image format
- `category`: Optional, 1-50 characters, alphanumeric and spaces only
- `inStock`: Boolean, default true
- `stripeProductId`: Optional, Stripe product ID format when present
- `createdAt`/`updatedAt`: ISO 8601 format, auto-managed

**Business Rules**:
- Out of stock products cannot be purchased
- Price changes update `updatedAt` timestamp
- Category standardization (case-insensitive storage)
- Stripe integration creates/updates `stripeProductId` when enabled

### 3. User Session Entity (NextAuth.js)

```typescript
interface AdminSession {
  user: {
    email: string;         // Admin email - Must be in ADMIN_EMAILS
    name?: string;         // Display name from Google OAuth
    image?: string;        // Profile image from Google OAuth
  };
  expires: string;         // Session expiration - ISO 8601 timestamp
}
```

**Validation Rules**:
- `email`: Must match one of the emails in `ADMIN_EMAILS` environment variable
- `name`: Optional, provided by Google OAuth
- `image`: Optional, Google profile image URL
- `expires`: ISO 8601 timestamp, managed by NextAuth.js

**Business Rules**:
- Only authorized emails can create sessions
- Session expiration managed automatically
- Multiple concurrent sessions allowed for same user
- Session invalidation on sign-out

## Aggregate Data Structures

### Gallery Data Container

```typescript
interface GalleryData {
  images: GalleryImage[];  // Array of gallery images
  lastUpdated: string;     // ISO 8601 timestamp - Auto-updated
}
```

**Storage**: `/public/data/gallery.json`
**Access Pattern**: Read for public display, write for admin operations
**Validation**: Array must be sortable by order, valid JSON structure

### Product Data Container

```typescript
interface ProductData {
  products: Product[];     // Array of products
  paymentsEnabled: boolean; // Global payment status flag
  lastUpdated: string;     // ISO 8601 timestamp - Auto-updated
}
```

**Storage**: `/public/data/products.json`
**Access Pattern**: Read for public display, write for admin operations
**Validation**: paymentsEnabled controls buy button state globally

## Entity Relationships

### Gallery Relationships
- **No foreign keys**: Gallery images are independent entities
- **Ordering relationship**: Images related by `order` field for display sequence
- **Admin relationship**: All images managed by authenticated admin users

### Product Relationships
- **No foreign keys**: Products are independent entities
- **Category grouping**: Soft relationship via `category` field
- **Payment relationship**: Products linked to Stripe via `stripeProductId`
- **Admin relationship**: All products managed by authenticated admin users

### Session Relationships
- **User-Admin relationship**: Sessions linked to admin users via email authorization
- **Admin-Data relationship**: Valid sessions enable CRUD operations on gallery/products

## State Transitions

### Gallery Image Lifecycle
```
[Created] → [Active] → [Reordered] → [Deleted]
           ↗                   ↘
         [Updated]         [Archived]
```

**States**:
- **Created**: New image added with metadata
- **Active**: Image visible in gallery
- **Updated**: Metadata modified (title, description, order)
- **Reordered**: Position changed in display sequence
- **Deleted**: Removed from gallery (permanent)

### Product Lifecycle
```
[Draft] → [Active] → [Out of Stock] → [Archived]
         ↗     ↘              ↗           ↘
    [Updated] [In Stock] [Restocked] [Deleted]
```

**States**:
- **Draft**: Product created but not yet active
- **Active**: Product available for purchase (inStock: true)
- **Out of Stock**: Product unavailable (inStock: false)
- **Updated**: Product metadata modified
- **Restocked**: Product returned to stock
- **Archived**: Product hidden but not deleted
- **Deleted**: Permanently removed

### Payment System States
```
[Disabled] → [Configuring] → [Enabled] → [Suspended]
                ↑                ↓           ↓
              [Error]      [Processing] [Maintenance]
```

**States**:
- **Disabled**: Default state, "Coming Soon" displayed
- **Configuring**: Stripe keys being set up
- **Enabled**: Payments fully operational
- **Processing**: Active payment in progress
- **Suspended**: Temporarily disabled
- **Error**: Configuration or processing error
- **Maintenance**: Planned downtime

## Data Validation Implementation

### Runtime Validation
```typescript
// Implemented in API routes
function validateGalleryImage(data: any): GalleryImage {
  // URL validation, title length, order constraints
}

function validateProduct(data: any): Product {
  // Price validation, name constraints, inventory rules
}
```

### TypeScript Compile-time Validation
```typescript
// Implemented throughout application
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
```

## Persistence Strategy

### Current Implementation: JSON Files
- **Location**: `/public/data/`
- **Format**: JSON with pretty printing
- **Backup**: Version controlled in Git
- **Performance**: Suitable for <1000 items per collection

### Future Migration Path: Database
```sql
-- Planned database schema
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  image_url VARCHAR(2048) NOT NULL,
  category VARCHAR(50),
  in_stock BOOLEAN DEFAULT true,
  stripe_product_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Contracts Alignment

All data models align with implemented API contracts:

- **GET /api/gallery**: Returns `GalleryData`
- **POST /api/gallery**: Accepts `Omit<GalleryImage, 'id' | 'createdAt'>`
- **PUT /api/gallery**: Accepts `GalleryImage[]` for reordering
- **DELETE /api/gallery**: Accepts `id` parameter

- **GET /api/products**: Returns `ProductData`
- **POST /api/products**: Accepts `Omit<Product, 'id' | 'createdAt' | 'updatedAt'>`
- **PUT /api/products**: Accepts complete `Product` object
- **DELETE /api/products**: Accepts `id` parameter

## Performance Considerations

### Current Scale
- **Gallery**: ~50 images expected, <10KB JSON
- **Products**: ~100 products expected, <50KB JSON
- **Read Performance**: <10ms from filesystem
- **Write Performance**: <50ms with validation

### Scale Thresholds for Migration
- **Gallery**: >500 images (JSON becomes unwieldy)
- **Products**: >1000 products (Search/filtering needed)
- **Traffic**: >1000 admin operations/day (Concurrency issues)

---
**Implementation Status**: ✅ All entities implemented and operational in production
**Last Updated**: 2025-01-09
**Validation**: All data models tested and validated through admin interface