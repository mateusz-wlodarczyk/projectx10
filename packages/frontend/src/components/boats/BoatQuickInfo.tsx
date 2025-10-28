"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Euro, Star, Eye, TrendingUp, Phone, Mail } from "lucide-react";

interface BoatQuickInfoData {
  priceFrom: number;
  currency: string;
  discount: number | null;
  isAvailable: boolean;
  reviewsScore: number;
  totalReviews: number;
  views: number;
  rank: number;
  isNew: boolean;
  charter: string;
  charterRank: {
    place: number;
    country: string;
    score: number;
    out_of: number;
    count: number;
  };
}

interface BoatQuickInfoProps {
  quickInfo: BoatQuickInfoData;
  onQuickAction: (action: string) => void;
  onContact: () => void;
  loading: boolean;
}

const BoatQuickInfo: React.FC<BoatQuickInfoProps> = ({
  quickInfo,
  onQuickAction,
  onContact,
  loading,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Euro className="h-5 w-5" />
          <span>Quick Info</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {quickInfo.currency} {quickInfo.priceFrom.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">per day</div>
          {quickInfo.discount && (
            <Badge className="mt-2 bg-red-100 text-red-800">
              -{quickInfo.discount}% OFF
            </Badge>
          )}
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={quickInfo.isAvailable ? "default" : "secondary"}>
              {quickInfo.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ranking</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">#{quickInfo.rank}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Views</span>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{quickInfo.views}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Reviews */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rating</span>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {quickInfo.reviewsScore}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reviews</span>
            <span className="text-sm text-muted-foreground">
              {quickInfo.totalReviews}
            </span>
          </div>
        </div>

        <Separator />

        {/* Charter Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Charter</span>
            <span className="text-sm font-medium">{quickInfo.charter}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Charter Rating</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {quickInfo.charterRank.score}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Charter Rank</span>
            <span className="text-sm text-muted-foreground">
              #{quickInfo.charterRank.place} in {quickInfo.charterRank.country}
            </span>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button onClick={() => onQuickAction("book")} className="w-full">
            Book Now
          </Button>
          <Button
            variant="outline"
            onClick={() => onQuickAction("inquiry")}
            className="w-full"
          >
            Send Inquiry
          </Button>
          <Button
            variant="outline"
            onClick={() => onQuickAction("favorite")}
            className="w-full"
          >
            Add to Favorites
          </Button>
        </div>

        <Separator />

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Contact</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={onContact}
              className="w-full justify-start"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Charter
            </Button>
            <Button
              variant="outline"
              onClick={onContact}
              className="w-full justify-start"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        {quickInfo.isNew && (
          <Badge className="w-full justify-center bg-green-100 text-green-800">
            New Listing
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default BoatQuickInfo;
