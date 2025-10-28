"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Users, MapPin, Calendar, Heart, Bookmark } from "lucide-react";

interface RelatedBoat {
  id: string;
  title: string;
  thumb: string;
  price: number;
  currency: string;
  similarity: number;
  manufacturer: string;
  model: string;
}

interface RelatedBoatsProps {
  relatedBoats: RelatedBoat[];
  onRelatedBoatClick: (boat: RelatedBoat) => void;
  loading: boolean;
}

const RelatedBoats: React.FC<RelatedBoatsProps> = ({
  relatedBoats,
  onRelatedBoatClick,
  loading,
}) => {
  const displayBoats = relatedBoats;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-16 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayBoats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Boats</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">No similar boats found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Boats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayBoats.map((boat) => (
          <div
            key={boat.id}
            className="flex space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onRelatedBoatClick(boat)}
          >
            <div className="relative w-16 h-12 flex-shrink-0">
              <img
                src={boat.thumb}
                alt={boat.title}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute top-1 right-1">
                <Badge className="text-xs bg-blue-100 text-blue-800">
                  {boat.similarity}%
                </Badge>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-1">{boat.title}</h4>
              <p className="text-xs text-muted-foreground">
                {boat.manufacturer} {boat.model}
              </p>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm font-semibold text-blue-600">
                  {boat.currency} {boat.price.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">4.5</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Separator />

        <Button variant="outline" className="w-full">
          View All Similar Boats
        </Button>
      </CardContent>
    </Card>
  );
};

export default RelatedBoats;
