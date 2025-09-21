# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Wretched Designs website - a split-architecture e-commerce site with a cyberpunk/techno-goth aesthetic featuring custom printed apparel and art sales. The project implements a separation between customer-facing static site and admin management system.

**Architecture Overview**:
- **Customer Site** (`customer/`): Static HTML/CSS/JS deployed to GitHub Pages + Cloudflare
- **Admin System** (`admin/`): Next.js app with full content management, authentication, and Docker deployment
- **Root Directory**: Contains shared Next.js configuration and legacy static files

## Development Commands

### Customer Site Development
```bash
cd customer/
# Edit index.html, styles.css directly
# No build process required - direct HTML/CSS/JS
```

### Admin System Development
```bash
cd admin/
npm install          # Install admin dependencies
npm run dev          # Start admin development server
npm run build        # Build admin system
```

### Root Directory Commands
```bash
npm install          # Install shared dependencies (minimal)
npm run dev          # Start development server (legacy)
npm run build        # Build for production
```

### Docker Deployment (Admin System)
```bash
cd admin/
docker-compose up -d # Start admin system in Docker
docker-compose down  # Stop admin system
```

### Testing
```bash
npm test             # Run vitest tests (configured in root)
npm run test:ui      # Run vitest with UI
```

### Code Quality & Linting
The project uses both Biome and ESLint for linting:
- **Biome**: Primary linter configured in `biome.json` for TypeScript/TSX files, focused on admin system
- **ESLint**: Secondary linter with Next.js configuration in `eslint.config.mjs`

Both tools have relaxed rules for rapid development:
- All accessibility rules disabled
- TypeScript strict rules disabled
- React hooks rules disabled

Note: ESLint is disabled during builds (`DISABLE_ESLINT_PLUGIN=true` in Netlify config).

### Media Management
Python scripts for managing project images:
```bash
python export_visible_image_urls.py  # Extract all image URLs from codebase
python copy_media_files.py           # Copy media files
python copy_and_download_media.py    # Download and organize media assets
```

### Deployment

#### Customer Site
- **Platform**: GitHub Pages + Cloudflare CDN
- **Source**: `customer/` directory
- **Process**: Direct static file deployment via GitHub Actions
- **URL**: www.wretchedesigns.com (public)

#### Admin System
- **Platform**: Docker container deployment
- **Source**: `admin/` directory
- **Process**: Docker Compose with Cloudflare Tunnel
- **URL**: Secure admin access only
- **Build command**: `SKIP_ENV_VALIDATION=true npm run build`

#### Legacy/Root
- **Alternative**: Netlify (configured via `netlify.toml`)
- **Status**: Fallback deployment option

### Admin Dashboard (NEW - OPERATIONAL)
- **URL**: https://www.wretchedesigns.com/admin
- **Authentication**: Google OAuth (NextAuth.js)
- **Admin Access**: Topher@TopherTek.com only
- **Features**: Gallery management, product management, payment toggle

## Architecture

### Technology Stack
- **Framework**: Next.js 15+ with TypeScript and App Router
- **Styling**: Tailwind CSS with custom cyberpunk theme colors
- **Fonts**: Orbitron (headers), Share Tech Mono (body/code)
- **Testing**: Vitest with React Testing Library
- **Payment**: Stripe integration (scaffolded, ready for activation)
- **Auth**: NextAuth.js with Google OAuth (OPERATIONAL)
- **Database**: JSON file persistence (gallery.json, products.json)
- **UI Components**: Custom React components with Tailwind

### Page Structure

#### Customer Site (`customer/`)
- **Static HTML**: `index.html` (main customer page)
- **Styling**: `styles.css` (standalone CSS)
- **JavaScript**: Embedded in HTML (no external JS files)

#### Admin System (`admin/`)
- **Next.js App**: `/src/app/` with App Router structure
- **Admin Routes**: `/admin/*` (protected by authentication)
- **API Routes**: `/api/*` for gallery/product CRUD operations
- **Components**: `/src/components/` (React components)
- **Public Assets**: `/public/` (admin-specific static files)

#### Legacy Static Files (`admin/public/`)
- **HTML files**: `index.html`, `shop.html`, `gallery.html`, `about.html`, `contact.html`, `blogs.html`
- **JavaScript**: `main.js` (image modal system)
- **Global styles**: `style.css` with embedded Tailwind classes

### Theme System
Custom cyberpunk color palette defined in `tailwind.config.ts`:
- Electric purple: `#9B00FF`
- Neon magenta: `#FF00CC`
- Neon blue: `#001F3F`
- Matte black: `#111111`
- Custom neon shadow effects and glitch animations

### Key Configuration Files

#### Root Directory
- `next.config.js`: Image optimization, build error ignoring, remote patterns for all hostnames
- `vitest.config.ts`: Test configuration with jsdom environment, globals enabled
- `biome.json`: Primary linter configuration (relaxed a11y rules)
- `eslint.config.mjs`: Next.js ESLint configuration (strict rules disabled)
- `netlify.toml`: Netlify deployment configuration (legacy)

#### Admin System (`admin/`)
- `tailwind.config.ts`: Cyberpunk theme colors and custom utilities
- `next.config.js`: Admin-specific Next.js configuration
- `docker-compose.yml`: Container deployment configuration
- `tsconfig.json`: TypeScript configuration for admin app

## Development Notes

### Image Handling
- Images loaded from Unsplash and same-assets.com domains
- Modal system implemented in `main.js` for gallery/shop image viewing
- Recent work focused on responsive image sizing across gallery and shop pages

### Styling Conventions
- Uses CSS custom properties for theming
- Extensive use of Tailwind utility classes
- Custom `.glitch` and `.neon` CSS classes for effects
- Font hierarchy: Orbitron for headers, Share Tech Mono for body text

### Build Configuration
- TypeScript and ESLint errors ignored during builds for rapid iteration (`ignoreBuildErrors: true`)
- Next.js image optimization configured for external domains (Unsplash, same-assets.com)
- Experimental typed routes disabled
- Environment validation skipped during Netlify builds (`SKIP_ENV_VALIDATION=true`)

### TODO System
The project includes a comprehensive TODO.md file with prioritized tasks and "Just Work Mode" for automated task execution. Key features:
- Prioritized task list with completion tracking
- Auto-execution mode for batch task completion
- Integration requirements for Firebase, Cloudflare Pages hosting
- Media management and optimization tasks

### Media Pipeline
- Image extraction and management via Python scripts
- Automated URL discovery across HTML/CSS/JS files
- Support for various image formats (jpg, png, gif, svg, webp, etc.)
- External image optimization through CDNs (Unsplash, same-assets.com)

## Admin Dashboard System

### Authentication & Access
- **OAuth Provider**: Google OAuth 2.0
- **Authorized User**: Topher@TopherTek.com (single admin)
- **Session Management**: NextAuth.js with secure JWT tokens
- **Access Control**: Email-based authorization, protected API routes

### Data Management
- **Gallery Management**: Add, delete, reorder images with real-time JSON updates
- **Product Management**: Full CRUD operations for store products
- **Data Persistence**: JSON files (`/public/data/gallery.json`, `/public/data/products.json`)
- **Public Integration**: Static HTML pages dynamically load from JSON files

### API Architecture
- **Gallery API**: `/api/gallery` (GET, POST, PUT, DELETE)
- **Products API**: `/api/products` (GET, POST, PUT, DELETE)
- **Checkout API**: `/api/checkout` (Stripe-ready, disabled until configured)
- **Payment Toggle**: `/api/payments/toggle` (admin control for enabling payments)

### Development Workflow

#### Customer Site Updates
1. **Direct Editing**: Modify `customer/index.html` and `customer/styles.css`
2. **Commit & Push**: Changes automatically deploy via GitHub Actions
3. **Cache Purge**: Cloudflare cache automatically purged

#### Admin System Changes
1. **Local Development**: Work in `admin/src/` with `npm run dev`
2. **Docker Deployment**: Use `docker-compose up -d` for production
3. **Content Management**: Use web interface at `/admin` for data updates

#### Content Management (No Code Required)
1. **Admin Changes**: Made through web interface at `/admin`
2. **Data Updates**: JSON files updated in real-time
3. **Public Reflection**: Static pages immediately show changes
4. **Deploy Button**: "🚀 Finalize & Deploy Live" triggers automated deployment

### Environment Configuration
```bash
# Authentication
NEXTAUTH_URL=https://www.wretchedesigns.com
NEXTAUTH_SECRET=secure-random-string
GOOGLE_CLIENT_ID=57848607243-o5omf12h5emrc3e64lk5073vianism1f.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ADMIN_EMAILS=Topher@TopherTek.com

# Payment Processing (optional)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```