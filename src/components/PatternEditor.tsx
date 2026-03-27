'use client';

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Pattern, Category, PatternExample } from "@/lib/patterns";

interface PatternEditorProps {
  /** Pass a pattern to edit it; omit to create a new one */
  pattern?: Pattern;
  categories: Category[];
  onSave: (saved: Pattern) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const EMPTY_PATTERN: Omit<Pattern, "id"> = {
  title: "",
  description: "",
  thumbnail: "",
  categoryId: "",
  sourceUrl: "",
  content: {
    description: "",
    designConsiderations: "",
    relatedPatterns: [],
    examples: [],
  },
};

const EMPTY_IMAGE_EXAMPLE: PatternExample = {
  type: "image",
  image: "",
  title: "",
  description: "",
  href: "",
};

const EMPTY_EMBED_EXAMPLE: PatternExample = {
  type: "embed",
  title: "",
  description: "",
  embedUrl: "",
  href: "",
  provider: "Figma",
  image: "",
  aspectRatio: "16 / 10",
};

export function PatternEditor({ pattern, categories, onSave, onDelete, onClose }: PatternEditorProps) {
  const isEditing = Boolean(pattern);
  const [form, setForm] = useState<Pattern>(
    pattern ?? { id: "", ...EMPTY_PATTERN }
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedInput, setRelatedInput] = useState("");

  // Reset form if pattern prop changes (e.g. user clicks different pattern)
  useEffect(() => {
    setForm(pattern ?? { id: "", ...EMPTY_PATTERN });
    setError(null);
  }, [pattern]);

  function set(key: keyof Pattern, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setContent(key: keyof Pattern["content"], value: unknown) {
    setForm((prev) => ({ ...prev, content: { ...prev.content, [key]: value } }));
  }

  function addExample() {
    setContent("examples", [
      ...form.content.examples,
      { ...EMPTY_IMAGE_EXAMPLE },
    ]);
  }

  function updateExample(index: number, field: string, value: string) {
    const updated = form.content.examples.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    setContent("examples", updated);
  }

  function updateExampleType(index: number, type: "image" | "embed") {
    const updated = form.content.examples.map((ex, i) => {
      if (i !== index) return ex;
      return type === "embed"
        ? {
            ...EMPTY_EMBED_EXAMPLE,
            title: ex.title ?? "",
            description: ex.description,
            href: ex.href ?? "",
            image: ex.image ?? "",
          }
        : {
            ...EMPTY_IMAGE_EXAMPLE,
            title: ex.title ?? "",
            description: ex.description,
            href: ex.href ?? "",
            image: ex.image ?? "",
          };
    });
    setContent("examples", updated);
  }

  function removeExample(index: number) {
    setContent("examples", form.content.examples.filter((_, i) => i !== index));
  }

  function addRelated() {
    const id = relatedInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!id || form.content.relatedPatterns.includes(id)) return;
    setContent("relatedPatterns", [...form.content.relatedPatterns, id]);
    setRelatedInput("");
  }

  function removeRelated(id: string) {
    setContent("relatedPatterns", form.content.relatedPatterns.filter((r) => r !== id));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.categoryId) {
      setError("Title and category are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let res: Response;
      if (isEditing) {
        res = await fetch(`/api/patterns/${form.id}/edit`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/patterns/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "An error occurred");
      }

      const { pattern: saved } = await res.json();
      onSave(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save pattern");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!pattern || !onDelete) return;
    if (!confirm(`Delete "${pattern.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/patterns/${pattern.id}/edit`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete");
      }
      onDelete(pattern.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete pattern");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close editor"
      />

      {/* panel */}
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? `Edit: ${pattern!.title}` : "New Pattern"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Basic fields */}
          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Core info
            </legend>

            {!isEditing && (
              <Field label="ID / URL slug" required>
                <input
                  type="text"
                  value={form.id}
                  placeholder="e.g. progressive-disclosure"
                  onChange={(e) => set("id", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Becomes the URL: /patterns/<span className="font-mono">{form.id || "your-slug"}</span>
                </p>
              </Field>
            )}

            <Field label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputClass}
                placeholder="Pattern name"
              />
            </Field>

            <Field label="Short description">
              <input
                type="text"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={inputClass}
                placeholder="One-sentence overview shown on the card"
              />
            </Field>

            <Field label="Category" required>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className={inputClass}
              >
                <option value="">Select a category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Thumbnail URL">
              <input
                type="url"
                value={form.thumbnail}
                onChange={(e) => set("thumbnail", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
              {form.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.thumbnail}
                  alt="Thumbnail preview"
                  className="mt-2 h-24 w-full rounded-lg object-cover border border-gray-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </Field>

            <Field label="Source URL">
              <input
                type="url"
                value={form.sourceUrl ?? ""}
                onChange={(e) => set("sourceUrl", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </Field>
          </fieldset>

          <hr className="border-gray-100" />

          {/* Content */}
          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Content
            </legend>

            <Field label="Description" hint="Supports ### headings, **bold**, and - bullet lists">
              <textarea
                rows={8}
                value={form.content.description}
                onChange={(e) => setContent("description", e.target.value)}
                className={`${inputClass} font-mono text-xs`}
                placeholder="Full description with markdown…"
              />
            </Field>

            <Field label="User archetype" hint="Optional: who this pattern is for (supports markdown)">
              <textarea
                rows={4}
                value={form.content.userArchetype ?? ""}
                onChange={(e) => setContent("userArchetype", e.target.value || undefined)}
                className={`${inputClass} font-mono text-xs`}
                placeholder="Describe the intended user type(s) for this pattern…"
              />
            </Field>

            <Field label="Design considerations" hint="Same markdown syntax">
              <textarea
                rows={8}
                value={form.content.designConsiderations}
                onChange={(e) => setContent("designConsiderations", e.target.value)}
                className={`${inputClass} font-mono text-xs`}
                placeholder="Design tips and guidelines…"
              />
            </Field>
          </fieldset>

          <hr className="border-gray-100" />

          {/* Related patterns */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Related patterns
            </legend>

            <div className="flex gap-2">
              <input
                type="text"
                value={relatedInput}
                onChange={(e) => setRelatedInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRelated())}
                className={`${inputClass} flex-1`}
                placeholder="pattern-id (press Enter to add)"
              />
              <button
                type="button"
                onClick={addRelated}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-gray-400"
              >
                <Plus size={16} />
              </button>
            </div>

            {form.content.relatedPatterns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.content.relatedPatterns.map((id) => (
                  <span
                    key={id}
                    className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-mono"
                  >
                    {id}
                    <button
                      type="button"
                      onClick={() => removeRelated(id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </fieldset>

          <hr className="border-gray-100" />

          {/* Examples */}
          <fieldset className="space-y-3">
            <div className="flex items-center justify-between">
              <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Examples
              </legend>
              <button
                type="button"
                onClick={addExample}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:border-gray-400"
              >
                <Plus size={13} /> Add example
              </button>
            </div>

            {form.content.examples.length === 0 && (
              <p className="text-sm text-gray-400">No examples yet. Click &ldquo;Add example&rdquo; above.</p>
            )}

            {form.content.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Example {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExample(i)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <Field label="Media type">
                  <select
                    value={ex.type ?? "image"}
                    onChange={(e) => updateExampleType(i, e.target.value as "image" | "embed")}
                    className={inputClass}
                  >
                    <option value="image">Image</option>
                    <option value="embed">Embed</option>
                  </select>
                </Field>
                <Field label="Title">
                  <input
                    type="text"
                    value={ex.title ?? ""}
                    onChange={(e) => updateExample(i, "title", e.target.value)}
                    className={inputClass}
                    placeholder="Optional label shown above the example"
                  />
                </Field>
                {ex.type === "embed" ? (
                  <>
                    <Field label="Embed URL">
                      <input
                        type="url"
                        value={ex.embedUrl}
                        onChange={(e) => updateExample(i, "embedUrl", e.target.value)}
                        className={inputClass}
                        placeholder="https://www.figma.com/embed?..."
                      />
                    </Field>
                    <Field label="External URL">
                      <input
                        type="url"
                        value={ex.href ?? ""}
                        onChange={(e) => updateExample(i, "href", e.target.value)}
                        className={inputClass}
                        placeholder="https://www.figma.com/design/..."
                      />
                    </Field>
                    <Field label="Provider">
                      <input
                        type="text"
                        value={ex.provider ?? ""}
                        onChange={(e) => updateExample(i, "provider", e.target.value)}
                        className={inputClass}
                        placeholder="Figma"
                      />
                    </Field>
                    <Field label="Aspect ratio">
                      <input
                        type="text"
                        value={ex.aspectRatio ?? ""}
                        onChange={(e) => updateExample(i, "aspectRatio", e.target.value)}
                        className={inputClass}
                        placeholder="16 / 10"
                      />
                    </Field>
                    <Field label="Poster image URL" hint="Optional fallback thumbnail shown later if you decide to use it">
                      <input
                        type="url"
                        value={ex.image ?? ""}
                        onChange={(e) => updateExample(i, "image", e.target.value)}
                        className={inputClass}
                        placeholder="https://..."
                      />
                    </Field>
                  </>
                ) : (
                  <Field label="Image URL">
                    <input
                      type="url"
                      value={ex.image}
                      onChange={(e) => updateExample(i, "image", e.target.value)}
                      className={inputClass}
                      placeholder="https://..."
                    />
                    {ex.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ex.image}
                        alt={`Example ${i + 1} preview`}
                        className="mt-2 h-20 w-full rounded-lg object-cover border border-gray-200"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </Field>
                )}
                <Field label="Caption">
                  <input
                    type="text"
                    value={ex.description}
                    onChange={(e) => updateExample(i, "description", e.target.value)}
                    className={inputClass}
                    placeholder="What this example shows"
                  />
                </Field>
              </div>
            ))}
          </fieldset>
        </div>

        {/* footer actions */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div>
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={14} />
                {deleting ? "Deleting…" : "Delete pattern"}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : isEditing ? "Save changes" : "Create pattern"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}
