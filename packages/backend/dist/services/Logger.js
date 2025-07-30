"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const logging_1 = require("@google-cloud/logging");
class Logger {
    context;
    cloudLogger;
    constructor(context) {
        this.context = context;
        this.cloudLogger = new logging_1.Logging();
    }
    async writeLog(level, message, additionalData) {
        try {
            const log = this.cloudLogger.log(this.context);
            const metadata = { severity: level.toUpperCase() };
            const entry = log.entry(metadata, {
                message,
                additionalData,
                timestamp: new Date().toISOString(),
            });
            await log.write(entry);
        }
        catch (error) {
            // Fallback to console only if Google Cloud Logging fails
            console.log(`[${level.toUpperCase()}] [${this.context}] Google Cloud Logging failed:`, error);
        }
    }
    async info(message, ...additionalData) {
        console.log(`[INFO] [${this.context}] ${message}`, ...additionalData);
        await this.writeLog("INFO", message, additionalData);
    }
    async warn(message, ...additionalData) {
        console.warn(`[WARN] [${this.context}] ${message}`, ...additionalData);
        await this.writeLog("WARNING", message, additionalData);
    }
    async error(message, ...additionalData) {
        console.error(`[ERROR] [${this.context}] ${message}`, ...additionalData);
        await this.writeLog("ERROR", message, additionalData);
    }
}
exports.Logger = Logger;
