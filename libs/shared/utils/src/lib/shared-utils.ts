/**
 * Reads a required environment variable. Throws at startup if missing.
 * Use for secrets and mandatory config (e.g. JWT_SECRET, DATABASE_URL).
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} env var is required`);
  return value;
}

/**
 * Reads an optional port from env. Falls back to the provided default.
 * Use in main.ts bootstrappers to read HTTP listen ports.
 */
export function getEnvPort(name: string, defaultPort: number): number {
  const raw = process.env[name];
  if (!raw) return defaultPort;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed))
    throw new Error(`${name} must be a valid port number, got: ${raw}`);
  return parsed;
}
