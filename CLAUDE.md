# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Wretched Designs website - a hybrid Next.js/static HTML e-commerce site with a cyberpunk/techno-goth aesthetic featuring custom printed apparel and art sales. The project combines Next.js infrastructure with static HTML pages for content delivery.

**Important**: This is a hybrid architecture where the main pages (index, shop, gallery, about, contact, blogs) are static HTML files in the root directory, not Next.js pages. The Next.js setup provides the build system, component library, and potentially API routes.

## Development Commands

### Basic Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production (outputs to .next/)
npm start            # Start production server
```

### Testing
```bash
npm test             # Run vitest tests
npm run test:ui      # Run vitest with UI
```

### Code Quality & Linting
The project uses both Biome and ESLint for linting:
- **Biome**: Primary linter configured in `biome.json` for TypeScript/TSX files in `src/`
- **ESLint**: Secondary linter with Next.js configuration in `eslint.config.mjs`

Both tools have relaxed rules for rapid development (many a11y and strict rules disabled).

Note: ESLint is disabled during builds (`DISABLE_ESLINT_PLUGIN=true` in Netlify config).

### Media Management
Python scripts for managing project images:
```bash
python export_visible_image_urls.py  # Extract all image URLs from codebase
python copy_media_files.py           # Copy media files
python copy_and_download_media.py    # Download and organize media assets
```

### Deployment
- **Primary**: Cloudflare Pages (production admin dashboard)
- **Alternative**: Netlify (configured via `netlify.toml`)
- **Domain**: www.wretchedesigns.com (configured for OAuth)
- **Build command**: `SKIP_ENV_VALIDATION=true npm run build`

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
- **Static HTML files**: `index.html`, `shop.html`, `gallery.html`, `about.html`, `contact.html`, `blogs.html`
- **Next.js Admin App**: `/src/app/` with App Router structure
- **Admin Routes**: `/admin/*` (protected by authentication)
- **API Routes**: `/api/*` for gallery/product CRUD operations
- **JavaScript functionality**: `main.js` (image modal system for static pages)
- **Global styles**: `style.css` with embedded Tailwind classes

### Theme System
Custom cyberpunk color palette defined in `tailwind.config.ts`:
- Electric purple: `#9B00FF`
- Neon magenta: `#FF00CC`
- Neon blue: `#001F3F`
- Matte black: `#111111`
- Custom neon shadow effects and glitch animations

### Key Configuration Files
- `next.config.js`: Image domains for Unsplash, build error ignoring
- `middleware.ts`: Route handling
- `vitest.config.ts`: Test configuration with jsdom environment
- `components.json`: shadcn/ui configuration

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
1. **Admin Changes**: Made through web interface at `/admin`
2. **Data Updates**: JSON files updated in real-time
3. **Public Reflection**: Static pages immediately show changes
4. **No Code Changes**: Content management requires no developer intervention

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