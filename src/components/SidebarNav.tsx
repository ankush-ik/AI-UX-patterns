/**
 * Reusable SidebarNav component
 * Used on both home page (with icons) and detail page (tabs only)
 */
import { cn } from "@/utils/cn";

interface SidebarNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export function SidebarNav({
  items,
  activeItem,
  onItemClick,
}: SidebarNavProps) {
  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="sticky top-4 space-y-1">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm",
                activeItem === item.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {IconComponent && (
                <IconComponent className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
