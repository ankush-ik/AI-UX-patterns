import { getCategories, getPatternsByCategory } from "@/lib/patternRepository";
import { HomePageClient } from "@/components/HomePageClient";

export default async function HomePage() {
  const categories = await getCategories();

  // Fetch all patterns for all categories
  const categoryData = await Promise.all(
    categories.map(async (category) => ({
      category,
      patterns: await getPatternsByCategory(category.id),
    }))
  );

  return (
    <HomePageClient
      categories={categories}
      categoryData={categoryData}
    />
  );
}
