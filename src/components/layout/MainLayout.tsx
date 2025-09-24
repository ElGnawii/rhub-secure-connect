import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="h-screen flex bg-background">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={user?.name || ''} userRole={user?.role || ''} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}