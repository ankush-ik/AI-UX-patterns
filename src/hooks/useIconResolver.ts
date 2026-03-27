/**
 * Custom hook for resolving category icon keys to Skapa icon names.
 */
export type CategoryIconName =
  | "compass"
  | "microphone"
  | "sparkles"
  | "settings"
  | "layout"
  | "pencil"
  | "gavel"
  | "shield-checkmark"
  | "checkmark-circle"
  | "tag";

const iconMap: Record<string, CategoryIconName> = {
  compass: "compass",
  mic: "microphone",
  voice: "microphone",
  microphone: "microphone",
  zap: "sparkles",
  sparkles: "sparkles",
  settings: "settings",
  layout: "layout",
  grid: "layout",
  edit: "pencil",
  pencil: "pencil",
  gavel: "gavel",
  shield: "shield-checkmark",
  "shield-checkmark": "shield-checkmark",
  "check-circle": "checkmark-circle",
  "checkmark-circle": "checkmark-circle",
  tag: "tag",
};

export function useIconResolver() {
  const resolveIcon = (iconName: string): CategoryIconName | null => iconMap[iconName] ?? null;

  return { resolveIcon, iconMap };
}
