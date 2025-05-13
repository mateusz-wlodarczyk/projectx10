import { SupabaseClient, PostgrestError, createClient } from "@supabase/supabase-js";

export class RepositoryService {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  //SELECT
  public async select<T>(tableName: string, selectValue: string): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client.from(tableName).select(selectValue);
    return { data: data as T[], error };
  }
  //SELECT_SPECIFIC_ROW
  public async selectSpecificRow<T>(
    tableName: string,
    columnName: string,
    value: string,
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client.from(tableName).select("*").eq(columnName, value);
    return { data: data as T[], error };
  }

  //INSERT_SPECIFIC_DATA
  public async insertWeekDataIfNotExist<T>(
    tableName: string,
    updatedColumnValue: T,
    slug: string,
    weekNum: string,
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client.from(tableName).upsert({ [weekNum]: updatedColumnValue, slug });
    return { data, error };
  }
  //UPSERT
  public async upsert<T>(tableName: string, insertData: T): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client.from(tableName).upsert([insertData]).select();
    return { data, error };
  }

  //UPDATE
  public async update<T>(
    tableName: string,
    updatedColumnName: string,
    updatedColumnValue: T,
    eqCondition: string,
    eqConditionValue: string,
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from(tableName)
      .update({ [updatedColumnName]: updatedColumnValue })
      .eq(eqCondition, eqConditionValue)
      .select();
    return { data, error };
  }
}
