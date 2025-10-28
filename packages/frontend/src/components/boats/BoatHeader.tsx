"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Star, MapPin, Calendar } from "lucide-react";

interface BoatBasicInfo {
  id: string;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  thumb: string;
  reviewsScore: number;
  totalReviews: number;
  priceFrom: number;
  currency: string;
}

interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

interface BoatHeaderProps {
  boat: BoatBasicInfo;
  onBack: () => void;
  onShare: () => void;
  breadcrumbs: Breadcrumb[];
  loading: boolean;
}

const BoatHeader: React.FC<BoatHeaderProps> = ({
  boat,
  onBack,
  onShare,
  breadcrumbs,
  loading,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span>/</span>}
            {breadcrumb.current ? (
              <span className="text-foreground font-medium">
                {breadcrumb.label}
              </span>
            ) : (
              <a
                href={breadcrumb.href}
                className="hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Boat Title and Basic Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {boat.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {boat.manufacturer} {boat.model} • {boat.category}
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{boat.reviewsScore}</span>
                  <span className="text-muted-foreground">
                    ({boat.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Croatia, Split</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">2020</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {boat.currency} {boat.priceFrom.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">per day</div>
              <Badge className="mt-2 bg-green-100 text-green-800">
                Available
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoatHeader;
