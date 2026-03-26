'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pattern, Category } from "@/lib/patterns";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { SidebarNav } from "@/components/SidebarNav";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type TabType = "description" | "design-considerations" | "related-patterns" | "examples";

interface PatternDetailClientProps {
  pattern: Pattern;
  category: Category;
  relatedPatterns: Pattern[];
}

export function PatternDetailClient({ pattern, category, relatedPatterns }: PatternDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Build tabs array
  const tabs: { id: TabType; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "design-considerations", label: "Design Considerations" },
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevious();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handlePrevious, handleNext]);

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

  const renderMarkdownContent = (content: string) => {
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
          <ul key={`ul-${key++}`} className="space-y-3 mb-6">
            {currentList.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span className="text-gray-400 mt-1">•</span>
                <span className="flex-1">{item}</span>
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
        elements.push(<h3 key={`h3-${key++}`} className="text-xl font-semibold mb-4 mt-8 first:mt-0 text-gray-900">{trimmedLine.substring(4)}</h3>);
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
              {pattern.sourceUrl && (
                <p className="text-sm text-gray-400">
                  Source: <a href={pattern.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{pattern.sourceUrl}</a>
                </p>
              )}
            </div>

            {/* Tabs */}
            <div id="section-description" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Description</h2>
              {renderMarkdownContent(pattern.content.description)}
            </div>

            <div id="section-design-considerations" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Design Considerations</h2>
              {renderMarkdownContent(pattern.content.designConsiderations)}
            </div>

            {relatedPatterns.length > 0 && (
              <div id="section-related-patterns" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Patterns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedPatterns.map((relPattern) => (
                    <Link
                      key={relPattern.id}
                      href={`/patterns/${relPattern.id}`}
                      className="group block rounded-lg border border-gray-200 p-4 hover:border-gray-900 hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{relPattern.title}</h3>
                      <p className="text-sm text-gray-500 mt-2">{relPattern.description}</p>
                    </Link>
                  ))}
                </div>
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
                      className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 hover:border-gray-900 transition group"
                    >
                      <Image
                        src={example.image}
                        alt={example.description}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
                        <p className="text-white font-semibold">{example.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && pattern.content.examples[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] mx-4">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:bg-white/20 rounded-lg transition"
            >
              <X size={24} />
            </button>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                src={pattern.content.examples[selectedImageIndex].image}
                alt={pattern.content.examples[selectedImageIndex].description}
                fill
                className="object-contain"
              />
            </div>

            <p className="text-white text-center mt-4 font-semibold">
              {pattern.content.examples[selectedImageIndex].description}
            </p>

            {/* Navigation */}
            {pattern.content.examples.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-white text-sm">
                  {selectedImageIndex + 1} / {pattern.content.examples.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
