'use client';

import { useState, useEffect } from "react";
import { SkapaIcon } from "@/components/SkapaIcon";
import { SkapaButton } from "@/components/SkapaButton";
import type { Pattern, Category, PatternExample, PatternSource } from "@/lib/patterns";
import { getPatternSources } from "@/lib/patterns";

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
  sources: [],
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
  const [previewField, setPreviewField] = useState<string | null>(null);

  // Initialize sources from pattern
  const [sources, setSources] = useState<PatternSource[]>(
    pattern ? getPatternSources(pattern) : []
  );

  // Reset form if pattern prop changes (e.g. user clicks different pattern)
  useEffect(() => {
    setForm(pattern ?? { id: "", ...EMPTY_PATTERN });
    setSources(pattern ? getPatternSources(pattern) : []);
    setPreviewField(null);
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

  function addSource() {
    setSources([...sources, { name: "", url: "" }]);
  }

  function updateSource(index: number, field: keyof PatternSource, value: string) {
    setSources(sources.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function removeSource(index: number) {
    setSources(sources.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.categoryId) {
      setError("Title and category are required.");
      return;
    }

    setSaving(true);
    setError(null);

    // Merge sources into form data
    const payload = {
      ...form,
      sources: sources.filter((s) => s.url.trim()),
      sourceUrl: undefined, // migrate away from deprecated field
    };

    try {
      let res: Response;
      if (isEditing) {
        res = await fetch(`/api/patterns/${form.id}/edit`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/patterns/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
        <div className="flex items-center justify-between border-b border-sk-border px-6 py-4">
          <h2 className="text-skapa-h3 font-semibold text-sk-primary">
            {isEditing ? `Edit: ${pattern!.title}` : "New Pattern"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sk-text-muted hover:bg-sk-surface-muted hover:text-sk-text"
          >
            <SkapaIcon name="close" size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-[var(--sk-color-danger)] bg-white px-4 py-3 text-skapa-body-sm text-[var(--sk-color-danger)]">
              {error}
            </div>
          )}

          {/* Basic fields */}
          <fieldset className="space-y-4">
            <legend className="text-skapa-overline font-semibold text-sk-text-muted">
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
                  className="mt-2 h-24 w-full rounded-lg object-cover border border-sk-border"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </Field>

            <Field label="Sources">
              <div className="space-y-2">
                {sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={source.name}
                      onChange={(e) => updateSource(i, "name", e.target.value)}
                      className={`${inputClass} w-1/3`}
                      placeholder="Label (e.g. Shapeof.ai)"
                    />
                    <input
                      type="url"
                      value={source.url}
                      onChange={(e) => updateSource(i, "url", e.target.value)}
                      className={`${inputClass} flex-1`}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => removeSource(i)}
                      className="mt-2 text-sk-text-muted hover:text-[var(--sk-color-danger)]"
                    >
                      <SkapaIcon name="close" size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSource}
                  className="text-skapa-body-sm text-sk-text-muted hover:text-sk-primary"
                >
                  + Add source
                </button>
              </div>
            </Field>
          </fieldset>

          <hr className="border-sk-border" />

          {/* Content */}
          <fieldset className="space-y-4">
            <legend className="text-skapa-overline font-semibold text-sk-text-muted">
              Content
            </legend>

            <MarkdownField
              label="Description"
              hint="Supports ### headings, **bold**, and - bullet lists"
              value={form.content.description}
              onChange={(v) => setContent("description", v)}
              rows={8}
              placeholder="Full description with markdown…"
              previewField={previewField}
              fieldKey="description"
              onTogglePreview={setPreviewField}
            />

            <MarkdownField
              label="User archetype"
              hint="Optional: who this pattern is for (supports markdown)"
              value={form.content.userArchetype ?? ""}
              onChange={(v) => setContent("userArchetype", v || undefined)}
              rows={4}
              placeholder="Describe the intended user type(s) for this pattern…"
              previewField={previewField}
              fieldKey="userArchetype"
              onTogglePreview={setPreviewField}
            />

            <MarkdownField
              label="Design considerations"
              hint="Same markdown syntax"
              value={form.content.designConsiderations}
              onChange={(v) => setContent("designConsiderations", v)}
              rows={8}
              placeholder="Design tips and guidelines…"
              previewField={previewField}
              fieldKey="designConsiderations"
              onTogglePreview={setPreviewField}
            />
          </fieldset>

          <hr className="border-sk-border" />

          {/* Related patterns */}
          <fieldset className="space-y-3">
            <legend className="text-skapa-overline font-semibold text-sk-text-muted">
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
              <SkapaButton
                type="button"
                onClick={addRelated}
                variant="ghost"
                size="small"
                iconName="add"
                iconOnly
              />
            </div>

            {form.content.relatedPatterns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.content.relatedPatterns.map((id) => (
                  <span
                    key={id}
                    className="flex items-center gap-1.5 rounded-full bg-sk-surface-muted px-3 py-1 text-skapa-caption font-mono text-sk-text"
                  >
                    {id}
                    <button
                      type="button"
                      onClick={() => removeRelated(id)}
                      className="text-sk-text-muted hover:text-[var(--sk-color-danger)]"
                    >
                      <SkapaIcon name="close" size={12} />
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
              <legend className="text-skapa-overline font-semibold text-sk-text-muted">
                Examples
              </legend>
              <SkapaButton
                type="button"
                onClick={addExample}
                variant="ghost"
                size="small"
                iconName="add"
              >
                Add example
              </SkapaButton>
            </div>

            {form.content.examples.length === 0 && (
              <p className="text-skapa-body-sm text-sk-text-muted">No examples yet. Click &ldquo;Add example&rdquo; above.</p>
            )}

            {form.content.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-sk-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-skapa-caption font-medium text-sk-text-muted">Example {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExample(i)}
                    className="text-sk-text-muted hover:text-[var(--sk-color-danger)]"
                  >
                    <SkapaIcon name="trash" size={14} />
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
                        className="mt-2 h-20 w-full rounded-lg object-cover border border-sk-border"
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
        <div className="flex items-center justify-between border-t border-sk-border px-6 py-4">
          <div>
            {isEditing && onDelete && (
              <SkapaButton
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                variant="danger"
                size="small"
                iconName="trash"
              >
                {deleting ? "Deleting…" : "Delete pattern"}
              </SkapaButton>
            )}
          </div>
          <div className="flex gap-3">
            <SkapaButton
              type="button"
              onClick={onClose}
              variant="secondary"
              size="small"
            >
              Cancel
            </SkapaButton>
            <SkapaButton
              type="button"
              onClick={handleSave}
              disabled={saving}
              variant="primary"
              size="small"
            >
              {saving ? "Saving…" : isEditing ? "Save changes" : "Create pattern"}
            </SkapaButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-sk-border bg-white px-3 py-2 text-skapa-body-sm text-sk-text placeholder-sk-text-muted focus:border-[var(--sk-color-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--sk-color-focus)]";

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
      <label className="block text-skapa-body-sm font-medium text-sk-text">
        {label}
        {required && <span className="ml-1 text-[var(--sk-color-danger)]">*</span>}
      </label>
      {hint && <p className="text-skapa-caption text-sk-text-muted">{hint}</p>}
      {children}
    </div>
  );
}

function renderSimpleMarkdown(text: string): React.ReactNode {
  if (!text.trim()) return <p className="text-skapa-body-sm text-sk-text-muted">Nothing to preview.</p>;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const applyInline = (s: string) =>
      s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-3 mb-1 text-sm font-semibold text-sk-primary" dangerouslySetInnerHTML={{ __html: applyInline(line.slice(4)) }} />
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="mt-2 mb-1 text-sm font-medium text-sk-text" dangerouslySetInnerHTML={{ __html: applyInline(line.slice(5)) }} />
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-xs text-sk-text" dangerouslySetInnerHTML={{ __html: applyInline(line.slice(2)) }} />
      );
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(
        <p key={i} className="text-xs text-sk-text" dangerouslySetInnerHTML={{ __html: applyInline(line) }} />
      );
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function MarkdownField({
  label,
  hint,
  value,
  onChange,
  rows,
  placeholder,
  previewField,
  fieldKey,
  onTogglePreview,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
  placeholder: string;
  previewField: string | null;
  fieldKey: string;
  onTogglePreview: (key: string | null) => void;
}) {
  const isPreviewing = previewField === fieldKey;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-skapa-body-sm font-medium text-sk-text">{label}</label>
        <button
          type="button"
          onClick={() => onTogglePreview(isPreviewing ? null : fieldKey)}
          className="text-skapa-caption text-sk-text-muted hover:text-sk-primary"
        >
          {isPreviewing ? "Write" : "Preview"}
        </button>
      </div>
      {hint && <p className="text-skapa-caption text-sk-text-muted">{hint}</p>}
      {isPreviewing ? (
        <div className={`rounded-lg border border-sk-border bg-sk-surface-muted px-3 py-2 min-h-[${rows * 1.5}rem] overflow-y-auto`}>
          {renderSimpleMarkdown(value)}
        </div>
      ) : (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} font-mono text-xs`}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
