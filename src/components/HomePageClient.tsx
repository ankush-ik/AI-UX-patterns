'use client';

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { FuseResultMatch } from "fuse.js";
import Search from "@ingka/search";
import Tabs, { Tab } from "@ingka/tabs";
import compassIcon from "@ingka/ssr-icon/paths/map";
import microphoneIcon from "@ingka/ssr-icon/paths/microphone";
import sparklesIcon from "@ingka/ssr-icon/paths/sparkles";
import settingsIcon from "@ingka/ssr-icon/paths/gear";
import layoutIcon from "@ingka/ssr-icon/paths/layout";
import pencilIcon from "@ingka/ssr-icon/paths/pencil";
import gavelIcon from "@ingka/ssr-icon/paths/scales";
import shieldIcon from "@ingka/ssr-icon/paths/shield-checkmark";
import checkCircleIcon from "@ingka/ssr-icon/paths/checkmark-circle";
import tagIcon from "@ingka/ssr-icon/paths/tag";
import { Compass, Mic, Sparkles, Settings, LayoutGrid, Pencil, Gavel, ShieldCheck, CircleCheck, Tag } from "lucide-react";
import type { Category, Pattern } from "@/lib/patterns";
import { useIconResolver } from "@/hooks/useIconResolver";
import { useScrollSpy } from "@/hooks/useScrollSpy";
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

  // Denormalize category name onto patterns for search
  const searchablePatterns = useMemo(
    () => allPatterns.map((p) => ({
      ...p,
      categoryName: categoryData.find((c) => c.category.id === p.categoryId)?.category.name ?? "",
    })),
    [allPatterns, categoryData]
  );

  const fuse = useMemo(
    () =>
      new Fuse(searchablePatterns, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1.5 },
          { name: "searchKeywords", weight: 1 },
          { name: "categoryName", weight: 0.8 },
          { name: "categoryId", weight: 0.3 },
        ],
        threshold: 0.3,
        includeMatches: true,
        includeScore: true,
        minMatchCharLength: 3,
      }),
    [searchablePatterns]
  );

  const searchResultsRaw = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).filter((r) => (r.score ?? 1) < 0.25);
  }, [fuse, searchQuery]);

  const searchResults = useMemo(
    () => searchResultsRaw.map((r) => r.item),
    [searchResultsRaw]
  );

  const searchHighlights = useMemo(() => {
    const map = new Map<string, FuseResultMatch[]>();
    for (const r of searchResultsRaw) {
      if (r.matches) map.set(r.item.id, r.matches as FuseResultMatch[]);
    }
    return map;
  }, [searchResultsRaw]);

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

  // SSR icon mapping for Skapa Tabs (mobile nav)
  const ssrIconMap: Record<string, unknown> = {
    compass: compassIcon,
    microphone: microphoneIcon,
    sparkles: sparklesIcon,
    settings: settingsIcon,
    layout: layoutIcon,
    pencil: pencilIcon,
    gavel: gavelIcon,
    "shield-checkmark": shieldIcon,
    "checkmark-circle": checkCircleIcon,
    tag: tagIcon,
  };

  // Category scroll-spy items for IntersectionObserver
  const categorySpyItems = useMemo(
    () => categories.map((c) => ({ id: c.id, label: c.name })),
    [categories]
  );

  const handleCategoryChange = useCallback((id: string) => setActiveCategory(id), []);

  useScrollSpy(activeCategory, handleCategoryChange, categorySpyItems, {
    prefix: "category-",
    rootMargin: "-100px 0px -66% 0px",
  });

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
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-[24px] py-6 md:px-4 md:py-12">
          <div>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-sk-primary md:text-5xl">Designing AI</h1>
            <p className="max-w-none text-lg leading-relaxed text-sk-text-muted md:text-xl lg:whitespace-nowrap">
              Foundational elements and interactions for AI-enabled experiences
            </p>
          </div>
          <div className="w-full md:max-w-sm">
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

      <div className="container mx-auto px-[24px] py-12 md:px-4 md:py-14">
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
                  matches={searchHighlights.get(pattern.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Category browsing view */
          <div>
            {/* Mobile horizontal category tab bar */}
            <div className="mobile-tabs sticky top-0 z-10 -mx-[24px] mb-[24px] bg-white lg:hidden">
              <Tabs
                tabs={sidebarItems.map((item) => {
                  const iconName = resolveIcon(categories.find(c => c.id === item.id)?.icon ?? "");
                  return (
                    <Tab
                      key={item.id}
                      text={item.label}
                      tabPanelId={`category-${item.id}`}
                      ssrIcon={iconName ? ssrIconMap[iconName] as never : undefined}
                      onClick={() => { scrollToCategory(item.id); return true; }}
                    />
                  );
                })}
                activeTab={activeCategory ? `category-${activeCategory}` : undefined}
                tabPanels={[]}
                ariaLabel="Categories"
              />
            </div>

            <div className="flex gap-8">
              <div className="hidden lg:block">
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
              </div>

              <main className="flex-1 min-w-0">
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
          </div>
        )}
      </div>
    </div>
  );
}
