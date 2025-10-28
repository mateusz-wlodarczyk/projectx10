"use client";

import React from 'react';
import { SingleBoatDetails } from '@/src/types/boat-detail';

interface BoatBasicInfoProps {
  boat: SingleBoatDetails;
  loading: boolean;
}

export default function BoatBasicInfo({ boat, loading }: BoatBasicInfoProps) {
  if (loading || !boat) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Filter out empty/null values and group by category
  const basicInfo = {
    identification: {
      title: boat.title,
      manufacturer: boat.manufacturer,
      model: boat.model,
      category: boat.category,
    },
    location: {
      marina: boat.marina,
      city: boat.city,
      region: boat.region,
      country: boat.country,
      flag: boat.flag,
    },
    pricing: {
      priceFrom: boat.priceFrom,
      currency: boat.currency,
      discount: boat.discount,
      loyaltyDiscount: boat.loyaltyDiscount,
      vat_excluded: boat.vat_excluded,
      prepayment: boat.prepayment,
    },
    reviews: {
      reviewsScore: boat.reviewsScore,
      totalReviews: boat.totalReviews,
      rank: boat.rank,
      lastCustomer: boat.lastCustomer,
    },
    status: {
      illustrated: boat.illustrated,
      newboat: boat.newboat,
      views: boat.views,
      isSmartDeal: boat.isSmartDeal,
      preferred_program: boat.preferred_program,
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Podstawowe informacje
      </h3>

      {/* Identification */}
      {Object.values(basicInfo.identification).some(value => value) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Identyfikacja</h4>
          <div className="grid grid-cols-1 gap-2">
            {basicInfo.identification.title && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nazwa:</span>
                <span className="text-sm text-gray-900 font-medium">{basicInfo.identification.title}</span>
              </div>
            )}
            {basicInfo.identification.manufacturer && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Producent:</span>
                <span className="text-sm text-gray-900">{basicInfo.identification.manufacturer}</span>
              </div>
            )}
            {basicInfo.identification.model && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Model:</span>
                <span className="text-sm text-gray-900">{basicInfo.identification.model}</span>
              </div>
            )}
            {basicInfo.identification.category && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kategoria:</span>
                <span className="text-sm text-gray-900">{basicInfo.identification.category}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {Object.values(basicInfo.location).some(value => value) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Lokalizacja</h4>
          <div className="grid grid-cols-1 gap-2">
            {basicInfo.location.marina && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Marina:</span>
                <span className="text-sm text-gray-900">{basicInfo.location.marina}</span>
              </div>
            )}
            {basicInfo.location.city && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Miasto:</span>
                <span className="text-sm text-gray-900">{basicInfo.location.city}</span>
              </div>
            )}
            {basicInfo.location.region && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Region:</span>
                <span className="text-sm text-gray-900">{basicInfo.location.region}</span>
              </div>
            )}
            {basicInfo.location.country && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kraj:</span>
                <span className="text-sm text-gray-900">{basicInfo.location.country}</span>
              </div>
            )}
            {basicInfo.location.flag && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Flaga:</span>
                <span className="text-sm text-gray-900">{basicInfo.location.flag.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing */}
      {Object.values(basicInfo.pricing).some(value => value !== null && value !== undefined) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Cennik</h4>
          <div className="grid grid-cols-1 gap-2">
            {basicInfo.pricing.priceFrom && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cena od:</span>
                <span className="text-sm text-gray-900 font-medium">
                  {basicInfo.pricing.priceFrom.toLocaleString()} {basicInfo.pricing.currency}
                </span>
              </div>
            )}
            {basicInfo.pricing.discount && basicInfo.pricing.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Rabat:</span>
                <span className="text-sm text-green-600 font-medium">{basicInfo.pricing.discount}%</span>
              </div>
            )}
            {basicInfo.pricing.loyaltyDiscount && basicInfo.pricing.loyaltyDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Rabat lojalnościowy:</span>
                <span className="text-sm text-blue-600 font-medium">{basicInfo.pricing.loyaltyDiscount}%</span>
              </div>
            )}
            {basicInfo.pricing.prepayment && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Zaliczka:</span>
                <span className="text-sm text-gray-900">{basicInfo.pricing.prepayment}%</span>
              </div>
            )}
            {basicInfo.pricing.vat_excluded !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">VAT:</span>
                <span className="text-sm text-gray-900">
                  {basicInfo.pricing.vat_excluded ? 'Nie zawiera' : 'Zawiera'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews */}
      {Object.values(basicInfo.reviews).some(value => value !== null && value !== undefined) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Oceny</h4>
          <div className="grid grid-cols-1 gap-2">
            {basicInfo.reviews.reviewsScore && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ocena:</span>
                <span className="text-sm text-gray-900 font-medium">
                  {basicInfo.reviews.reviewsScore.toFixed(1)}/10
                </span>
              </div>
            )}
            {basicInfo.reviews.totalReviews && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Liczba ocen:</span>
                <span className="text-sm text-gray-900">{basicInfo.reviews.totalReviews}</span>
              </div>
            )}
            {basicInfo.reviews.rank && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ranking:</span>
                <span className="text-sm text-gray-900">{basicInfo.reviews.rank.toFixed(1)}</span>
              </div>
            )}
            {basicInfo.reviews.lastCustomer && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ostatni klient:</span>
                <span className="text-sm text-gray-900">{basicInfo.reviews.lastCustomer}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      {Object.values(basicInfo.status).some(value => value !== null && value !== undefined) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Status</h4>
          <div className="grid grid-cols-1 gap-2">
            {basicInfo.status.views && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Wyświetlenia:</span>
                <span className="text-sm text-gray-900">{basicInfo.status.views.toLocaleString()}</span>
              </div>
            )}
            {basicInfo.status.newboat && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nowa łódź:</span>
                <span className="text-sm text-green-600 font-medium">Tak</span>
              </div>
            )}
            {basicInfo.status.illustrated && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Z ilustracjami:</span>
                <span className="text-sm text-blue-600 font-medium">Tak</span>
              </div>
            )}
            {basicInfo.status.isSmartDeal && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Smart Deal:</span>
                <span className="text-sm text-orange-600 font-medium">Tak</span>
              </div>
            )}
            {basicInfo.status.preferred_program && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Program preferencyjny:</span>
                <span className="text-sm text-purple-600 font-medium">Tak</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
