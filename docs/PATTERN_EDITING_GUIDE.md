# Pattern Editing Guide

Reference this guide when adding or editing patterns in `src/content/patterns.json` to ensure data quality and consistency.

## Required Fields

Every pattern object must have these fields:

| Field | Type | Rules | Example |
|---|---|---|---|
| `id` | string | Lowercase, hyphens only (no spaces/underscores), unique | `"progressive-disclosure"` |
| `title` | string | Human-readable, 2-50 chars | `"Progressive Disclosure"` |
| `description` | string | Short summary, 10-200 chars | `"Reveal content progressively..."` |
| `categoryId` | string | Must match an existing category ID | `"governors"` |
| `thumbnail` | string | Image filename or URL | `"progressive-disclosure.jpg"` |
| `sourceUrl` | string | HTTP(S) link to source/inspiration (optional but recommended) | `"https://example.com/pattern"` |
| `content.description` | string | Long description, markdown OK | `"# Overview\n\nFull details..."` |
| `content.designConsiderations` | string | Design tips and tradeoffs | `"Consider user cognitive load..."` |
| `content.relatedPatterns` | array | IDs of related patterns (optional) | `["pattern-id-1", "pattern-id-2"]` |
| `content.examples` | array | Visual/code examples (optional) | `[{ "title": "Example 1", "image": "..." }]` |

## Pattern Structure Template

```json
{
  "id": "your-pattern-id",
  "title": "Your Pattern Title",
  "description": "Short one-liner description",
  "categoryId": "existing-category-id",
  "thumbnail": "filename.jpg",
  "sourceUrl": "https://link-to-source.com",
  "sources": [
    { "name": "Source Name", "url": "https://source.url" }
  ],
  "content": {
    "description": "# Full Description\n\nMarkdown formatted.",
    "designConsiderations": "Key design decisions and tradeoffs.",
    "userArchetype": "Target user type (optional)",
    "relatedPatterns": ["other-pattern-id"],
    "examples": [
      {
        "title": "Example Title",
        "description": "What this example shows",
        "image": "example.jpg"
      }
    ]
  }
}
```

## Validation Checklist

Use this before committing pattern edits:

### ID & Naming
- [ ] Pattern `id` is lowercase with hyphens only (no spaces, underscores, or mixed case)
- [ ] `id` is globally unique in the patterns.json file
- [ ] `title` matches the human-readable name of the pattern

### Required Content
- [ ] All required fields are present and non-empty (except optional fields marked above)
- [ ] `categoryId` matches an existing category from the categories array
- [ ] `description` is 10-200 characters
- [ ] `content.description` exists and is 50+ characters (narrative depth)
- [ ] `content.designConsiderations` exists and is 30+ characters

### Related Patterns
- [ ] Each ID in `content.relatedPatterns` points to an existing pattern
- [ ] Related patterns are bidirectional (if A references B, B should reference A)
- [ ] No self-references (pattern doesn't reference itself)

### URLs & Images
- [ ] `sourceUrl` is a valid HTTP(S) link (if provided)
- [ ] `thumbnail` file exists in `public/patterns/<pattern-id>/`
- [ ] Image filenames in examples are relative or full HTTP(S) URLs

### Examples
- [ ] Each example object has `title` and at least one of: `description` or `image`
- [ ] Example images are 400x300 or similar (mobile-friendly aspect ratios)

### Format & Style
- [ ] No trailing commas in JSON
- [ ] Markdown in `content.description` is valid (test locally)
- [ ] No hardcoded HTML; use markdown formatting instead
- [ ] Text doesn't exceed 2000 chars per field (for readability)

## Editing Workflow

1. **Create a branch**
   ```bash
   git checkout -b content/update-patterns-$(date +%Y%m%d)
   ```

2. **Edit `src/content/patterns.json`**
   - Add or modify pattern objects
   - Use the template above as a starting point

3. **Run local validation**
   ```bash
   npm run lint
   npm run build
   ```

4. **Audit content quality** (optional)
   ```bash
   npm run audit:parity
   ```

5. **Test locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000 and verify:
   # - Home page loads
   # - New/edited pattern appears
   # - Admin dashboard shows coverage
   # - /api/content-report reflects changes
   ```

6. **Commit and push**
   ```bash
   git add src/content/patterns.json
   git commit -m "content: add/update pattern(s): pattern-id-1, pattern-id-2"
   git push origin content/update-patterns-YYYYMMDD
   ```

7. **Create a PR** to `main`, review, merge

8. **Verify production** after Vercel deploy
   ```bash
   npm run smoke:deploy -- --base-url=https://ai-ux-patterns-one.vercel.app \
     --admin-user=demo --admin-pass=summertime --phase1
   ```

## Common Issues & Fixes

| Issue | Fix |
|---|---|
| Build fails: "Unknown categoryId" | Verify `categoryId` matches a category in the categories array |
| Broken related pattern link | Check that the referenced pattern `id` exists and is spelled correctly |
| Admin dashboard shows "Broken related references" | Use the checklist above to fix bidirectional references |
| Pattern doesn't appear on home page | Check `id` and `categoryId` are valid; rebuild locally |
| Markdown not rendering in descriptions | Ensure you're using markdown syntax (not HTML); test in /admin |

## Valid Category IDs

Reference these when setting `categoryId`:

- `wayfinders`
- `input-modalities`
- `prompt-actions`
- `settings`
- `results`
- `editing`
- `governors`
- `trust-builders`
- `identifiers`

## Questions?

1. Check `/admin` dashboard for content audit warnings
2. Run `npm run audit:parity` to spot inconsistencies
3. Review existing patterns in `src/content/patterns.json` as examples
