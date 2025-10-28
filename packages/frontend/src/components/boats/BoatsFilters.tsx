"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, X, MapPin, Calendar, Anchor } from "lucide-react";

interface BoatsFilterState {
  search: string;
  countries: string[];
  regions: string[];
  cities: string[];
  marinas: string[];
  categories: string[];
  manufacturers: string[];
  priceRange: {
    min: number;
    max: number;
  };
  yearRange: {
    min: number;
    max: number;
  };
  availability: {
    availableOnly: boolean;
    featuredOnly: boolean;
  };
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  category: string;
}

interface BoatsFiltersProps {
  filters: BoatsFilterState;
  onFilterChange: (filters: BoatsFilterState) => void;
  availableOptions: FilterOption[];
  loading: boolean;
}

const BoatsFilters: React.FC<BoatsFiltersProps> = ({
  filters,
  onFilterChange,
  availableOptions,
  loading,
}) => {
  const [localFilters, setLocalFilters] =
    React.useState<BoatsFilterState>(filters);

  const handleFilterChange = (field: keyof BoatsFilterState, value: any) => {
    const updatedFilters = {
      ...localFilters,
      [field]: value,
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleArrayFilterChange = (
    field: keyof BoatsFilterState,
    value: string,
    checked: boolean
  ) => {
    const currentValues = localFilters[field] as string[];
    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    handleFilterChange(field, updatedValues);
  };

  const clearFilters = () => {
    const clearedFilters: BoatsFilterState = {
      search: "",
      countries: [],
      regions: [],
      cities: [],
      marinas: [],
      categories: [],
      manufacturers: [],
      priceRange: {
        min: 0,
        max: 10000,
      },
      yearRange: {
        min: 1990,
        max: 2024,
      },
      availability: {
        availableOnly: false,
        featuredOnly: false,
      },
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const boatCategories = [
    "Sailboat",
    "Motorboat",
    "Catamaran",
    "Yacht",
    "Boat",
    "Rib",
    "Dinghy",
    "Cruiser",
  ];

  const manufacturers = [
    "Beneteau",
    "Jeanneau",
    "Bavaria",
    "Dufour",
    "Sunseeker",
    "Princess",
    "Azimut",
    "Ferretti",
  ];

  const countries = [
    "Croatia",
    "Greece",
    "Italy",
    "Spain",
    "France",
    "Turkey",
    "Malta",
    "Cyprus",
    "Portugal",
  ];

  const hasActiveFilters = () => {
    return (
      localFilters.countries.length > 0 ||
      localFilters.categories.length > 0 ||
      localFilters.manufacturers.length > 0 ||
      localFilters.priceRange.min > 0 ||
      localFilters.priceRange.max < 10000 ||
      localFilters.yearRange.min > 1990 ||
      localFilters.yearRange.max < 2024 ||
      localFilters.availability.availableOnly ||
      localFilters.availability.featuredOnly
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </h3>
        {hasActiveFilters() && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Availability Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="availableOnly">Available Only</Label>
              <p className="text-sm text-muted-foreground">
                Show only available boats
              </p>
            </div>
            <Switch
              id="availableOnly"
              checked={localFilters.availability.availableOnly}
              onCheckedChange={(checked) =>
                handleFilterChange("availability", {
                  ...localFilters.availability,
                  availableOnly: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="featuredOnly">Featured Only</Label>
              <p className="text-sm text-muted-foreground">
                Show only featured boats
              </p>
            </div>
            <Switch
              id="featuredOnly"
              checked={localFilters.availability.featuredOnly}
              onCheckedChange={(checked) =>
                handleFilterChange("availability", {
                  ...localFilters.availability,
                  featuredOnly: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Anchor className="h-4 w-4" />
            <span>Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {boatCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={localFilters.categories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange(
                      "categories",
                      category,
                      checked as boolean
                    )
                  }
                />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manufacturers */}
      <Card>
        <CardHeader>
          <CardTitle>Manufacturers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {manufacturers.map((manufacturer) => (
              <div key={manufacturer} className="flex items-center space-x-2">
                <Checkbox
                  id={`manufacturer-${manufacturer}`}
                  checked={localFilters.manufacturers.includes(manufacturer)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange(
                      "manufacturers",
                      manufacturer,
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor={`manufacturer-${manufacturer}`}
                  className="text-sm"
                >
                  {manufacturer}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {countries.map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={localFilters.countries.includes(country)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange(
                      "countries",
                      country,
                      checked as boolean
                    )
                  }
                />
                <Label htmlFor={`country-${country}`} className="text-sm">
                  {country}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priceMin">Min Price (EUR)</Label>
              <Input
                id="priceMin"
                type="number"
                value={localFilters.priceRange.min}
                onChange={(e) =>
                  handleFilterChange("priceRange", {
                    ...localFilters.priceRange,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceMax">Max Price (EUR)</Label>
              <Input
                id="priceMax"
                type="number"
                value={localFilters.priceRange.max}
                onChange={(e) =>
                  handleFilterChange("priceRange", {
                    ...localFilters.priceRange,
                    max: parseInt(e.target.value) || 10000,
                  })
                }
                min="0"
                max="10000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Year Range */}
      <Card>
        <CardHeader>
          <CardTitle>Year Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="yearMin">Min Year</Label>
              <Input
                id="yearMin"
                type="number"
                value={localFilters.yearRange.min}
                onChange={(e) =>
                  handleFilterChange("yearRange", {
                    ...localFilters.yearRange,
                    min: parseInt(e.target.value) || 1990,
                  })
                }
                min="1990"
                max="2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearMax">Max Year</Label>
              <Input
                id="yearMax"
                type="number"
                value={localFilters.yearRange.max}
                onChange={(e) =>
                  handleFilterChange("yearRange", {
                    ...localFilters.yearRange,
                    max: parseInt(e.target.value) || 2024,
                  })
                }
                min="1990"
                max="2024"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoatsFilters;
