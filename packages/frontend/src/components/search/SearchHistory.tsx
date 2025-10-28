"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2, Search } from "lucide-react";

interface SearchQuery {
  term: string;
  filters: any;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

interface SearchHistoryItem {
  id: string;
  query: SearchQuery;
  timestamp: Date;
  resultCount: number;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onHistorySelect: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  maxItems: number;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onHistorySelect,
  onClearHistory,
  maxItems,
}) => {
  const displayHistory = history.slice(0, maxItems);

  const formatQuery = (query: SearchQuery) => {
    if (query.term) {
      return query.term;
    }
    const filters = [];
    if (query.filters?.locations?.countries?.length > 0) {
      filters.push(query.filters.locations.countries.join(", "));
    }
    if (query.filters?.boatSpecs?.types?.length > 0) {
      filters.push(query.filters.boatSpecs.types.join(", "));
    }
    return filters.length > 0 ? filters.join(" | ") : "Advanced search";
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Search History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No search history yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your recent searches will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Search History</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
              onClick={() => onHistorySelect(item)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {formatQuery(item.query)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {item.resultCount} results
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        {history.length > maxItems && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Showing {maxItems} of {history.length} searches
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
