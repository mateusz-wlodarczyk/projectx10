"use client";

import React from "react";
import NavigationBar from "./NavigationBar";
import { UserRole } from "../../types/dashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  user?: UserRole | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath = "/dashboard",
  user = null,
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <NavigationBar
        user={user}
        currentPath={currentPath}
        onNavigate={(path: string) => {
          // Handle navigation logic
          console.log("Navigate to:", path);
        }}
      />

      {/* Main Content */}
      <main className="h-[calc(100vh-64px)] overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
