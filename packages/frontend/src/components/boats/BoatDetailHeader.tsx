"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Euro } from 'lucide-react';
import { SingleBoatDetails } from '@/src/types/boat-detail';

interface BoatDetailHeaderProps {
  boat: SingleBoatDetails;
  onBack: () => void;
  loading: boolean;
}

export default function BoatDetailHeader({ boat, onBack, loading }: BoatDetailHeaderProps) {
  if (loading || !boat) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-96 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Wróć do listy</span>
          </Button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900 truncate max-w-md">
              {boat.title}
            </h1>
            {boat.newboat && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Nowa
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {boat.reviewsScore && boat.totalReviews && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{boat.reviewsScore.toFixed(1)}</span>
              <span>({boat.totalReviews} ocen)</span>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Manufacturer & Model */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Producent:</span>
            <span className="text-sm text-gray-900">{boat.manufacturer}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Model:</span>
            <span className="text-sm text-gray-900">{boat.model}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Kategoria:</span>
            <span className="text-sm text-gray-900">{boat.category}</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Lokalizacja:</span>
          </div>
          <div className="pl-6 space-y-1">
            <div className="text-sm text-gray-900">{boat.city}</div>
            <div className="text-sm text-gray-900">{boat.region}</div>
            <div className="text-sm text-gray-900">{boat.country}</div>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Cena od:</span>
          </div>
          <div className="pl-6">
            <div className="text-lg font-bold text-gray-900">
              {boat.priceFrom?.toLocaleString()} {boat.currency}
            </div>
            {boat.discount && boat.discount > 0 && (
              <div className="text-sm text-green-600">
                Rabat: {boat.discount}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charter Info */}
      {boat.charter && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {boat.charter_logo && (
              <img
                src={boat.charter_logo}
                alt={boat.charter}
                className="h-8 w-auto object-contain"
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">{boat.charter}</div>
              {boat.charter_rank && (
                <div className="text-xs text-gray-500">
                  Ranking: {boat.charter_rank.place}. miejsce ({boat.charter_rank.score}/10)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
