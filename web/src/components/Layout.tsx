import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-900">
      <Header />
      <main className="max-w-8xl mx-auto w-full flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
