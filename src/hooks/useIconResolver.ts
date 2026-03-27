/**
 * Custom hook for resolving category icon keys to Skapa icon names.
 */
import type { SkapaIconName } from "@/components/SkapaIcon";

const iconMap: Record<string, SkapaIconName> = {
  compass: "compass",
  zap: "zap",
  settings: "settings",
  layout: "grid",
  edit: "pencil",
  shield: "shield",
  "check-circle": "check-circle",
  tag: "tag",
};

export function useIconResolver() {
  const resolveIcon = (iconName: string): SkapaIconName | null => iconMap[iconName] ?? null;

  return { resolveIcon, iconMap };
}
