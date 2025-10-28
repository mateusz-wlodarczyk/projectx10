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
import { Search, X } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "boat_name" | "manufacturer" | "model" | "location";
  count?: number;
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  loading: boolean;
  placeholder: string;
  currentQuery: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  suggestions,
  loading,
  placeholder,
  currentQuery,
}) => {
  const [searchTerm, setSearchTerm] = React.useState(currentQuery);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  React.useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  const handleSearch = () => {
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
    setShowSuggestions(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Search Boats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="pr-20"
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

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
            <div className="p-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{suggestion.text}</span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type.replace("_", " ")}
                    </Badge>
                  </div>
                  {suggestion.count && (
                    <span className="text-xs text-muted-foreground">
                      {suggestion.count} results
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchTerm && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Croatia", "Catamaran", "Beneteau", "Greece"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(term);
                    onSearch(term);
                  }}
                  className="text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchBox;
