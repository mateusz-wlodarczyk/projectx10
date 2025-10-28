/**
 * Library enumeration for database technologies
 * Used in database rules configuration
 */
export enum Library {
  // SQL databases
  POSTGRES = "postgres",
  MYSQL = "mysql",
  SQLSERVER = "sqlserver",
  ORACLE = "oracle",

  // NoSQL databases
  MONGODB = "mongodb",
  DYNAMODB = "dynamodb",
  FIREBASE = "firebase",
  COUCHDB = "couchdb",

  // Graph databases
  NEO4J = "neo4j",
  DGRAPH = "dgraph",

  // Time-series databases
  INFLUXDB = "influxdb",
  TIMESCALEDB = "timescaledb",

  // Key-value stores
  REDIS = "redis",
  MEMCACHED = "memcached",
}
