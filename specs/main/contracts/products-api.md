# Products API Contract

**Endpoint**: `/api/products`
**Purpose**: CRUD operations for product management
**Authentication**: Required for POST, PUT, DELETE operations

## GET /api/products

**Description**: Retrieve all products with metadata and payment status
**Authentication**: Not required (public endpoint)

### Request
```http
GET /api/products
Content-Type: application/json
```

### Response
```typescript
{
  "products": [
    {
      "id": "string (UUID)",
      "name": "string (1-200 chars)",
      "description": "string (1-2000 chars)",
      "price": "number (positive, 2 decimal places)",
      "image": "string (valid URL)",
      "category": "string (optional, 1-50 chars)",
      "inStock": "boolean",
      "stripeProductId": "string (optional)",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "paymentsEnabled": "boolean",
  "lastUpdated": "string (ISO 8601)"
}
```

### Status Codes
- `200 OK`: Product data retrieved successfully
- `500 Internal Server Error`: Failed to read product data

## POST /api/products

**Description**: Add new product to store
**Authentication**: Required (admin session)

### Request
```http
POST /api/products
Content-Type: application/json
Authorization: Session cookie
```

```typescript
{
  "product": {
    "name": "string (1-200 chars, required)",
    "description": "string (1-2000 chars, required)",
    "price": "number (positive, required)",
    "image": "string (valid URL, required)",
    "category": "string (optional, 1-50 chars)",
    "inStock": "boolean (default: true)"
  }
}
```

### Response
```typescript
// Success
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "inStock": "boolean",
  "stripeProductId": null,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}

// Error
{
  "error": "string (error message)"
}
```

### Status Codes
- `200 OK`: Product added successfully
- `401 Unauthorized`: No valid admin session
- `400 Bad Request`: Invalid product data
- `500 Internal Server Error`: Failed to save product

### Validation Rules
- `name`: Required, 1-200 characters, no special characters except (-.&')
- `description`: Required, 1-2000 characters
- `price`: Positive number, max 2 decimal places, max $999,999.99
- `image`: Must be valid HTTP/HTTPS URL
- `category`: Optional, 1-50 characters, alphanumeric and spaces only
- `inStock`: Boolean, defaults to true

## PUT /api/products

**Description**: Update existing product
**Authentication**: Required (admin session)

### Request
```http
PUT /api/products
Content-Type: application/json
Authorization: Session cookie
```

```typescript
{
  "product": {
    "id": "string (UUID, required)",
    "name": "string (1-200 chars, required)",
    "description": "string (1-2000 chars, required)",
    "price": "number (positive, required)",
    "image": "string (valid URL, required)",
    "category": "string (optional, 1-50 chars)",
    "inStock": "boolean (required)",
    "stripeProductId": "string (optional)",
    "createdAt": "string (ISO 8601, required)",
    "updatedAt": "string (will be auto-updated)"
  }
}
```

### Response
```typescript
// Success
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "inStock": "boolean",
  "stripeProductId": "string",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)" // Automatically updated
}

// Error
{
  "error": "string (error message)"
}
```

### Status Codes
- `200 OK`: Product updated successfully
- `401 Unauthorized`: No valid admin session
- `400 Bad Request`: Invalid product data
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Failed to update product

## DELETE /api/products

**Description**: Delete specific product from store
**Authentication**: Required (admin session)

### Request
```http
DELETE /api/products?id={productId}
Authorization: Session cookie
```

### Response
```typescript
// Success
{
  "success": true
}

// Error
{
  "error": "string (error message)"
}
```

### Status Codes
- `200 OK`: Product deleted successfully
- `400 Bad Request`: Product ID required or invalid
- `401 Unauthorized`: No valid admin session
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Failed to delete product

## Error Handling

### Common Error Responses
```typescript
{
  "error": "string",
  "details"?: "string" // Optional additional details
}
```

### Error Scenarios
- **Authentication Failed**: Invalid or expired session
- **Validation Failed**: Invalid product data format
- **File System Error**: Unable to read/write products.json
- **Network Error**: Product image URL not accessible
- **Concurrent Modification**: Products modified by another admin
- **Price Validation**: Invalid price format or negative value

## Business Rules

### Product State Management
- New products default to `inStock: true`
- Out of stock products cannot be purchased (frontend enforcement)
- Price changes trigger `updatedAt` timestamp update
- Categories are stored case-insensitive

### Stripe Integration
- `stripeProductId` populated when Stripe integration enabled
- Products without Stripe ID show "Coming Soon" in frontend
- Payment toggle affects all products globally via `paymentsEnabled`

## Rate Limiting
- **GET**: No limits (public endpoint)
- **POST/PUT/DELETE**: 100 requests per minute per session

## Caching
- **GET**: Cached by Cloudflare CDN for 5 minutes
- **POST/PUT/DELETE**: Invalidates cache immediately

---
**Implementation Status**: ✅ Fully implemented and operational
**Last Updated**: 2025-01-09