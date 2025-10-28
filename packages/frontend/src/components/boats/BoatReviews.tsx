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
import { Star, ThumbsUp, MessageCircle, Calendar, User } from "lucide-react";

interface BoatReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
  helpful: number;
}

interface BoatReviewsData {
  reviewsScore: number;
  totalReviews: number;
  reviews: BoatReview[];
  ratingBreakdown: {
    [rating: number]: number;
  };
}

interface BoatReviewsProps {
  reviews: BoatReviewsData;
  onReviewSubmit: (review: any) => void;
  onReviewHelpful: (reviewId: string) => void;
  loading: boolean;
}

const BoatReviews: React.FC<BoatReviewsProps> = ({
  reviews,
  onReviewSubmit,
  onReviewHelpful,
  loading,
}) => {
  const [showAllReviews, setShowAllReviews] = React.useState(false);

  const displayReviews = reviews.reviews;
  const visibleReviews = showAllReviews
    ? displayReviews
    : displayReviews.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>Reviews & Ratings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {reviews.reviewsScore}
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {renderStars(Math.round(reviews.reviewsScore))}
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {reviews.totalReviews} reviews
          </div>
        </div>

        <Separator />

        {/* Rating Breakdown */}
        <div className="space-y-3">
          <h3 className="font-medium">Rating Breakdown</h3>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.ratingBreakdown[rating] || 0;
            const percentage =
              reviews.totalReviews > 0
                ? (count / reviews.totalReviews) * 100
                : 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Individual Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Customer Reviews</h3>
            {displayReviews.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews
                  ? "Show Less"
                  : `Show All (${displayReviews.length})`}
              </Button>
            )}
          </div>

          {displayReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to write a review!
            </div>
          ) : (
            visibleReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{review.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReviewHelpful(review.id)}
                  className="text-xs"
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful ({review.helpful})
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          ))
          )}
        </div>

        <Separator />

        {/* Write Review */}
        <div className="space-y-3">
          <h3 className="font-medium">Write a Review</h3>
          <Button variant="outline" className="w-full">
            Write a Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatReviews;
