'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
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

  const sidebarItems = categories.map((category) => ({
    id: category.id,
    label: category.name,
    icon: resolveIcon(category.icon),
  }));

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto flex flex-wrap items-start justify-between gap-4 px-4 py-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">AI Design Patterns</h1>
            <p className="text-gray-500">
              Foundational elements and interactions to help us design for AI-enabled interfaces
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
          >
            Content admin
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <SidebarNav
            items={sidebarItems}
            activeItem={activeCategory}
            onItemClick={scrollToCategory}
          />

          {/* Main Content */}
          <main className="flex-1">
            {categoryData.map(({ category, patterns }) => (
              <section
                key={category.id}
                id={`category-${category.id}`}
                className="mb-16 scroll-mt-20"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">{category.name}</h2>
                  <p className="text-gray-500">{category.description}</p>
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
    </div>
  );
}
