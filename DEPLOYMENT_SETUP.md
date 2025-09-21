# Deployment Setup Guide

This guide explains how to set up the complete deployment pipeline for Wretched Designs.

## Architecture Overview

- **Customer Site**: Static HTML hosted on GitHub Pages + Cloudflare CDN
- **Admin System**: Docker-based Next.js app with PostgreSQL database
- **Deployment**: Admin pushes changes to GitHub → GitHub Actions → GitHub Pages → Cloudflare cache purge

## Required GitHub Secrets

You need to set up these secrets in your GitHub repository settings:

### 1. Cloudflare Secrets

Go to **Settings > Secrets and variables > Actions** in your GitHub repository and add:

- `CLOUDFLARE_ZONE_ID`: Your Cloudflare zone ID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Zone:Zone and Zone:Page Rules permissions

### How to get Cloudflare credentials:

1. **Zone ID**:
   - Go to Cloudflare Dashboard → Select your domain
   - Zone ID is shown in the right sidebar under "API"

2. **API Token**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Click "Create Token" → Use "Custom token" template
   - Permissions: Zone:Zone:Read, Zone:Page Rules:Edit, Zone:Cache Purge:Purge
   - Zone Resources: Include → Specific zone → Your domain

## GitHub Repository Settings

### 1. Enable GitHub Pages

1. Go to **Settings > Pages**
2. Source: "GitHub Actions"
3. The workflow will automatically deploy to Pages

### 2. Set up GitHub Actions

The workflow file is already configured at `.github/workflows/deploy.yml`. It will:

1. Build the customer site from the `customer/` directory
2. Deploy to GitHub Pages
3. Purge Cloudflare cache

## Admin System Setup

### 1. Docker Environment

The admin system runs in Docker with:
- Next.js admin interface
- PostgreSQL database
- Git integration for deployment

Start the admin system:
```bash
cd admin
docker-compose up -d
```

### 2. Environment Variables

Configure these in `admin/.env.local`:

```env
# Authentication
NEXTAUTH_URL=https://www.wretchedesigns.com
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_EMAILS=your-admin-email@gmail.com

# Database (configured in docker-compose.yml)
DATABASE_URL=postgresql://postgres:wretchedsecret2024@postgres:5432/wretched_designs
```

## Deployment Workflow

### Admin Makes Changes

1. Admin logs into Docker-based admin interface at `http://localhost:3000`
2. Makes changes to gallery, products, or content
3. Clicks "🚀 Finalize & Deploy Live" button

### Automated Process

1. **Export Database**: Current gallery and product data exported to JSON files
2. **Git Commit**: Changes committed to GitHub with automated message
3. **GitHub Actions**: Triggered automatically on push to main branch
4. **Build Customer Site**: Static files built from `customer/` directory + exported data
5. **Deploy to GitHub Pages**: Site deployed to GitHub Pages
6. **Cloudflare Purge**: Cache automatically purged for instant updates

## Cloudflare Setup

### 1. DNS Configuration

Point your domain to GitHub Pages:

- **Type**: CNAME
- **Name**: www (or @)
- **Target**: `your-username.github.io`

### 2. SSL/TLS Settings

- **SSL/TLS mode**: Full (strict)
- **Always Use HTTPS**: On
- **Automatic HTTPS Rewrites**: On

### 3. Caching Rules

Set up cache rules for optimal performance:

- **HTML files**: Cache for 2 hours
- **Images/Assets**: Cache for 1 month
- **API responses**: No cache

## Testing the Pipeline

1. **Make a test change** in admin interface
2. **Click deploy** and verify GitHub commit appears
3. **Check GitHub Actions** workflow runs successfully
4. **Visit live site** to confirm changes are visible
5. **Verify Cloudflare cache** was purged (check timestamp in page source)

## Troubleshooting

### Deploy Button Not Working

- Check Docker logs: `docker-compose logs admin`
- Verify Git permissions in container
- Ensure GitHub credentials are set up

### GitHub Actions Failing

- Check workflow run logs in GitHub
- Verify Cloudflare secrets are set correctly
- Ensure build script works locally: `npm run build-customer`

### Cloudflare Not Updating

- Verify API token has correct permissions
- Check cache purge is happening in GitHub Actions logs
- Manually purge cache in Cloudflare dashboard

## Security Notes

- Admin interface only accessible via OAuth authentication
- GitHub repository should be private if containing sensitive data
- Use strong passwords for database and NextAuth secret
- Regularly rotate API tokens and secrets

## Backup Strategy

- PostgreSQL data is persisted in Docker volumes
- Export database regularly: Admin interface → Deploy (creates JSON backups)
- Git repository serves as backup for all content and code
- Consider setting up automated database backups to external storage