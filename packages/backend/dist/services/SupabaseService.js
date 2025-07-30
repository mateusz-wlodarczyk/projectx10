"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const RepositoryService_1 = require("../api/RepositoryService");
class SupabaseService {
    client;
    constructor() {
        const supabaseKey = process.env.SUPABASE_KEY;
        const supabaseUrl = process.env.SUPABASE_URL;
        this.client = new RepositoryService_1.RepositoryService(supabaseUrl, supabaseKey);
    }
    async insertWeekDataIfNotExist(tableName, updatedColumnValue, slug, weekKey) {
        return this.client.insertWeekDataIfNotExist(tableName, updatedColumnValue, slug, weekKey);
    }
    async updateWeekData(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue) {
        return this.client.update(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue);
    }
    async upsertData(table, insertData) {
        return this.client.upsert(table, insertData);
    }
    async selectData(tableName, selectValue = "*", conditions) {
        return this.client.select(tableName, selectValue, conditions);
    }
}
exports.SupabaseService = SupabaseService;
