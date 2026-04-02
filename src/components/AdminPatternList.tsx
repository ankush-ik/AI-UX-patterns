'use client';

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Pattern, Category } from "@/lib/patterns";
import { PatternEditor } from "@/components/PatternEditor";
import { SkapaButton } from "@/components/SkapaButton";
import { SkapaIcon } from "@/components/SkapaIcon";

interface AdminPatternListProps {
  patterns: Pattern[];
  categories: Category[];
}

export function AdminPatternList({ patterns: initialPatterns, categories }: AdminPatternListProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editingPattern, setEditingPattern] = useState<Pattern | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredPatterns = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return initialPatterns;
    return initialPatterns.filter((p) =>
      [p.title, p.description, p.categoryId].join(" ").toLowerCase().includes(q)
    );
  }, [initialPatterns, filter]);

  function refresh() {
    startTransition(() => router.refresh());
  }

  function handleSave() {
    setEditingPattern(null);
    setCreatingNew(false);
    refresh();
  }

  function handleDelete() {
    setEditingPattern(null);
    refresh();
  }

  return (
    <>
      {/* "New pattern" button — injected into whatever section uses this */}
      <div className="rounded-3xl border border-sk-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-skapa-h2 text-sk-primary">All patterns</h2>
            <p className="mt-1 text-skapa-body-sm text-sk-text-muted">Click any pattern to edit it, or create a new one.</p>
          </div>
          <SkapaButton
            onClick={() => setCreatingNew(true)}
            variant="primary"
            size="small"
            iconName="add"
          >
            New pattern
          </SkapaButton>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter patterns…"
            className="w-full rounded-lg border border-sk-border bg-white px-3 py-2 text-skapa-body-sm text-sk-text placeholder-sk-text-muted focus:border-[var(--sk-color-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--sk-color-focus)]"
          />
          {filter && (
            <p className="mt-1 text-skapa-caption text-sk-text-muted">
              {filteredPatterns.length} of {initialPatterns.length} patterns
            </p>
          )}
        </div>

        <div className="mt-4 divide-y divide-sk-border">
          {filteredPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setEditingPattern(pattern)}
              className="group flex w-full items-center justify-between gap-4 py-3 text-left text-sk-text-muted hover:text-sk-primary"
            >
              <div className="min-w-0">
                <p className="truncate text-skapa-body-md font-medium text-sk-primary group-hover:text-sk-primary-strong">
                  {pattern.title}
                </p>
                <p className="truncate text-skapa-caption text-sk-text-muted">{pattern.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-sk-surface-muted px-2.5 py-0.5 text-skapa-caption text-sk-text-muted">
                  {pattern.categoryId}
                </span>
                <SkapaIcon name="pencil" size={14} className="text-sk-border-strong group-hover:text-sk-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor slide-over */}
      {(editingPattern || creatingNew) && (
        <PatternEditor
          pattern={editingPattern ?? undefined}
          categories={categories}
          onSave={handleSave}
          onDelete={editingPattern ? handleDelete : undefined}
          onClose={() => {
            setEditingPattern(null);
            setCreatingNew(false);
          }}
        />
      )}
    </>
  );
}
