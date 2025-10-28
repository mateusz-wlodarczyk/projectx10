"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ZoomIn, Grid3X3 } from "lucide-react";

interface BoatImage {
  id: string;
  url: string;
  alt: string;
  thumbnail: string;
  isMain: boolean;
  order: number;
}

interface BoatImageGalleryProps {
  images: BoatImage[];
  onImageSelect: (image: BoatImage) => void;
  loading: boolean;
  error: string | null;
}

const BoatImageGallery: React.FC<BoatImageGalleryProps> = ({
  images,
  onImageSelect,
  loading,
  error,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const selectedImage = images[selectedImageIndex];

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-200 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">Error loading images</div>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
            <div className="text-muted-foreground">No images available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
            {selectedImage?.url && selectedImage.url.trim() ? (
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="w-full h-full object-cover"
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
              className="image-placeholder w-full h-full bg-gray-200 flex items-center justify-center"
              style={{
                display:
                  selectedImage?.url && selectedImage.url.trim()
                    ? "none"
                    : "flex",
              }}
            >
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🚤</span>
                </div>
                <p className="text-lg font-medium">No image available</p>
                <p className="text-sm text-gray-400">
                  Image will be loaded soon
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute top-2 left-2">
              <Badge className="bg-black/50 text-white">
                {selectedImageIndex + 1} / {images.length}
              </Badge>
            </div>

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {image.thumbnail && image.thumbnail.trim() ? (
                      <img
                        src={image.thumbnail}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">🚤</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="relative max-w-7xl max-h-full p-4">
              <img
                src={selectedImage?.url}
                alt={selectedImage?.alt}
                className="max-w-full max-h-full object-contain"
              />

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              >
                ×
              </Button>

              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BoatImageGallery;
