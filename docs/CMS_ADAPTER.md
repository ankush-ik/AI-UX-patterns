# CMS Adapter Pattern

This document explains the CMS adapter pattern used in this application and how to extend it with new providers.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│    (pages, components, API routes)                              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Repository Layer                              │
│   (patternRepository.ts) - Data access abstraction              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CMS Manager                                 │
│   (cms/manager.ts) - Adapter selection & singleton              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
       ╔═════════════════╗ ╔═════════════╗ ╔════════════╗
       ║ LocalJsonAdapter ║ │ Contentful  │ │   Sanity   │
       ║ (Local JSON)    ║ │  Adapter    │ │  Adapter   │
       ║ ✓implemented    ║ │  (Template) │ │  (Future)  │
       ╚═════════════════╝ ╚═════════════╝ ╚════════════╝
              │                │                  │
              ▼                ▼                  ▼
        src/content/    Contentful CDN       Sanity CDN
        patterns.json   with API
```

## How It Works

### 1. Adapter Interface (`src/lib/cms/adapter.ts`)

All CMS sources implement the `ICMSAdapter` interface:

```typescript
interface ICMSAdapter {
  getCategories(): Promise<Category[]>;
  getCategoryById(categoryId: string): Promise<Category | undefined>;
  getPatterns(): Promise<Pattern[]>;
  getPatternById(patternId: string): Promise<Pattern | undefined>;
  getPatternsByCategory(categoryId: string): Promise<Pattern[]>;
  getPatternWithCategory(patternId: string): Promise<{ pattern: Pattern; category: Category } | undefined>;
  getName(): string;
  isHealthy(): Promise<boolean>;
}
```

### 2. CMS Manager (`src/lib/cms/manager.ts`)

Selects the appropriate adapter based on the `CMS_PROVIDER` environment variable:

```typescript
const provider = process.env.CMS_PROVIDER || "local-json";
// Returns: LocalJsonAdapter | ContentfulAdapter | SanityAdapter | etc.
```

### 3. Repository Layer (`src/lib/patternRepository.ts`)

Uses the selected adapter through the CMS Manager. App code doesn't know which provider is active:

```typescript
import { getCMSAdapter } from "@/lib/cms/manager";

const adapter = getCMSAdapter();
const categories = await adapter.getCategories(); // Works with any provider
```

## Built-in Adapters

### LocalJsonAdapter (Default) ✓

- **Status**: Fully implemented
- **Provider ID**: `local-json` (default)
- **Source**: `src/content/patterns.json`
- **Best for**: Local development, static sites, fast builds
- **Configuration**: No env vars needed

**Usage**:
```bash
# Default - no config needed
npm run dev

# Or explicitly set:
export CMS_PROVIDER=local-json
npm run dev
```

### ContentfulAdapter (Template)

- **Status**: Template provided, not yet implemented
- **Provider ID**: `contentful`
- **Installation**: `npm install contentful`
- **Configuration**:

```bash
# .env.local
CMS_PROVIDER=contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

**To Implement**:
1. Install the Contentful SDK: `npm install contentful`
2. Map Contentful content types to `Category` and `Pattern` interfaces
3. Complete the methods in `src/lib/cms/contentfulAdapter.ts`
4. Implement the health check method

### SanityAdapter (Future)

- **Status**: Not yet implemented
- **Provider ID**: `sanity`
- **When ready**: Create `src/lib/cms/sanityAdapter.ts`

## Creating a New Adapter

To add support for a new CMS provider:

### 1. Create the adapter file

```typescript
// src/lib/cms/myProviderAdapter.ts
import type { ICMSAdapter } from "@/lib/cms/adapter";
import type { Category, Pattern } from "@/lib/patterns";

export class MyProviderAdapter implements ICMSAdapter {
  // Implement all interface methods
  async getCategories(): Promise<Category[]> {
    // Fetch from your provider
  }

  // ... other methods ...

  getName(): string {
    return "MyProviderAdapter";
  }

  async isHealthy(): Promise<boolean> {
    // Verify connection to provider
  }
}
```

### 2. Register in the manager

```typescript
// src/lib/cms/manager.ts
import { MyProviderAdapter } from "@/lib/cms/myProviderAdapter";

function createAdapter(): ICMSAdapter {
  const provider = process.env.CMS_PROVIDER || "local-json";

  switch (provider.toLowerCase()) {
    // ... existing cases ...
    case "myprovider":
      return new MyProviderAdapter();
    default:
      throw new Error(`Unknown CMS provider: ${provider}`);
  }
}
```

### 3. Document environment variables

Add documentation for required environment variables and configuration.

### 4. Test with the admin dashboard

Visit `/admin` to verify the adapter is working:

```
GET /admin
- Shows "Connected to: MyProviderAdapter"
- Displays health metrics
- Lists all patterns and categories
```

## Type Safety

The adapter pattern maintains full TypeScript type safety:

- All adapters implement `ICMSAdapter` interface
- Runtime type checking ensures adapter is loaded
- Content types are consistent across all providers
- IDE autocomplete works with any provider

## Performance Considerations

### LocalJsonAdapter

- **Build time**: ✓ Fast (static JSON import)
- **Runtime**: ✓ Cached in module (instant lookups)
- **Best for**: Static sites, predictable deployments

### Dynamic Adapters (Contentful, Sanity)

- **Build time**: May vary (depends on API)
- **Runtime**: Cache on first load, consider cache invalidation
- **Ideal for**: Content teams, dynamic updates

**Recommended cache strategy for dynamic adapters**:

```typescript
// Add to adapter.ts
interface ICMSAdapter {
  // ... existing methods ...
  getCacheMaxAge?(): number; // seconds
  onCacheExpire?(): Promise<void>; // Called when cache expires
}
```

## Debugging

### Check which adapter is active

```typescript
import { getCurrentProvider } from "@/lib/cms/manager";

console.log(getCurrentProvider()); // "LocalJsonAdapter" or "ContentfulAdapter" etc.
```

### Health check endpoint

```bash
curl http://localhost:3000/api/health
# Response: { "provider": "LocalJsonAdapter", "healthy": true }
```

### Admin Dashboard

Visit `http://localhost:3000/admin` to:
- See connected provider
- View content health metrics
- Check for missing references
- Find orphaned patterns

## Migration Path

To migrate from one provider to another:

1. **Implement** the new adapter following the template
2. **Test locally**: `CMS_PROVIDER=newprovider npm run dev`
3. **Run admin health check**: Verify no data loss
4. **Deploy to staging**: Set env var on staging environment
5. **Verify** all pages load correctly
6. **Deploy to production**: Update env var in production environment

Example: Migrate from Local JSON to Contentful

```bash
# Stage 1: Dev testing
export CMS_PROVIDER=contentful
export CONTENTFUL_SPACE_ID=xxx
export CONTENTFUL_ACCESS_TOKEN=yyy
npm run dev

# Stage 2: Staging deployment
# (set env vars in staging environment)
npm run build

# Stage 3: Production
# (set env vars in production environment)
```

## Benefits

✓ **Flexibility**: Switch between providers without code changes  
✓ **Testability**: Easy to create mock adapters for testing  
✓ **Maintainability**: Changes to one provider don't affect others  
✓ **Scalability**: Add new providers as business needs change  
✓ **Type Safety**: Full TypeScript support across all providers  
✓ **Performance**: Cached access regardless of provider  
