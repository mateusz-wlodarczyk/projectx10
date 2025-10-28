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
// import { Slider } from "@/components/ui/slider"; // Slider component not available
import { Calendar, MapPin, Users, Anchor, X } from "lucide-react";

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
    marinas: [];
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

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  category: string;
}

interface SearchFiltersProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  availableOptions: FilterOption[];
  loading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  availableOptions,
  loading,
}) => {
  const [localFilters, setLocalFilters] =
    React.useState<SearchFilterState>(filters);

  const handleFilterChange = (
    section: keyof SearchFilterState,
    field: string,
    value: any
  ) => {
    const sectionData = localFilters[section] || {};
    const updatedFilters = {
      ...localFilters,
      [section]: {
        ...sectionData,
        [field]: value,
      },
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleLocationChange = (
    locationType: string,
    value: string,
    checked: boolean
  ) => {
    const currentValues = localFilters.locations[
      locationType as keyof typeof localFilters.locations
    ] as string[];
    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    handleFilterChange("locations", locationType, updatedValues);
  };

  const handleBoatTypeChange = (value: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...localFilters.boatSpecs.types, value]
      : localFilters.boatSpecs.types.filter((t) => t !== value);

    handleFilterChange("boatSpecs", "types", updatedTypes);
  };

  const handleAmenityChange = (value: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...localFilters.amenities, value]
      : localFilters.amenities.filter((a) => a !== value);

    handleFilterChange("amenities", "amenities", updatedAmenities);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilterState = {
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
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const boatTypes = [
    "Sailboat",
    "Motorboat",
    "Catamaran",
    "Yacht",
    "Boat",
    "Rib",
    "Dinghy",
  ];

  const amenities = [
    "Air Conditioning",
    "WiFi",
    "Kitchen",
    "Bathroom",
    "Deck",
    "Anchor",
    "Life Jackets",
    "GPS",
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={localFilters.dateRange.start.toISOString().split("T")[0]}
                onChange={(e) =>
                  handleFilterChange(
                    "dateRange",
                    "start",
                    new Date(e.target.value)
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={localFilters.dateRange.end.toISOString().split("T")[0]}
                onChange={(e) =>
                  handleFilterChange(
                    "dateRange",
                    "end",
                    new Date(e.target.value)
                  )
                }
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="flexibleDates"
              checked={localFilters.availability.flexibleDates}
              onCheckedChange={(checked) =>
                handleFilterChange("availability", "flexibleDates", checked)
              }
            />
            <Label htmlFor="flexibleDates">Flexible dates</Label>
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Countries</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {countries.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={localFilters.locations.countries.includes(country)}
                    onCheckedChange={(checked) =>
                      handleLocationChange(
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
          </div>
        </CardContent>
      </Card>

      {/* Boat Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Anchor className="h-4 w-4" />
            <span>Boat Specifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Boat Types</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {boatTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.boatSpecs.types.includes(type)}
                    onCheckedChange={(checked) =>
                      handleBoatTypeChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Length (meters)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min length"
                  value={localFilters.boatSpecs.minLength}
                  onChange={(e) =>
                    handleFilterChange(
                      "boatSpecs",
                      "minLength",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  max="50"
                />
                <Input
                  type="number"
                  placeholder="Max length"
                  value={localFilters.boatSpecs.maxLength}
                  onChange={(e) =>
                    handleFilterChange(
                      "boatSpecs",
                      "maxLength",
                      parseInt(e.target.value) || 50
                    )
                  }
                  min="0"
                  max="50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Capacity (people)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min capacity"
                  value={localFilters.boatSpecs.minCapacity}
                  onChange={(e) =>
                    handleFilterChange(
                      "boatSpecs",
                      "minCapacity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  min="1"
                  max="20"
                />
                <Input
                  type="number"
                  placeholder="Max capacity"
                  value={localFilters.boatSpecs.maxCapacity}
                  onChange={(e) =>
                    handleFilterChange(
                      "boatSpecs",
                      "maxCapacity",
                      parseInt(e.target.value) || 20
                    )
                  }
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cabins</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min cabins"
                  value={localFilters.boatSpecs.minCabins}
                  onChange={(e) =>
                    handleFilterChange(
                      "boatSpecs",
                      "minCabins",
                      parseInt(e.target.value) || 1
                    )
                  }
                  min="1"
                  max="10"
                />
                <Input
                  type="number"
                  placeholder="Max cabins"
                  value={localFilters.boatSpecs.maxCabins}
                  onChange={(e) =>
                    handleFilterChange(
                      "boatSpecs",
                      "maxCabins",
                      parseInt(e.target.value) || 10
                    )
                  }
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Price per day</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min price"
                value={localFilters.priceRange.min}
                onChange={(e) =>
                  handleFilterChange(
                    "priceRange",
                    "min",
                    parseInt(e.target.value) || 0
                  )
                }
                min="0"
                max="10000"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={localFilters.priceRange.max}
                onChange={(e) =>
                  handleFilterChange(
                    "priceRange",
                    "max",
                    parseInt(e.target.value) || 10000
                  )
                }
                min="0"
                max="10000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={localFilters.priceRange.currency}
              onValueChange={(value) =>
                handleFilterChange("priceRange", "currency", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CHF">CHF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={localFilters.amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, checked as boolean)
                  }
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="availableOnly"
              checked={localFilters.availability.availableOnly}
              onCheckedChange={(checked) =>
                handleFilterChange("availability", "availableOnly", checked)
              }
            />
            <Label htmlFor="availableOnly">Available only</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;
