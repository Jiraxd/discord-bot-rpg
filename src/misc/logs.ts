import * as fs from "fs";
import * as path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(
  LOG_DIR,
  `${new Date().toISOString().slice(0, 10)}.log`
);
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

const originalConsole = {
  log: console.log,
};

if (!fs.existsSync(LOG_DIR)) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    console.log(`Created logs directory at: ${LOG_DIR}`);
  } catch (error) {
    console.error(`Failed to create logs directory: ${error}`);
  }
}

function writeToLogFile(prefix: string, args: any[]): void {
  try {
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_LOG_SIZE) {
      const backupFile = `${LOG_FILE}.${Date.now()}.backup`;
      fs.renameSync(LOG_FILE, backupFile);
    }

    const timestamp = new Date().toISOString();
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
      )
      .join(" ");

    const logEntry = `[${timestamp}] ${
      prefix ? prefix + ": " : ""
    }${message}\n`;

    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error("Failed to write to log file:", error);
  }
}

console.log = function (...args: any[]): void {
  writeToLogFile("", args);
  originalConsole.log(...args);
};
