import { Logging } from "@google-cloud/logging";

export class Logger {
  private context: string;
  private cloudLogger: Logging;

  constructor(context: string) {
    this.context = context;
    this.cloudLogger = new Logging();
  }

  private async writeLog(level: string, message: string, additionalData?: any) {
    const log = this.cloudLogger.log(this.context);
    const metadata = { severity: level.toUpperCase() };
    const entry = log.entry(metadata, {
      message,
      additionalData,
      timestamp: new Date().toISOString(),
    });

    await log.write(entry);
  }

  async info(message: string, ...additionalData: any[]) {
    console.log(`[INFO] [${this.context}] ${message}`, ...additionalData);
    await this.writeLog("INFO", message, additionalData);
  }

  async warn(message: string, ...additionalData: any[]) {
    console.warn(`[WARN] [${this.context}] ${message}`, ...additionalData);
    await this.writeLog("WARNING", message, additionalData);
  }

  async error(message: string, ...additionalData: any[]) {
    console.error(`[ERROR] [${this.context}] ${message}`, ...additionalData);
    await this.writeLog("ERROR", message, additionalData);
  }
}
