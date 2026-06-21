import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const showSidebar = location.startsWith("/topics");

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-10">
        {showSidebar && <Sidebar />}
        <main className={`flex w-full flex-col overflow-hidden ${!showSidebar ? "md:col-span-2 lg:col-span-2" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
