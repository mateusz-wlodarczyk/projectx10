"use client";

import React from "react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import BoatsHeader from "@/src/components/boats/BoatsHeader";
import BoatsGrid from "@/src/components/boats/BoatsGrid";
import BoatsPagination from "@/src/components/boats/BoatsPagination";
import { BoatsErrorBoundary } from "@/src/components/common/ErrorBoundary";
import { useBoatsPage } from "@/src/hooks/useBoatsPage";
import { useAuth } from "@/src/components/auth/AuthProvider";
import AuthGuard from "@/src/components/auth/AuthGuard";
import { createDashboardUser } from "@/src/lib/user-utils";

export default function BoatsPage() {
  const { user } = useAuth();

  const currentUser = createDashboardUser(user);

  const {
    boats,
    loading,
    error,
    filters,
    pagination,
    summary,
    currentView,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleViewToggle,
    handleBoatClick,
  } = useBoatsPage({ user });

  // Console logs for boats data
  console.log("=== BOATS PAGE: BACKEND DATA ===");
  console.log("Boats array:", boats);
  console.log("Boats count:", boats?.length || 0);
  console.log("Boats loading:", loading);
  console.log("Boats error:", error);
  console.log("Boats filters:", filters);
  console.log("Boats pagination:", pagination);
  console.log("Boats summary:", summary);
  console.log("Boats currentView:", currentView);
  console.log("=== END BOATS PAGE DATA ===");

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout user={currentUser} currentPath="/boats">
        <BoatsErrorBoundary>
          <div className="space-y-6">
            {/* Boats Header */}
            <BoatsHeader
              summary={summary}
              onViewToggle={handleViewToggle}
              onSearch={handleSearch}
              currentView={currentView}
              loading={loading}
              searchQuery={filters.search || ""}
            />

            {/* Main Content */}
            <div className="space-y-6">
              {/* Boats Grid */}
              <BoatsGrid
                boats={boats}
                onBoatClick={handleBoatClick}
                loading={loading}
                error={error}
                view={currentView}
              />
            </div>

            {/* Pagination - Bottom of Page */}
            <div className="border-t pt-6">
              <BoatsPagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 20, 50, 100]}
              />
            </div>
          </div>
        </BoatsErrorBoundary>
      </DashboardLayout>
    </AuthGuard>
  );
}
