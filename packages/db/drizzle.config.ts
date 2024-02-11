import { defineConfig, type Config } from "drizzle-kit";

const connection = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

export default defineConfig({
  out: "./migrations/",
  strict: true,
  schema: "./src/models/*.ts",
  verbose: true,
  driver: "mysql2",
  dbCredentials: {
    uri: `mysql://${connection.username}:${connection.password}@${connection.host}/playground?ssl={"rejectUnauthorized":true}`,
  },
  tablesFilter: ["replicache_*"],
}) satisfies Config;
