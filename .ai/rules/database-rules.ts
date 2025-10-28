import { Library } from "../../packages/backend/src/types/dictionaries";
import { type LibraryRulesMap } from "../types";

/**
 * Database library rules for boatsStats application
 * Focused on PostgreSQL/Supabase best practices for boat data management
 */
export const databaseRules: LibraryRulesMap = {
  // Primary database (Supabase/PostgreSQL)
  [Library.POSTGRES]: [
    'Use connection pooling to manage database connections efficiently for high-frequency boat data queries',
    'Implement JSONB columns for flexible boat specifications and amenities data instead of creating many tables for boat_features',
    'Use materialized views for complex boat availability calculations that are frequently accessed',
    'Create partial indexes on boat availability tables filtered by year for better performance',
    'Use GIN indexes on JSONB columns containing boat specifications and pricing data',
    'Implement row-level security (RLS) policies for boat data access control based on user_roles',
    'Use stored procedures for complex boat availability calculations and price history updates',
    'Implement proper foreign key constraints between boats_list and boat_availability_{year} tables',
    'Use array columns for boat amenities and license requirements instead of separate junction tables',
    'Create composite indexes on (country, category, price) for efficient boat search queries',
    'Use triggers to automatically update boat view counts and last_updated timestamps',
    'Implement database-level validation for boat coordinates using CHECK constraints',
    'Use table partitioning for boat_availability tables by year to improve query performance',
    'Create full-text search indexes on boat titles and descriptions for search functionality',
  ],

  // Alternative SQL databases (if migration needed)
  [Library.MYSQL]: [
    'Use InnoDB storage engine for transactions and foreign key constraints in boat data',
    'Implement proper indexing strategies on boat search patterns (country, category, price_range)',
    'Use connection pooling for better performance with high-frequency boat availability checks',
    'Create composite indexes on boat search fields (country, region, price, reviews_score)',
    'Use JSON data type for flexible boat specifications and amenities storage',
    'Implement proper datetime indexing for boat availability date ranges',
  ],

  [Library.SQLSERVER]: [
    'Use parameterized queries to prevent SQL injection in boat search and availability queries',
    'Implement proper indexing strategies based on boat search and filtering patterns',
    'Use stored procedures for complex boat availability calculations and price updates',
    'Create filtered indexes on active boat records and current year availability data',
    'Use JSON data type for boat specifications and amenities with proper indexing',
    'Implement table partitioning for boat_availability tables by year',
  ],

  // NoSQL alternatives (if needed for specific features)
  [Library.MONGODB]: [
    'Use the aggregation framework for complex boat search and availability queries',
    'Implement schema validation to ensure data consistency for boat_documents',
    'Use compound indexes for boat search queries (country, category, price, availability)',
    'Store boat availability data as embedded documents for faster queries',
    'Use MongoDB Change Streams to sync boat data updates across systems',
    'Implement proper sharding strategy based on boat geographic distribution',
  ],

  [Library.DYNAMODB]: [
    'Design access patterns first for boat search and availability queries',
    'Implement single-table design for boats and availability data to minimize costs',
    'Use sparse indexes and composite keys for efficient boat filtering queries',
    'Store boat specifications as JSON attributes for flexible schema evolution',
    'Implement TTL for temporary boat availability data to reduce storage costs',
    'Use DynamoDB Streams for real-time boat data synchronization',
  ],

  [Library.FIREBASE]: [
    'Use security rules to enforce access control for boat data based on user_roles',
    'Implement shallow queries to minimize bandwidth usage for boat listings',
    'Use offline capabilities for boat search and availability checking',
    'Store boat availability data in subcollections for efficient querying',
    'Implement proper data validation rules for boat specifications and pricing',
    'Use Firebase Functions for complex boat availability calculations',
  ],

  // Graph databases (if relationships become complex)
  [Library.NEO4J]: [
    'Use parameterized Cypher queries for boat search and availability queries',
    'Implement proper indexing on boat properties (country, category, price) for efficient queries',
    'Use the APOC library for complex boat availability and pricing calculations',
    'Create relationships between boats, marinas, and regions for advanced search',
    'Use graph algorithms for boat recommendation and similarity matching',
    'Implement proper constraints on boat node properties for data integrity',
  ],

  [Library.DGRAPH]: [
    'Use GraphQL+-/DQL for complex boat search and availability queries',
    'Implement proper indexing based on boat search and filtering patterns',
    'Use transactions for maintaining data consistency in boat availability updates',
    'Create relationships between boats, locations, and availability periods',
    'Use Dgraph's built-in full-text search for boat descriptions and specifications',
    'Implement proper schema definitions for boat data types and relationships',
  ],
};

/**
 * Supabase-specific database rules for boatsStats
 * Additional rules specific to Supabase platform features
 */
export const supabaseRules = [
  // Authentication and RLS
  'Implement Row Level Security (RLS) policies for boat data access based on user authentication',
  'Use Supabase Auth for user management and JWT token validation',
  'Create RLS policies that allow public read access to boat listings but restrict admin operations',

  // Real-time features
  'Use Supabase Realtime for live boat availability updates',
  'Implement real-time subscriptions for boat price changes and availability updates',
  'Use database triggers to publish real-time events for boat data changes',

  // Edge Functions
  'Use Supabase Edge Functions for complex boat data processing and external API integrations',
  'Implement Edge Functions for boat availability calculations and price updates',
  'Use Edge Functions for data validation and transformation before database insertion',

  // Database optimizations
  'Use Supabase database extensions for full-text search and geographic queries',
  'Implement proper database backups and point-in-time recovery for boat data',
  'Use Supabase connection pooling and query optimization features',
  'Monitor database performance using Supabase dashboard and optimize slow queries',

  // Data integrity
  'Use database constraints to ensure boat data consistency across tables',
  'Implement proper foreign key relationships between boats and availability data',
  'Use check constraints to validate boat coordinates, prices, and availability dates',
  'Create unique constraints on boat slugs to prevent duplicates',

  // Security
  'Use Supabase API keys and service role keys appropriately for different operations',
  'Implement proper CORS policies for boat API endpoints',
  'Use Supabase database encryption for sensitive boat data',
  'Monitor and log all database access for security auditing',
];
