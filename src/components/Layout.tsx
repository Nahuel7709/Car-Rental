import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-8xl mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};
