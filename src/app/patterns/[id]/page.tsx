'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { patterns, categories } from "@/lib/patterns";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type TabType = "description" | "design-considerations" | "related-patterns" | "examples";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cn(...classes: any[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function PatternDetailPage() {
  const params = useParams();
  const patternId = params?.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const pattern = patterns.find((p) => p.id === patternId);
  const category = pattern ? categories.find((c) => c.id === pattern.categoryId) : null;

  const handlePrevious = () => {
    if (selectedImageIndex !== null && pattern) {
      setSelectedImageIndex((selectedImageIndex - 1 + pattern.content.examples.length) % pattern.content.examples.length);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && pattern) {
      setSelectedImageIndex((selectedImageIndex + 1) % pattern.content.examples.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevious();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, pattern]);

  if (!pattern || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Pattern not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "design-considerations", label: "Design Considerations" },
    { id: "related-patterns", label: "Related Patterns" },
    ...(pattern.content.examples.length > 0 ? [{ id: "examples" as TabType, label: "Examples" }] : []),
  ];

  const scrollToSection = (tabId: TabType) => {
    setActiveTab(tabId);
    const element = document.getElementById(`section-${tabId}`);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };
    const intersectingSections = new Map<string, number>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id.replace('section-', '');
        if (entry.isIntersecting) intersectingSections.set(sectionId, entry.intersectionRatio);
        else intersectingSections.delete(sectionId);
      });
      if (intersectingSections.size > 0) {
        let maxRatio = 0;
        let topSection = '';
        intersectingSections.forEach((ratio, sectionId) => {
          if (ratio > maxRatio) { maxRatio = ratio; topSection = sectionId; }
        });
        if (topSection) setActiveTab(topSection as TabType);
      }
    }, observerOptions);

    tabs.forEach((tab) => {
      const element = document.getElementById(`section-${tab.id}`);
      if (element) observer.observe(element);
    });

    return () => { observer.disconnect(); intersectingSections.clear(); };
  }, []);

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
        <div className="container mx-auto px-4 py-4 flex gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href={`/#category-${category.id}`} className="hover:text-gray-900">{category.name}</Link>
          <span>/</span>
          <span className="text-gray-900">{pattern.title}</span>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full h-96 overflow-hidden border-b bg-gray-50">
        <img src={pattern.thumbnail} alt={pattern.title} className="w-full h-full object-contain" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Sticky Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-colors text-sm",
                    activeTab === tab.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

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

            <section id="section-description" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
              <div className="border rounded-xl p-8 bg-white">{renderMarkdownContent(pattern.content.description)}</div>
            </section>

            <section id="section-design-considerations" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Design Considerations</h2>
              <div className="border rounded-xl p-8 bg-white">{renderMarkdownContent(pattern.content.designConsiderations)}</div>
            </section>

            <section id="section-related-patterns" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Related Patterns</h2>
              <div className="space-y-4">
                {pattern.content.relatedPatterns.map((related) => (
                  <Link key={related.id} href={`/patterns/${related.id}`} className="block border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all bg-white">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">{related.title}</h3>
                    <p className="text-gray-500">{related.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            {pattern.content.examples.length > 0 && (
              <section id="section-examples" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pattern.content.examples.map((example, index) => (
                    <div key={index} className="group cursor-pointer" onClick={() => setSelectedImageIndex(index)}>
                      <div className="aspect-video w-full overflow-hidden mb-3 rounded-xl bg-gray-100">
                        <img src={example.image} alt={example.description} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      </div>
                      <p className="text-sm text-gray-500">{example.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImageIndex(null)}>
          <div className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedImageIndex(null)} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white">
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {pattern.content.examples.length}
            </div>
            <img src={pattern.content.examples[selectedImageIndex].image} alt={pattern.content.examples[selectedImageIndex].description} className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="p-6">
              <p className="text-gray-500">{pattern.content.examples[selectedImageIndex].description}</p>
            </div>
            {pattern.content.examples.length > 1 && (
              <>
                <button onClick={handlePrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
