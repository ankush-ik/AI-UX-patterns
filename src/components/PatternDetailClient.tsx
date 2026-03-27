'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pattern, Category } from "@/lib/patterns";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { SidebarNav } from "@/components/SidebarNav";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type TabType = "description" | "user-archetype" | "design-considerations" | "related-patterns" | "examples";

interface PatternDetailClientProps {
  pattern: Pattern;
  category: Category;
  relatedPatterns: Pattern[];
}

export function PatternDetailClient({ pattern, category, relatedPatterns }: PatternDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const selectedExample =
    selectedImageIndex !== null ? pattern.content.examples[selectedImageIndex] : null;

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
      setSelectedImageIndex((selectedImageIndex - 1 + pattern.content.examples.length) % pattern.content.examples.length);
    }
  }, [pattern.content.examples.length, selectedImageIndex]);

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % pattern.content.examples.length);
    }
  }, [pattern.content.examples.length, selectedImageIndex]);

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
    let key = 0;

    const renderInlineMarkdown = (text: string) => {
      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let partKey = 0;
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let match;
      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
        parts.push(<strong key={`bold-${partKey++}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) parts.push(text.substring(lastIndex));
      return parts.length > 0 ? parts : text;
    };

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${key++}`} className="mb-6 leading-relaxed text-gray-700">{renderInlineMarkdown(currentParagraph.join(" "))}</p>);
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${key++}`} className="mb-6 ml-6 list-disc space-y-3 text-gray-700">
            {currentList.map((item, i) => (
              <li key={i} className="pl-1 leading-relaxed marker:text-gray-400">
                {typeof item === "string" ? renderInlineMarkdown(item) : item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("### ")) {
        flushParagraph(); flushList();
        elements.push(
          <h3
            key={`h3-${key++}`}
            className={
              options?.compactSectionHeadings
                ? "text-lg font-semibold mb-3 mt-7 first:mt-0 text-gray-900"
                : "text-xl font-semibold mb-4 mt-8 first:mt-0 text-gray-900"
            }
          >
            {trimmedLine.substring(4)}
          </h3>
        );
      } else if (trimmedLine.match(/^\*\*[^*]+\*\*:/)) {
        flushParagraph();
        const m = trimmedLine.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
        if (m) currentList.push(<><strong>{m[1]}</strong>: {m[2]}</>);
      } else if (trimmedLine.startsWith("- ")) {
        flushParagraph();
        currentList.push(trimmedLine.substring(2));
      } else if (trimmedLine === "") {
        flushParagraph(); flushList();
      } else {
        flushList();
        currentParagraph.push(trimmedLine);
      }
    });

    flushParagraph(); flushList();
    return <>{elements}</>;
  };

  const renderDesignConsiderationsContent = (content: string) => {
    const lines = content.split("\n");
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
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="text-gray-700 leading-relaxed">
            <strong className="text-gray-900">{item.title}.</strong> {item.body}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-gray-500">
          <div className="flex gap-2">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href={`/#category-${category.id}`} className="hover:text-gray-900">{category.name}</Link>
            <span>/</span>
            <span className="text-gray-900">{pattern.title}</span>
          </div>
          <Link href="/admin" className="hover:text-gray-900">Content admin</Link>
        </div>
      </div>

      {/* Banner */}
      <div className="relative w-full h-96 overflow-hidden border-b bg-gray-50">
        <Image
          src={pattern.thumbnail}
          alt={pattern.title}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">

          <SidebarNav
            items={tabs}
            activeItem={activeTab}
            onItemClick={scrollToSection}
          />

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{pattern.title}</h1>
              <p className="text-xl text-gray-500 mb-4">{pattern.description}</p>
              {pattern.sources && pattern.sources.length > 0 ? (
                <p className="text-sm text-gray-400">
                  Sources:{" "}
                  {pattern.sources.map((s, i) => (
                    <span key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.name}</a>
                      {i < pattern.sources!.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              ) : pattern.sourceUrl ? (
                <p className="text-sm text-gray-400">
                  Source:{" "}
                  <a href={pattern.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{pattern.sourceUrl}</a>
                </p>
              ) : null}
            </div>

            {/* Tabs */}
            <div id="section-description" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Description</h2>
              {renderMarkdownContent(pattern.content.description)}
            </div>

            {pattern.content.userArchetype && (
              <div id="section-user-archetype" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">User Archetype</h2>
                {renderMarkdownContent(pattern.content.userArchetype)}
              </div>
            )}

            <div id="section-design-considerations" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Design considerations</h2>
              {renderDesignConsiderationsContent(pattern.content.designConsiderations)}
            </div>

            {relatedPatterns.length > 0 && (
              <div id="section-related-patterns" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Patterns</h2>
                <ul className="space-y-6">
                  {relatedPatterns.map((relPattern) => (
                    <li key={relPattern.id} className="list-none">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link
                          href={`/patterns/${relPattern.id}`}
                          className="underline decoration-gray-300 underline-offset-4 transition hover:decoration-gray-900"
                        >
                          {relPattern.title}
                        </Link>
                      </h3>
                      <p className="mt-2 ml-6 leading-relaxed text-gray-600">{relPattern.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pattern.content.examples.length > 0 && (
              <div id="section-examples" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pattern.content.examples.map((example, index) => (
                    <button
                      key={index}
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
                        <p className="leading-relaxed text-gray-700">{example.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Example
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900 md:text-2xl">
                      {pattern.title}
                    </h2>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                    {selectedImageIndex + 1} / {pattern.content.examples.length}
                  </span>
                </div>

                <div className="relative bg-[#f5f3ee] px-3 py-3 md:px-5 md:py-5">
                  {pattern.content.examples.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="absolute left-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-900 shadow-lg transition hover:bg-white"
                        aria-label="Previous example"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        onClick={handleNext}
                        className="absolute right-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-900 shadow-lg transition hover:bg-white"
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
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    {selectedExample.description}
                  </p>

                  {pattern.content.examples.length > 1 && (
                    <div className="mt-5 overflow-x-auto pb-1">
                      <div className="flex min-w-max gap-3">
                        {pattern.content.examples.map((example, index) => {
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
