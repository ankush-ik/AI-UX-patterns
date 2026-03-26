/**
 * PatternCard component
 * Displays a pattern as a card with thumbnail, title, and description
 * Used in grid layouts on the home page
 */
import Image from "next/image";
import Link from "next/link";

interface PatternCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export function PatternCard({
  id,
  title,
  description,
  thumbnail,
}: PatternCardProps) {
  return (
    <Link href={`/patterns/${id}`} className="group block">
      <div className="h-full border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 bg-white">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
