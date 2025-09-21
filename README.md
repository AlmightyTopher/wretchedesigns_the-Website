# Wretched Designs - Split Architecture

## Overview

Wretched Designs implements a split deployment architecture with separate customer-facing static site and admin Docker container.

## Architecture

### Customer Site (`customer/`)
- **Static HTML/CSS/JS** site deployed to GitHub Pages + Cloudflare
- Loads data dynamically from JSON files
- Fully public and accessible without authentication

### Admin System (`admin/`)
- **Next.js app** running in Docker container
- Full content management interface
- Triggered deployments with "Finalize & Deploy" button
- Secure access via OAuth and Cloudflare Tunnel

## Quick Start

### 1. Setup Repository

```bash
git clone <repository-url>
cd wretchedesigns_the-Website
```

### 2. Configure GitHub Secrets

In GitHub Repository Settings → Secrets and Variables → Actions:

```
CLOUDFLARE_ZONE_ID=<your-cloudflare-zone-id>
CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
```

### 3. Run Admin System

```bash
cd admin/
cp .env.example .env.local
# Edit .env.local with your Google OAuth credentials and secrets
docker-compose up -d
```

### 4. Access Systems

- **Admin Dashboard**: http://localhost:3000/admin
- **Customer Site**: Will be auto-deployed to GitHub Pages

## Workflow

1. **Admin Interface**: Make content changes (gallery, products, etc.)
2. **Finalize Button**: Click "🚀 Finalize & Deploy Live"
3. **Git Operations**: Auto-commit and push to GitHub main branch
4. **GitHub Actions**: Triggers automated build and deployment
5. **Cloudflare**: Automatically purges cache for instant updates

## Security

- Customer site is fully public static HTML
- Admin system requires OAuth authentication
- Admin container never exposed publicly (use Cloudflare Tunnel)
- All sensitive operations happen server-side in Docker container

## Development

### Customer Site
```bash
cd customer/
# Edit index.html, styles.css, app.js
```

### Admin System
```bash
cd admin/
npm run dev # Development server
```

### Deployment
```bash
# Changes are automatically deployed via GitHub Actions
# Just commit to main branch or use the Finalize button in admin
