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
  Euro,
  Calendar,
  Users,
  Anchor,
  Clock,
  CheckCircle,
} from "lucide-react";

interface BoatPricingData {
  priceFrom: number;
  currency: string;
  discount: number | null;
  originalPrice?: number;
  loyaltyDiscount: number;
  prepayment: number;
  isSmartDeal: boolean;
}

interface BoatPricingProps {
  pricing: BoatPricingData;
  onBook: () => void;
  onPriceInquiry: () => void;
  onDiscountDetails: () => void;
  loading: boolean;
}

const BoatPricing: React.FC<BoatPricingProps> = ({
  pricing,
  onBook,
  onPriceInquiry,
  onDiscountDetails,
  loading,
}) => {
  const [showPriceBreakdown, setShowPriceBreakdown] = React.useState(false);

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

  const calculateTotalPrice = () => {
    const basePrice = pricing.priceFrom;
    const discountAmount = pricing.discount
      ? (basePrice * pricing.discount) / 100
      : 0;
    const loyaltyDiscountAmount = (basePrice * pricing.loyaltyDiscount) / 100;
    return basePrice - discountAmount - loyaltyDiscountAmount;
  };

  const totalPrice = calculateTotalPrice();
  const prepaymentAmount = (totalPrice * pricing.prepayment) / 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Euro className="h-5 w-5" />
          <span>Pricing & Booking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Price Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {pricing.currency} {totalPrice.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mb-4">per day</div>

          {pricing.discount && pricing.originalPrice && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-lg text-muted-foreground line-through">
                {pricing.currency} {pricing.originalPrice.toLocaleString()}
              </span>
              <Badge className="bg-red-100 text-red-800">
                -{pricing.discount}% OFF
              </Badge>
            </div>
          )}

          {pricing.isSmartDeal && (
            <Badge className="bg-green-100 text-green-800 mb-4">
              Smart Deal
            </Badge>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            className="w-full"
          >
            {showPriceBreakdown ? "Hide" : "Show"} Price Breakdown
          </Button>

          {showPriceBreakdown && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm">Base price</span>
                <span className="text-sm">
                  {pricing.currency} {pricing.priceFrom.toLocaleString()}
                </span>
              </div>
              {pricing.discount && (
                <div className="flex justify-between text-red-600">
                  <span className="text-sm">
                    Discount ({pricing.discount}%)
                  </span>
                  <span className="text-sm">
                    -{pricing.currency}{" "}
                    {(
                      (pricing.priceFrom * pricing.discount) /
                      100
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {pricing.loyaltyDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">
                    Loyalty discount ({pricing.loyaltyDiscount}%)
                  </span>
                  <span className="text-sm">
                    -{pricing.currency}{" "}
                    {(
                      (pricing.priceFrom * pricing.loyaltyDiscount) /
                      100
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total price</span>
                <span>
                  {pricing.currency} {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Booking Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Prepayment Required</div>
              <div className="text-sm text-muted-foreground">
                {pricing.currency} {prepaymentAmount.toLocaleString()} (
                {pricing.prepayment}%)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Cancellation Policy</div>
              <div className="text-sm text-muted-foreground">
                Free cancellation up to 24 hours before departure
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">Instant Confirmation</div>
              <div className="text-sm text-muted-foreground">
                Get instant confirmation upon booking
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onBook} className="w-full" size="lg">
            Book Now
          </Button>
          <Button variant="outline" onClick={onPriceInquiry} className="w-full">
            Request Custom Quote
          </Button>
          {pricing.discount && (
            <Button
              variant="ghost"
              onClick={onDiscountDetails}
              className="w-full text-sm"
            >
              View Discount Details
            </Button>
          )}
        </div>

        {/* Additional Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Prices include VAT</p>
          <p>• Fuel costs not included</p>
          <p>• Tourist tax may apply</p>
          <p>• Marina fees may apply</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatPricing;
