'use client';

import { useState, useTransition } from "react";
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

        <div className="mt-6 divide-y divide-sk-border">
          {initialPatterns.map((pattern) => (
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
