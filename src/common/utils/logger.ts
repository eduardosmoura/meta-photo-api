import { createLogger, format, transports } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

const { combine, timestamp, printf, errors, json } = format;

// Define log folder path
const logDir =
  process.env.NODE_ENV === 'production' ? '/tmp/logs' : path.resolve(__dirname, '../../../logs');

// Ensure log directory exists; if not, create it
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for console logging
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info', // Default logging level
  format: combine(
    timestamp(),
    errors({ stack: true }), // Include stack trace if available
    json(), // Format logs as JSON for file output
  ),
  transports: [
    // Write all logs with level `info` and below to the file in the log folder
    new transports.File({ filename: path.join(logDir, 'app.log') }),
    // Also log to the console with a custom format
    new transports.Console({
      format: combine(timestamp(), consoleFormat),
    }),
  ],
  exceptionHandlers: [
    // Log unhandled exceptions to a separate file in the log folder
    new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
});

export default logger;
