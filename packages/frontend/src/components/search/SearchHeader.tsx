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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, Users, Anchor } from "lucide-react";

interface SearchQuery {
  term: string;
  filters: SearchFilterState;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

interface SearchFilterState {
  dateRange: {
    start: Date;
    end: Date;
  };
  boatName: string;
  locations: {
    countries: string[];
    regions: string[];
    cities: string[];
    marinas: string[];
  };
  boatSpecs: {
    types: string[];
    minLength: number;
    maxLength: number;
    minCapacity: number;
    maxCapacity: number;
    minCabins: number;
    maxCabins: number;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  availability: {
    availableOnly: boolean;
    flexibleDates: boolean;
  };
  amenities: string[];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "boat_name" | "location" | "manufacturer" | "model";
  count?: number;
  category: string;
}

interface SearchHeaderProps {
  onSearch: (query: SearchQuery) => void;
  suggestions: SearchSuggestion[];
  loading: boolean;
  initialQuery?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  suggestions,
  loading,
  initialQuery = "",
}) => {
  const [searchTerm, setSearchTerm] = React.useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("relevance");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const handleSearch = () => {
    const query: SearchQuery = {
      term: searchTerm,
      filters: {
        dateRange: {
          start: new Date(),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        boatName: "",
        locations: {
          countries: [],
          regions: [],
          cities: [],
          marinas: [],
        },
        boatSpecs: {
          types: [],
          minLength: 0,
          maxLength: 100,
          minCapacity: 1,
          maxCapacity: 20,
          minCabins: 1,
          maxCabins: 10,
        },
        priceRange: {
          min: 0,
          max: 10000,
          currency: "EUR",
        },
        availability: {
          availableOnly: true,
          flexibleDates: false,
        },
        amenities: [],
      },
      sortBy,
      sortOrder,
      page: 1,
      limit: 20,
    };
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    handleSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Boats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Search for boats, locations, manufacturers..."
                className="pr-10"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={handleSearch}
                disabled={loading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
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
        </CardContent>
      </Card>

      {/* Search Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="sortBy">Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="sortOrder">Order:</Label>
            <Select
              value={sortOrder}
              onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Flexible dates</span>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
