"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
/**
 * Library enumeration for database technologies
 * Used in database rules configuration
 */
var Library;
(function (Library) {
    // SQL databases
    Library["POSTGRES"] = "postgres";
    Library["MYSQL"] = "mysql";
    Library["SQLSERVER"] = "sqlserver";
    Library["ORACLE"] = "oracle";
    // NoSQL databases
    Library["MONGODB"] = "mongodb";
    Library["DYNAMODB"] = "dynamodb";
    Library["FIREBASE"] = "firebase";
    Library["COUCHDB"] = "couchdb";
    // Graph databases
    Library["NEO4J"] = "neo4j";
    Library["DGRAPH"] = "dgraph";
    // Time-series databases
    Library["INFLUXDB"] = "influxdb";
    Library["TIMESCALEDB"] = "timescaledb";
    // Key-value stores
    Library["REDIS"] = "redis";
    Library["MEMCACHED"] = "memcached";
})(Library || (exports.Library = Library = {}));
