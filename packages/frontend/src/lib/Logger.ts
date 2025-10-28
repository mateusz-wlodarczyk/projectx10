/**
 * Centralized logging service for the application
 * Provides structured logging with different levels and environment-based filtering
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  context?: string;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : "";

    return `${timestamp} ${levelName}${context}: ${entry.message}`;
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      context,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data || "");
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data || "");
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data || "");
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data || "");
        break;
    }
  }

  debug(message: string, data?: any, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: any, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: any, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: any, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context);
  }

  /**
   * Sets the minimum log level for the logger
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Gets the current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience functions for common logging patterns
export const logDebug = (message: string, data?: any, context?: string) =>
  logger.debug(message, data, context);

export const logInfo = (message: string, data?: any, context?: string) =>
  logger.info(message, data, context);

export const logWarn = (message: string, data?: any, context?: string) =>
  logger.warn(message, data, context);

export const logError = (message: string, data?: any, context?: string) =>
  logger.error(message, data, context);
