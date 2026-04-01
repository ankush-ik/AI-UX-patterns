# AI Design Patterns

> A comprehensive library of design patterns and interactions for AI-enabled user interfaces, with a production-ready CMS adapter system for flexible content management.

[![Next.js](https://img.shields.io/badge/next.js-16.2.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4)](https://tailwindcss.com/)

## 📋 Overview

This project catalogs **foundational design patterns and UI interactions** to help teams design better experiences for AI-enabled interfaces. It explores how users construct prompts, interpret AI results, and interact with AI-powered features.

Patterns are organized by category (Wayfinders, Prompt Actions, Settings, Results, etc.) and include:
- Visual examples and use cases
- Design considerations and best practices
- Related patterns for cross-cutting concerns
- Source references and inspiration links

## ✨ Features

- **56+ AI/UX Design Patterns** - Organized by category with detailed descriptions
- **Interactive Pattern Gallery** - Browse, search, and explore patterns with rich media
- **Content Admin Dashboard** - Audit pattern coverage, validate references, spot gaps
- **Production-Ready CMS Architecture** - Flexible adapter pattern for seamless provider switching
- **Static JSON APIs** - Export patterns for integration with external tools
- **Optimized Images** - Next.js Image optimization with remote host support
- **Type-Safe** - Full TypeScript support throughout
- **Zero Lint Errors** - Production-ready code quality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ankush-ik/AI-UX-patterns.git
cd AI-UX-patterns

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app supports hot reload as you edit files.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Linting

```bash
# Check code quality
npm run lint
```

### Shape Of Parity Audit

Use these commands to validate and remediate full-repo parity against source pages.

```bash
# Run parity audit only (writes scripts/audit_shapeof_parity.output.json)
npm run audit:parity

# Run deterministic remediation flow (audit -> fixes -> re-audit)
npm run fix:parity

# Allow additional remediation loops when needed
node scripts/remediate_shapeof_parity.mjs --max-passes=3
```

What remediation runs:
- Sync single-source Shape Of text for failing patterns.
- Merge dual-source Shape Of + AIUX sections.
- Normalize markdown content formatting.
- Fill missing inline source images and captions.
- Re-audit after each pass.

### Source Image Sync

Use the sync script to scrape pattern source pages and insert missing inline images into pattern descriptions.

```bash
# Preview planned updates without writing files
npm run sync:source-images:dry

# Download images to public/patterns/<pattern-id>/ and update patterns.json
npm run sync:source-images
```

Notes:
- The script only fills missing inline description images and does not remove existing images/examples.
- Sources are read from sources[] with sourceUrl as fallback.
- The script is idempotent and safe to rerun.

## 📚 Usage

### Viewing Patterns

1. **Home Page** - Browse all patterns organized by category
2. **Pattern Details** - Click any pattern to see:
   - Full description and design considerations
   - Visual examples and use cases
   - Related patterns
   - Source URLs for further reading
3. **Admin Dashboard** - Visit `/admin` to:
   - View content coverage metrics
   - Spot missing examples or source URLs
   - Validate pattern relationships
   - Export pattern data as JSON

### API Endpoints

The app exposes static JSON endpoints for programmatic access:

```bash
# Get all categories
GET /api/categories

# Get all patterns
GET /api/patterns

# Get patterns with category data
GET /api/patterns?include=category

# Get single pattern
GET /api/patterns/[id]

# Get pattern with related patterns
GET /api/patterns/[id]?include=category,related

# Get content health audit
GET /api/content-report

# Check CMS provider health
GET /api/health
```

## 🗂️ Where Things Live

```
src/
├── app/                         # Next.js App Router
│   ├── page.tsx                # Home page with pattern gallery
│   ├── patterns/[id]/page.tsx  # Pattern detail page
│   ├── admin/page.tsx          # Content admin dashboard
│   └── api/                    # JSON API endpoints
├── components/                 # Reusable React components
│   ├── PatternCard.tsx         # Pattern card display
│   ├── PatternDetailClient.tsx # Rich detail viewer
│   └── HomePageClient.tsx      # Client-side home interactions
├── lib/
│   ├── patterns.ts             # Type definitions
│   ├── patternRepository.ts    # Data access abstraction
│   ├── patternValidation.ts    # Content health checks
│   └── cms/                    # CMS adapter system
├── content/
│   └── patterns.json           # Pattern data (file-backed)
└── utils/                      # Helper functions
```

See [Project Structure](#project-structure) below for detailed breakdown.

## 🔌 Content Management

This project uses a **flexible CMS adapter pattern** for content management. This means you can switch between different content sources without changing any application code.

### Supported Providers

- **Local JSON** (default) ✓ Production-ready
  - Uses `src/content/patterns.json`
  - Perfect for static sites and development
  - No external dependencies
  - Fast, deterministic builds

- **Contentful** - Template only (not implemented in this repo)
  - Template provided in `src/lib/cms/contentfulAdapter.ts`
  - Full guide in [docs/CMS_ADAPTER.md](docs/CMS_ADAPTER.md#creating-a-new-adapter)
  - Connect via environment variables

- **Sanity** - Placeholder only (not implemented)
  - Currently throws a not-implemented error when selected
  - Use `local-json` unless you implement a Sanity adapter

### Setting a Provider

Configure which content provider to use via environment variables:

```bash
# Use default local JSON (no config needed)
npm run dev

# Use Contentful
export CMS_PROVIDER=contentful
export CONTENTFUL_SPACE_ID=your_space_id
export CONTENTFUL_ACCESS_TOKEN=your_read_token
npm run dev
```

Important:
- The repository currently ships with `local-json` as the only fully implemented provider.
- Contentful/Sanity entries are scaffolding paths and require adapter implementation before use.

That's it! No code changes needed. The app automatically uses the configured provider.

### How It Works

- `src/lib/cms/adapter.ts` - Defines the interface all providers must implement
- `src/lib/cms/manager.ts` - Selects provider based on environment
- `src/lib/patternRepository.ts` - Unified data access layer (same interface regardless of provider)
- `src/app/admin/page.tsx` - Shows which provider is currently active

For implementation details, see [docs/CMS_ADAPTER.md](docs/CMS_ADAPTER.md).

## 📡 Admin Dashboard

## 📡 Admin Dashboard

The admin dashboard at `/admin` provides insights into your content:

- **Coverage Metrics** - Total patterns, categories, examples
- **Content Gaps** - Patterns missing examples, source URLs, or related patterns
- **Reference Validation** - Spot broken links and orphaned patterns
- **Provider Info** - See which CMS is currently connected
- **Data Export** - Export patterns as JSON for integration or migration

### Admin Authentication

The admin dashboard and mutating pattern endpoints are protected with HTTP Basic Auth:

- `GET /admin`
- `POST /api/patterns/new`
- `PATCH /api/patterns/[id]/edit`
- `DELETE /api/patterns/[id]/edit`

Default local credentials (non-production only):

- Username: `demo`
- Password: `summertime`

You can override these using environment variables:

```bash
export ADMIN_USERNAME=demo
export ADMIN_PASSWORD=summertime
```

Quick check:

```bash
# Expect 401
curl -i http://localhost:3000/admin

# Expect 200
curl -i -u demo:summertime http://localhost:3000/admin
```

Production note:
- In production, `ADMIN_USERNAME` and `ADMIN_PASSWORD` are required.
- If either value is missing, protected routes return `503` instead of falling back to demo credentials.

## 🗂️ Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── page.tsx                # Home - gallery of all patterns
│   ├── patterns/[id]/page.tsx  # Detail page for single pattern
│   ├── admin/page.tsx          # Admin dashboard with health checks
│   │
│   └── api/                    # JSON API endpoints
│       ├── categories/         # GET /api/categories
│       ├── patterns/           # GET /api/patterns
│       ├── patterns/[id]/      # GET /api/patterns/[id]
│       ├── content-report/     # GET /api/content-report
│       └── health/             # GET /api/health
│
├── components/                 # React components
│   ├── PatternCard.tsx         # Pattern preview card
│   ├── PatternDetailClient.tsx # Rich detail view (client)
│   ├── HomePageClient.tsx      # Home page controller (client)
│   ├── SidebarNav.tsx          # Category sidebar
│   └── ...other components
│
├── lib/                        # Business logic & data layer
│   ├── patterns.ts             # TypeScript type definitions
│   ├── patternRepository.ts    # Unified data access (works with any CMS)
│   ├── patternValidation.ts    # Content health checking
│   ├── contentSource.ts        # JSON import helper
│   │
│   └── cms/                    # CMS adapter system
│       ├── adapter.ts          # ICMSAdapter interface
│       ├── manager.ts          # Provider selection
│       ├── localJsonAdapter.ts # ✓ JSON provider (complete)
│       └── contentfulAdapter.ts# Contentful template (to implement)
│
├── content/
│   └── patterns.json           # All pattern data
│
├── utils/
│   └── patternResolver.ts      # Helper functions
│
├── hooks/                      # React hooks
│   ├── useIconResolver.ts
│   ├── useScrollSpy.ts
│   └── ...
│
└── public/                     # Static assets
```

### Key Files

- **`src/lib/cms/`** - CMS adapter system (swap providers here)
- **`src/content/patterns.json`** - Your content lives here (edit to update patterns)
- **`src/app/admin/page.tsx`** - Admin dashboard (audit and manage content)
- **`docs/CMS_ADAPTER.md`** - Complete CMS implementation guide

## 🔌 API Reference

All endpoints return static content (prerendered at build time). Use for integrations, migrations, or external tools.

### GET /api/categories
Returns all pattern categories.

```json
{
  "categories": [
    { "id": "wayfinders", "name": "Wayfinders", "description": "...", "icon": "..." },
    ...
  ],
  "total": 5
}
```

### GET /api/patterns
Returns all patterns with optional filters.

```bash
GET /api/patterns                    # All patterns
GET /api/patterns?category=wayfinders # By category
GET /api/patterns?include=category   # With category data
GET /api/patterns?q=search-term      # Search patterns
```

### GET /api/patterns/[id]
Returns single pattern with optional relationships.

```bash
GET /api/patterns/pattern-id                          # Basic
GET /api/patterns/pattern-id?include=category,related # Full
```

### GET /api/content-report
Returns comprehensive content health audit.

```json
{
  "totalCategories": 5,
  "totalPatterns": 56,
  "patternsWithoutExamples": [...],
  "brokenRelatedPatterns": [...],
  "categoryHealth": [...],
  ...
}
```

### GET /api/health
CMS provider health check.

```json
{
  "status": "healthy",
  "provider": "LocalJsonAdapter",
  "environment": "production",
  "adminCredentialsConfigured": true,
  "adminMutationsEnabled": false,
  "warnings": [],
  "timestamp": "2026-03-26T..."
}
```

Health status semantics:
- `healthy`: CMS is healthy and no deployment warnings are active.
- `degraded`: CMS is healthy but deployment warnings exist (for example risky mutation settings).
- `unhealthy`: blocking issue detected (for example CMS failure or missing production admin credentials).

## 🎨 Customization

### Typography

This project can use **Noto IKEA Latin** font globally via a stylesheet. To enable:

```bash
# Set in .env.local
export NEXT_PUBLIC_SKAPA_FONT_STYLESHEET="http://<your-font-host>/noto-ikea-latin.css"
# or provide MCP base URL
export NEXT_PUBLIC_SKAPA_MCP_BASE_URL="http://<your-font-host>"
```

### Image Optimization

Remote image providers are configured in `next.config.ts`:

```javascript
images: {
  remotePatterns: [
    { hostname: 'cdn.prod.website-files.com' },
    { hostname: 'images.unsplash.com' },
  ]
}
```

Add more hosts as needed for your pattern images.

### Styling

The project uses **Tailwind CSS** for styling. Modify `tailwind.config.js` to customize colors, spacing, fonts, etc.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel UI or CLI
vercel deploy
```

Recommended Vercel environment variables:

```bash
ADMIN_USERNAME=<strong-username>
ADMIN_PASSWORD=<strong-password>
CMS_PROVIDER=local-json
ENABLE_ADMIN_MUTATIONS=false
```

How mutation safety works:
- `ENABLE_ADMIN_MUTATIONS=false` (or unset in production) keeps create/edit/delete routes disabled with `503` responses.
- Set `ENABLE_ADMIN_MUTATIONS=true` only when using a durable write backend and you intentionally want runtime edits.

Post-deploy smoke checks:

```bash
# Basic production checks (home + APIs + unauthorized admin)
npm run smoke:deploy -- --base-url=https://your-app.vercel.app

# Include authorized admin check
npm run smoke:deploy -- --base-url=https://your-app.vercel.app \
  --admin-user=$ADMIN_USERNAME --admin-pass=$ADMIN_PASSWORD

# Phase 1 strict mode: also verifies mutation endpoints are disabled (503)
npm run smoke:deploy -- --base-url=https://your-app.vercel.app \
  --admin-user=$ADMIN_USERNAME --admin-pass=$ADMIN_PASSWORD --phase1

# Local verification (localhost is normalized to 127.0.0.1 automatically)
npm run smoke:deploy -- --base-url=http://localhost:3000 --admin-user=demo --admin-pass=summertime
```

### Other Platforms

The app builds to static HTML + prerendered pages. Deploy the `.next` output directory to any CDN or static hosting.

```bash
npm run build
# Deploy `.next` folder to your host
```

## 📖 Learn More

### CMS & Architecture
- [CMS Adapter Pattern Guide](docs/CMS_ADAPTER.md) - Complete implementation guide

### Framework & Tools
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Whether it's new patterns, bug fixes, or improvements to the CMS adapter system.

### Adding a New Pattern

1. Add pattern definition to `src/content/patterns.json`
2. Run `/admin` dashboard to audit coverage
3. Test the detail page works correctly
4. Submit pull request

### Adding a CMS Provider

1. Create a new adapter in `src/lib/cms/`
2. Implement the `ICMSAdapter` interface
3. Register in `src/lib/cms/manager.ts`
4. Add environment variables to `.env.local.example`
5. See [docs/CMS_ADAPTER.md](docs/CMS_ADAPTER.md#creating-a-new-adapter) for details

### Development Guidelines

- Use TypeScript for type safety
- Run `npm run lint` before committing
- Ensure `npm run build` passes
- Follow existing code style

## 📝 License

This project is open source and available under the MIT License.

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/ankush-ik/AI-UX-patterns/issues)
- **Documentation**: See [docs/CMS_ADAPTER.md](docs/CMS_ADAPTER.md)
- **Admin Dashboard**: Visit `/admin` for content insights

---

**Built with ❤️ for designing better AI experiences.**
