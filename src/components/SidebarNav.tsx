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
  footer?: React.ReactNode;
}

export function SidebarNav({
  items,
  activeItem,
  onItemClick,
  footer,
}: SidebarNavProps) {
  return (
    <aside className="w-72 flex-shrink-0">
      <nav className="sticky top-4 flex flex-col">
        <div className="space-y-2">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 text-left text-base transition-colors md:text-lg",
                  activeItem === item.id
                    ? "bg-[var(--sk-color-primary)] text-[var(--sk-color-on-primary)]"
                    : "text-sk-text hover:bg-[var(--sk-color-surface-muted)]"
                )}
              >
                {IconComponent && (
                  <IconComponent className="h-6 w-6 flex-shrink-0 md:h-7 md:w-7" />
                )}
                <span className="font-semibold leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
        {footer && (
          <div className="mt-8 border-t border-sk-border pt-4">
            {footer}
          </div>
        )}
      </nav>
    </aside>
  );
}
