'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import type { Pattern, Category } from "@/lib/patterns";import { PatternEditor } from "@/components/PatternEditor";

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
      <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">All patterns</h2>
            <p className="mt-1 text-sm text-gray-500">Click any pattern to edit it, or create a new one.</p>
          </div>
          <button
            onClick={() => setCreatingNew(true)}
            className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
          >
            <Plus size={15} />
            New pattern
          </button>
        </div>

        <div className="mt-6 divide-y divide-gray-100">
          {initialPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setEditingPattern(pattern)}
              className="group flex w-full items-center justify-between gap-4 py-3 text-left hover:text-gray-600"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900 group-hover:text-gray-600">
                  {pattern.title}
                </p>
                <p className="truncate text-xs text-gray-400">{pattern.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                  {pattern.categoryId}
                </span>
                <Pencil size={13} className="text-gray-300 group-hover:text-gray-500" />
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
