import type { SVGProps } from "react";

export type SkapaIconName =
  | "close"
  | "add"
  | "trash"
  | "chevron-left"
  | "chevron-right"
  | "compass"
  | "zap"
  | "settings"
  | "grid"
  | "pencil"
  | "shield"
  | "check-circle"
  | "tag";

interface SkapaIconProps extends SVGProps<SVGSVGElement> {
  name: SkapaIconName;
  size?: number;
}

export function SkapaIcon({ name, size = 16, ...props }: SkapaIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  const icons: Record<SkapaIconName, JSX.Element> = {
    close: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    add: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </>
    ),
    "chevron-left": <path d="m15 18-6-6 6-6" />,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    compass: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m14.5 9.5-2.8 1.2-1.2 2.8 2.8-1.2 1.2-2.8Z" />
      </>
    ),
    zap: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
    settings: (
      <>
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path d="M19 12a7.4 7.4 0 0 0-.08-1l2.02-1.57-2-3.46-2.47.86a7.5 7.5 0 0 0-1.73-1L14.36 3h-4.72l-.38 2.83a7.5 7.5 0 0 0-1.73 1l-2.47-.86-2 3.46L5.08 11a7.4 7.4 0 0 0 0 2l-2.02 1.57 2 3.46 2.47-.86a7.5 7.5 0 0 0 1.73 1L9.64 21h4.72l.38-2.83a7.5 7.5 0 0 0 1.73-1l2.47.86 2-3.46L18.92 13c.05-.33.08-.66.08-1Z" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </>
    ),
    pencil: (
      <>
        <path d="m4 20 4.5-1 9-9-3.5-3.5-9 9L4 20Z" />
        <path d="m12.5 6.5 3.5 3.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.8 7.9 7 10 4.2-2.1 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    "check-circle": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    tag: (
      <>
        <path d="M20 10 12 2H4v8l8 8 8-8Z" />
        <circle cx="7.5" cy="7.5" r="1" />
      </>
    ),
  };

  return <svg {...commonProps}>{icons[name]}</svg>;
}
