import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

export const Button = ({children}:ButtonProps) => {
  return (
    <button className="w-full cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-300">
      {children}
    </button>
  );
};
