# Gallery API Contract

**Endpoint**: `/api/gallery`
**Purpose**: CRUD operations for gallery image management
**Authentication**: Required for POST, PUT, DELETE operations

## GET /api/gallery

**Description**: Retrieve all gallery images with metadata
**Authentication**: Not required (public endpoint)

### Request
```http
GET /api/gallery
Content-Type: application/json
```

### Response
```typescript
{
  "images": [
    {
      "id": "string (UUID)",
      "url": "string (valid URL)",
      "title": "string (1-100 chars)",
      "description": "string (optional, max 500 chars)",
      "order": "number (integer >= 0)",
      "createdAt": "string (ISO 8601)"
    }
  ],
  "lastUpdated": "string (ISO 8601)"
}
```

### Status Codes
- `200 OK`: Gallery data retrieved successfully
- `500 Internal Server Error`: Failed to read gallery data

## POST /api/gallery

**Description**: Add new image to gallery
**Authentication**: Required (admin session)

### Request
```http
POST /api/gallery
Content-Type: application/json
Authorization: Session cookie
```

```typescript
{
  "image": {
    "url": "string (valid URL, required)",
    "title": "string (1-100 chars, required)",
    "description": "string (optional, max 500 chars)",
    "order": "number (integer >= 0, required)"
  }
}
```

### Response
```typescript
// Success
{
  "id": "string (UUID)",
  "url": "string",
  "title": "string",
  "description": "string",
  "order": "number",
  "createdAt": "string (ISO 8601)"
}

// Error
{
  "error": "string (error message)"
}
```

### Status Codes
- `200 OK`: Image added successfully
- `401 Unauthorized`: No valid admin session
- `400 Bad Request`: Invalid image data
- `500 Internal Server Error`: Failed to save image

### Validation Rules
- `url`: Must be valid HTTP/HTTPS URL
- `title`: Required, 1-100 characters, no HTML
- `description`: Optional, max 500 characters
- `order`: Non-negative integer

## PUT /api/gallery

**Description**: Update gallery images (typically for reordering)
**Authentication**: Required (admin session)

### Request
```http
PUT /api/gallery
Content-Type: application/json
Authorization: Session cookie
```

```typescript
{
  "images": [
    {
      "id": "string (UUID, required)",
      "url": "string (required)",
      "title": "string (required)",
      "description": "string (optional)",
      "order": "number (required)",
      "createdAt": "string (ISO 8601, required)"
    }
  ]
}
```

### Response
```typescript
// Success
{
  "images": [...], // Updated images array
  "lastUpdated": "string (ISO 8601)"
}

// Error
{
  "error": "string (error message)"
}
```

### Status Codes
- `200 OK`: Gallery updated successfully
- `401 Unauthorized`: No valid admin session
- `400 Bad Request`: Invalid images data
- `500 Internal Server Error`: Failed to update gallery

## DELETE /api/gallery

**Description**: Delete specific image from gallery
**Authentication**: Required (admin session)

### Request
```http
DELETE /api/gallery?id={imageId}
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
- `200 OK`: Image deleted successfully
- `400 Bad Request`: Image ID required or invalid
- `401 Unauthorized`: No valid admin session
- `404 Not Found`: Image not found
- `500 Internal Server Error`: Failed to delete image

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
- **Validation Failed**: Invalid image data format
- **File System Error**: Unable to read/write gallery.json
- **Network Error**: Image URL not accessible
- **Concurrent Modification**: Gallery modified by another admin

## Rate Limiting
- **GET**: No limits (public endpoint)
- **POST/PUT/DELETE**: 100 requests per minute per session

## Caching
- **GET**: Cached by Cloudflare CDN for 5 minutes
- **POST/PUT/DELETE**: Invalidates cache immediately

---
**Implementation Status**: ✅ Fully implemented and operational
**Last Updated**: 2025-01-09