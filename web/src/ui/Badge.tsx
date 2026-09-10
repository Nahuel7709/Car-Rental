import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "brand" | "solid";
};

const tones = {
  neutral: "border border-ink-200 bg-white text-ink-700",
  brand: "border border-brand-200 bg-brand-50 text-brand-700",
  solid: "border border-white/20 bg-ink-900/75 text-white backdrop-blur-sm",
};

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};
