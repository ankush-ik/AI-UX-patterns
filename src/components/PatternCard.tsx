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
      <div className="h-full overflow-hidden border border-sk-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-sk-surface-muted">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="mb-2 text-skapa-h4 text-sk-primary transition-colors group-hover:text-sk-primary-strong">
            {title}
          </h3>
          <p className="text-skapa-body-sm text-sk-text-muted">{description}</p>
        </div>
      </div>
    </Link>
  );
}
