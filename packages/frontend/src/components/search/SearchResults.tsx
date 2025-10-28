"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, Star, MapPin, Users, Calendar } from "lucide-react";

interface BoatSearchResult {
  id: string;
  slug: string;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  marina: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
  price: number;
  currency: string;
  discount: number;
  originalPrice: number;
  thumb: string;
  main_img: string;
  views: number;
  reviewsScore: number;
  totalReviews: number;
  availability: {
    available: boolean;
    nextAvailableDate?: Date;
  };
  specifications: {
    length: number;
    capacity: number;
    cabins: number;
    year: number;
  };
  isFavorite: boolean;
  isBookmarked: boolean;
}

interface SearchResultsProps {
  results: BoatSearchResult[];
  loading: boolean;
  error: string | null;
  onBoatClick: (boat: BoatSearchResult) => void;
  onToggleFavorite: (boatId: string) => void;
  onToggleBookmark: (boatId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  onBoatClick,
  onToggleFavorite,
  onToggleBookmark,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-48 h-32 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">Error loading results</div>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground mb-4">No boats found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {results.length} boat{results.length !== 1 ? "s" : ""} found
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((boat) => (
          <Card
            key={boat.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-0">
              <div className="relative">
                {(boat.thumb && boat.thumb.trim()) ||
                (boat.main_img && boat.main_img.trim()) ? (
                  <img
                    src={
                      (boat.thumb && boat.thumb.trim()) ||
                      (boat.main_img && boat.main_img.trim()) ||
                      ""
                    }
                    alt={boat.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      // Show placeholder when image fails to load
                      const placeholder =
                        e.currentTarget.parentElement?.querySelector(
                          ".image-placeholder"
                        );
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                {/* Loading/placeholder state when no image URL or image fails to load */}
                <div
                  className="image-placeholder w-full h-48 bg-gray-200 flex items-center justify-center"
                  style={{
                    display:
                      (boat.thumb && boat.thumb.trim()) ||
                      (boat.main_img && boat.main_img.trim())
                        ? "none"
                        : "flex",
                  }}
                >
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🚤</span>
                    </div>
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(boat.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${boat.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(boat.id);
                    }}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${boat.isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
                {boat.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    -{boat.discount}%
                  </Badge>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div onClick={() => onBoatClick(boat)}>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {boat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {boat.manufacturer} {boat.model}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {boat.city}, {boat.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{boat.specifications.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {boat.reviewsScore}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({boat.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {boat.currency} {boat.price.toLocaleString()}
                    </div>
                    {boat.originalPrice > boat.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        {boat.currency} {boat.originalPrice.toLocaleString()}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">per day</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        boat.availability.available ? "default" : "secondary"
                      }
                    >
                      {boat.availability.available
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                    {!boat.availability.available &&
                      boat.availability.nextAvailableDate && (
                        <span className="text-xs text-muted-foreground">
                          Next:{" "}
                          {boat.availability.nextAvailableDate.toLocaleDateString()}
                        </span>
                      )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {boat.views} views
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => onBoatClick(boat)}
                  disabled={!boat.availability.available}
                >
                  {boat.availability.available
                    ? "View Details"
                    : "Check Availability"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
