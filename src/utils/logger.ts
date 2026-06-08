type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, meta?: unknown): void {
  const timestamp = new Date().toISOString();
  if (meta) {
    console[level](`[${timestamp}] ${level.toUpperCase()} ${message}`, meta);
    return;
  }
  console[level](`[${timestamp}] ${level.toUpperCase()} ${message}`);
}

export const logger = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta)
};

