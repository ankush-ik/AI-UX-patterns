import Link from "next/link";
import { getContentReport } from "@/lib/patternValidation";
import { getCurrentProvider } from "@/lib/cms/manager";
import { getCategories, getPatterns } from "@/lib/patternRepository";
import { AdminPatternList } from "@/components/AdminPatternList";

function StatCard({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "warn" | "danger" }) {
  const toneClasses = {
    default: "border-gray-200 bg-white text-gray-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses[tone]}`}>
      <p className="text-sm uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#ffffff_22%,#ffffff_100%)] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Phase 3 Admin • Connected to: {cmsProvider}</p>
            <h1 className="mt-2 text-4xl font-semibold">Content Dashboard</h1>
            <p className="mt-3 max-w-3xl text-gray-600">
              A local admin surface for auditing pattern coverage, validating references, and exposing file-backed JSON endpoints for a future CMS migration.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link href="/" className="rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 hover:text-gray-900">
              View site
            </Link>
            <Link href="/api/patterns?include=category" className="rounded-full bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
              Export patterns JSON
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Categories" value={report.totalCategories} />
          <StatCard label="Patterns" value={report.totalPatterns} />
          <StatCard label="Missing examples" value={report.patternsWithoutExamples.length} tone={report.patternsWithoutExamples.length ? "warn" : "default"} />
          <StatCard label="Missing source URLs" value={report.patternsWithoutSourceUrl.length} tone={report.patternsWithoutSourceUrl.length ? "warn" : "default"} />
          <StatCard label="Broken related refs" value={report.brokenRelatedPatterns.length} tone={report.brokenRelatedPatterns.length ? "danger" : "default"} />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Category health</h2>
                <p className="mt-1 text-sm text-gray-500">Coverage by category, including examples and source links.</p>
              </div>
                <Link href="/api/categories" className="text-sm text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline">
                /api/categories
                </Link>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Patterns</th>
                    <th className="px-4 py-3 font-medium">With examples</th>
                    <th className="px-4 py-3 font-medium">With sources</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {report.categoryHealth.map((entry) => (
                    <tr key={entry.category.id}>
                      <td className="px-4 py-3">
                        <Link href={`/#category-${entry.category.id}`} className="font-medium hover:text-blue-600">
                          {entry.category.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{entry.patternCount}</td>
                      <td className="px-4 py-3">{entry.withExamplesCount}</td>
                      <td className="px-4 py-3">{entry.withSourceUrlCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Reference health</h2>
                  <p className="mt-1 text-sm text-gray-500">Broken links, duplicate IDs, and orphan patterns.</p>
                </div>
                <Link href="/api/content-report" className="text-sm text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline">
                  /api/content-report
                </Link>
              </div>
              <div className="mt-6 space-y-5 text-sm text-gray-700">
                <div>
                  <p className="font-medium">Duplicate pattern IDs</p>
                  <p className="mt-1 text-gray-500">
                    {report.duplicatePatternIds.length === 0 ? "None detected." : report.duplicatePatternIds.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Broken related references</p>
                  {report.brokenRelatedPatterns.length === 0 ? (
                    <p className="mt-1 text-gray-500">None detected.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {report.brokenRelatedPatterns.map((issue) => (
                        <li key={`${issue.patternId}-${issue.missingRelatedPatternId}`}>
                          <Link href={`/patterns/${issue.patternId}`} className="font-medium hover:text-blue-600">
                            {issue.patternId}
                          </Link>{" "}
                          references missing pattern <span className="font-mono text-xs">{issue.missingRelatedPatternId}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <p className="font-medium">Orphan patterns</p>
                  <p className="mt-1 text-gray-500">Patterns that no other pattern links to.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.orphanPatterns.slice(0, 12).map((pattern) => (
                      <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200">
                        {pattern.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Most referenced patterns</h2>
              <ol className="mt-5 space-y-3 text-sm text-gray-700">
                {report.mostReferencedPatterns.map((entry) => (
                  <li key={entry.pattern.id} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                    <Link href={`/patterns/${entry.pattern.id}`} className="font-medium hover:text-blue-600">
                      {entry.pattern.title}
                    </Link>
                    <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-gray-500">
                      {entry.count} refs
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Patterns missing examples</h2>
            <p className="mt-1 text-sm text-gray-500">Candidates for enrichment before a future CMS workflow.</p>
            <div className="mt-5 space-y-3">
              {report.patternsWithoutExamples.slice(0, 12).map((pattern) => (
                <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 px-4 py-3 hover:border-gray-900">
                  <span className="font-medium">{pattern.title}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-gray-400">{pattern.categoryId}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Patterns missing source URLs</h2>
            <p className="mt-1 text-sm text-gray-500">Good targets for editorial completion or CMS metadata.</p>
            <div className="mt-5 space-y-3">
              {report.patternsWithoutSourceUrl.slice(0, 12).map((pattern) => (
                <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 px-4 py-3 hover:border-gray-900">
                  <span className="font-medium">{pattern.title}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-gray-400">{pattern.categoryId}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AdminPatternList patterns={patterns} categories={categories} />

      </div>
    </main>
  );
}
