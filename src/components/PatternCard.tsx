/**
 * PatternCard component
 * Displays a pattern as a card with thumbnail, title, and description
 * Used in grid layouts on the home page
 */
import Image from "next/image";
import Link from "next/link";
import type { FuseResultMatch } from "fuse.js";

function highlightText(text: string, matches: FuseResultMatch[] | undefined, key: string): React.ReactNode {
  if (!matches) return text;
  const fieldMatch = matches.find((m) => m.key === key);
  if (!fieldMatch || !fieldMatch.indices.length) return text;

  // Merge overlapping indices
  const sorted = [...fieldMatch.indices].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (cursor < start) parts.push(text.slice(cursor, start));
    parts.push(<mark key={start} className="bg-yellow-200 text-inherit">{text.slice(start, end + 1)}</mark>);
    cursor = end + 1;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

interface PatternCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  matches?: FuseResultMatch[];
}

export function PatternCard({
  id,
  title,
  description,
  thumbnail,
  matches,
}: PatternCardProps) {
  const cleanTitle = title.trim().replace(/\.+$/, "");
  const cleanDescription = description.trim().replace(/\.+$/, "");

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
          <h3 className="mb-2 text-xl font-semibold leading-tight text-sk-primary transition-colors group-hover:text-sk-primary-strong md:text-2xl">
            {highlightText(cleanTitle, matches, "title")}
          </h3>
          <p className="text-base leading-relaxed text-sk-primary md:text-lg">{highlightText(cleanDescription, matches, "description")}</p>
        </div>
      </div>
    </Link>
  );
}
