"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { devLog } from "@/src/lib/devLog";

interface BoatData {
  id: string;
  slug: string;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  category_slug: string;
  marina: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
  price: number;
  currency: string;
  discount: number;
  originalPrice: number;
  reviewsScore: number;
  totalReviews: number;
  views: number;
  thumb: string;
  main_img: string;
  year: number;
  length: number;
  capacity: number;
  cabins: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BoatsGridProps {
  boats: BoatData[];
  onBoatClick: (boat: BoatData) => void;
  loading: boolean;
  error: string | null;
  view: "grid" | "list";
}

const BoatsGrid: React.FC<BoatsGridProps> = ({
  boats,
  onBoatClick,
  loading,
  error,
  view,
}) => {
  devLog("=== BOATSGRID: BOATS BEING RENDERED ===", { boats, boatsLength: boats?.length, loading, error, view });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div
          className="text-lg font-medium text-muted-foreground"
          data-testid="loading-spinner"
        >
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2" data-testid="error-message">
            Error loading boats
          </div>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Safety check: ensure boats is an array
  if (!Array.isArray(boats)) {
    console.error("BoatsGrid: boats is not an array:", boats);
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">Data Error</div>
          <p className="text-muted-foreground">
            Expected boats to be an array, but received: {typeof boats}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Debug info: {JSON.stringify(boats, null, 2)}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (boats.length === 0 && !loading) {
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

  if (view === "list") {
    return (
      <div className="space-y-4">
        {boats.map((boat) => (
          <Card
            key={boat.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onBoatClick(boat)}
          >
            <CardContent className="p-0">
              <div className="flex">
                <div className="relative w-48 h-32 flex-shrink-0">
                  {(boat.thumb && boat.thumb.trim()) ||
                  (boat.main_img && boat.main_img.trim()) ? (
                    <img
                      src={boat.thumb || boat.main_img}
                      alt={boat.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
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
                  <div
                    className="image-placeholder w-full h-full bg-gray-200 flex items-center justify-center"
                    style={{
                      display:
                        (boat.thumb && boat.thumb.trim()) ||
                        (boat.main_img && boat.main_img.trim())
                          ? "none"
                          : "flex",
                    }}
                  >
                    <div className="text-center text-gray-500">
                      <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg">🚤</span>
                      </div>
                      <p className="text-xs">No image</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {boat.title}
                      </h3>

                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {boat.city}, {boat.country}
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-primary">
                        {boat.currency} {boat.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-testid="boats-grid"
    >
      {boats.map((boat) => (
        <Card
          key={boat.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onBoatClick(boat)}
          data-testid="boat-card"
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
            </div>

            <div className="p-4 space-y-2">
              {/* Title */}
              <h3 className="font-semibold text-lg line-clamp-2">
                {boat.title}
              </h3>

              {/* Location */}
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {boat.city}, {boat.country}
                </span>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {boat.currency} {boat.price.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BoatsGrid;
