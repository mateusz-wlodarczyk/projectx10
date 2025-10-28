"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

interface SearchQuery {
  term: string;
  filters: any;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: Date;
  lastUsed: Date;
  resultCount: number;
}

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onSaveSearch: (search: SearchQuery) => void;
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onRenameSearch: (searchId: string, newName: string) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({
  savedSearches,
  onSaveSearch,
  onLoadSearch,
  onDeleteSearch,
  onRenameSearch,
}) => {
  const [showSaveForm, setShowSaveForm] = React.useState(false);
  const [searchName, setSearchName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");

  const handleSave = () => {
    if (searchName.trim()) {
      // In real implementation, this would save the current search
      const currentSearch: SearchQuery = {
        term: "",
        filters: {},
        sortBy: "relevance",
        sortOrder: "desc",
        page: 1,
        limit: 20,
      };
      onSaveSearch(currentSearch);
      setSearchName("");
      setShowSaveForm(false);
    }
  };

  const handleRename = (searchId: string) => {
    if (editingName.trim()) {
      onRenameSearch(searchId, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  const startEditing = (search: SavedSearch) => {
    setEditingId(search.id);
    setEditingName(search.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4" />
            <span>Saved Searches</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showSaveForm && (
          <div className="mb-4 p-3 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Input
                placeholder="Enter search name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!searchName.trim()}
                >
                  Save Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSaveForm(false);
                    setSearchName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {savedSearches.length === 0 ? (
          <div className="text-center py-4">
            <Bookmark className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No saved searches</p>
            <p className="text-xs text-muted-foreground mt-1">
              Save your searches for quick access
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
              >
                <div className="flex-1 min-w-0">
                  {editingId === search.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleRename(search.id)
                        }
                        className="h-6 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRename(search.id)}
                        disabled={!editingName.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {search.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground truncate">
                          {formatQuery(search.query)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {search.resultCount} results
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last used: {formatDate(search.lastUsed)}
                      </div>
                    </div>
                  )}
                </div>

                {editingId !== search.id && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLoadSearch(search)}
                      className="h-6 w-6 p-0"
                    >
                      <BookmarkCheck className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(search)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSearch(search.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedSearches;
