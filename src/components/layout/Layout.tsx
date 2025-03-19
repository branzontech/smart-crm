
import { ReactNode } from "react";
import { Header } from "./Header";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 pt-[var(--header-height)] ml-[var(--sidebar-width,5rem)] transition-all duration-300 main-container w-full overflow-x-hidden overflow-y-auto">
          <div className="max-w-full p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
