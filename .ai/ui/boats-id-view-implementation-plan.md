# View Implementation Plan - Boats ID View

## 1. Overview

The Boats ID View displays comprehensive details for a specific boat using data from the API. It shows all available boat information including specifications, pricing, availability, reviews, and additional details. The view serves as the detailed boat information page accessible from the boats listing.

## 2. View Routing

- **Path**: `/boats/{id}` or `/boats/{slug}`
- **Route Component**: `BoatDetailsPage`
- **Layout**: Uses `DashboardLayout` with sidebar and main content area
- **Authentication**: Required for all users
- **Dynamic Route**: Uses boat ID or slug parameter

## 3. Component Structure

```
DashboardLayout
├── NavigationBar
├── Sidebar
│   ├── BoatQuickInfo
│   ├── BoatActions
│   └── RelatedBoats
└── MainContent
    ├── BoatHeader
    ├── BoatImageGallery
    ├── BoatDetails
    ├── BoatSpecifications
    ├── BoatPricing
    ├── BoatAvailability
    ├── BoatReviews
    └── BoatLocation
```

## 4. Component Details

### BoatHeader

- **Component description**: Header section with boat title, basic info, and navigation
- **Main elements**: Boat title, manufacturer, model, breadcrumbs, back button, share button
- **Handled interactions**: Back navigation, share functionality, breadcrumb navigation
- **Handled validation**: Boat data validation, navigation state validation
- **Types**: `BoatHeaderProps`, `BoatBasicInfo`
- **Props**: `boat: BoatBasicInfo`, `onBack: () => void`, `onShare: () => void`

### BoatImageGallery

- **Component description**: Image gallery displaying boat photos with navigation
- **Main elements**: Main image, thumbnail gallery, zoom functionality, image navigation
- **Handled interactions**: Image selection, zoom, gallery navigation, fullscreen view
- **Handled validation**: Image loading validation, gallery state validation
- **Types**: `BoatImageGalleryProps`, `BoatImage`
- **Props**: `images: BoatImage[]`, `onImageSelect: (image: BoatImage) => void`, `loading: boolean`

### BoatDetails

- **Component description**: Main boat information section with description and features
- **Main elements**: Description, features list, USP highlights, additional information
- **Handled interactions**: Feature toggles, description expansion, USP interactions
- **Handled validation**: Content validation, feature data validation
- **Types**: `BoatDetailsProps`, `BoatDetailsData`
- **Props**: `details: BoatDetailsData`, `onFeatureToggle: (feature: string) => void`

### BoatSpecifications

- **Component description**: Comprehensive boat specifications and technical details
- **Main elements**: Specifications table, technical parameters, equipment list
- **Handled interactions**: Specification filtering, parameter highlighting, equipment details
- **Handled validation**: Specification data validation, parameter validation
- **Types**: `BoatSpecificationsProps`, `BoatSpecifications`
- **Props**: `specifications: BoatSpecifications`, `onSpecificationClick: (spec: string) => void`

### BoatPricing

- **Component description**: Pricing information and booking details
- **Main elements**: Price display, discount information, currency, booking options
- **Handled interactions**: Price calculation, booking initiation, discount details
- **Handled validation**: Price validation, currency validation, booking validation
- **Types**: `BoatPricingProps`, `BoatPricingData`
- **Props**: `pricing: BoatPricingData`, `onBook: () => void`, `onPriceInquiry: () => void`

### BoatAvailability

- **Component description**: Boat availability calendar and booking status
- **Main elements**: Availability calendar, booking status, date selection, availability indicators
- **Handled interactions**: Date selection, availability checking, booking status updates
- **Handled validation**: Date validation, availability validation, booking status validation
- **Types**: `BoatAvailabilityProps`, `BoatAvailabilityData`
- **Props**: `availability: BoatAvailabilityData`, `onDateSelect: (date: Date) => void`, `onAvailabilityCheck: () => void`

### BoatReviews

- **Component description**: Reviews and ratings section for the boat
- **Main elements**: Review summary, individual reviews, rating breakdown, review form
- **Handled interactions**: Review navigation, rating display, review submission
- **Handled validation**: Review data validation, rating validation
- **Types**: `BoatReviewsProps`, `BoatReviewsData`
- **Props**: `reviews: BoatReviewsData`, `onReviewSubmit: (review: ReviewData) => void`

### BoatLocation

- **Component description**: Boat location and marina information with map
- **Main elements**: Location details, marina information, map display, coordinates
- **Handled interactions**: Map interaction, location details, marina information
- **Handled validation**: Location data validation, map data validation
- **Types**: `BoatLocationProps`, `BoatLocationData`
- **Props**: `location: BoatLocationData`, `onMapInteraction: (action: string) => void`

### BoatQuickInfo

- **Component description**: Sidebar with quick boat information and actions
- **Main elements**: Quick stats, action buttons, contact information, sharing options
- **Handled interactions**: Quick actions, contact initiation, sharing
- **Handled validation**: Quick info validation, action validation
- **Types**: `BoatQuickInfoProps`, `BoatQuickInfoData`
- **Props**: `quickInfo: BoatQuickInfoData`, `onQuickAction: (action: string) => void`

### RelatedBoats

- **Component description**: Sidebar section showing related or similar boats
- **Main elements**: Related boat cards, similarity indicators, navigation to related boats
- **Handled interactions**: Related boat navigation, similarity exploration
- **Handled validation**: Related boat data validation
- **Types**: `RelatedBoatsProps`, `RelatedBoat`
- **Props**: `relatedBoats: RelatedBoat[]`, `onRelatedBoatClick: (boat: RelatedBoat) => void`

## 5. Types

### Core Boat Types (from API)

```typescript
// Based on SingleBoatDetails from backend types
interface BoatDetailsData {
  _id: string;
  slug: string;
  parameters: SingleBoatParameters;
  vat_excluded: boolean;
  old_id: number;
  views: number;
  title: string;
  manufacturer: string;
  model: string;
  category: string;
  category_slug: string;
  illustrated: boolean;
  marina: string;
  coordinates: [number, number];
  country: string;
  region: string;
  city: string;
  flag: string;
  captain: string;
  sail: string;
  engineType: string;
  usp: USP[];
  cancellationInsurance: EmptyObjectCancellationInsurance | null;
  noLicense: NoLicenseType | null;
  totalReviews: number;
  lastCustomer: string;
  rank: number;
  newboat: boolean;
  reviewsScore: number;
  cancellations: string | null;
  thumb: string;
  main_img: string;
  boataroundExtra: boolean;
  charterLoyalty: boolean;
  additional_specials: any[];
  featuredUsp: USP;
  restrictions_covered: EmptyObjectRestrictions_covered | null;
  freeBerths: EmptyObjectFreeBerths;
  charter: string;
  charter_logo: string | null;
  charter_id: string;
  charter_rank: CharterRank;
  prepayment: number;
  guarantee_date: string | null;
  priceFrom: number;
  discount: number | null;
  loyaltyDiscount: number;
  currency: string;
  isSmartDeal: boolean;
  preferred_program: boolean;
}

interface SingleBoatParameters {
  max_sleeps: number;
  max_people: number;
  allowed_people: number;
  single_cabins: number;
  double_cabins: number;
  triple_cabins: number;
  quadruple_cabins: number;
  cabins: number;
  cabins_with_bunk_bed: number;
  saloon_sleeps: number;
  crew_sleeps: number;
  toilets: number;
  electric_toilets: number;
  length: number;
  beam: number;
  draft: number;
  year: number;
  renovated_year: number;
  sail_renovated_year: number;
  engine_power: number;
  number_engines: number;
  total_engine_power: number;
  engine: string;
  fuel: number;
  cruising_consumption: number;
  maximum_speed: number;
  water_tank: number;
  waste_tank: number;
  single_cabins_outdoor_entrance: boolean;
  single_cabins_indoor_entrance: boolean;
}

interface USP {
  name: string;
  icon: string;
  provider: string;
}

interface CharterRank {
  place: number;
  country: string;
  score: number;
  out_of: number;
  count: number;
}

interface BoatImage {
  id: string;
  url: string;
  alt: string;
  thumbnail: string;
  isMain: boolean;
  order: number;
}

interface BoatAvailabilityData {
  available: boolean;
  nextAvailableDate?: Date;
  bookedDates: Date[];
  maintenanceDates: Date[];
  seasonalAvailability: {
    start: Date;
    end: Date;
  };
  lastUpdated: Date;
}

interface BoatPricingData {
  priceFrom: number;
  currency: string;
  discount: number | null;
  originalPrice?: number;
  loyaltyDiscount: number;
  prepayment: number;
  isSmartDeal: boolean;
  seasonalPricing?: {
    season: string;
    multiplier: number;
  }[];
  additionalCosts?: {
    name: string;
    amount: number;
    currency: string;
    mandatory: boolean;
  }[];
}

interface BoatReviewsData {
  reviewsScore: number;
  totalReviews: number;
  reviews: BoatReview[];
  ratingBreakdown: {
    [rating: number]: number;
  };
}

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
```

### Component Interface Types

```typescript
interface BoatHeaderProps {
  boat: BoatBasicInfo;
  onBack: () => void;
  onShare: () => void;
  breadcrumbs: Breadcrumb[];
  loading: boolean;
}

interface BoatImageGalleryProps {
  images: BoatImage[];
  onImageSelect: (image: BoatImage) => void;
  loading: boolean;
  error: string | null;
}

interface BoatDetailsProps {
  details: BoatDetailsData;
  onFeatureToggle: (feature: string) => void;
  onUSPClick: (usp: USP) => void;
  loading: boolean;
}

interface BoatSpecificationsProps {
  specifications: SingleBoatParameters;
  onSpecificationClick: (spec: string) => void;
  onParameterHighlight: (parameter: string) => void;
  loading: boolean;
}

interface BoatPricingProps {
  pricing: BoatPricingData;
  onBook: () => void;
  onPriceInquiry: () => void;
  onDiscountDetails: () => void;
  loading: boolean;
}

interface BoatAvailabilityProps {
  availability: BoatAvailabilityData;
  onDateSelect: (date: Date) => void;
  onAvailabilityCheck: () => void;
  selectedDate?: Date;
  loading: boolean;
}

interface BoatReviewsProps {
  reviews: BoatReviewsData;
  onReviewSubmit: (review: ReviewData) => void;
  onReviewHelpful: (reviewId: string) => void;
  loading: boolean;
}

interface BoatLocationProps {
  location: BoatLocationData;
  onMapInteraction: (action: string) => void;
  onMarinaInfo: () => void;
  loading: boolean;
}

interface BoatQuickInfoProps {
  quickInfo: BoatQuickInfoData;
  onQuickAction: (action: string) => void;
  onContact: () => void;
  loading: boolean;
}

interface RelatedBoatsProps {
  relatedBoats: RelatedBoat[];
  onRelatedBoatClick: (boat: RelatedBoat) => void;
  loading: boolean;
}

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
  charterRank: CharterRank;
}

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

interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

interface ReviewData {
  rating: number;
  comment: string;
  anonymous?: boolean;
}
```

## 6. State Management

### Custom Hooks

- **useBoatDetails**: Manages boat data fetching and state
- **useBoatImages**: Handles boat image gallery state
- **useBoatAvailability**: Manages availability data and calendar
- **useBoatReviews**: Handles reviews data and submission
- **useRelatedBoats**: Manages related boats data

### State Variables

- `boat: BoatDetailsData`
- `images: BoatImage[]`
- `availability: BoatAvailabilityData`
- `reviews: BoatReviewsData`
- `relatedBoats: RelatedBoat[]`
- `loading: boolean`
- `error: string | null`
- `selectedImage: BoatImage`
- `selectedDate: Date`

## 7. API Integration

### Primary Endpoints

- **GET /boats/{id}**: Get detailed boat information
- **GET /boats/{id}/images**: Get boat images
- **GET /boats/{id}/availability**: Get boat availability
- **GET /boats/{id}/reviews**: Get boat reviews
- **GET /boats/{id}/related**: Get related boats
- **POST /boats/{id}/contact**: Send inquiry about boat
- **POST /boats/{id}/bookmark**: Bookmark/unbookmark boat

### Request/Response Types

```typescript
// GET /boats/{id} response
interface BoatDetailsResponse {
  data: BoatDetailsData;
  success: boolean;
  message?: string;
}

// GET /boats/{id}/images response
interface BoatImagesResponse {
  images: BoatImage[];
  mainImage: BoatImage;
  total: number;
}

// GET /boats/{id}/availability response
interface BoatAvailabilityResponse {
  availability: BoatAvailabilityData;
  lastUpdated: Date;
}

// GET /boats/{id}/reviews response
interface BoatReviewsResponse {
  reviews: BoatReviewsData;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// GET /boats/{id}/related response
interface RelatedBoatsResponse {
  relatedBoats: RelatedBoat[];
  similarityCriteria: string[];
}

// POST /boats/{id}/contact request
interface BoatContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact: "email" | "phone";
  inquiryType: "general" | "booking" | "pricing";
}

// POST /boats/{id}/contact response
interface BoatContactResponse {
  success: boolean;
  message: string;
  inquiryId: string;
}
```

## 8. User Interactions

### Navigation Interactions

- **Back Button**: Navigate back to boats listing
- **Breadcrumb Navigation**: Navigate through breadcrumb trail
- **Related Boat Clicks**: Navigate to related boat details
- **Share Functionality**: Share boat details

### Image Interactions

- **Image Gallery Navigation**: Navigate through boat images
- **Image Zoom**: Zoom into images for detail view
- **Fullscreen View**: View images in fullscreen mode
- **Thumbnail Selection**: Select different images

### Detail Interactions

- **Feature Toggles**: Expand/collapse feature details
- **Specification Highlights**: Highlight specific specifications
- **USP Interactions**: View USP details and benefits
- **Description Expansion**: Expand/collapse descriptions

### Booking Interactions

- **Availability Calendar**: Select available dates
- **Price Inquiry**: Request detailed pricing information
- **Contact Form**: Send inquiries about the boat
- **Bookmark Toggle**: Add/remove boat from bookmarks

## 9. Conditions and Validation

### Data Validation

- **Boat Data Integrity**: Validate complete boat data
- **Image Validation**: Validate image URLs and loading
- **Availability Validation**: Validate availability data
- **Pricing Validation**: Validate pricing calculations

### Route Validation

- **Boat ID Validation**: Validate boat ID or slug
- **Parameter Validation**: Validate route parameters
- **Access Validation**: Validate user access to boat details
- **Navigation Validation**: Validate navigation state

### Form Validation

- **Contact Form Validation**: Validate inquiry form data
- **Review Form Validation**: Validate review submission
- **Date Selection Validation**: Validate date selections
- **Input Validation**: Validate all user inputs

## 10. Error Handling

### Data Loading Errors

- **Boat Not Found**: Handle missing boat data
- **Image Loading Errors**: Handle failed image loads
- **API Errors**: Handle API communication failures
- **Data Parsing Errors**: Handle malformed responses

### UI Error States

- **Loading States**: Show skeleton loaders during data fetching
- **Error Boundaries**: Catch and display component-level errors
- **Empty States**: Display appropriate empty states
- **Partial Loading**: Handle partial data loading

### User Action Errors

- **Form Submission Errors**: Handle form validation errors
- **Contact Errors**: Handle contact form failures
- **Booking Errors**: Handle booking process failures
- **Navigation Errors**: Handle navigation failures

## 11. Performance Optimizations

### Data Loading

- **Lazy Loading**: Load sections as they come into view
- **Image Optimization**: Optimize and compress boat images
- **Data Caching**: Cache boat details and related data
- **Preloading**: Preload related boat data

### UI Performance

- **Component Memoization**: Memoize expensive components
- **Virtual Scrolling**: Use virtual scrolling for large lists
- **Image Lazy Loading**: Lazy load images in gallery
- **State Optimization**: Optimize state updates

### Caching Strategy

- **Boat Details Caching**: Cache boat details data
- **Image Caching**: Cache boat images locally
- **Related Boats Caching**: Cache related boats data
- **API Response Caching**: Cache API responses

## 12. Responsive Design

### Layout Adaptation

- **Mobile Layout**: Single column layout with stacked sections
- **Tablet Layout**: Two column layout with sidebar
- **Desktop Layout**: Full layout with sidebar and main content
- **Large Screens**: Enhanced layout with additional features

### Image Gallery

- **Mobile Gallery**: Touch-friendly image navigation
- **Desktop Gallery**: Mouse and keyboard navigation
- **Responsive Images**: Adaptive image sizing
- **Gallery Controls**: Responsive gallery controls

### Content Sections

- **Collapsible Sections**: Collapsible sections on mobile
- **Tabbed Interface**: Tabbed interface for related content
- **Progressive Disclosure**: Progressive content disclosure
- **Adaptive Typography**: Responsive text sizing

## 13. Accessibility

### Navigation Accessibility

- **Keyboard Navigation**: Full keyboard navigation support
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Skip Links**: Skip navigation links

### Content Accessibility

- **Image Alt Text**: Descriptive alt text for all images
- **Content Structure**: Proper heading hierarchy
- **Color Contrast**: Sufficient color contrast
- **Text Scaling**: Support for text scaling

### Interactive Elements

- **Button Labels**: Clear button labels and descriptions
- **Form Accessibility**: Accessible form elements
- **Error Announcements**: Announce errors to screen readers
- **Status Updates**: Announce status changes

## 14. Implementation Steps

1. **Setup Boat Details Layout**: Create boat details page layout
2. **Implement Boat Header**: Build boat header with navigation
3. **Create Image Gallery**: Build responsive image gallery
4. **Add Boat Details Section**: Implement main boat information
5. **Build Specifications**: Create comprehensive specifications display
6. **Add Pricing Section**: Implement pricing and booking information
7. **Create Availability Calendar**: Build availability display
8. **Implement Reviews Section**: Add reviews and ratings
9. **Build Location Section**: Create location and map display
10. **Add Sidebar Components**: Implement quick info and related boats
11. **Handle Loading States**: Add loading skeletons and error states
12. **Implement Responsive Design**: Ensure mobile compatibility
13. **Add Accessibility Features**: Implement keyboard navigation and screen reader support
14. **Optimize Performance**: Add lazy loading and caching
15. **Testing**: Add unit tests and integration tests
16. **Documentation**: Create component documentation and usage examples
