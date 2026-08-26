import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

export const Badge = ({ children }: BadgeProps) => {
  return (
    <li className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600">
      {children}
    </li>
  );
};
