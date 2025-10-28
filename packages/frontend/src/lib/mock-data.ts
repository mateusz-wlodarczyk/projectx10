import { UserRole } from "@/types/dashboard";

// Centralized mock users for different roles
export const mockUsers = {
  user: {
    id: "1",
    email: "user@boatsanalytics.com",
    firstName: "John",
    lastName: "Doe",
    emailVerified: true,
  },
  admin: {
    id: "2",
    email: "admin@boatsanalytics.com",
    firstName: "Jane",
    lastName: "Smith",
    emailVerified: true,
  },
  superuser: {
    id: "3",
    email: "superuser@boatsanalytics.com",
    firstName: "Admin",
    lastName: "User",
    emailVerified: true,
  },
  manager: {
    id: "4",
    email: "manager@boatsanalytics.com",
    firstName: "Manager",
    lastName: "User",
    emailVerified: false,
  },
};

// Mock boat data
export const mockBoats = [
  {
    slug: "beneteau-oceanis-45",
    title: "Beneteau Oceanis 45",
    manufacturer: "Beneteau",
    model: "Oceanis 45",
    category: "Sailboat",
    category_slug: "sailboat",
    marina: "Marina Split",
    country: "Croatia",
    region: "Dalmatia",
    city: "Split",
    coordinates: [43.5081, 16.4402] as [number, number],
    price: 1200,
    currency: "EUR",
    discount: 15,
    originalPrice: 1412,
    reviewsScore: 4.5,
    totalReviews: 23,
    views: 156,
    thumb: "",
    main_img: "",
    year: 2020,
    length: 13.85,
    capacity: 8,
    cabins: 3,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    slug: "lagoon-450",
    title: "Lagoon 450",
    manufacturer: "Lagoon",
    model: "450",
    category: "Catamaran",
    category_slug: "catamaran",
    marina: "Marina Dubrovnik",
    country: "Croatia",
    region: "Dalmatia",
    city: "Dubrovnik",
    coordinates: [42.6507, 18.0944] as [number, number],
    price: 1800,
    currency: "EUR",
    discount: 20,
    originalPrice: 2250,
    reviewsScore: 4.8,
    totalReviews: 45,
    views: 234,
    thumb: "",
    main_img: "",
    year: 2021,
    length: 13.96,
    capacity: 10,
    cabins: 4,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    slug: "sunseeker-60",
    title: "Sunseeker 60",
    manufacturer: "Sunseeker",
    model: "60",
    category: "Motorboat",
    category_slug: "motorboat",
    marina: "Marina Hvar",
    country: "Croatia",
    region: "Dalmatia",
    city: "Hvar",
    coordinates: [43.1725, 16.4427] as [number, number],
    price: 2500,
    currency: "EUR",
    discount: 10,
    originalPrice: 2778,
    reviewsScore: 4.3,
    totalReviews: 18,
    views: 89,
    thumb: "",
    main_img: "",
    year: 2019,
    length: 18.5,
    capacity: 12,
    cabins: 3,
    isAvailable: false,
    isFeatured: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock analytics data
export const mockAnalyticsData = {
  totalBookings: 1247,
  activeUsers: 892,
  totalBoats: 15420,
  systemUptime: 99.8,
  memoryUsage: 67.3,
  diskUsage: 42.1,
  cpuUsage: 23.7,
  lastBackup: new Date("2024-01-15T10:30:00Z"),
  lastSync: new Date("2024-01-15T08:15:00Z"),
};

// Mock system health data
export const mockSystemHealth = {
  overall: "healthy" as const,
  components: {
    database: {
      status: "healthy" as const,
      message: "Connected",
      lastChecked: new Date(),
    },
    cache: {
      status: "healthy" as const,
      message: "Active",
      lastChecked: new Date(),
    },
    storage: {
      status: "healthy" as const,
      message: "Available",
      lastChecked: new Date(),
    },
    email: {
      status: "warning" as const,
      message: "Slow response",
      lastChecked: new Date(),
    },
    sms: {
      status: "healthy" as const,
      message: "Active",
      lastChecked: new Date(),
    },
    integrations: {
      status: "healthy" as const,
      message: "All services up",
      lastChecked: new Date(),
    },
  },
  metrics: {
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 23,
    networkLatency: 12,
    responseTime: 150,
  },
  alerts: [],
  lastChecked: new Date(),
};

// Mock configuration data
export const mockConfig = {
  site: {
    name: "Boats Analytics",
    description: "Comprehensive boat analytics platform",
    logo: "https://example.com/logo.png",
    favicon: "https://example.com/favicon.ico",
    domain: "boatsanalytics.com",
    environment: "production" as const,
  },
  localization: {
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "fr", "de", "it"],
    defaultTimezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "24h",
    currency: "USD",
  },
  maintenance: {
    enabled: false,
    message: "System is currently under maintenance. Please check back later.",
    allowedIps: ["192.168.1.1", "10.0.0.1"],
  },
  features: {
    registrationEnabled: true,
    emailVerificationRequired: true,
    twoFactorAuthRequired: false,
    analyticsEnabled: true,
    debugMode: false,
  },
};

// Mock sync jobs
export const mockSyncJobs = [
  {
    id: "1",
    type: "weekly" as const,
    status: "completed" as const,
    progress: 100,
    startedAt: new Date("2024-01-15T08:00:00Z"),
    estimatedDuration: "2h 30m",
    results: {
      boatsProcessed: 150,
      newBoats: 12,
      updatedBoats: 138,
      errors: 0,
    },
  },
  {
    id: "2",
    type: "daily" as const,
    status: "running" as const,
    progress: 65,
    startedAt: new Date("2024-01-15T10:00:00Z"),
    estimatedDuration: "45m",
    results: {
      boatsProcessed: 85,
      newBoats: 3,
      updatedBoats: 82,
      errors: 0,
    },
  },
];

// Mock users list for admin
export const mockUsersList = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user" as const,
    emailVerified: true,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLoginAt: new Date("2024-01-15T09:30:00Z"),
    permissions: ["read"],
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "admin" as const,
    emailVerified: true,
    isActive: true,
    createdAt: new Date("2024-01-02"),
    lastLoginAt: new Date("2024-01-15T08:45:00Z"),
    permissions: ["read", "write", "admin"],
  },
  {
    id: "3",
    email: "bob.wilson@example.com",
    firstName: "Bob",
    lastName: "Wilson",
    role: "manager" as const,
    emailVerified: false,
    isActive: false,
    createdAt: new Date("2024-01-03"),
    lastLoginAt: new Date("2024-01-10T14:20:00Z"),
    permissions: ["read", "write"],
  },
];

// Helper function to get mock user by role
export function getMockUser(role: keyof typeof mockUsers): UserRole {
  return mockUsers[role];
}

// Helper function to get mock boat by slug
export function getMockBoat(slug: string) {
  return mockBoats.find((boat) => boat.slug === slug) || null;
}

// Helper function to get mock boats by country
export function getMockBoatsByCountry(country: string) {
  return mockBoats.filter((boat) => boat.country === country);
}

// Helper function to get mock boats by category
export function getMockBoatsByCategory(category: string) {
  return mockBoats.filter(
    (boat) => boat.category.toLowerCase() === category.toLowerCase()
  );
}
