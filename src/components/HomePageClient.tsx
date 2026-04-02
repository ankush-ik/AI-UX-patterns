'use client';

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import Search from "@ingka/search";
import { Compass, Mic, Sparkles, Settings, LayoutGrid, Pencil, Gavel, ShieldCheck, CircleCheck, Tag } from "lucide-react";
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
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");

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
          { name: "categoryId", weight: 0.5 },
        ],
        threshold: 0.2,
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
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-12 md:py-14">
          <div>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-sk-primary md:text-5xl">AI Design Patterns</h1>
            <p className="max-w-none text-base leading-relaxed text-sk-text-muted md:text-lg lg:whitespace-nowrap">
              Foundational elements and interactions for AI-enabled experiences
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Search
              id="pattern-search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Search"
              ariaLabel="Search patterns"
              size="large"
            />
          </div>
        </div>
      </header>

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
              footer={
                <a
                  href="/admin"
                  className="block py-4 pl-[3.75rem] pr-5 text-base font-semibold leading-tight text-[#b0b0b0] transition-colors hover:text-sk-text-muted md:pl-[4rem] md:text-lg"
                >
                  Content admin
                </a>
              }
            />

            <main className="flex-1">
              {categoryData.map(({ category, patterns }) => (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  className="mb-24 scroll-mt-20"
                >
                  <div className="mb-6">
                    <h2 className="mb-3 text-4xl font-bold leading-tight text-sk-primary md:text-5xl">{category.name}</h2>
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
