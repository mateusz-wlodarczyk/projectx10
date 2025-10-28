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
import { Separator } from "@/components/ui/separator";
import {
  Anchor,
  Users,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
} from "lucide-react";

interface BoatDetailsData {
  _id: string;
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
  priceFrom: number;
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

interface USP {
  name: string;
  icon: string;
  provider: string;
}

interface BoatDetailsProps {
  details: BoatDetailsData;
  onFeatureToggle: (feature: string) => void;
  onUSPClick: (usp: USP) => void;
  loading: boolean;
}

const BoatDetails: React.FC<BoatDetailsProps> = ({
  details,
  onFeatureToggle,
  onUSPClick,
  loading,
}) => {
  const [expandedFeatures, setExpandedFeatures] = React.useState<string[]>([]);

  const toggleFeature = (feature: string) => {
    setExpandedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
    onFeatureToggle(feature);
  };

  const features = [
    {
      id: "description",
      title: "Description",
      content: `The ${details.title} is a modern ${details.category.toLowerCase()} perfect for exploring the beautiful Croatian coastline. With ${details.capacity} berths and ${details.cabins} cabins, this vessel offers comfort and space for your sailing adventure.`,
      expanded: expandedFeatures.includes("description"),
    },
    {
      id: "amenities",
      title: "Amenities",
      content:
        "Air conditioning, WiFi, Kitchen, Bathroom, Deck, Anchor, Life jackets, GPS, Radio, Refrigerator, Stove, Sink, Shower, Toilet",
      expanded: expandedFeatures.includes("amenities"),
    },
    {
      id: "included",
      title: "What's Included",
      content:
        "Fuel, Water, Electricity, Bedding, Towels, Kitchen utensils, Safety equipment, Navigation charts, First aid kit",
      expanded: expandedFeatures.includes("included"),
    },
    {
      id: "not-included",
      title: "Not Included",
      content:
        "Food and drinks, Personal items, Travel insurance, Marina fees, Tourist tax",
      expanded: expandedFeatures.includes("not-included"),
    },
  ];

  const usps: USP[] = [
    { name: "Free Cancellation", icon: "cancel", provider: "system" },
    { name: "Best Price Guarantee", icon: "price", provider: "system" },
    { name: "24/7 Support", icon: "support", provider: "system" },
    { name: "Instant Confirmation", icon: "confirm", provider: "system" },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Anchor className="h-5 w-5" />
          <span>Boat Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Information */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">Capacity</div>
              <div className="text-sm text-muted-foreground">
                {details.capacity} people
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">Year</div>
              <div className="text-sm text-muted-foreground">
                {details.year}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Anchor className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">Length</div>
              <div className="text-sm text-muted-foreground">
                {details.length}m
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">Location</div>
              <div className="text-sm text-muted-foreground">
                {details.city}, {details.country}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* USP Highlights */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Why Choose This Boat</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {usps.map((usp) => (
              <div
                key={usp.name}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onUSPClick(usp)}
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">{usp.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Expandable Features */}
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="border rounded-lg">
              <button
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                onClick={() => toggleFeature(feature.id)}
              >
                <h3 className="font-medium">{feature.title}</h3>
                <span
                  className={`transform transition-transform ${feature.expanded ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {feature.expanded && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">
                    {feature.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reviews Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">
                {details.reviewsScore}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {details.totalReviews} reviews
            </div>
            <div className="text-sm text-muted-foreground">
              {details.views} views
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatDetails;
