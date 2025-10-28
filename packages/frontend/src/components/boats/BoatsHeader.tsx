"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Grid, List, Search, X } from "lucide-react";

interface BoatsSummary {
  total: number;
  filtered: number;
  currentPage: number;
  totalPages: number;
  hasFilters: boolean;
  searchQuery?: string;
}

interface BoatsHeaderProps {
  summary: BoatsSummary;
  onViewToggle: (view: "grid" | "list") => void;
  onSearch: (query: string) => void;
  currentView: "grid" | "list";
  loading: boolean;
  searchQuery: string;
}

const BoatsHeader: React.FC<BoatsHeaderProps> = ({
  summary,
  onViewToggle,
  onSearch,
  currentView,
  loading,
  searchQuery,
}) => {
  const [searchTerm, setSearchTerm] = React.useState(searchQuery);

  React.useEffect(() => {
    console.log("🔍 BoatsHeader: searchQuery changed to:", searchQuery);
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Debounced search effect - trigger for both empty and non-empty strings
  React.useEffect(() => {
    console.log("🔍 BoatsHeader: searchTerm changed to:", searchTerm);
    const timeoutId = setTimeout(() => {
      console.log("🔍 BoatsHeader: Auto-triggering search for:", searchTerm);
      onSearch(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // Remove onSearch from dependencies to prevent infinite loop

  const handleSearch = () => {
    console.log("🔍 BoatsHeader: handleSearch called with:", searchTerm);
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    console.log("🔍 BoatsHeader: clearSearch called");
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            data-testid="boats-header"
          >
            Boats
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of boats and yachts
          </p>
        </div>
      </div>

      {/* Summary and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{summary.total} boats</h3>
                {summary.searchQuery && (
                  <Badge variant="secondary">"{summary.searchQuery}"</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Page {summary.currentPage} of {summary.totalPages}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Box */}
              <div className="relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by boat name..."
                  className="w-64 pr-20"
                  data-testid="search-input"
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    disabled={loading}
                    className="h-6 px-2"
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* View Toggle */}
              <div
                className="flex items-center space-x-1 border rounded-lg p-1"
                data-testid="view-toggle"
              >
                <Button
                  variant={currentView === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewToggle("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentView === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewToggle("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoatsHeader;
