"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const RepositoryService_1 = require("../api/RepositoryService");
class SupabaseService {
    client = null;
    adminClient = null;
    isConfigured = false;
    constructor() {
        const supabaseKey = process.env.SUPABASE_KEY;
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log("[SupabaseService] Initializing...");
        console.log("[SupabaseService] SUPABASE_URL:", supabaseUrl);
        console.log("[SupabaseService] SUPABASE_KEY:", supabaseKey ? "SET" : "NOT SET");
        console.log("[SupabaseService] SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "SET" : "NOT SET");
        if (!supabaseKey || !supabaseUrl) {
            console.warn("[SupabaseService] Supabase credentials not found in environment variables. Running in mock mode.");
            this.isConfigured = false;
            return;
        }
        try {
            // Use anon key for regular operations
            this.client = new RepositoryService_1.RepositoryService(supabaseUrl, supabaseKey);
            // Use service role key for admin operations (if available)
            if (serviceRoleKey) {
                this.adminClient = new RepositoryService_1.RepositoryService(supabaseUrl, serviceRoleKey);
            }
            else {
                console.warn("[SupabaseService] Service role key not found, admin operations may fail");
                this.adminClient = this.client; // Fallback to anon key
            }
            this.isConfigured = true;
            console.log("[SupabaseService] Supabase service initialized successfully");
            // Test connection
            this.testConnection();
        }
        catch (error) {
            console.error("[SupabaseService] Failed to initialize Supabase service:", error);
            this.isConfigured = false;
        }
    }
    async testConnection() {
        if (!this.client)
            return;
        try {
            console.log("[SupabaseService] Testing connection...");
            // Simple query to test connection
            const { error } = await this.client.supabase.from("boats_list").select("count").limit(1);
            if (error) {
                console.warn("[SupabaseService] Connection test failed:", error.message);
            }
            else {
                console.log("[SupabaseService] Connection test successful");
            }
        }
        catch (error) {
            console.warn("[SupabaseService] Connection test error:", error);
        }
    }
    // Get the supabase client for direct access
    get supabase() {
        if (!this.client) {
            throw new Error("Supabase client not initialized. Check environment variables.");
        }
        return this.client.supabase;
    }
    // Get the admin supabase client for admin operations
    get adminSupabase() {
        if (!this.adminClient) {
            throw new Error("Supabase admin client not initialized. Check environment variables.");
        }
        return this.adminClient.supabase;
    }
    // Authentication methods
    async signUp(email, password, userData) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                },
            },
        });
        return { data, error };
    }
    async signIn(email, password) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }
    async signOut() {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        const { error } = await this.client.auth.signOut();
        return { error };
    }
    async resetPassword(email) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
        });
        return { data, error };
    }
    async updatePassword(accessToken, newPassword) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        const { data, error } = await this.client.auth.updateUser({
            password: newPassword,
        });
        return { data, error };
    }
    async insertWeekDataIfNotExist(tableName, updatedColumnValue, slug, weekKey) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        return this.client.insertWeekDataIfNotExist(tableName, updatedColumnValue, slug, weekKey);
    }
    async updateWeekData(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        return this.client.update(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue);
    }
    async upsertData(table, insertData) {
        if (!this.client) {
            throw new Error("Supabase client not initialized");
        }
        return this.client.upsert(table, insertData);
    }
    async selectData(tableName, selectValue = "*", conditions) {
        if (!this.client) {
            console.warn(`[SupabaseService] Client not initialized, returning null data for table: ${tableName}`);
            return { data: null, error: null };
        }
        try {
            console.log(`[SupabaseService] Selecting data from table: ${tableName}`);
            const result = await this.client.select(tableName, selectValue, conditions);
            if (result.error) {
                console.error(`[SupabaseService] Error selecting data from ${tableName}:`, result.error);
            }
            else {
                console.log(`[SupabaseService] Successfully selected data from ${tableName}, count: ${Array.isArray(result.data) ? result.data.length : "N/A"}`);
            }
            return result;
        }
        catch (error) {
            console.error(`[SupabaseService] Exception selecting data from ${tableName}:`, error);
            return { data: null, error: error };
        }
    }
}
exports.SupabaseService = SupabaseService;
