'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import Fuse from "fuse.js";
import { Compass, Mic, Sparkles, Settings, LayoutGrid, Pencil, Gavel, ShieldCheck, CircleCheck, Tag, Search, X } from "lucide-react";
import type { Category, Pattern } from "@/lib/patterns";
import { useIconResolver } from "@/hooks/useIconResolver";
import { SidebarNav } from "@/components/SidebarNav";
import { PatternCard } from "@/components/PatternCard";

interface HomePageClientProps {
  categories: Category[];
  categoryData: Array<{
    category: Category;
    patterns: Pattern[];
  }>;
}

export function HomePageClient({ categories, categoryData }: HomePageClientProps) {
  const { resolveIcon } = useIconResolver();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Flatten all patterns for Fuse.js index
  const allPatterns = useMemo(
    () => categoryData.flatMap(({ patterns }) => patterns),
    [categoryData]
  );

  const fuse = useMemo(
    () =>
      new Fuse(allPatterns, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1.5 },
          { name: "content.description", weight: 1 },
          { name: "categoryId", weight: 0.5 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [allPatterns]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  // Map resolved category icons to renderer components.
  const iconComponentMap: Record<string, React.ComponentType<{ className?: string }>> = {
    compass: Compass,
    microphone: Mic,
    sparkles: Sparkles,
    settings: Settings,
    layout: LayoutGrid,
    pencil: Pencil,
    gavel: Gavel,
    "shield-checkmark": ShieldCheck,
    "checkmark-circle": CircleCheck,
    tag: Tag,
  };

  useEffect(() => {
    const handleScroll = () => {
      const categoryElements = categories.map((cat) =>
        document.getElementById(`category-${cat.id}`)
      );
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isNearBottom = windowHeight + scrollTop >= documentHeight - 100;

      if (isNearBottom) {
        setActiveCategory(categories[categories.length - 1].id);
        return;
      }

      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const element = categoryElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveCategory(categories[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const sidebarItems = categories.map((category) => {
    const iconName = resolveIcon(category.icon);
    return {
      id: category.id,
      label: category.name,
      icon: iconName ? iconComponentMap[iconName] : undefined,
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-sk-border">
        <div className="container mx-auto flex flex-wrap items-start justify-between gap-4 px-4 py-12 md:py-14">
          <div>
            <h1 className="mb-3 text-5xl font-bold leading-tight text-sk-primary md:text-6xl">AI Design Patterns</h1>
            <p className="max-w-none text-base leading-relaxed text-sk-text-muted md:text-lg lg:whitespace-nowrap">
              Foundational elements and interactions for AI-enabled experiences
            </p>
          </div>
          <a
            href="/admin"
            className="inline-flex min-h-10 items-center border border-sk-border-strong px-4 text-skapa-body-sm text-sk-primary transition-colors hover:border-sk-primary"
          >
            Content admin
          </a>
        </div>
      </header>

      {/* Search bar */}
      <div className="border-b border-sk-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sk-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={'Search patterns\u2026 e.g. "help users get started"'}
              className="w-full rounded-lg border border-sk-border bg-white py-2.5 pl-10 pr-10 text-skapa-body-md text-sk-text placeholder-sk-text-muted focus:border-sk-primary focus:outline-none focus:ring-1 focus:ring-sk-primary"
            />
            {isSearching && (
              <button
                onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-sk-text-muted hover:text-sk-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-14">
        {isSearching ? (
          /* Search results view */
          <div>
            <p className="mb-6 text-skapa-body-md text-sk-text-muted">
              {searchResults.length === 0
                ? `No patterns found for "${searchQuery}"`
                : `${searchResults.length} pattern${searchResults.length !== 1 ? "s" : ""} found`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((pattern) => (
                <PatternCard
                  key={pattern.id}
                  id={pattern.id}
                  title={pattern.title}
                  description={pattern.description}
                  thumbnail={pattern.thumbnail}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Category browsing view */
          <div className="flex gap-8">
            <SidebarNav
              items={sidebarItems}
              activeItem={activeCategory}
              onItemClick={scrollToCategory}
            />

            <main className="flex-1">
              {categoryData.map(({ category, patterns }) => (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  className="mb-24 scroll-mt-20"
                >
                  <div className="mb-6">
                    <h2 className="mb-3 text-5xl font-bold leading-tight text-sk-primary md:text-6xl">{category.name}</h2>
                    <p className="text-lg leading-relaxed text-sk-text-muted md:text-xl">{category.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {patterns.map((pattern) => (
                      <PatternCard
                        key={pattern.id}
                        id={pattern.id}
                        title={pattern.title}
                        description={pattern.description}
                        thumbnail={pattern.thumbnail}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
