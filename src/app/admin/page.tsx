import Link from "next/link";
import { getContentReport } from "@/lib/patternValidation";
import { getCurrentProvider } from "@/lib/cms/manager";
import { getCategories, getPatterns } from "@/lib/patternRepository";
import { AdminPatternList } from "@/components/AdminPatternList";

function StatCard({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "warn" | "danger" }) {
  const toneClasses = {
    default: "border-sk-border bg-white text-sk-primary",
    warn: "border-[#e5a500] bg-[#fffaf0] text-sk-text",
    danger: "border-[var(--sk-color-danger)] bg-white text-[var(--sk-color-danger)]",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses[tone]}`}>
      <p className="text-skapa-overline text-sk-text-muted">{label}</p>
      <p className="mt-3 text-skapa-h2 font-semibold">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const [report, categories, patterns, cmsProvider] = await Promise.all([
    getContentReport(),
    getCategories(),
    getPatterns(),
    Promise.resolve(getCurrentProvider()),
  ]);

  return (
    <main className="min-h-screen bg-white text-sk-text">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sk-border pb-6">
          <div>
            <p className="text-skapa-overline text-sk-text-muted">Connected to: {cmsProvider}</p>
            <h1 className="mt-2 text-skapa-h1">Content Admin</h1>
            <p className="mt-3 max-w-3xl text-skapa-body-md text-sk-text-muted">
              Audit pattern coverage, validate references, and manage content enrichment for the pattern library.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sk-color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border border-[var(--sk-color-border-strong)] bg-white text-[var(--sk-color-primary)] hover:border-[var(--sk-color-primary)] min-h-10 px-3.5 text-skapa-body-sm rounded-lg">
              View site
            </Link>
            <Link href="/api/patterns?include=category" className="inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sk-color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--sk-color-primary)] text-[var(--sk-color-on-primary)] hover:bg-[var(--sk-color-primary-strong)] min-h-10 px-3.5 text-skapa-body-sm rounded-lg">
              Export patterns
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Categories" value={report.totalCategories} />
          <StatCard label="Patterns" value={report.totalPatterns} />
          <StatCard label="Missing examples" value={report.patternsWithoutExamples.length} tone={report.patternsWithoutExamples.length ? "warn" : "default"} />
          <StatCard label="Missing sources" value={report.patternsWithoutSourceUrl.length} tone={report.patternsWithoutSourceUrl.length ? "warn" : "default"} />
          <StatCard label="Broken related refs" value={report.brokenRelatedPatterns.length} tone={report.brokenRelatedPatterns.length ? "danger" : "default"} />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-3xl border border-sk-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-skapa-h2 text-sk-primary">Category health</h2>
                <p className="mt-1 text-skapa-body-sm text-sk-text-muted">Coverage by category, including examples and source links.</p>
              </div>
              <Link href="/api/categories" className="text-skapa-body-sm text-sk-text-muted underline-offset-4 hover:text-sk-primary hover:underline">
                /api/categories
              </Link>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-sk-border">
              <table className="min-w-full divide-y divide-sk-border text-skapa-body-sm">
                <thead className="bg-sk-surface-muted text-left text-sk-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Patterns</th>
                    <th className="px-4 py-3 font-medium">With examples</th>
                    <th className="px-4 py-3 font-medium">With sources</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sk-border bg-white">
                  {report.categoryHealth.map((entry) => (
                    <tr key={entry.category.id}>
                      <td className="px-4 py-3">
                        <Link href={`/#category-${entry.category.id}`} className="font-medium text-sk-primary hover:text-sk-primary-strong">
                          {entry.category.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{entry.patternCount}</td>
                      <td className="px-4 py-3">{entry.withExamplesCount}</td>
                      <td className="px-4 py-3">{entry.withSourceCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-sk-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-skapa-h2 text-sk-primary">Reference health</h2>
                  <p className="mt-1 text-skapa-body-sm text-sk-text-muted">Broken links, duplicate IDs, and orphan patterns.</p>
                </div>
                <Link href="/api/content-report" className="text-skapa-body-sm text-sk-text-muted underline-offset-4 hover:text-sk-primary hover:underline">
                  /api/content-report
                </Link>
              </div>
              <div className="mt-6 space-y-5 text-skapa-body-sm text-sk-text">
                <div>
                  <p className="font-medium text-sk-primary">Duplicate pattern IDs</p>
                  <p className="mt-1 text-sk-text-muted">
                    {report.duplicatePatternIds.length === 0 ? "None detected." : report.duplicatePatternIds.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sk-primary">Broken related references</p>
                  {report.brokenRelatedPatterns.length === 0 ? (
                    <p className="mt-1 text-sk-text-muted">None detected.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {report.brokenRelatedPatterns.map((issue) => (
                        <li key={`${issue.patternId}-${issue.missingRelatedPatternId}`}>
                          <Link href={`/patterns/${issue.patternId}`} className="font-medium text-sk-primary hover:text-sk-primary-strong">
                            {issue.patternId}
                          </Link>{" "}
                          references missing pattern <span className="font-mono text-skapa-caption">{issue.missingRelatedPatternId}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sk-primary">Orphan patterns</p>
                  <p className="mt-1 text-sk-text-muted">Patterns that no other pattern links to.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.orphanPatterns.slice(0, 12).map((pattern) => (
                      <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="rounded-full bg-sk-surface-muted px-3 py-1 text-skapa-caption text-sk-text hover:bg-sk-border">
                        {pattern.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-sk-border bg-white p-6 shadow-sm">
              <h2 className="text-skapa-h2 text-sk-primary">Most referenced patterns</h2>
              <ol className="mt-5 space-y-3 text-skapa-body-sm text-sk-text">
                {report.mostReferencedPatterns.map((entry) => (
                  <li key={entry.pattern.id} className="flex items-center justify-between gap-4 rounded-2xl bg-sk-surface-muted px-4 py-3">
                    <Link href={`/patterns/${entry.pattern.id}`} className="font-medium text-sk-primary hover:text-sk-primary-strong">
                      {entry.pattern.title}
                    </Link>
                    <span className="rounded-full bg-white px-3 py-1 text-skapa-overline text-sk-text-muted">
                      {entry.count} refs
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-sk-border bg-white p-6 shadow-sm">
            <h2 className="text-skapa-h2 text-sk-primary">Patterns missing examples</h2>
            <p className="mt-1 text-skapa-body-sm text-sk-text-muted">Candidates for enrichment before a future CMS workflow.</p>
            <div className="mt-5 space-y-3">
              {report.patternsWithoutExamples.slice(0, 12).map((pattern) => (
                <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-sk-border px-4 py-3 text-skapa-body-sm hover:border-sk-primary">
                  <span className="font-medium text-sk-text">{pattern.title}</span>
                  <span className="text-skapa-overline text-sk-text-muted">{pattern.categoryId}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-sk-border bg-white p-6 shadow-sm">
            <h2 className="text-skapa-h2 text-sk-primary">Patterns missing sources</h2>
            <p className="mt-1 text-skapa-body-sm text-sk-text-muted">Good targets for editorial completion or CMS metadata.</p>
            <div className="mt-5 space-y-3">
              {report.patternsWithoutSourceUrl.slice(0, 12).map((pattern) => (
                <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-sk-border px-4 py-3 text-skapa-body-sm hover:border-sk-primary">
                  <span className="font-medium text-sk-text">{pattern.title}</span>
                  <span className="text-skapa-overline text-sk-text-muted">{pattern.categoryId}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <AdminPatternList patterns={patterns} categories={categories} />
        </section>

      </div>
    </main>
  );
}
