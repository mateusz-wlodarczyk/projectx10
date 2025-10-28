import { Library } from "../packages/backend/src/types/dictionaries";

/**
 * Type definition for library rules mapping
 * Maps each database library to an array of best practice rules
 */
export type LibraryRulesMap = Record<Library, string[]>;

/**
 * Type definition for rule categories
 */
export type RuleCategory =
  | "performance"
  | "security"
  | "data_integrity"
  | "scalability"
  | "maintainability"
  | "monitoring";

/**
 * Type definition for individual database rules
 */
export type DatabaseRule = {
  library: Library;
  category: RuleCategory;
  rule: string;
  priority: "high" | "medium" | "low";
  description?: string;
};

/**
 * Type definition for database configuration
 */
export type DatabaseConfig = {
  library: Library;
  rules: string[];
  connectionString?: string;
  poolSize?: number;
  timeout?: number;
};
