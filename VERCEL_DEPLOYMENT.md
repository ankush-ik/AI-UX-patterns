# Vercel Deployment Guide

## Phase 1: Production Launch (Read-Only Content Model)

This guide walks through deploying the AI UX Patterns app to Vercel as a read-only production site. Phase 1 prioritizes stability and quick launch over durable editing capabilities.

### Prerequisites

- GitHub account with access to `ankush-ik/AI-UX-patterns` repository
- Vercel account (create at https://vercel.com if needed)
- Repository is already connected to GitHub at `https://github.com/ankush-ik/AI-UX-patterns.git`

### Step 1: Connect Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for and select `ankush-ik/AI-UX-patterns`
5. Click **"Import"**

### Step 2: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm ci` (default)

**Root Directory:** `.` (current directory)

### Step 3: Set Environment Variables

In Vercel Project Settings → **Environment Variables**, add:

| Variable | Value | Environment | Purpose |
|----------|-------|-------------|---------|
| `ADMIN_USERNAME` | *(strong, unique value)* | Production | Admin portal username |
| `ADMIN_PASSWORD` | *(strong, unique value)* | Production | Admin portal password |
| `CMS_PROVIDER` | `local-json` | Production | Read-only local JSON content source |
| `NODE_ENV` | `production` | Production | Enables strict auth fallback |

**Security Notes:**
- Use a strong password generator for `ADMIN_PASSWORD` (minimum 16 characters, mixed case, numbers, symbols)
- Store credentials securely (LastPass, 1Password, Vercel secrets dashboard)
- Do NOT commit credentials to git or use weak values like "demo/summertime"

### Step 4: Deploy

1. Review deployment settings summary
2. Click **"Deploy"**
3. Wait for build to complete (typically 2–5 minutes)
4. Once deployment completes, copy the Production URL (format: `https://your-project.vercel.app`)

### Step 5: Smoke Tests (Verify Deployment Health)

Use the Production URL from Step 4. Replace `https://your-project.vercel.app` with your actual URL.

#### 5a. Core Route Tests

```bash
# Homepage / pattern gallery
curl -s https://your-project.vercel.app/ -I

# Pattern detail page (example ID: "initial-cta")
curl -s https://your-project.vercel.app/patterns/initial-cta -I
```

Expected: HTTP 200

#### 5b. Read APIs

```bash
# Categories API
curl https://your-project.vercel.app/api/categories

# Patterns API
curl https://your-project.vercel.app/api/patterns

# Content report API
curl https://your-project.vercel.app/api/content-report

# Health check API
curl https://your-project.vercel.app/api/health
```

Expected: HTTP 200 with JSON payloads

#### 5c. Admin Authentication

```bash
# Without credentials (should fail)
curl -s https://your-project.vercel.app/admin -I

# With credentials (should succeed)
curl -s https://your-project.vercel.app/admin \
  -H "Authorization: Basic $(echo -n 'ADMIN_USERNAME:ADMIN_PASSWORD' | base64)" -I
```

Expected without creds: HTTP 401
Expected with creds: HTTP 200

#### 5d. Mutation Protection (Phase 1)

```bash
# Create pattern endpoint should be protected
curl -s -X POST https://your-project.vercel.app/api/patterns/new -I

# Edit pattern endpoint should be protected
curl -s -X PATCH https://your-project.vercel.app/api/patterns/initial-cta/edit -I
```

Expected: HTTP 401 (Unauthorized)

### Step 6: Post-Deployment Checks

- [ ] Production URL is accessible and loads homepage
- [ ] Pattern detail pages render correctly
- [ ] All read APIs return valid JSON
- [ ] Admin portal is protected (401 without credentials, 200 with credentials)
- [ ] Mutation endpoints reject requests (expected Phase 1 behavior)
- [ ] No errors in Vercel deployment logs (check under Deployments → Latest → Logs)
- [ ] Custom domain (if applicable) is DNS-configured and operational

### Monitoring & Operations

**Uptime Monitoring (Recommended):**

Set up a health check in Vercel monitoring or external service:
- Endpoint: `GET /api/health`
- Interval: 5 minutes
- Alert on failure

**Deployment Protection:**

Enable Vercel deployment protection:
1. Project Settings → **"Deployment Protection"**
2. Select **"Vercel Authentication"** or **"Password Protected"**
3. Add team members or set passphrase

**Rollback Procedure:**

If deployment fails:
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click **"Redeploy"** to restore previous version

### Phase 2: Durable Editing (Optional, Future)

When ready to enable editable content on production:

1. Implement Contentful adapter (see [CMS_ADAPTER.md](docs/CMS_ADAPTER.md))
2. Add Contentful API credentials to Vercel env vars
3. Set `CMS_PROVIDER=contentful`
4. Test mutation flows in staging before production rollout

---

## Troubleshooting

### Build Fails: "Module not found: 'next'"

**Cause:** Dependencies not installed properly

**Fix:**
- Ensure `package.json` and `package-lock.json` are committed to git
- Check Vercel build logs for error details
- Manually rebuild: Delete build cache in Vercel Settings → "Git" → "Clear all"

### Admin Portal Returns 403 Even with Credentials

**Cause:** Credentials don't match, or middleware wasn't deployed with env vars

**Fix:**
- Double-check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Vercel env vars (no extra spaces)
- Redeploy: Vercel Dashboard → click **"Redeploy"** button
- Verify auth header is properly base64-encoded in curl

### Production Feels Slow

**Cause:** Cold start on serverless functions, or content JSON is large

**Fix:**
- Vercel caches automatically after first request; second visit should be faster
- Monitor function duration in Vercel Analytics
- If patterns.json grows large, consider CDN caching or pagination (Phase 2)

### Pattern Not Showing in Production

**Cause:** Content wasn't committed to git before deployment

**Fix:**
- Verify pattern exists in `/src/content/patterns.json`
- Commit and push to git: `git add . && git commit -m "Add pattern" && git push`
- Redeploy from Vercel dashboard
- Allow 2–5 minutes for build and deployment

---

## Summary

✅ **Phase 1 Complete When:**
- Production URL is fully operational
- All smoke tests pass
- Admin credentials are strong and stored securely
- Mutation endpoints are protected (not used operationally)
- Monitoring and rollback procedures are in place

**Next Steps:**
- Monitor uptime and user engagement
- Collect feedback on production performance
- Plan Phase 2 if editable content becomes required
