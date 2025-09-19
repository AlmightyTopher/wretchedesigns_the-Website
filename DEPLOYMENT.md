# Deployment Guide for Wretched Designs Admin Dashboard

## Overview

This guide covers deploying the Wretched Designs site with admin dashboard to Cloudflare Pages.

## Prerequisites

1. Cloudflare account
2. Google Cloud Console project for OAuth
3. Domain configured in Cloudflare (wretchedesigns.com)

## Environment Variables

Configure these in Cloudflare Pages > Settings > Environment variables:

### Required Variables

```
NEXTAUTH_URL=https://www.wretchedesigns.com
NEXTAUTH_SECRET=your-secure-random-string-32-chars-min
GOOGLE_CLIENT_ID=57848607243-o5omf12h5emrc3e64lk5073vianism1f.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ADMIN_EMAILS=Topher@TopherTek.com,tophergutbrod@gmail.com,dogmansemail1@gmail.com
SKIP_ENV_VALIDATION=true
```

### Optional Variables (for Stripe payments)

```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://www.wretchedesigns.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)

**Note**: Your Google OAuth is already configured with Client ID: `57848607243-o5omf12h5emrc3e64lk5073vianism1f.apps.googleusercontent.com`

## Cloudflare Pages Setup

### Build Configuration

- **Build command**: `SKIP_ENV_VALIDATION=true npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (project root)

### Environment Variables Setup

1. Go to Cloudflare Pages dashboard
2. Select your site > Settings > Environment variables
3. Add all required environment variables listed above
4. Deploy the site

### Build Settings in netlify.toml

The project includes a `netlify.toml` but for Cloudflare Pages, use these settings:

```toml
[build]
  command = "SKIP_ENV_VALIDATION=true npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"
  DISABLE_ESLINT_PLUGIN = "true"
```

## Admin Access

### Adding Admin Users

1. Add email addresses to `ADMIN_EMAILS` environment variable (comma-separated)
2. Redeploy the site for changes to take effect
3. Users can sign in at: `https://wretchedesigns.com/auth/signin`

### Admin Features

- **Dashboard**: `https://wretchedesigns.com/admin`
- **Gallery Management**: `https://wretchedesigns.com/admin/gallery`
- **Product Management**: `https://wretchedesigns.com/admin/products`

## File Persistence

### Data Storage

- Gallery data: `/public/data/gallery.json`
- Product data: `/public/data/products.json`

### Important Notes

⚠️ **Data Persistence Limitation**: In Cloudflare Pages, files written during runtime are not persisted between deployments. For production use, consider:

1. Using Cloudflare KV or D1 database for persistence
2. External database (PostgreSQL, MongoDB)
3. External file storage (Cloudflare R2, AWS S3)

### Temporary Solution

For now, data is stored in JSON files. After each deployment:
1. Re-upload gallery images through admin panel
2. Re-add products through admin panel

## Stripe Integration

### Setup

1. Create Stripe account
2. Get API keys from Stripe dashboard
3. Add to Cloudflare Pages environment variables
4. Toggle payments in admin dashboard

### Test Mode

Use test API keys (pk_test_... and sk_test_...) for development.

### Production

Use live API keys (pk_live_... and sk_live_...) for production.

## Troubleshooting

### Common Issues

1. **Auth not working**: Check NEXTAUTH_URL matches your domain exactly
2. **Admin access denied**: Verify email is in ADMIN_EMAILS list
3. **Build fails**: Ensure SKIP_ENV_VALIDATION=true is set

### Debugging

Check Cloudflare Pages build logs for specific error messages.

## Security Notes

- Only authorized emails can access admin dashboard
- All admin routes are protected by authentication
- Environment variables are securely stored in Cloudflare
- HTTPS is enforced for all routes

## Development

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables
3. Run `npm run dev`
4. Access admin at `http://localhost:3000/admin`