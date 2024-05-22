import { defineConfig, type Config } from "drizzle-kit";

export default defineConfig({
  out: "./migrations/",
  strict: true,
  schema: "./src/schema/*.ts",
  verbose: true,
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "not provided idiot",
  },
  tablesFilter: ["replicache_*"],
}) satisfies Config;
