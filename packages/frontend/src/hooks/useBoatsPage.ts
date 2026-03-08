import { useState, useCallback, useMemo } from "react";
import { useBoatsData } from "@/src/hooks/useBoatsData";
import { useBoatNavigation } from "@/src/hooks/useNavigation";
import { devLog } from "@/src/lib/devLog";

interface UseBoatsPageProps {
  user: any;
}

export const useBoatsPage = ({ user }: UseBoatsPageProps) => {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

  const boatsData = useBoatsData();
  const { goToBoatDetails } = useBoatNavigation();

  devLog("=== USEBOATSPAGE HOOK: BACKEND DATA ===", boatsData);
  devLog("=== END USEBOATSPAGE HOOK DATA ===");

  const handleSearch = useCallback(
    (query: string) => {
      boatsData.updateFilters({ search: query });
    },
    [boatsData]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      boatsData.updatePagination({ currentPage: page });
    },
    [boatsData]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      boatsData.updatePagination({ itemsPerPage: size, currentPage: 1 });
    },
    [boatsData]
  );

  const handleViewToggle = useCallback((view: "grid" | "list") => {
    setCurrentView(view);
  }, []);

  const handleBoatClick = useCallback(
    (boat: any) => {
      goToBoatDetails(boat.id);
    },
    [goToBoatDetails]
  );

  const summary = useMemo(
    () => ({
      total: boatsData.pagination.totalItems,
      filtered: boatsData.boats.length,
      currentPage: boatsData.pagination.currentPage,
      totalPages: boatsData.pagination.totalPages,
      hasFilters: Object.keys(boatsData.filters).length > 0,
      searchQuery: boatsData.filters.search || "",
    }),
    [
      boatsData.pagination.totalItems,
      boatsData.boats.length,
      boatsData.pagination.currentPage,
      boatsData.pagination.totalPages,
      boatsData.filters,
    ]
  );

  return {
    // Data
    boats: boatsData.boats,
    loading: boatsData.loading,
    error: boatsData.error,
    filters: boatsData.filters,
    pagination: boatsData.pagination,
    summary,
    currentView,

    // Actions
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleViewToggle,
    handleBoatClick,
    refreshData: boatsData.refreshData,
  };
};
