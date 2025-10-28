"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Globe, Mail, Navigation } from "lucide-react";

interface BoatLocationData {
  marina: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
  address: string;
  marinaInfo: {
    name: string;
    facilities: string[];
    contact: string;
    website?: string;
  };
}

interface BoatLocationProps {
  location: BoatLocationData;
  onMapInteraction: (action: string) => void;
  onMarinaInfo: () => void;
  loading: boolean;
}

const BoatLocation: React.FC<BoatLocationProps> = ({
  location,
  onMapInteraction,
  onMarinaInfo,
  loading,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Location & Marina</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">{location.marina}</div>
              <div className="text-sm text-muted-foreground">
                {location.address}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Coordinates: {location.coordinates[0]}, {location.coordinates[1]}
          </div>
        </div>

        <Separator />

        {/* Marina Facilities */}
        <div className="space-y-3">
          <h3 className="font-medium">Marina Facilities</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {location.marinaInfo.facilities.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{facility}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="font-medium">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{location.marinaInfo.contact}</span>
            </div>
            {location.marinaInfo.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={location.marinaInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {location.marinaInfo.website}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                info@{location.marina.toLowerCase().replace(/\s+/g, "")}.com
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Map */}
        <div className="space-y-3">
          <h3 className="font-medium">Map</h3>
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">
                  Interactive Map
                </div>
                <div className="text-xs text-muted-foreground">
                  {location.city}, {location.country}
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className="bg-white/80 text-gray-700">
                {location.coordinates[0]}, {location.coordinates[1]}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={() => onMapInteraction("directions")}
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
          <Button variant="outline" onClick={onMarinaInfo} className="w-full">
            View Marina Details
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Marina fees may apply</p>
          <p>• Check-in time: 2:00 PM</p>
          <p>• Check-out time: 10:00 AM</p>
          <p>• Fuel station available</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatLocation;
