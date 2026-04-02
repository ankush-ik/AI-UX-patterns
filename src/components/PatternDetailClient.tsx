'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Search from "@ingka/search";
import Tabs, { Tab } from "@ingka/tabs";
import { ThumbsUp, ThumbsDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Pattern, Category, PatternExample, PatternEmbedExample, PatternImageExample } from "@/lib/patterns";
import { getPatternSources } from "@/lib/patterns";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { SidebarNav } from "@/components/SidebarNav";

type TabType = "description" | "user-archetype" | "design-considerations" | "related-patterns" | "examples";

interface PatternDetailClientProps {
  pattern: Pattern;
  category: Category;
  relatedPatterns: Pattern[];
}

function isEmbedExample(example: PatternExample): example is PatternEmbedExample {
  return example.type === "embed" && "embedUrl" in example;
}

function isImageExample(example: PatternExample): example is PatternImageExample {
  return !isEmbedExample(example) && typeof example.image === "string";
}

export function PatternDetailClient({ pattern, category, relatedPatterns }: PatternDetailClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<"helpful" | "not-helpful" | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const embedExamples = pattern.content.examples.filter(isEmbedExample);
  const imageExamples = pattern.content.examples.filter(isImageExample);
  const sources = getPatternSources(pattern);

  const selectedExample =
    selectedImageIndex !== null ? imageExamples[selectedImageIndex] : null;

  // Build tabs array
  const tabs: { id: TabType; label: string }[] = [
    { id: "description", label: "Description" },
    ...(pattern.content.userArchetype ? [{ id: "user-archetype" as TabType, label: "User Archetype" }] : []),
    { id: "design-considerations", label: "Design considerations" },
    { id: "related-patterns", label: "Related Patterns" },
    ...(pattern.content.examples.length > 0 ? [{ id: "examples" as TabType, label: "Examples" }] : []),
  ];

  const handlePrevious = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + imageExamples.length) % imageExamples.length);
    }
  }, [imageExamples.length, selectedImageIndex]);

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % imageExamples.length);
    }
  }, [imageExamples.length, selectedImageIndex]);

  const handleCloseLightbox = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevious();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") handleCloseLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleCloseLightbox, handlePrevious, handleNext]);

  useEffect(() => {
    if (selectedImageIndex === null) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [selectedImageIndex]);

  // Use scroll spy hook for tab highlighting
  useScrollSpy(activeTab, (tab) => setActiveTab(tab as TabType), tabs);

  const scrollToSection = (tabId: TabType) => {
    setActiveTab(tabId);
    const element = document.getElementById(`section-${tabId}`);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const renderMarkdownContent = (
    content: string,
    options?: {
      compactSectionHeadings?: boolean;
    }
  ) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let currentList: (string | JSX.Element)[] = [];
    let currentListType: "ul" | "ol" | null = null;
    let pendingLeadIn: string | null = null;
    let key = 0;

    const sanitizeMarkdownText = (text: string) => text
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\*\*\*\*:\*\*/g, "**:")
      .replace(/\*\*\*\*:/g, "**:")
      .replace(/\*\*‍\*\*/g, "")
      .replace(/!\[\/\]\(([^)]+)\)/g, "![Pattern source image]($1)")
      .replace(/\s+/g, " ")
      .trim();

    const sanitizeHeadingText = (text: string) => sanitizeMarkdownText(text)
      .replace(/^\*\*(.+)\*\*$/, "$1")
      .replace(/\*\*/g, "")
      .trim();

    const renderInlineMarkdown = (text: string) => {
      const safeText = sanitizeMarkdownText(text);
      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let partKey = 0;
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let match;
      while ((match = boldRegex.exec(safeText)) !== null) {
        if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
        parts.push(<strong key={`bold-${partKey++}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < safeText.length) parts.push(safeText.substring(lastIndex));
      return parts.length > 0 ? parts : safeText;
    };

    const parseMarkdownImageLine = (text: string) => {
      const imageMatch = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (!imageMatch) {
        return null;
      }

      const alt = imageMatch[1].trim() || "Pattern image";
      const src = imageMatch[2].trim();

      if (!src) {
        return null;
      }

      return { alt, src };
    };

    const parseMarkdownCaptionLine = (text: string) => {
      const captionMatch = text.match(/^\*(.+)\*$/);
      if (!captionMatch) {
        return null;
      }

      return captionMatch[1].trim();
    };

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">{renderInlineMarkdown(currentParagraph.join(" "))}</p>);
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = currentListType === "ol" ? "ol" : "ul";
        const listClassName = currentListType === "ol"
          ? "mb-10 ml-6 list-decimal space-y-3 text-lg text-sk-text md:text-xl"
          : "mb-10 ml-6 list-disc space-y-3 text-lg text-sk-text md:text-xl";

        elements.push(
          <ListTag key={`list-${key++}`} className={listClassName}>
            {currentList.map((item, i) => (
              <li key={i} className="pl-1 leading-relaxed marker:text-[var(--sk-color-text-muted)]">
                {typeof item === "string" ? renderInlineMarkdown(item) : item}
              </li>
            ))}
          </ListTag>
        );
        currentList = [];
        currentListType = null;
      }
    };

    for (let index = 0; index < lines.length; index += 1) {
      const line = sanitizeMarkdownText(lines[index]);
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("### ")) {
        flushParagraph(); flushList();
        if (pendingLeadIn) {
          elements.push(
            <p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">
              <strong>{pendingLeadIn}</strong>
            </p>
          );
          pendingLeadIn = null;
        }
        elements.push(
          <h3
            key={`h3-${key++}`}
            className={
              options?.compactSectionHeadings
                ? "mb-3 mt-8 text-xl font-semibold text-sk-primary first:mt-0 md:text-2xl"
                : "mb-4 mt-10 text-2xl font-semibold text-sk-primary first:mt-0 md:text-3xl"
            }
          >
            {sanitizeHeadingText(trimmedLine.substring(4))}
          </h3>
        );
      } else if (trimmedLine.startsWith("#### ")) {
        flushParagraph(); flushList();
        pendingLeadIn = sanitizeHeadingText(trimmedLine.substring(5));
      } else if (parseMarkdownImageLine(trimmedLine)) {
        flushParagraph(); flushList();
        if (pendingLeadIn) {
          elements.push(
            <p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">
              <strong>{pendingLeadIn}</strong>
            </p>
          );
          pendingLeadIn = null;
        }
        const imageData = parseMarkdownImageLine(trimmedLine);
        if (imageData) {
          const caption = parseMarkdownCaptionLine(lines[index + 1]?.trim() ?? "");
          elements.push(
            <figure key={`img-${key++}`} className="mb-10 overflow-hidden rounded-2xl border border-[var(--sk-color-border)] bg-[var(--sk-color-surface-muted)] p-2">
              <Image
                src={imageData.src}
                alt={imageData.alt}
                width={1600}
                height={1000}
                className="h-auto w-full rounded-xl object-contain"
                sizes="(min-width: 1280px) 90ch, 100vw"
              />
              {caption ? (
                <figcaption className="px-3 pb-2 pt-3 text-sm italic leading-relaxed text-sk-text-muted md:text-base">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
          if (caption) {
            index += 1;
          }
        }
      } else if (trimmedLine.match(/^\*\*[^*]+\*\*:/)) {
        flushParagraph();
        if (pendingLeadIn) {
          elements.push(
            <p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">
              <strong>{pendingLeadIn}</strong>
            </p>
          );
          pendingLeadIn = null;
        }
        currentListType = currentListType ?? "ul";
        const m = trimmedLine.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
        if (m) currentList.push(<><strong>{m[1]}</strong>: {m[2]}</>);
      } else if (trimmedLine.match(/^\d+\.\s+/)) {
        flushParagraph();
        if (pendingLeadIn) {
          elements.push(
            <p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">
              <strong>{pendingLeadIn}</strong>
            </p>
          );
          pendingLeadIn = null;
        }
        if (currentListType && currentListType !== "ol") {
          flushList();
        }
        currentListType = "ol";
        currentList.push(trimmedLine.replace(/^\d+\.\s+/, ""));
      } else if (trimmedLine.startsWith("- ")) {
        flushParagraph();
        if (pendingLeadIn) {
          elements.push(
            <p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">
              <strong>{pendingLeadIn}</strong>
            </p>
          );
          pendingLeadIn = null;
        }
        if (currentListType && currentListType !== "ul") {
          flushList();
        }
        currentListType = "ul";
        currentList.push(trimmedLine.substring(2));
      } else if (trimmedLine === "") {
        flushParagraph(); flushList();
      } else {
        flushList();
        if (pendingLeadIn && currentParagraph.length === 0) {
          currentParagraph.push(`**${pendingLeadIn}:** ${trimmedLine}`);
          pendingLeadIn = null;
        } else {
          currentParagraph.push(trimmedLine);
        }
      }
    }

    if (pendingLeadIn) {
      elements.push(
        <p key={`p-${key++}`} className="mb-10 text-lg leading-relaxed text-sk-text md:text-xl">
          <strong>{pendingLeadIn}</strong>
        </p>
      );
    }

    flushParagraph(); flushList();
    return <>{elements}</>;
  };

  const renderDesignConsiderationsContent = (content: string) => {
    const lines = content.split("\n");
    const hasComplexMarkdown = lines.some((line) => {
      const trimmed = line.trim();
      return trimmed.startsWith("#### ") || trimmed.startsWith("- ") || /^\d+\.\s+/.test(trimmed) || /^!\[/.test(trimmed) || /^\*\*[^*]+\*\*$/.test(trimmed);
    });

    if (hasComplexMarkdown) {
      return renderMarkdownContent(content, { compactSectionHeadings: true });
    }

    const items: { title: string; body: string }[] = [];
    let currentTitle = "";
    let currentBody: string[] = [];

    const pushCurrent = () => {
      if (!currentTitle) return;
      items.push({
        title: currentTitle,
        body: currentBody.join(" ").trim(),
      });
      currentTitle = "";
      currentBody = [];
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        pushCurrent();
        currentTitle = trimmed.substring(4).replace(/[.:]+$/, "");
        return;
      }

      if (trimmed === "") {
        return;
      }

      if (currentTitle) {
        currentBody.push(trimmed);
      }
    });

    pushCurrent();

    if (items.length === 0) {
      return renderMarkdownContent(content, { compactSectionHeadings: true });
    }

    return (
      <ul className="space-y-10">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="text-lg leading-relaxed text-sk-text md:text-xl">
            <strong className="text-sk-primary">{item.title}.</strong> {item.body}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-[24px] py-4 text-base text-sk-text md:px-4 md:text-lg">
          <div className="flex gap-2">
            <Link href="/" className="transition-colors hover:text-sk-primary">Home</Link>
            <span>/</span>
            <Link href={`/#category-${category.id}`} className="transition-colors hover:text-sk-primary">{category.name}</Link>
            <span>/</span>
            <span className="text-sk-primary">{pattern.title}</span>
          </div>
          <div className="w-full md:w-64">
            <Search
              id="detail-search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onSearch={() => { if (searchQuery.trim()) router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`); }}
              onClear={() => setSearchQuery("")}
              placeholder="Search"
              ariaLabel="Search patterns"
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden border-b bg-[var(--sk-color-surface-muted)] md:h-96">
        <Image
          src={pattern.thumbnail}
          alt={pattern.title}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="container mx-auto px-[24px] py-8 md:px-4">
        {/* Mobile horizontal tab bar */}
        <div className="sticky top-0 z-10 -mx-[24px] mb-[24px] bg-white pl-[24px] lg:hidden">
          <Tabs
            tabs={tabs.map((tab) => (
              <Tab
                key={tab.id}
                text={tab.label}
                tabPanelId={`section-${tab.id}`}
                onClick={() => { scrollToSection(tab.id); return true; }}
              />
            ))}
            activeTab={`section-${activeTab}`}
            tabPanels={[]}
            ariaLabel="Sections"
          />
        </div>

        <div className="flex gap-8">

          <div className="hidden lg:block">
            <SidebarNav
              items={tabs}
              activeItem={activeTab}
              onItemClick={scrollToSection}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 space-y-8 pr-0 lg:pr-10 xl:pr-16">
            <div className="max-w-[90ch]">
              <h1 className="mb-4 text-4xl font-bold leading-tight text-sk-primary md:text-5xl">{pattern.title}</h1>
              <p className="mb-5 text-xl leading-[1.7] text-sk-text-muted md:text-2xl">{pattern.description}</p>
              {sources.length > 0 ? (
                <p className="text-base text-sk-text-muted md:text-lg">
                  {sources.length > 1 ? "Sources:" : "Source:"}{" "}
                  {sources.map((s, i) => (
                    <span key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.name || s.url}</a>
                      {i < sources.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>

            {/* Tabs */}
            <div id="section-description" className="scroll-mt-20">
              <h2 className="mb-7 text-3xl font-bold text-sk-primary md:text-4xl">Description</h2>
              <div className="max-w-[90ch]">{renderMarkdownContent(pattern.content.description)}</div>
            </div>

            {pattern.content.userArchetype && (
              <div id="section-user-archetype" className="scroll-mt-20">
                <h2 className="mb-7 text-3xl font-bold text-sk-primary md:text-4xl">User Archetype</h2>
                <div className="max-w-[90ch]">{renderMarkdownContent(pattern.content.userArchetype)}</div>
              </div>
            )}

            <div id="section-design-considerations" className="scroll-mt-20">
              <h2 className="mb-7 text-3xl font-bold text-sk-primary md:text-4xl">Design considerations</h2>
              <div className="max-w-[90ch]">{renderDesignConsiderationsContent(pattern.content.designConsiderations)}</div>
            </div>

            {relatedPatterns.length > 0 && (
              <div id="section-related-patterns" className="scroll-mt-20">
                <h2 className="mb-7 text-3xl font-bold text-sk-primary md:text-4xl">Related Patterns</h2>
                <ul className="space-y-6">
                  {relatedPatterns.map((relPattern) => (
                    <li key={relPattern.id} className="list-none">
                      <h3 className="text-lg font-semibold text-sk-primary md:text-xl">
                        <Link
                          href={`/patterns/${relPattern.id}`}
                          className="underline decoration-[var(--sk-color-border-strong)] underline-offset-4 transition hover:decoration-[var(--sk-color-primary)]"
                        >
                          {relPattern.title}
                        </Link>
                      </h3>
                      <p className="mt-2 ml-6 text-lg leading-[1.85] text-sk-text">{relPattern.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pattern.content.examples.length > 0 && (
              <div id="section-examples" className="scroll-mt-20">
                <h2 className="mb-7 text-3xl font-bold text-sk-primary md:text-4xl">Examples</h2>
                <div className="space-y-8">
                  {embedExamples.length > 0 && (
                    <div className="space-y-4">
                      {imageExamples.length > 0 && (
                        <h3 className="text-2xl font-semibold text-sk-primary">Interactive prototypes</h3>
                      )}
                      <div className="space-y-6">
                        {embedExamples.map((example, index) => (
                          <article
                            key={`${example.embedUrl}-${index}`}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                          >
                            <div className="border-b border-gray-200 px-5 py-4">
                              <div>
                                <h4 className="text-2xl font-semibold text-sk-primary">
                                  {example.title ?? `Prototype ${index + 1}`}
                                </h4>
                                <p className="mt-2 max-w-3xl text-lg leading-[1.85] text-sk-text">{example.description}</p>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-3 md:p-5">
                              <div
                                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white"
                                style={{ aspectRatio: example.aspectRatio ?? "16 / 10" }}
                              >
                                <iframe
                                  src={example.embedUrl}
                                  title={example.title ?? `${pattern.title} prototype ${index + 1}`}
                                  className="absolute inset-0 h-full w-full"
                                  loading="lazy"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  {imageExamples.length > 0 && (
                    <div className="space-y-4">
                      {embedExamples.length > 0 && (
                        <h3 className="text-2xl font-semibold text-sk-primary">Screenshots</h3>
                      )}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {imageExamples.map((example, index) => (
                          <button
                            key={`${example.image}-${index}`}
                            onClick={() => setSelectedImageIndex(index)}
                            className="group overflow-hidden rounded-lg border border-gray-200 text-left transition hover:border-gray-900"
                          >
                            <div className="relative aspect-video overflow-hidden bg-gray-50">
                              <Image
                                src={example.image}
                                alt={example.description}
                                fill
                                sizes="(min-width: 768px) 50vw, 100vw"
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <div className="border-t border-gray-200 px-4 py-3">
                              {example.title && (
                                <p className="mb-1 text-base font-semibold text-sk-primary">{example.title}</p>
                              )}
                              <p className="text-lg leading-[1.85] text-sk-text">{example.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="mt-16 border-t border-sk-border pt-10">
              {feedbackSubmitted ? (
                <div className="rounded-2xl border border-sk-border bg-sk-surface-muted px-6 py-5">
                  <p className="text-lg font-medium text-sk-primary">Thank you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-sk-primary">Was this pattern helpful?</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFeedbackRating("helpful")}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                        feedbackRating === "helpful"
                          ? "border-sk-primary bg-sk-primary text-white"
                          : "border-sk-border text-sk-text hover:border-sk-primary"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" /> Yes, helpful
                    </button>
                    <button
                      onClick={() => setFeedbackRating("not-helpful")}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                        feedbackRating === "not-helpful"
                          ? "border-sk-primary bg-sk-primary text-white"
                          : "border-sk-border text-sk-text hover:border-sk-primary"
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" /> Not really
                    </button>
                  </div>

                  {feedbackRating && (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="w-full rounded-lg border border-sk-border bg-white px-3 py-2 text-sm text-sk-text placeholder-sk-text-muted focus:border-sk-primary focus:outline-none focus:ring-1 focus:ring-sk-primary"
                        placeholder="Share how you used this pattern or suggest an improvement (optional)"
                      />
                      <button
                        onClick={async () => {
                          setFeedbackSubmitting(true);
                          try {
                            const res = await fetch("/api/feedback", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                patternId: pattern.id,
                                rating: feedbackRating,
                                comment: feedbackComment || undefined,
                              }),
                            });
                            if (!res.ok) throw new Error("Failed");
                            setFeedbackSubmitted(true);
                          } catch {
                            alert("Could not submit feedback. Please try again.");
                          } finally {
                            setFeedbackSubmitting(false);
                          }
                        }}
                        disabled={feedbackSubmitting}
                        className="rounded-lg bg-sk-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-sk-primary-strong disabled:opacity-50"
                      >
                        {feedbackSubmitting ? "Submitting…" : "Submit feedback"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Example Lightbox */}
      {selectedExample && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          onClick={handleCloseLightbox}
        >
          <div className="absolute inset-0 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${pattern.title} example viewer`}
              className="relative mx-auto flex min-h-full w-full max-w-6xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseLightbox}
                className="absolute right-2 top-2 z-20 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/70 md:right-4 md:top-4"
                aria-label="Close example viewer"
              >
                <X size={22} />
              </button>

              <div className="w-full overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 md:px-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sk-text-muted">
                      Example
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-sk-primary md:text-3xl">
                      {pattern.title}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[var(--sk-color-surface-muted)] px-3 py-1 text-base font-medium text-sk-text md:text-lg">
                    {selectedImageIndex + 1} / {imageExamples.length}
                  </span>
                </div>

                <div className="relative bg-[#f5f3ee] px-3 py-3 md:px-5 md:py-5">
                  {imageExamples.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="absolute left-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-sk-primary shadow-lg transition hover:bg-white"
                        aria-label="Previous example"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        onClick={handleNext}
                        className="absolute right-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-sk-primary shadow-lg transition hover:bg-white"
                        aria-label="Next example"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}

                  <div className="relative mx-auto overflow-hidden rounded-[22px] bg-white shadow-sm">
                    <div className="relative aspect-[4/3] w-full md:aspect-[16/10]">
                      <Image
                        src={selectedExample.image}
                        alt={selectedExample.description}
                        fill
                        sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-5 py-4 md:px-7 md:py-5">
                  <p className="text-lg leading-[1.9] text-sk-text md:text-xl">
                    {selectedExample.description}
                  </p>

                  {imageExamples.length > 1 && (
                    <div className="mt-5 overflow-x-auto pb-1">
                      <div className="flex min-w-max gap-3">
                        {imageExamples.map((example, index) => {
                          const isActive = index === selectedImageIndex;

                          return (
                            <button
                              key={`${example.image}-${index}`}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`group relative h-20 w-28 flex-none overflow-hidden rounded-xl border transition md:h-24 md:w-36 ${
                                isActive
                                  ? "border-gray-900 ring-2 ring-gray-900/10"
                                  : "border-gray-200 hover:border-gray-400"
                              }`}
                              aria-label={`View example ${index + 1}`}
                              aria-pressed={isActive}
                            >
                              <Image
                                src={example.image}
                                alt={example.description}
                                fill
                                sizes="144px"
                                className="object-cover transition group-hover:scale-105"
                              />
                              <div
                                className={`absolute inset-0 transition ${
                                  isActive ? "bg-black/0" : "bg-black/10 group-hover:bg-black/0"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
