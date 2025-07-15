"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class RepositoryService {
    client;
    constructor(supabaseUrl, supabaseKey) {
        this.client = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    //SELECT
    async select(tableName, selectValue) {
        const { data, error } = await this.client.from(tableName).select(selectValue);
        return { data: data, error };
    }
    //SELECT_SPECIFIC_ROW
    async selectSpecificRow(tableName, columnName, value) {
        const { data, error } = await this.client.from(tableName).select("*").eq(columnName, value);
        return { data: data, error };
    }
    //INSERT_SPECIFIC_DATA
    async insertWeekDataIfNotExist(tableName, updatedColumnValue, slug, weekNum) {
        const { data, error } = await this.client.from(tableName).upsert({ [weekNum]: updatedColumnValue, slug });
        return { data, error };
    }
    //UPSERT
    async upsert(tableName, insertData) {
        const { data, error } = await this.client.from(tableName).upsert([insertData]).select();
        return { data, error };
    }
    //UPDATE
    async update(tableName, updatedColumnName, updatedColumnValue, eqCondition, eqConditionValue) {
        const { data, error } = await this.client
            .from(tableName)
            .update({ [updatedColumnName]: updatedColumnValue })
            .eq(eqCondition, eqConditionValue)
            .select();
        return { data, error };
    }
}
exports.RepositoryService = RepositoryService;
