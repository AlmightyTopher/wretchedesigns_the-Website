# Quickstart Guide: Admin Dashboard

**Status**: ✅ OPERATIONAL - Ready for immediate use
**Last Updated**: 2025-01-09

## Overview
This quickstart guide provides step-by-step instructions to access and use the Wretched Designs admin dashboard. The system is fully deployed and operational.

## Prerequisites
- Google account with email: `Topher@TopherTek.com`
- Internet connection
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Access

### Production Dashboard
🚀 **Live URL**: https://www.wretchedesigns.com/admin

### Local Development (Optional)
```bash
# Clone repository
git clone [repository-url]
cd wretchedesigns_the-Website

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your admin email

# Start development server
npm run dev

# Access local admin
# http://localhost:3000/admin
```

## Step-by-Step Usage

### 1. Access Admin Dashboard

1. **Navigate to**: https://www.wretchedesigns.com/admin
2. **Automatic Redirect**: You'll be redirected to Google sign-in
3. **Sign In**: Use Google account with `Topher@TopherTek.com`
4. **Authorization**: System will verify admin access
5. **Dashboard Access**: You'll arrive at the admin dashboard

### 2. Gallery Management

#### Add Images to Gallery
1. **Navigate**: Click "Gallery" in admin navigation
2. **Add Image**: Click "Add Image" button
3. **Fill Form**:
   - **Image URL**: Paste direct link to image (e.g., from Unsplash)
   - **Title**: Enter descriptive title
   - **Description**: Optional description
   - **Order**: Number for display position (0 = first)
4. **Save**: Click "Add Image"
5. **Verify**: Image appears in gallery grid

#### Manage Existing Images
- **Reorder**: Use ↑↓ buttons to change position
- **Delete**: Click 🗑️ icon (requires confirmation)
- **Preview**: Click image to view in modal

#### Example Gallery Addition
```
Image URL: https://images.unsplash.com/photo-1518709268805-4e9042af2176
Title: Cyberpunk Neon Street
Description: Futuristic street scene with neon lighting
Order: 1
```

### 3. Product Management

#### Add Products to Store
1. **Navigate**: Click "Products" in admin navigation
2. **Add Product**: Click "Add Product" button
3. **Fill Form**:
   - **Product Name**: Clear, descriptive name
   - **Price**: Dollar amount (e.g., 29.99)
   - **Image URL**: Product image link
   - **Category**: Optional (e.g., "T-Shirts", "Posters")
   - **Description**: Detailed product description
   - **In Stock**: Check if available
4. **Save**: Click "Add Product"
5. **Verify**: Product appears in store grid

#### Manage Existing Products
- **Edit**: Click "Edit" button on product card
- **Delete**: Click "Delete" button (requires confirmation)
- **Stock Status**: Toggle in/out of stock

#### Example Product Addition
```
Product Name: Wretched Designs Logo Tee
Price: 24.99
Image URL: https://example.com/logo-tee.jpg
Category: T-Shirts
Description: High-quality cotton t-shirt featuring the iconic Wretched Designs logo in electric purple on matte black.
In Stock: ✓ Checked
```

### 4. Payment System (Future)

#### Current Status
- **Status**: "Coming Soon" mode
- **Display**: All products show "Coming Soon" instead of "Buy Now"
- **Admin Control**: Payment toggle available in product manager

#### Enable Payments (When Ready)
1. **Get Stripe Keys**: Sign up for Stripe account
2. **Configure Environment**: Add Stripe keys to Cloudflare Pages
3. **Enable**: Use payment toggle in admin dashboard
4. **Test**: Verify checkout flow works

## User Interface Guide

### Dashboard Navigation
```
Header Navigation:
├── Wretched Admin (logo/home)
├── Dashboard (overview)
├── Gallery (image management)
├── Products (store management)
└── Sign Out (session management)
```

### Common Actions

#### Quick Stats (Dashboard)
- View gallery image count
- View product count
- Check payment status
- Access quick links to public site

#### Gallery Operations
- **Add**: Add new images to gallery
- **Reorder**: Change display sequence
- **Delete**: Remove images permanently
- **Preview**: View images in modal overlay

#### Product Operations
- **Add**: Create new products
- **Edit**: Modify existing products
- **Delete**: Remove products permanently
- **Stock**: Toggle availability status

## Verification Steps

### Test Gallery Functionality
1. **Add Test Image**:
   - URL: `https://images.unsplash.com/photo-1542396601-dca920ea2807`
   - Title: "Test Gallery Image"
   - Order: 999
2. **Verify Public Display**: Visit https://www.wretchedesigns.com/gallery.html
3. **Check Image Appears**: New image should be visible
4. **Clean Up**: Delete test image from admin

### Test Product Functionality
1. **Add Test Product**:
   - Name: "Test Product"
   - Price: 1.00
   - Description: "Test product for verification"
   - Category: "Test"
2. **Verify Public Display**: Visit https://www.wretchedesigns.com/shop.html
3. **Check Product Appears**: New product should be visible with "Coming Soon"
4. **Clean Up**: Delete test product from admin

### Test Authentication
1. **Sign Out**: Click "Sign Out" in header
2. **Access Attempt**: Try to visit `/admin` directly
3. **Redirect Verification**: Should redirect to sign-in page
4. **Sign Back In**: Complete OAuth flow again

## Troubleshooting

### Common Issues

#### Cannot Access Admin Dashboard
- **Solution**: Verify you're using `Topher@TopherTek.com` Google account
- **Check**: Ensure cookies enabled in browser
- **Try**: Incognito/private browsing mode

#### Images Not Loading
- **Solution**: Verify image URL is publicly accessible
- **Check**: URL returns actual image (not HTML page)
- **Try**: Use direct image links (e.g., Unsplash direct URLs)

#### Changes Not Appearing on Public Site
- **Solution**: Changes are immediate, try refreshing public pages
- **Check**: Cloudflare cache may need time to update (5 minutes max)
- **Try**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)

#### Authentication Errors
- **Solution**: Clear browser cookies for the site
- **Check**: Ensure using correct Google account
- **Try**: Different browser or incognito mode

### Error Messages

#### "Unauthorized"
- **Cause**: Not signed in or session expired
- **Solution**: Sign in again with admin account

#### "Failed to load gallery/products"
- **Cause**: Temporary server issue
- **Solution**: Refresh page, try again in a moment

#### "Invalid image URL"
- **Cause**: URL not accessible or not an image
- **Solution**: Verify URL loads image directly in browser

## Performance Notes

### Expected Performance
- **Dashboard Load**: <2 seconds
- **Image Upload**: <3 seconds
- **Product Creation**: <2 seconds
- **Public Site Update**: <5 minutes (due to CDN caching)

### Best Practices
- **Image URLs**: Use CDN-hosted images when possible
- **Image Size**: Optimize images before adding (recommended <2MB)
- **Batch Operations**: Add multiple items in sequence rather than simultaneously

## Security Reminders

### Access Control
- Only `Topher@TopherTek.com` can access admin functions
- All admin operations require authentication
- Sessions expire automatically after 30 days

### Data Safety
- Changes are permanent - no undo functionality
- Gallery/product data is backed up in Git repository
- Always confirm deletions before proceeding

## Support

### Self-Service Resources
- **Documentation**: All guides in `/specs/main/` directory
- **API Contracts**: Detailed in `/specs/main/contracts/`
- **Configuration**: See `DEPLOYMENT.md` for setup details

### Technical Issues
- **Check**: Browser console for JavaScript errors
- **Verify**: Network connectivity and firewall settings
- **Test**: Same operations in different browser

---
**Status**: ✅ System fully operational and ready for daily use
**Admin Access**: https://www.wretchedesigns.com/admin
**Public Gallery**: https://www.wretchedesigns.com/gallery.html
**Public Shop**: https://www.wretchedesigns.com/shop.html