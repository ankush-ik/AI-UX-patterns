This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Typography Source

This project is configured to use **Noto IKEA Latin** globally via a stylesheet served by your Skapa MCP server.

Set either the full stylesheet URL, or just the MCP base URL:

```bash
export NEXT_PUBLIC_SKAPA_FONT_STYLESHEET="http://<your-skapa-mcp-host>/fonts/noto-ikea-latin.css"
# or
export NEXT_PUBLIC_SKAPA_MCP_BASE_URL="http://<your-skapa-mcp-host>"
```

If `NEXT_PUBLIC_SKAPA_FONT_STYLESHEET` is not set, the app will automatically use:

`$NEXT_PUBLIC_SKAPA_MCP_BASE_URL/fonts/noto-ikea-latin.css`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Content Admin & CMS Architecture

Phase 3 adds a local content-management surface at `/admin` with a production-ready CMS adapter pattern.

### Admin Dashboard

Use it to:

- Audit pattern coverage by category
- Spot patterns missing examples or source URLs
- Validate related-pattern references
- See which CMS provider is currently connected
- Export the current dataset as JSON

### CMS Adapter Pattern

The app uses a flexible **CMS adapter pattern** to abstract content sources. This enables seamless switching between providers without changing application code.

#### Supported Providers

- **Local JSON** (default) ✓ Fully implemented
  - Uses `src/content/patterns.json`
  - Perfect for static sites and development
  - No external dependencies

- **Contentful** (template provided)
  - Template in `src/lib/cms/contentfulAdapter.ts`
  - Follow the implementation guide to activate

- **Sanity** (coming soon)
  - Template placeholder for future implementation

#### Switching Providers

To use Contentful instead of local JSON:

```bash
# Set environment variables in .env.local
export CMS_PROVIDER=contentful
export CONTENTFUL_SPACE_ID=your_space_id
export CONTENTFUL_ACCESS_TOKEN=your_api_token
```

That's it! The app automatically uses the configured provider. No code changes needed.

#### Architecture

See [docs/CMS_ADAPTER.md](docs/CMS_ADAPTER.md) for:

- Complete architecture explanation
- How to implement a new adapter
- Migration guide for adding new CMS providers
- Performance considerations
- Debugging and health checks

### API Endpoints

The app exposes static JSON endpoints:

- `/api/categories` - All categories
- `/api/patterns` - All patterns (with optional category inclusion)
- `/api/patterns?include=category` - Patterns with enriched category data
- `/api/patterns/[id]` - Single pattern details
- `/api/patterns/[id]?include=category,related` - Pattern with related patterns
- `/api/content-report` - Content health audit report
- `/api/health` - CMS provider health check

## Project Structure

### Core Application

```
src/
├── app/
│   ├── page.tsx                 # Home page (SSR with async content)
│   ├── patterns/[id]/page.tsx  # Pattern detail page (SSR)
│   ├── admin/page.tsx           # Content admin dashboard
│   ├── api/
│   │   ├── categories/          # Category list endpoint
│   │   ├── patterns/            # Patterns endpoint (supports filtering)
│   │   ├── patterns/[id]/       # Single pattern endpoint
│   │   ├── content-report/      # Health audit report
│   │   └── health/              # CMS provider health check
│   └── globals.css
├── components/
│   ├── PatternCard.tsx          # Pattern card with image optimization
│   ├── PatternDetailClient.tsx  # Client-side detail viewer
│   ├── HomePageClient.tsx       # Client-side home page
│   └── ...other components
├── lib/
│   ├── patterns.ts              # Type definitions (Category, Pattern)
│   ├── patternRepository.ts     # Unified data access layer
│   ├── patternValidation.ts     # Content health checks
│   ├── contentSource.ts         # JSON content import helper
│   └── cms/                     # CMS adapter system
│       ├── adapter.ts           # Interface & types
│       ├── manager.ts           # Provider selection & singleton
│       ├── localJsonAdapter.ts  # ✓ JSON implementation
│       └── contentfulAdapter.ts # Template (not yet implemented)
├── content/
│   └── patterns.json            # File-backed content source
└── utils/
    └── patternResolver.ts       # Helper functions for pattern access
```

### Documentation

```
docs/
└── CMS_ADAPTER.md       # Complete CMS adapter pattern guide
```

### Configuration

```
.env.local.example      # Environment variable template
next.config.ts          # Next.js config with image optimization
next.config.js          # CommonJS config variant
```

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
