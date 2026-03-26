/**
 * Custom hook for resolving icon names to Lucide React components
 * Centralizes icon mapping to avoid duplication across components
 */
import * as Icons from "lucide-react";

const iconMap: Record<string, string> = {
  compass: "Compass",
  zap: "Zap",
  settings: "Settings",
  layout: "Layout",
  edit: "Edit3",
  shield: "Shield",
  "check-circle": "CheckCircle",
  tag: "Tag",
};

export function useIconResolver() {
  const resolveIcon = (iconName: string) => {
    const mappedName = iconMap[iconName];
    if (!mappedName) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Icons as any)[mappedName] || null;
  };

  return { resolveIcon, iconMap };
}
