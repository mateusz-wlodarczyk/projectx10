"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoatsController = void 0;
const tsoa_1 = require("tsoa");
const getBoatData_1 = require("../utils/getBoatData");
const validation_1 = require("../utils/validation");
const index_1 = require("../index");
let BoatsController = class BoatsController extends tsoa_1.Controller {
    /**
     * Health check endpoint
     * @returns Simple health status
     */
    async healthCheck() {
        return {
            success: true,
            message: "Boats API is running",
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Get boat data by slug and week
     * @param slug Boat slug identifier
     * @param week Week number (1-52)
     * @returns Boat data with price history
     */
    async getBoatData(slug, week) {
        try {
            // Validate input parameters
            const validationResult = validation_1.boatQuerySchema.parse({ slug, week });
            // If validation passes, get boat data
            const boatData = await (0, getBoatData_1.getBoatData)(slug, week);
            return (0, validation_1.createSuccessResponse)(boatData, "Boat data retrieved successfully");
        }
        catch (error) {
            console.error("Error in getBoatData:", error);
            if (error instanceof Error) {
                return (0, validation_1.createLegacyErrorResponse)(error.message, 400);
            }
            return (0, validation_1.createLegacyErrorResponse)("Internal server error", 500);
        }
    }
    /**
     * Search for specific boat in boats_list table
     * @param boatId Boat ID to search for
     * @returns Boat data from boats_list
     */
    async searchBoatInBoatsList(boatId) {
        try {
            console.log(`Searching for boat with ID: "${boatId}" in boats_list table`);
            if (!index_1.supabaseService || !index_1.supabaseService.isConfigured) {
                console.warn("Supabase service not configured for boats_list search");
                return (0, validation_1.createLegacyErrorResponse)("Database service not available", 500);
            }
            const { data, error } = await index_1.supabaseService.supabase.from("boats_list").select("*").eq("slug", boatId).single();
            if (error) {
                console.log(`No boat found with ID "${boatId}":`, error.message);
                return (0, validation_1.createLegacyErrorResponse)(`Boat with ID "${boatId}" not found`, 404);
            }
            if (data) {
                console.log(`Found boat "${boatId}" in boats_list:`, {
                    slug: data.slug,
                    title: data.title,
                    country: data.country,
                    city: data.city,
                    totalPrice: data.totalPrice,
                    currency: data.currency,
                    fortka: data.fortka,
                });
                return (0, validation_1.createSuccessResponse)(data, `Boat "${boatId}" found successfully`);
            }
            return (0, validation_1.createLegacyErrorResponse)(`Boat with ID "${boatId}" not found`, 404);
        }
        catch (error) {
            console.error(`Error searching for boat "${boatId}":`, error);
            return (0, validation_1.createLegacyErrorResponse)("Internal server error", 500);
        }
    }
    /**
     * Get boat details from boats_list table by slug
     * @param slug Boat slug identifier
     * @returns Complete boat details from boats_list
     */
    async getBoatDetails(slug) {
        try {
            console.log(`Getting boat details for slug: "${slug}"`);
            if (!index_1.supabaseService || !index_1.supabaseService.isConfigured) {
                console.warn("Supabase service not configured for boat details");
                return (0, validation_1.createLegacyErrorResponse)("Database service not available", 500);
            }
            const { data, error } = await index_1.supabaseService.supabase.from("boats_list").select("*").eq("slug", slug).single();
            if (error) {
                console.log(`No boat found with slug "${slug}":`, error.message);
                return (0, validation_1.createLegacyErrorResponse)(`Boat with slug "${slug}" not found`, 404);
            }
            if (data) {
                console.log(`Found boat details for "${slug}":`, {
                    slug: data.slug,
                    title: data.title,
                    manufacturer: data.manufacturer,
                    model: data.model,
                    country: data.country,
                    city: data.city,
                    priceFrom: data.priceFrom,
                    currency: data.currency,
                });
                return (0, validation_1.createSuccessResponse)(data, `Boat details for "${slug}" retrieved successfully`);
            }
            return (0, validation_1.createLegacyErrorResponse)(`Boat with slug "${slug}" not found`, 404);
        }
        catch (error) {
            console.error(`Error getting boat details for "${slug}":`, error);
            return (0, validation_1.createLegacyErrorResponse)("Internal server error", 500);
        }
    }
    /**
     * Get boat availability data from boats_availability_2025 table
     * @param slug Boat slug identifier
     * @param year Year for availability data (default: 2025)
     * @returns Complete availability data for the boat
     */
    async getBoatAvailability(slug, year) {
        try {
            const targetYear = year || "2025";
            const tableName = `boat_availability_${targetYear}`;
            console.log(`Getting availability data for slug: "${slug}" from table: "${tableName}"`);
            if (!index_1.supabaseService || !index_1.supabaseService.isConfigured) {
                console.warn("Supabase service not configured for boat availability");
                return (0, validation_1.createLegacyErrorResponse)("Database service not available", 500);
            }
            const { data, error } = await index_1.supabaseService.supabase.from(tableName).select("*").eq("slug", slug).single();
            if (error) {
                console.log(`No availability data found for slug "${slug}":`, error.message);
                return (0, validation_1.createLegacyErrorResponse)(`Availability data for slug "${slug}" not found`, 404);
            }
            if (data) {
                // Count weeks with data
                const weeksWithData = Object.keys(data).filter((key) => key.startsWith("week_") && data[key] !== null).length;
                console.log(`Found availability data for "${slug}":`, {
                    slug: data.slug,
                    id: data.id,
                    weeksWithData,
                    totalWeeks: 53,
                });
                return (0, validation_1.createSuccessResponse)(data, `Availability data for "${slug}" retrieved successfully`);
            }
            return (0, validation_1.createLegacyErrorResponse)(`Availability data for slug "${slug}" not found`, 404);
        }
        catch (error) {
            console.error(`Error getting availability data for "${slug}":`, error);
            return (0, validation_1.createLegacyErrorResponse)("Internal server error", 500);
        }
    }
    /**
     * Get specific week data for a boat
     * @param slug Boat slug identifier
     * @param week Week number (1-53)
     * @param year Year for availability data (default: 2025)
     * @returns Week-specific price and discount data
     */
    async getBoatWeekData(slug, week, year) {
        try {
            const targetYear = year || "2025";
            const weekNumber = parseInt(week);
            const tableName = `boat_availability_${targetYear}`;
            const weekColumn = `week_${weekNumber}`;
            console.log(`Getting week ${weekNumber} data for slug: "${slug}" from table: "${tableName}"`);
            if (weekNumber < 1 || weekNumber > 53) {
                return (0, validation_1.createLegacyErrorResponse)("Week number must be between 1 and 53", 400);
            }
            if (!index_1.supabaseService || !index_1.supabaseService.isConfigured) {
                console.warn("Supabase service not configured for boat week data");
                return (0, validation_1.createLegacyErrorResponse)("Database service not available", 500);
            }
            const { data, error } = await index_1.supabaseService.supabase.from(tableName).select(`${weekColumn}, slug, id`).eq("slug", slug).single();
            if (error) {
                console.log(`No week ${weekNumber} data found for slug "${slug}":`, error.message);
                return (0, validation_1.createLegacyErrorResponse)(`Week ${weekNumber} data for slug "${slug}" not found`, 404);
            }
            if (data && data[weekColumn]) {
                const weekData = data[weekColumn];
                const dataPoints = Object.keys(weekData).length;
                console.log(`Found week ${weekNumber} data for "${slug}":`, {
                    slug: data.slug,
                    week: weekNumber,
                    dataPoints,
                    sampleData: Object.keys(weekData).slice(0, 3), // Show first 3 timestamps
                });
                return (0, validation_1.createSuccessResponse)(weekData, `Week ${weekNumber} data for "${slug}" retrieved successfully`);
            }
            return (0, validation_1.createLegacyErrorResponse)(`No data available for week ${weekNumber} and slug "${slug}"`, 404);
        }
        catch (error) {
            console.error(`Error getting week ${week} data for "${slug}":`, error);
            return (0, validation_1.createLegacyErrorResponse)("Internal server error", 500);
        }
    }
    /**
     * Get boats list with pagination and filtering
     * @param page Page number (default: 1)
     * @param limit Items per page (default: 20, max: 100)
     * @param search Search query for boat names
     * @param country Filter by country
     * @param category Filter by boat category
     * @param minPrice Minimum price filter
     * @param maxPrice Maximum price filter
     * @returns Paginated boats list
     */
    async getBoatsList(page, limit, search, country, category, minPrice, maxPrice, sort, order) {
        try {
            // Validate pagination parameters
            const validatedPage = Math.max(1, page || 1);
            const validatedLimit = Math.min(100, Math.max(1, limit || 20));
            const boats = await this.fetchBoatsFromAvailabilityTables({
                search,
                country,
                category,
                minPrice,
                maxPrice,
                sort,
                order,
                page: validatedPage,
                limit: validatedLimit,
            });
            // Final validation - ensure page doesn't exceed total pages
            if (boats.page && boats.totalPages && boats.page > boats.totalPages && boats.totalPages > 0) {
                // Re-fetch with corrected page
                const correctedBoats = await this.fetchBoatsFromAvailabilityTables({
                    search,
                    country,
                    category,
                    minPrice,
                    maxPrice,
                    sort,
                    order,
                    page: boats.totalPages,
                    limit: validatedLimit,
                });
                return (0, validation_1.createSuccessResponse)(correctedBoats, "Boats list retrieved successfully");
            }
            return (0, validation_1.createSuccessResponse)(boats, "Boats list retrieved successfully");
        }
        catch (error) {
            console.error("Error in getBoatsList:", error);
            return (0, validation_1.createLegacyErrorResponse)("Failed to fetch boats list", 500);
        }
    }
    /**
     * Fetch boats directly from boats_list table
     */
    async fetchBoatsFromAvailabilityTables(filters) {
        try {
            // Console log the filters
            console.log(`Backend: Starting fetchBoatsFromAvailabilityTables`);
            console.log(`Backend: Applied filters:`, {
                search: filters.search,
                country: filters.country,
                category: filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                sort: filters.sort,
                order: filters.order,
                page: filters.page,
                limit: filters.limit,
            });
            // Check if Supabase is properly configured
            if (!index_1.supabaseService || !index_1.supabaseService.isConfigured) {
                console.error("Supabase service not properly configured");
                throw new Error("Database service not available");
            }
            console.log("Supabase service is configured, proceeding with database fetch");
            // Fetch boats directly from boats_list table
            console.log(`Backend: Fetching boats directly from boats_list table`);
            console.log(`Backend: Supabase client:`, index_1.supabaseService.supabase);
            // First, get total count for pagination
            console.log("Backend: Getting total count from boats_list table...");
            // Build count query with search filter
            let countQuery = index_1.supabaseService.supabase.from("boats_list").select("*", { count: "exact", head: true });
            // Add search filter if provided
            if (filters.search && filters.search.trim()) {
                console.log(`Backend: Adding search filter to count query for: "${filters.search}"`);
                countQuery = countQuery.ilike("title", `%${filters.search.trim()}%`);
            }
            const { count: totalCount, error: countError } = await countQuery;
            // Count is nice to have for better pagination, but if it fails (e.g. transient
            // network issue / undici fetch problem), we still want to return some boats
            // instead of failing the entire endpoint.
            if (countError) {
                console.error(`Error getting boats count (continuing without total count):`, countError);
            }
            else {
                console.log(`Backend: Total boats in database: ${totalCount}`);
            }
            // Then fetch the actual data with pagination
            console.log(`Backend: Fetching boats data with pagination (page ${filters.page}, limit ${filters.limit})`);
            // Build the query with search filter
            let query = index_1.supabaseService.supabase.from("boats_list").select("slug, priceFrom, currency, thumb, city, country, title"); // Use 'priceFrom' instead of 'price'
            // Add search filter if provided
            if (filters.search && filters.search.trim()) {
                console.log(`Backend: Adding search filter for: "${filters.search}"`);
                query = query.ilike("title", `%${filters.search.trim()}%`);
            }
            // Add sorting if provided
            if (filters.sort) {
                const sortField = this.getSortField(filters.sort);
                const sortOrder = filters.order === "desc" ? false : true; // Supabase uses boolean for ascending
                console.log(`Backend: Adding sort by ${sortField} ${filters.order || "asc"}`);
                query = query.order(sortField, { ascending: sortOrder });
            }
            // Add pagination
            const { data: boatsListData, error: boatsListError } = await query.range((filters.page - 1) * filters.limit, filters.page * filters.limit - 1);
            if (boatsListError) {
                console.error(`Error fetching boats_list data:`, boatsListError);
                throw new Error(`Database error: ${boatsListError.message}`);
            }
            // Console log RAW data from database
            console.log("RAW DATABASE DATA (first 3 boats):");
            if (boatsListData && boatsListData.length > 0) {
                boatsListData.slice(0, 3).forEach((boat, index) => {
                    console.log(`Raw Boat ${index + 1}:`, {
                        slug: boat.slug,
                        title: boat.title,
                        country: boat.country,
                        city: boat.city,
                        price: boat.priceFrom,
                        currency: boat.currency,
                        thumb: boat.thumb,
                    });
                });
                // Show RAW data from database BEFORE transformation
                console.log("RAW DATABASE DATA (BEFORE TRANSFORMATION):");
                console.log("Raw boat from DB:", {
                    slug: boatsListData[0].slug,
                    title: boatsListData[0].title,
                    country: boatsListData[0].country,
                    city: boatsListData[0].city,
                    price: boatsListData[0].priceFrom,
                    currency: boatsListData[0].currency,
                    thumb: boatsListData[0].thumb,
                });
                console.log("price value:", boatsListData[0].priceFrom);
                console.log("price type:", typeof boatsListData[0].priceFrom);
                // Check for other price fields
                console.log("CHECKING FOR OTHER PRICE FIELDS:");
                const boat = boatsListData[0];
                const priceFields = Object.keys(boat).filter((key) => key.toLowerCase().includes("price") ||
                    key.toLowerCase().includes("cost") ||
                    key.toLowerCase().includes("rate") ||
                    key.toLowerCase().includes("fee"));
                console.log("Price-related fields:", priceFields);
                priceFields.forEach((field) => {
                    console.log(`${field}:`, boat[field]);
                });
                // Show ALL available fields
                console.log("ALL AVAILABLE FIELDS IN DATABASE:");
                console.log("All field names:", Object.keys(boat));
                // Show ALL fields with values
                console.log("ALL FIELDS WITH VALUES:");
                Object.keys(boat).forEach((field) => {
                    console.log(`${field}:`, boat[field]);
                });
            }
            else {
                console.log("No raw data received from database");
            }
            console.log(`Backend: Found ${boatsListData?.length || 0} boats in boats_list (total: ${totalCount ?? boatsListData?.length ?? 0})`);
            if (!boatsListData || boatsListData.length === 0) {
                console.warn("Backend: No boats found in boats_list");
                return {
                    success: true,
                    data: {
                        boats: [],
                        total: 0,
                        page: filters.page,
                        totalPages: 0,
                        limit: filters.limit,
                    },
                };
            }
            // Console log the new data structure
            console.log("Backend: Raw boats_list data (first 3 boats):");
            boatsListData.slice(0, 3).forEach((boat, index) => {
                console.log(`Boat ${index}:`, {
                    slug: boat.slug,
                    title: boat.title,
                    country: boat.country,
                    city: boat.city,
                    price: boat.priceFrom,
                    currency: boat.currency,
                    thumb: boat.thumb,
                });
            });
            // Transform boats data
            const boats = boatsListData
                .map((boatInfo) => {
                const transformedBoat = this.transformBoatDataFromBoatsList(boatInfo);
                // Apply filters
                if (this.matchesFilters(transformedBoat, filters)) {
                    console.log(`Added boat ${boatInfo.slug} to results`);
                    return transformedBoat;
                }
                else {
                    console.log(`Boat ${boatInfo.slug} filtered out`);
                    return null;
                }
            })
                .filter((boat) => boat !== null);
            // Calculate pagination info. If we don't have a reliable totalCount (e.g. count query failed),
            // fall back to using the current page size so that the frontend still gets sane values.
            const effectiveTotalCount = totalCount ?? boats.length ?? 0;
            const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / filters.limit));
            // Console log final results
            console.log(`Backend: Returning ${boats.length} boats (page ${filters.page}/${totalPages})`);
            // Check if search filtering worked correctly
            if (filters.search && filters.search.trim()) {
                const searchTerm = filters.search.trim().toLowerCase();
                console.log(`BACKEND SEARCH VERIFICATION: Looking for "${searchTerm}" in ${boats.length} boats`);
                const matchingBoats = boats.filter((boat) => boat.title && boat.title.toLowerCase().includes(searchTerm));
                console.log(`BACKEND SEARCH RESULTS: Found ${matchingBoats.length} boats with "${searchTerm}" in title:`);
                matchingBoats.forEach((boat, index) => {
                    console.log(`  ${index + 1}. "${boat.title}" (ID: ${boat.id})`);
                });
                if (matchingBoats.length === 0) {
                    console.warn(`BACKEND NO MATCHES: No boats found with "${searchTerm}" in title`);
                    console.log("Available boat titles:", boats.map((b) => b.title));
                }
            }
            console.log("Backend: Transformed boats (first 3):");
            boats.slice(0, 3).forEach((boat, index) => {
                console.log(`Transformed Boat ${index}:`, {
                    id: boat.id,
                    title: boat.title,
                    country: boat.country,
                    city: boat.city,
                    price: boat.price,
                    currency: boat.currency,
                    thumb: boat.thumb,
                });
            });
            // Console log boats being sent to frontend
            console.log("=== BACKEND: BOATS BEING SENT TO FRONTEND ===");
            console.log(`Total boats being sent: ${boats.length}`);
            console.log(`Page: ${filters.page}/${totalPages}`);
            console.log(`Limit: ${filters.limit}`);
            console.log(`Total count: ${totalCount}`);
            // Log first 3 boats with all their fields
            if (boats.length > 0) {
                console.log("First 3 boats being sent to frontend:");
                boats.slice(0, 3).forEach((boat, index) => {
                    console.log(`Boat ${index + 1} (${boat.slug}):`, {
                        id: boat.id,
                        slug: boat.slug,
                        title: boat.title,
                        manufacturer: boat.manufacturer,
                        model: boat.model,
                        category: boat.category,
                        country: boat.country,
                        city: boat.city,
                        price: boat.price,
                        currency: boat.currency,
                        thumb: boat.thumb,
                        main_img: boat.main_img,
                        year: boat.year,
                        length: boat.length,
                        capacity: boat.capacity,
                        cabins: boat.cabins,
                        isAvailable: boat.isAvailable,
                        isFeatured: boat.isFeatured,
                        reviewsScore: boat.reviewsScore,
                        totalReviews: boat.totalReviews,
                        views: boat.views,
                        discount: boat.discount,
                        originalPrice: boat.originalPrice,
                        coordinates: boat.coordinates,
                        marina: boat.marina,
                        region: boat.region,
                        category_slug: boat.category_slug,
                        createdAt: boat.createdAt,
                        updatedAt: boat.updatedAt,
                    });
                });
            }
            else {
                console.log("No boats being sent to frontend");
            }
            console.log("=== END BACKEND BOATS LOG ===");
            return {
                boats: boats,
                total: totalCount || 0,
                page: filters.page,
                limit: filters.limit,
                totalPages: totalPages,
            };
        }
        catch (error) {
            console.error("Error in fetchBoatsFromAvailabilityTables:", error);
            throw error;
        }
    }
    /**
     * Transform boat data to match frontend format
     */
    transformBoatData(boatData, year) {
        const boat = boatData.boat;
        const slug = boatData.slug;
        return {
            id: slug,
            slug: slug,
            title: this.extractBoatTitle(slug),
            manufacturer: this.extractManufacturer(slug),
            model: this.extractModel(slug),
            category: this.extractCategory(slug),
            category_slug: this.extractCategorySlug(slug),
            marina: "Unknown Marina",
            country: "Unknown Country",
            region: "Unknown Region",
            city: "Unknown City",
            coordinates: [0, 0],
            price: boat.price || 0,
            currency: "EUR",
            discount: 0,
            originalPrice: boat.price || 0,
            reviewsScore: 4.0,
            totalReviews: 0,
            views: Math.floor(Math.random() * 1000),
            thumb: "",
            main_img: "",
            year: year,
            length: 40, // Default length
            capacity: 8, // Default capacity
            cabins: 3, // Default cabins
            isAvailable: true,
            isFeatured: Math.random() > 0.8,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    /**
     * Transform boat data using real information from boats_list
     */
    transformBoatDataWithRealInfo(boatData, boatInfo, year) {
        const boat = boatData.boat;
        const slug = boatData.slug;
        return {
            id: slug,
            slug: slug,
            title: boatInfo.title || this.extractBoatTitle(slug),
            manufacturer: this.extractManufacturer(slug),
            model: this.extractModel(slug),
            category: this.extractCategory(slug),
            category_slug: this.extractCategorySlug(slug),
            marina: "Unknown Marina",
            country: boatInfo.country || "Unknown Country",
            region: "Unknown Region",
            city: boatInfo.city || "Unknown City",
            coordinates: [0, 0],
            price: boat.price || boatInfo.totalPrice || 0,
            currency: boatInfo.currency || "EUR",
            discount: 0,
            originalPrice: boat.price || boatInfo.totalPrice || 0,
            reviewsScore: 4.0,
            totalReviews: 0,
            views: Math.floor(Math.random() * 1000),
            thumb: boatInfo.fortka || "",
            main_img: boatInfo.fortka || "",
            year: year,
            length: 40, // Default length
            capacity: 8, // Default capacity
            cabins: 3, // Default cabins
            isAvailable: true,
            isFeatured: Math.random() > 0.8,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    /**
     * Extract boat title from slug
     */
    extractBoatTitle(slug) {
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
    /**
     * Extract manufacturer from slug
     */
    extractManufacturer(slug) {
        const parts = slug.split("-");
        return parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Unknown";
    }
    /**
     * Extract model from slug
     */
    extractModel(slug) {
        const parts = slug.split("-");
        return parts.slice(1).join(" ").charAt(0).toUpperCase() + parts.slice(1).join(" ").slice(1);
    }
    /**
     * Extract category from slug
     */
    extractCategory(slug) {
        if (slug.includes("catamaran"))
            return "Catamaran";
        if (slug.includes("sailboat"))
            return "Sailboat";
        if (slug.includes("motorboat"))
            return "Motorboat";
        return "Sailboat"; // Default
    }
    /**
     * Extract category slug from slug
     */
    extractCategorySlug(slug) {
        if (slug.includes("catamaran"))
            return "catamaran";
        if (slug.includes("sailboat"))
            return "sailboat";
        if (slug.includes("motorboat"))
            return "motorboat";
        return "sailboat"; // Default
    }
    /**
     * Transform boat data directly from boats_list table
     */
    transformBoatDataFromBoatsList(boatInfo) {
        const slug = boatInfo.slug;
        // Debug log for transformation
        console.log(`Transforming boat ${slug}:`);
        console.log(`  priceFrom from DB:`, boatInfo.priceFrom);
        console.log(`  thumb from DB:`, boatInfo.thumb);
        console.log(`  currency from DB:`, boatInfo.currency);
        return {
            id: slug,
            slug: slug,
            title: boatInfo.title || this.extractBoatTitle(slug),
            manufacturer: this.extractManufacturer(slug),
            model: this.extractModel(slug),
            category: this.extractCategory(slug),
            category_slug: this.extractCategorySlug(slug),
            marina: "Unknown Marina",
            country: boatInfo.country || "Unknown Country",
            region: "Unknown Region",
            city: boatInfo.city || "Unknown City",
            coordinates: [0, 0],
            price: boatInfo.priceFrom || 0,
            currency: boatInfo.currency || "EUR",
            discount: 0,
            originalPrice: boatInfo.priceFrom || 0,
            reviewsScore: 4.0,
            totalReviews: 0,
            views: Math.floor(Math.random() * 1000),
            thumb: boatInfo.thumb || "",
            main_img: boatInfo.thumb || "",
            year: 2025, // Default year
            length: 40, // Default length
            capacity: 8, // Default capacity
            cabins: 3, // Default cabins
            isAvailable: true,
            isFeatured: Math.random() > 0.8,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    /**
     * Check if boat matches filters
     */
    matchesFilters(boat, filters) {
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            if (!boat.title.toLowerCase().includes(searchTerm) &&
                !boat.manufacturer.toLowerCase().includes(searchTerm) &&
                !boat.model.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        // Country filter
        if (filters.country && boat.country !== filters.country) {
            return false;
        }
        // Category filter
        if (filters.category && boat.category !== filters.category) {
            return false;
        }
        // Price filters
        if (filters.minPrice && boat.price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice && boat.price > filters.maxPrice) {
            return false;
        }
        return true;
    }
    /**
     * Get current week number
     */
    getCurrentWeek() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + start.getDay() + 1) / 7);
    }
    /**
     * Map frontend sort field to database field
     */
    getSortField(sort) {
        switch (sort) {
            case "name":
                return "title";
            case "price":
                return "priceFrom";
            case "country":
                return "country";
            case "city":
                return "city";
            default:
                return "title"; // Default to title
        }
    }
    /**
     * Search boats by query
     * @param query Search query
     * @param limit Maximum results (default: 10, max: 50)
     * @returns Search results
     */
    async searchBoats(query, limit) {
        try {
            // Validate search query
            if (!query || query.trim().length < 2) {
                return (0, validation_1.createLegacyErrorResponse)("Search query must be at least 2 characters long", 400);
            }
            if (query.length > 100) {
                return (0, validation_1.createLegacyErrorResponse)("Search query too long", 400);
            }
            const validatedLimit = Math.min(50, Math.max(1, limit || 10));
            // Use the same boats fetching logic but with search filter
            const boats = await this.fetchBoatsFromAvailabilityTables({
                search: query.trim(),
                page: 1,
                limit: validatedLimit,
            });
            const results = {
                results: boats.boats,
                query: query.trim(),
                total: boats.total,
            };
            return (0, validation_1.createSuccessResponse)(results, "Search completed successfully");
        }
        catch (error) {
            console.error("Error in searchBoats:", error);
            return (0, validation_1.createLegacyErrorResponse)("Search failed", 500);
        }
    }
};
exports.BoatsController = BoatsController;
__decorate([
    (0, tsoa_1.Get)("/health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "healthCheck", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "getBoatData", null);
__decorate([
    (0, tsoa_1.Get)("/search/:boatId"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "searchBoatInBoatsList", null);
__decorate([
    (0, tsoa_1.Get)("/details/:slug"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "getBoatDetails", null);
__decorate([
    (0, tsoa_1.Get)("/availability/:slug"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "getBoatAvailability", null);
__decorate([
    (0, tsoa_1.Get)("/availability/:slug/week/:week"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "getBoatWeekData", null);
__decorate([
    (0, tsoa_1.Get)("/list"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __param(7, (0, tsoa_1.Query)()),
    __param(8, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "getBoatsList", null);
__decorate([
    (0, tsoa_1.Get)("/search"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BoatsController.prototype, "searchBoats", null);
exports.BoatsController = BoatsController = __decorate([
    (0, tsoa_1.Route)("boat"),
    (0, tsoa_1.Tags)("Boats")
], BoatsController);
